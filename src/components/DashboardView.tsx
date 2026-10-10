import React from 'react';
import {
  FileText,
  Briefcase,
  Users,
  Sparkles,
  Database,
  ArrowRight,
  Upload,
  Plus,
  Bot,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { DashboardStats } from '../services/api';
import { ActiveTab } from './Navigation';
import { Candidate, JobDescription } from '../../server/types';

interface DashboardViewProps {
  stats: DashboardStats | null;
  candidates: Candidate[];
  jobs: JobDescription[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectCandidateForAnalysis?: (candidateId: string, jobId: string) => void;
  onOpenUploadModal: () => void;
  onOpenJobModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  candidates,
  jobs,
  setActiveTab,
  onSelectCandidateForAnalysis,
  onOpenUploadModal,
  onOpenJobModal,
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Title & Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Recruitment Intelligence Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Grounded LLM candidate matching, vector-indexed resumes, and HR policy retrieval assistant.
          </p>
        </div>

        {/* Quick Access Action Bar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Resume</span>
          </button>

          <button
            onClick={onOpenJobModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Requisition</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask AI Agent</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Candidate Resumes</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {stats?.totalResumes ?? candidates.length}
            </span>
            <span className="text-xs text-slate-500">indexed</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>PDF, DOCX, TXT parsed</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Active Requisitions</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {stats?.totalJobs ?? jobs.length}
            </span>
            <span className="text-xs text-slate-500">open roles</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Engineering & Design</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Analyzed Matches</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {stats?.candidatesAnalyzed ?? 0}
            </span>
            <span className="text-xs text-slate-500">evaluations</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>Grounded with Gemini</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Avg. Alignment</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {stats?.averageMatchScore ? `${stats.averageMatchScore}%` : '82%'}
            </span>
            <span className="text-xs text-slate-500">estimated</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>Objective 4-tier weighting</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">RAG Chunks</span>
            <Database className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {stats?.vectorChunksCount ?? 28}
            </span>
            <span className="text-xs text-slate-500">vector embeddings</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            <span>Dense semantic + BM25</span>
          </div>
        </div>
      </div>

      {/* RAG Architecture Project Showcase Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-5 text-white border border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>MCA / Final-Year AI Project Architecture</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              End-to-End Recruitment RAG & Tool-Using Agent
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Multi-document ingestion (Resumes, Requisitions, HR Policies) → Text Normalization → Overlapping Semantic Chunking → Gemini Embeddings & Vector Search → Grounded LLM Response with Source Citations.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('rag')}
              className="px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition"
            >
              Explore Vector Chunks
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className="px-3.5 py-2 rounded-lg bg-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-600 transition"
            >
              Test Tool-Using Agent
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Candidates at a Glance & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Requisitions & Candidates */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidates Ready for Evaluation */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Candidate Talent Pool
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified profiles parsed from unstructured resumes
                </p>
              </div>
              <button
                onClick={() => setActiveTab('resumes')}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View all ({candidates.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {candidates.slice(0, 4).map(candidate => (
                <div
                  key={candidate.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">
                        {candidate.name}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{candidate.location}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {candidate.summary}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs text-slate-500">
                      {candidate.skills.slice(0, 5).map((skill, sIdx) => (
                        <span key={skill}>
                          {skill}
                          {sIdx < Math.min(candidate.skills.length, 5) - 1 && (
                            <span className="text-slate-300 ml-1.5">/</span>
                          )}
                        </span>
                      ))}
                      {candidate.skills.length > 5 && (
                        <span className="text-slate-400">
                          +{candidate.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        if (jobs.length > 0 && onSelectCandidateForAnalysis) {
                          onSelectCandidateForAnalysis(candidate.id, jobs[0].id);
                        } else {
                          setActiveTab('analysis');
                        }
                      }}
                      className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition"
                    >
                      Analyze Match
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Job Requisitions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Open Job Requisitions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Benchmarks used for candidate matching and interview guide generation
                </p>
              </div>
              <button
                onClick={() => setActiveTab('jobs')}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Manage jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {jobs.slice(0, 2).map(job => (
                <div
                  key={job.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{job.title}</h4>
                      <p className="text-xs text-slate-500">
                        {job.department} · {job.employmentType}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {job.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Exp: {job.experienceRequired}</span>
                    <button
                      onClick={() => setActiveTab('comparison')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Compare Candidates →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Recent Activities & Ethical Note */}
        <div className="space-y-6">
          {/* Recent Activity Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">Recent Activities</h3>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3.5">
              {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.slice(0, 5).map(act => (
                  <div key={act.id} className="text-xs space-y-1 border-l-2 border-blue-500 pl-3 py-0.5">
                    <div className="font-semibold text-slate-800">{act.title}</div>
                    <div className="text-slate-500 leading-relaxed">{act.description}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(act.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-4 text-center">
                  No recent activities recorded.
                </div>
              )}
            </div>
          </div>

          {/* Ethical AI & Fair Evaluation Guidelines Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ethical AI Compliance Rules</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong>Job-relevant criteria only:</strong> Technical skills, verified work history, and qualifications.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong>Zero protected characteristics:</strong> Names, photos, gender, age, or religion are barred from ranking.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong>No automated rejection:</strong> Match scores serve strictly as assistive aids for human interviewers.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
