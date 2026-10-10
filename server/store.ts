import { Candidate, JobDescription, HRPolicy, MatchAnalysis, ActivityLog } from './types';
import { SEED_CANDIDATES, SEED_JOBS, SEED_POLICIES } from './rag/seedData';
import { chunkDocument } from './rag/chunker';
import { globalVectorStore } from './rag/vectorStore';
import fs from 'fs';
import path from 'path';

export interface AppState {
  candidates: Candidate[];
  jobs: JobDescription[];
  policies: HRPolicy[];
  analyses: MatchAnalysis[];
  activities: ActivityLog[];
}

class Store {
  private data: AppState = {
    candidates: [...SEED_CANDIDATES],
    jobs: [...SEED_JOBS],
    policies: [...SEED_POLICIES],
    analyses: [],
    activities: [
      {
        id: 'act-1',
        type: 'upload_resume',
        title: 'Initial candidate resumes loaded',
        description: 'System loaded Priya Sharma, Alex Chen, Sarah Jenkins, and David Kumar profiles.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'act-2',
        type: 'create_job',
        title: 'Requisitions established',
        description: 'Created Senior Full-Stack Engineer, Machine Learning Engineer, and UI/UX Engineer openings.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  };

  private storageFile = path.resolve(process.cwd(), 'data_storage.json');
  private isInitialized = false;

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load from disk if present
    try {
      if (fs.existsSync(this.storageFile)) {
        const raw = fs.readFileSync(this.storageFile, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.candidates && parsed.candidates.length > 0) {
          this.data = parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read existing data storage, using seed data:', e);
    }

    console.log('Indexing candidate resumes, job descriptions, and HR policies into Vector Store...');
    await this.reindexAll();
    this.isInitialized = true;
    console.log(`Vector store initialized with ${globalVectorStore.getAllChunks().length} document chunks.`);
  }

  public async reindexAll(): Promise<void> {
    // Clear and rebuild chunks
    const allChunks = [];

    // Chunks for candidates
    for (const cand of this.data.candidates) {
      const chunks = chunkDocument(
        cand.id,
        'resume',
        `${cand.name} - Resume`,
        cand.rawText || `${cand.name}\n${cand.summary}\nSkills: ${cand.skills.join(', ')}`
      );
      allChunks.push(...chunks);
    }

    // Chunks for jobs
    for (const job of this.data.jobs) {
      const jobText = `JOB TITLE: ${job.title}
DEPARTMENT: ${job.department}
LOCATION: ${job.location} (${job.employmentType})
EXPERIENCE: ${job.experienceRequired}
SALARY: ${job.salaryRange || 'Competitive'}
SUMMARY: ${job.summary}
RESPONSIBILITIES:
${job.responsibilities.map(r => '- ' + r).join('\n')}
REQUIRED SKILLS:
${job.requiredSkills.join(', ')}
PREFERRED SKILLS:
${job.preferredSkills.join(', ')}
QUALIFICATIONS:
${job.qualifications.join(', ')}`;

      const chunks = chunkDocument(job.id, 'job_description', `${job.title} Job Description`, jobText);
      allChunks.push(...chunks);
    }

    // Chunks for HR policies
    for (const pol of this.data.policies) {
      const chunks = chunkDocument(pol.id, 'hr_policy', pol.title, pol.content);
      allChunks.push(...chunks);
    }

    await globalVectorStore.addChunks(allChunks);
    this.saveToDisk();
  }

  public saveToDisk(): void {
    try {
      fs.writeFileSync(this.storageFile, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not write data storage to disk:', e);
    }
  }

  // Getters
  public getCandidates(): Candidate[] {
    return this.data.candidates;
  }

  public getCandidateById(id: string): Candidate | undefined {
    return this.data.candidates.find(c => c.id === id);
  }

  public async addCandidate(candidate: Candidate): Promise<void> {
    const existingIdx = this.data.candidates.findIndex(c => c.id === candidate.id);
    if (existingIdx >= 0) {
      this.data.candidates[existingIdx] = candidate;
    } else {
      this.data.candidates.unshift(candidate);
    }

    // Index chunks into vector store
    const chunks = chunkDocument(
      candidate.id,
      'resume',
      `${candidate.name} - Resume`,
      candidate.rawText
    );
    await globalVectorStore.addChunks(chunks);

    this.logActivity(
      'upload_resume',
      `New resume parsed: ${candidate.name}`,
      `Extracted ${candidate.skills.length} skills and ${candidate.experience.length} roles.`
    );
    this.saveToDisk();
  }

  public removeCandidate(id: string): boolean {
    const cand = this.getCandidateById(id);
    if (!cand) return false;
    this.data.candidates = this.data.candidates.filter(c => c.id !== id);
    globalVectorStore.removeDocument(id);
    this.saveToDisk();
    return true;
  }

  public getJobs(): JobDescription[] {
    return this.data.jobs;
  }

  public getJobById(id: string): JobDescription | undefined {
    return this.data.jobs.find(j => j.id === id);
  }

  public async addJob(job: JobDescription): Promise<void> {
    const existingIdx = this.data.jobs.findIndex(j => j.id === job.id);
    if (existingIdx >= 0) {
      this.data.jobs[existingIdx] = job;
    } else {
      this.data.jobs.unshift(job);
    }

    const jobText = `JOB TITLE: ${job.title}
DEPARTMENT: ${job.department}
RESPONSIBILITIES:
${job.responsibilities.join('\n')}
REQUIRED SKILLS:
${job.requiredSkills.join(', ')}
QUALIFICATIONS:
${job.qualifications.join('\n')}`;

    const chunks = chunkDocument(job.id, 'job_description', `${job.title} Job Description`, jobText);
    await globalVectorStore.addChunks(chunks);

    this.logActivity('create_job', `Created job posting: ${job.title}`, `${job.department} · ${job.employmentType}`);
    this.saveToDisk();
  }

  public removeJob(id: string): boolean {
    const job = this.getJobById(id);
    if (!job) return false;
    this.data.jobs = this.data.jobs.filter(j => j.id !== id);
    globalVectorStore.removeDocument(id);
    this.saveToDisk();
    return true;
  }

  public getPolicies(): HRPolicy[] {
    return this.data.policies;
  }

  public getPolicyById(id: string): HRPolicy | undefined {
    return this.data.policies.find(p => p.id === id);
  }

  public async addPolicy(policy: HRPolicy): Promise<void> {
    const existingIdx = this.data.policies.findIndex(p => p.id === policy.id);
    if (existingIdx >= 0) {
      this.data.policies[existingIdx] = policy;
    } else {
      this.data.policies.push(policy);
    }

    const chunks = chunkDocument(policy.id, 'hr_policy', policy.title, policy.content);
    await globalVectorStore.addChunks(chunks);

    this.logActivity('policy_query', `Uploaded HR Policy: ${policy.title}`, policy.category);
    this.saveToDisk();
  }

  public getAnalyses(): MatchAnalysis[] {
    return this.data.analyses;
  }

  public addAnalysis(analysis: MatchAnalysis): void {
    const existingIdx = this.data.analyses.findIndex(
      a => a.candidateId === analysis.candidateId && a.jobId === analysis.jobId
    );
    if (existingIdx >= 0) {
      this.data.analyses[existingIdx] = analysis;
    } else {
      this.data.analyses.unshift(analysis);
    }
    this.logActivity(
      'analyze_resume',
      `Evaluated ${analysis.candidateName} for ${analysis.jobTitle}`,
      `Estimated match score: ${analysis.estimatedMatchScore}% (${analysis.scoreExplanation})`
    );
    this.saveToDisk();
  }

  public getActivities(): ActivityLog[] {
    return this.data.activities;
  }

  public logActivity(type: ActivityLog['type'], title: string, description: string): void {
    this.data.activities.unshift({
      id: `act-${Date.now()}`,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
    });
    if (this.data.activities.length > 50) {
      this.data.activities = this.data.activities.slice(0, 50);
    }
  }

  public resetToSeed(): void {
    this.data = {
      candidates: [...SEED_CANDIDATES],
      jobs: [...SEED_JOBS],
      policies: [...SEED_POLICIES],
      analyses: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'upload_resume',
          title: 'Reset to demo seed state',
          description: 'Restored default candidates, jobs, and HR policies.',
          timestamp: new Date().toISOString(),
        },
      ],
    };
    this.reindexAll();
  }
}

export const appStore = new Store();
