import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Briefcase,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import { Candidate, JobDescription, MatchAnalysis } from '../../server/types';
import { api } from '../services/api';

interface AnalysisViewProps {
  candidates: Candidate[];
  jobs: JobDescription[];
  initialCandidateId?: string;
  initialJobId?: string;
  onNavigateToInterview: (jobId: string, candidateId: string) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  candidates,
  jobs,
  initialCandidateId,
  initialJobId,
  onNavigateToInterview,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    initialCandidateId || (candidates[0]?.id || '')
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(
    initialJobId || (jobs[0]?.id || '')
  );

  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    if (initialCandidateId) setSelectedCandidateId(initialCandidateId);
    if (initialJobId) setSelectedJobId(initialJobId);
  }, [initialCandidateId, initialJobId]);

  const handleRunAnalysis = async () => {
    if (!selectedCandidateId || !selectedJobId) return;

    setIsLoading(true);
    try {
      const result = await api.analyzeResume(selectedCandidateId, selectedJobId);
      setAnalysis(result);
    } catch (err) {
      alert('Failed to analyze candidate against job description.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const handleCopySummary = () => {
    if (!analysis) return;
    const text = `EVALUATION SUMMARY: ${analysis.candidateName} for ${analysis.jobTitle}
Estimated Match Score: ${analysis.estimatedMatchScore}%
Calculation: ${analysis.scoreExplanation}

Matching Skills:
${analysis.matchingSkills.map(m => `- ${m.skill}: ${m.evidence}`).join('\n')}

Missing / Unverified Skills:
${analysis.missingSkills.map(s => `- ${s}`).join('\n')}

Suggested Interview Questions:
${analysis.suggestedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Overall Assessment:
${analysis.overallSummary}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Resume Analysis & Job Matching
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Grounded evaluation using Gemini 3.8 Flash with transparent score breakdown and verifiable resume evidence.
          </p>
        </div>

        {analysis && (
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Export Evaluation Note</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Candidate & Job Selection Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Select Candidate Resume</span>
            </label>
            <select
              value={selectedCandidateId}
              onChange={e => setSelectedCandidateId(e.target.value)}
              className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              {candidates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.location})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span>Select Target Requisition</span>
            </label>
            <select
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.department})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleRunAnalysis}
              disabled={isLoading || !selectedCandidateId || !selectedJobId}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Context Quick Summary */}
        {selectedCandidate && selectedJob && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
            <div>
              <strong>Candidate:</strong> {selectedCandidate.name} ({selectedCandidate.skills.length} skills listed)
            </div>
            <div>
              <strong>Job Requisition:</strong> {selectedJob.title} (Exp: {selectedJob.experienceRequired})
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results Display */}
      {analysis ? (
        <div className="space-y-6">
          {/* Top Score & Ethical Notice Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-6">
              {/* Score Indicator */}
              <div className="flex items-center gap-5">
                <div
                  className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center border font-bold ${getScoreColor(
                    analysis.estimatedMatchScore
                  )}`}
                >
                  <span className="text-3xl tracking-tight leading-none">
                    {analysis.estimatedMatchScore}%
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider mt-1">
                    Match
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Estimated Alignment Index
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {analysis.candidateName} ↔ {analysis.jobTitle}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                    {analysis.scoreExplanation}
                  </p>
                </div>
              </div>

              {/* Ethical AI Callout Badge */}
              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs text-slate-600 max-w-sm space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Assistive Evaluation Only</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  This score is an automated estimation aid. Protected demographic attributes are excluded. Human recruiter decision is required.
                </p>
              </div>
            </div>

            {/* Score 4-Way Breakdown Bars */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Transparent Weighting Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600">Technical Skills (40%)</span>
                    <span className="font-bold text-slate-900">
                      {analysis.scoreBreakdown.skillsMatch}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${analysis.scoreBreakdown.skillsMatch}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600">Experience Depth (30%)</span>
                    <span className="font-bold text-slate-900">
                      {analysis.scoreBreakdown.experienceMatch}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${analysis.scoreBreakdown.experienceMatch}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600">Qualifications (20%)</span>
                    <span className="font-bold text-slate-900">
                      {analysis.scoreBreakdown.qualificationsMatch}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${analysis.scoreBreakdown.qualificationsMatch}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600">Projects & Proof (10%)</span>
                    <span className="font-bold text-slate-900">
                      {analysis.scoreBreakdown.projectsMatch}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${analysis.scoreBreakdown.projectsMatch}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Skills: Matched vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matching Skills with Evidence */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="font-semibold text-sm text-slate-900">
                  Verified Matching Skills ({analysis.matchingSkills.length})
                </h4>
              </div>

              <div className="space-y-2.5">
                {analysis.matchingSkills.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-100 text-xs space-y-1"
                  >
                    <div className="font-bold text-emerald-900">{item.skill}</div>
                    <div className="text-slate-600 leading-relaxed italic text-[11px]">
                      "{item.evidence}"
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing or Unverified Skills */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="font-semibold text-sm text-slate-900">
                  Missing or Unverified Requirements ({analysis.missingSkills.length})
                </h4>
              </div>

              {analysis.missingSkills.length > 0 ? (
                <div className="space-y-2.5">
                  {analysis.missingSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-amber-50/40 border border-amber-100 text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-amber-900">{skill}</span>
                      <span className="text-[11px] text-amber-700">Not found in resume</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                  All mandatory technical skills verified in candidate resume.
                </div>
              )}
            </div>
          </div>

          {/* Relevant Experience Evidence */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Demonstrated Experience & Impact</span>
            </h4>
            <div className="space-y-2.5">
              {analysis.relevantExperience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 text-xs space-y-1"
                >
                  <div className="font-semibold text-slate-900">{exp.finding}</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{exp.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Verification Interview Questions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <h4 className="font-semibold text-sm text-slate-900">
                  Targeted Verification Questions for Interview
                </h4>
              </div>

              <button
                onClick={() => onNavigateToInterview(analysis.jobId, analysis.candidateId)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Generate Full Interview Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {analysis.suggestedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-purple-100 bg-purple-50/30 text-xs text-slate-800 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="font-bold text-purple-700 shrink-0">{idx + 1}.</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Job Relevance Synthesis */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-2">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400">
              Evaluator Synthesis
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">{analysis.overallSummary}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
          <Sparkles className="w-8 h-8 text-blue-400 mx-auto" />
          <h4 className="font-semibold text-slate-700 text-sm">No Active Evaluation</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Select a candidate resume and job requisition above, then click 'Run Analysis' to generate a grounded, evidence-backed evaluation.
          </p>
        </div>
      )}
    </div>
  );
};
