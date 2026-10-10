import React, { useState } from 'react';
import {
  Briefcase,
  UserCheck,
  Sparkles,
  GitCompare,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Mail,
  Copy,
  Check,
  Video,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { AgentActionPayload } from '../../server/types';
import { ActiveTab } from './Navigation';

interface ActionCardProps {
  payload: AgentActionPayload;
  onNavigateTab?: (tab: ActiveTab, params?: { candidateId?: string; jobId?: string }) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ payload, onNavigateTab }) => {
  const [copied, setCopied] = useState(false);

  if (!payload || !payload.type) return null;

  switch (payload.type) {
    case 'candidate_status_updated': {
      const data = payload.data;
      const candidate = data.candidate;
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3.5 space-y-2.5 text-xs text-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <UserCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Candidate Pipeline Stage Updated</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-200/70 text-amber-900 font-bold rounded">
              {data.newStatus}
            </span>
          </div>

          <div>
            <div className="font-bold text-slate-900">{candidate.name}</div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Moved from <span className="line-through text-slate-400">{data.previousStatus}</span> → <strong className="text-amber-800">{data.newStatus}</strong>
            </div>
          </div>

          {data.note && (
            <div className="p-2 rounded bg-white/80 border border-amber-200/80 text-[11px] text-slate-600 italic">
              "{data.note}"
            </div>
          )}

          <div className="pt-2 border-t border-amber-200/70 flex items-center gap-2">
            <button
              onClick={() => onNavigateTab?.('dashboard')}
              className="px-2.5 py-1 rounded bg-amber-700 text-white font-medium hover:bg-amber-800 text-[11px] flex items-center gap-1 transition"
            >
              <span>View Dashboard Pipeline</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigateTab?.('resumes')}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-medium transition"
            >
              Candidate Directory
            </button>
          </div>
        </div>
      );
    }

    case 'interview_scheduled': {
      const int = payload.data;
      return (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/80 p-3.5 space-y-2.5 text-xs text-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <Calendar className="w-3.5 h-3.5 text-indigo-700" />
              <span>Interview Booked & Invite Dispatched</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-200/70 text-indigo-900 font-bold rounded">
              Confirmed
            </span>
          </div>

          <div>
            <div className="font-bold text-slate-900">{int.candidateName} · {int.interviewType}</div>
            <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-indigo-600" />
              <span>{new Date(int.scheduledTime).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Interviewer: <strong>{int.interviewer}</strong>
            </div>
          </div>

          <div className="p-2 rounded bg-white/90 border border-indigo-200 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 font-mono text-indigo-700 truncate mr-2">
              <Video className="w-3 h-3 shrink-0" />
              <span className="truncate">{int.meetingLink}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(int.meetingLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="shrink-0 text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 hover:bg-indigo-200 font-medium"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          <div className="pt-2 border-t border-indigo-200/70 flex items-center gap-2">
            <button
              onClick={() => onNavigateTab?.('dashboard')}
              className="px-2.5 py-1 rounded bg-indigo-700 text-white font-medium hover:bg-indigo-800 text-[11px] flex items-center gap-1 transition"
            >
              <span>View in Dashboard Calendar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigateTab?.('interview', { candidateId: int.candidateId, jobId: int.jobId })}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-medium transition"
            >
              Prepare Questions
            </button>
          </div>
        </div>
      );
    }

    case 'outreach_drafted': {
      const draft = payload.data;
      return (
        <div className="rounded-lg border border-teal-200 bg-teal-50/80 p-3.5 space-y-2.5 text-xs text-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-teal-900">
              <Mail className="w-3.5 h-3.5 text-teal-700" />
              <span>{draft.type} Draft Prepared</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-200/70 text-teal-900 font-bold rounded">
              Ready to Send
            </span>
          </div>

          <div>
            <div className="font-bold text-slate-900">To: {draft.candidateName} ({draft.candidateEmail})</div>
            <div className="text-[11px] font-medium text-slate-700 mt-0.5">
              Subject: {draft.subject}
            </div>
          </div>

          <div className="p-2.5 rounded bg-white/90 border border-teal-200 text-[11px] text-slate-600 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
            {draft.body}
          </div>

          <div className="pt-2 border-t border-teal-200/70 flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-2.5 py-1 rounded bg-teal-700 text-white font-medium hover:bg-teal-800 text-[11px] flex items-center gap-1 transition"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied Email' : 'Copy Email Body'}</span>
            </button>
            <span className="text-[10px] text-teal-700 font-medium">Saved in workspace</span>
          </div>
        </div>
      );
    }

    case 'job_created': {
      const job = payload.data;
      return (
        <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3.5 space-y-2.5 text-xs text-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <Briefcase className="w-3.5 h-3.5 text-blue-700" />
              <span>Job Requisition Created & Published</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded">
              Live in DB
            </span>
          </div>

          <div>
            <div className="font-bold text-slate-900">{job.title}</div>
            <div className="text-[11px] text-slate-500">
              {job.department} · {job.employmentType} · Exp: {job.experienceRequired}
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {job.requiredSkills?.slice(0, 4).map((s: string) => (
              <span key={s} className="px-2 py-0.5 bg-white border border-blue-200 text-blue-800 text-[10px] rounded font-medium">
                {s}
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-blue-200/60 flex items-center gap-2">
            <button
              onClick={() => onNavigateTab?.('jobs')}
              className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 text-[11px] flex items-center gap-1 transition"
            >
              <span>View in Requisitions</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigateTab?.('comparison', { jobId: job.id })}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-medium transition"
            >
              Match Candidates
            </button>
          </div>
        </div>
      );
    }

    case 'candidate_added': {
      const cand = payload.data;
      return (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3.5 space-y-2.5 text-xs text-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Candidate Profile Added & Indexed</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded">
              Indexed in RAG
            </span>
          </div>

          <div>
            <div className="font-bold text-slate-900">{cand.name}</div>
            <div className="text-[11px] text-slate-500">{cand.location}</div>
          </div>

          <div className="flex flex-wrap gap-1">
            {cand.skills?.slice(0, 5).map((s: string) => (
              <span key={s} className="px-2 py-0.5 bg-white border border-emerald-200 text-emerald-800 text-[10px] rounded font-medium">
                {s}
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-2">
            <button
              onClick={() => onNavigateTab?.('resumes')}
              className="px-2.5 py-1 rounded bg-emerald-700 text-white font-medium hover:bg-emerald-800 text-[11px] flex items-center gap-1 transition"
            >
              <span>Inspect Profile</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigateTab?.('analysis', { candidateId: cand.id })}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-medium transition"
            >
              Analyze with Requisition
            </button>
          </div>
        </div>
      );
    }

    case 'analysis_completed': {
      const analysis = payload.data;
      return (
        <div className="rounded-lg border border-purple-200 bg-purple-50/70 p-3.5 space-y-2.5 text-xs text-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-purple-900">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>AI Resume Analysis Completed</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-purple-600 text-white rounded">
              {analysis.estimatedMatchScore}% Match
            </span>
          </div>

          <div>
            <div className="font-bold text-slate-900">
              {analysis.candidateName} ↔ {analysis.jobTitle}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Skills: {analysis.scoreBreakdown?.skillsMatch}% · Exp: {analysis.scoreBreakdown?.experienceMatch}%
            </div>
          </div>

          <div className="pt-2 border-t border-purple-200/60 flex items-center gap-2">
            <button
              onClick={() => onNavigateTab?.('analysis', { candidateId: analysis.candidateId, jobId: analysis.jobId })}
              className="px-2.5 py-1 rounded bg-purple-600 text-white font-medium hover:bg-purple-700 text-[11px] flex items-center gap-1 transition"
            >
              <span>Open in Matching Tab</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigateTab?.('interview', { candidateId: analysis.candidateId, jobId: analysis.jobId })}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-medium transition"
            >
              Generate Interview Kit
            </button>
          </div>
        </div>
      );
    }

    case 'comparison_completed': {
      const comp = payload.data;
      return (
        <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3.5 space-y-2.5 text-xs text-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <GitCompare className="w-3.5 h-3.5 text-blue-700" />
              <span>Multi-Candidate Comparison Ready</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold">
              {comp.candidates?.length} Candidates
            </span>
          </div>

          <div className="text-slate-700 leading-snug">
            Evaluated for <strong>{comp.jobTitle}</strong> with comparative competency breakdowns.
          </div>

          <div className="pt-1">
            <button
              onClick={() => onNavigateTab?.('comparison', { jobId: comp.jobId })}
              className="px-3 py-1.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 text-[11px] flex items-center gap-1 transition"
            >
              <span>Open in Comparison Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    case 'interview_guide_generated': {
      const guide = payload.data;
      return (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-3.5 space-y-2.5 text-xs text-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-700" />
              <span>Structured Interview Kit Prepared</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-semibold">
              {guide.questions?.length} Questions
            </span>
          </div>

          <div className="text-slate-700 leading-snug">
            Standardized technical, behavioral, and problem-solving rubrics for <strong>{guide.jobTitle}</strong>.
          </div>

          <div className="pt-1">
            <button
              onClick={() => onNavigateTab?.('interview', { jobId: guide.jobId, candidateId: guide.candidateId })}
              className="px-3 py-1.5 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 text-[11px] flex items-center gap-1 transition"
            >
              <span>View Full Interview Kit</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};
