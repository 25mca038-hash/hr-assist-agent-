import { Router } from 'express';
import { appStore } from '../store';
import { globalVectorStore } from '../rag/vectorStore';
import {
  parseResumeWithLLM,
  analyzeCandidateAgainstJob,
  generateInterviewGuide,
  compareCandidates,
  answerRAGQuery,
  runRecruitmentAgent,
} from '../rag/gemini';
import { Candidate, JobDescription, HRPolicy, DocumentType } from '../types';
import * as pdfParseModule from 'pdf-parse';
import mammoth from 'mammoth';

const pdfParse: any = (pdfParseModule as any).default || pdfParseModule;

const router = Router();

// ---------------- DASHBOARD ----------------
router.get('/dashboard/stats', (req, res) => {
  const candidates = appStore.getCandidates();
  const jobs = appStore.getJobs();
  const analyses = appStore.getAnalyses();
  const activities = appStore.getActivities();

  const totalResumes = candidates.length;
  const totalJobs = jobs.length;
  const candidatesAnalyzed = analyses.length;

  const averageMatchScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((acc, a) => acc + a.estimatedMatchScore, 0) / analyses.length)
      : 78;

  res.json({
    totalResumes,
    totalJobs,
    candidatesAnalyzed,
    averageMatchScore,
    recentActivities: activities.slice(0, 8),
    recentAnalyses: analyses.slice(0, 5),
    vectorChunksCount: globalVectorStore.getAllChunks().length,
  });
});

// ---------------- CANDIDATES & RESUMES ----------------
router.get('/candidates', (req, res) => {
  res.json(appStore.getCandidates());
});

router.get('/candidates/:id', (req, res) => {
  const cand = appStore.getCandidateById(req.params.id);
  if (!cand) return res.status(404).json({ error: 'Candidate not found' });
  res.json(cand);
});

router.post('/candidates/upload', async (req, res) => {
  try {
    const { fileName, fileData, fileType, rawText } = req.body;
    let extractedText = '';

    if (rawText && typeof rawText === 'string') {
      extractedText = rawText;
    } else if (fileData) {
      const buffer = Buffer.from(fileData, 'base64');
      const lowerName = (fileName || '').toLowerCase();

      if (lowerName.endsWith('.pdf') || fileType === 'application/pdf') {
        const parsed = await pdfParse(buffer);
        extractedText = parsed.text;
      } else if (
        lowerName.endsWith('.docx') ||
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } else {
        // Plain text fallback
        extractedText = buffer.toString('utf-8');
      }
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'Unable to extract text from the uploaded document.' });
    }

    const nameForFile = fileName || 'Uploaded_Resume.txt';
    const parsedData = await parseResumeWithLLM(extractedText, nameForFile);

    const newCandidate: Candidate = {
      id: `cand-${Date.now()}`,
      name: parsedData.name || 'Candidate',
      email: parsedData.email || '',
      phone: parsedData.phone || '',
      location: parsedData.location || 'Not Specified',
      summary: parsedData.summary || extractedText.slice(0, 250),
      education: parsedData.education || [],
      skills: parsedData.skills && parsedData.skills.length > 0 ? parsedData.skills : ['Communication', 'Problem Solving'],
      experience: parsedData.experience || [],
      certifications: parsedData.certifications || [],
      projects: parsedData.projects || [],
      achievements: parsedData.achievements || [],
      rawText: extractedText,
      fileName: nameForFile,
      uploadedAt: new Date().toISOString(),
    };

    await appStore.addCandidate(newCandidate);
    res.status(201).json(newCandidate);
  } catch (err: any) {
    console.error('Error in candidate upload:', err);
    res.status(500).json({ error: err?.message || 'Failed to parse and save resume.' });
  }
});

router.delete('/candidates/:id', (req, res) => {
  const success = appStore.removeCandidate(req.params.id);
  if (!success) return res.status(404).json({ error: 'Candidate not found' });
  res.json({ success: true, message: 'Candidate removed successfully' });
});

// ---------------- JOBS ----------------
router.get('/jobs', (req, res) => {
  res.json(appStore.getJobs());
});

router.get('/jobs/:id', (req, res) => {
  const job = appStore.getJobById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job description not found' });
  res.json(job);
});

router.post('/jobs', async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      employmentType,
      experienceRequired,
      salaryRange,
      summary,
      responsibilities,
      requiredSkills,
      preferredSkills,
      qualifications,
    } = req.body;

    if (!title || !department) {
      return res.status(400).json({ error: 'Job title and department are required.' });
    }

    const newJob: JobDescription = {
      id: `job-${Date.now()}`,
      title,
      department,
      location: location || 'Remote',
      employmentType: employmentType || 'Full-time',
      experienceRequired: experienceRequired || '2+ years',
      salaryRange: salaryRange || 'Competitive',
      summary: summary || `Role for ${title} in ${department}.`,
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : (responsibilities || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : (requiredSkills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      preferredSkills: Array.isArray(preferredSkills)
        ? preferredSkills
        : (preferredSkills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      qualifications: Array.isArray(qualifications)
        ? qualifications
        : (qualifications || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      status: 'Active',
    };

    await appStore.addJob(newJob);
    res.status(201).json(newJob);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to create job posting' });
  }
});

router.put('/jobs/:id', async (req, res) => {
  const existing = appStore.getJobById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Job not found' });

  const updated: JobDescription = {
    ...existing,
    ...req.body,
    id: existing.id,
  };

  await appStore.addJob(updated);
  res.json(updated);
});

router.delete('/jobs/:id', (req, res) => {
  const success = appStore.removeJob(req.params.id);
  if (!success) return res.status(404).json({ error: 'Job not found' });
  res.json({ success: true, message: 'Job removed successfully' });
});

// ---------------- HR POLICIES ----------------
router.get('/policies', (req, res) => {
  res.json(appStore.getPolicies());
});

router.post('/policies', async (req, res) => {
  try {
    const { title, category, content, summary } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Policy title and content are required.' });
    }

    const newPolicy: HRPolicy = {
      id: `pol-${Date.now()}`,
      title,
      category: category || 'Recruitment & Hiring',
      version: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      content,
      summary: summary || content.slice(0, 180),
    };

    await appStore.addPolicy(newPolicy);
    res.status(201).json(newPolicy);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to add HR policy' });
  }
});

// ---------------- RESUME ANALYSIS ----------------
router.get('/analysis', (req, res) => {
  res.json(appStore.getAnalyses());
});

router.post('/analysis', async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;
    const candidate = appStore.getCandidateById(candidateId);
    const job = appStore.getJobById(jobId);

    if (!candidate || !job) {
      return res.status(400).json({ error: 'Candidate or Job not found.' });
    }

    const analysis = await analyzeCandidateAgainstJob(candidate, job);
    appStore.addAnalysis(analysis);
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to analyze candidate' });
  }
});

// ---------------- INTERVIEW GUIDE ----------------
router.post('/interview-guide', async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;
    const job = appStore.getJobById(jobId);
    if (!job) return res.status(404).json({ error: 'Job description not found.' });

    const candidate = candidateId ? appStore.getCandidateById(candidateId) : undefined;
    const guide = await generateInterviewGuide(job, candidate);
    appStore.logActivity(
      'generate_questions',
      `Generated interview guide for ${job.title}`,
      `${guide.questions.length} questions across technical and behavioral rubrics.`
    );
    res.json(guide);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to generate interview guide' });
  }
});

// ---------------- CANDIDATE COMPARISON ----------------
router.post('/compare', async (req, res) => {
  try {
    const { candidateIds, jobId } = req.body;
    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one candidate ID.' });
    }

    const job = appStore.getJobById(jobId);
    if (!job) return res.status(404).json({ error: 'Job description not found.' });

    const candidates: Candidate[] = [];
    for (const id of candidateIds) {
      const c = appStore.getCandidateById(id);
      if (c) candidates.push(c);
    }

    if (candidates.length === 0) {
      return res.status(404).json({ error: 'No valid candidates found for the given IDs.' });
    }

    const comparison = await compareCandidates(candidates, job);
    appStore.logActivity(
      'compare_candidates',
      `Compared ${candidates.length} candidates for ${job.title}`,
      `Generated side-by-side competency & qualification matrix.`
    );
    res.json(comparison);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to compare candidates' });
  }
});

// ---------------- RAG KNOWLEDGE QUERY ----------------
router.post('/rag/search', async (req, res) => {
  try {
    const { query, documentType, topK } = req.body;
    if (!query) return res.status(400).json({ error: 'Search query is required.' });

    const results = await globalVectorStore.similaritySearch(query, {
      documentType: documentType as DocumentType,
      topK: topK || 6,
    });

    res.json({
      query,
      resultsCount: results.length,
      chunks: results.map(r => ({
        id: r.chunk.id,
        documentId: r.chunk.documentId,
        documentTitle: r.chunk.documentTitle,
        documentType: r.chunk.documentType,
        sectionTitle: r.chunk.sectionTitle,
        text: r.chunk.text,
        similarityScore: r.similarityScore,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'RAG search failed' });
  }
});

router.post('/rag/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required.' });

    const results = await globalVectorStore.similaritySearch(query, { topK: 5 });
    const answer = await answerRAGQuery(query, results);
    res.json(answer);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to generate grounded RAG answer' });
  }
});

// ---------------- AI AGENT CHAT ----------------
router.post('/agent/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });

    const agentResult = await runRecruitmentAgent(message, history || [], {
      candidates: appStore.getCandidates(),
      jobs: appStore.getJobs(),
      policies: appStore.getPolicies(),
    });

    res.json(agentResult);
  } catch (err: any) {
    console.error('Agent chat error:', err);
    res.status(500).json({ error: err?.message || 'Agent error during chat processing.' });
  }
});

// ---------------- DEMO RESET ----------------
router.post('/reset-demo', async (req, res) => {
  appStore.resetToSeed();
  res.json({ success: true, message: 'Demo data restored successfully' });
});

export default router;
