import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Briefcase,
  Users,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';
import { Candidate, JobDescription, InterviewGuide } from '../../server/types';
import { api } from '../services/api';

interface InterviewGuideViewProps {
  candidates: Candidate[];
  jobs: JobDescription[];
  initialJobId?: string;
  initialCandidateId?: string;
}

export const InterviewGuideView: React.FC<InterviewGuideViewProps> = ({
  candidates,
  jobs,
  initialJobId,
  initialCandidateId,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(
    initialJobId || (jobs[0]?.id || '')
  );
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    initialCandidateId || ''
  );

  const [guide, setGuide] = useState<InterviewGuide | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialJobId) setSelectedJobId(initialJobId);
    if (initialCandidateId) setSelectedCandidateId(initialCandidateId);
  }, [initialJobId, initialCandidateId]);

  const handleGenerateGuide = async () => {
    if (!selectedJobId) return;

    setIsLoading(true);
    try {
      const res = await api.generateInterviewGuide(
        selectedJobId,
        selectedCandidateId || undefined
      );
      setGuide(res);
    } catch (err) {
      alert('Failed to generate interview guide.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyGuide = () => {
    if (!guide) return;
    const text = `STRUCTURED INTERVIEW GUIDE: ${guide.jobTitle} ${
      guide.candidateName ? `(Candidate: ${guide.candidateName})` : ''
    }

QUESTIONS:
${guide.questions
  .map(
    (q, idx) =>
      `${idx + 1}. [${q.category} · ${q.difficulty}] ${q.question}\n   Purpose: ${
        q.purpose
      }\n   Evaluation Rubric: ${q.evaluationCriteria}`
  )
  .join('\n\n')}

INTERVIEWER GUIDELINES:
${guide.interviewerTips.map(t => `- ${t}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyBadge = (diff: string) => {
    if (diff === 'Advanced') return 'text-purple-700 bg-purple-50 border-purple-200';
    if (diff === 'Intermediate') return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Interview Question Generator
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Job-specific technical, behavioral (STAR), and situational interview questions with standardized evaluation rubrics.
          </p>
        </div>

        {guide && (
          <button
            onClick={handleCopyGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied Interview Kit</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Interview Kit</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Target Requisition</span>
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

          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Candidate Context (Optional)</span>
            </label>
            <select
              value={selectedCandidateId}
              onChange={e => setSelectedCandidateId(e.target.value)}
              className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">General Job Guide (No specific candidate)</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} (Tailor to resume & projects)
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleGenerateGuide}
              disabled={isLoading || !selectedJobId}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Kit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Guide Results */}
      {guide ? (
        <div className="space-y-6">
          {/* Guide Header Summary */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                Structured Interview Kit
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {guide.jobTitle}
                {guide.candidateName && (
                  <span className="text-slate-300 font-normal"> · Tailored for {guide.candidateName}</span>
                )}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Standardized questions to ensure parity and objective scoring across all candidates.
              </p>
            </div>

            <div className="text-xs font-mono text-slate-400 shrink-0">
              {guide.questions.length} questions ready
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-4">
            {guide.questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      {q.category} Question
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded border ${getDifficultyBadge(
                      q.difficulty
                    )}`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                <div className="text-sm font-semibold text-slate-900 leading-snug">
                  {q.question}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="space-y-1 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                      Interviewer Purpose
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{q.purpose}</p>
                  </div>

                  <div className="space-y-1 bg-blue-50/40 p-3 rounded-lg border border-blue-100">
                    <span className="font-semibold text-blue-900 uppercase tracking-wider text-[10px]">
                      Evaluation Rubric / What to Look For
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {q.evaluationCriteria}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interviewer Guidelines & Tips Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-emerald-600" />
              <span>Interviewer Guidelines & Fair Evaluation Standards</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {guide.interviewerTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed"
                >
                  <span className="font-bold text-slate-900 block mb-1">Principle #{idx + 1}</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
          <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm">
            Select a job requisition above and click 'Generate Kit' to produce a complete structured interview kit.
          </p>
        </div>
      )}
    </div>
  );
};
