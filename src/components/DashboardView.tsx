import React, { useState } from 'react';
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
  Calendar,
  Video,
  Mail,
  Zap,
  ChevronRight,
  UserCheck,
  Copy,
  Check,
  PanelRightClose,
  PanelRightOpen,
  Filter,
} from 'lucide-react';
import { DashboardStats } from '../services/api';
import { ActiveTab } from './Navigation';
import { Candidate, JobDescription, ScheduledInterview } from '../../server/types';
import { AgentChatView } from './AgentChatView';

interface DashboardViewProps {
  stats: DashboardStats | null;
  candidates: Candidate[];
  jobs: JobDescription[];
  interviews?: ScheduledInterview[];
  setActiveTab: (tab: ActiveTab, params?: { candidateId?: string; jobId?: string }) => void;
  onSelectCandidateForAnalysis?: (candidateId: string, jobId: string) => void;
  onOpenUploadModal: () => void;
  onOpenJobModal: () => void;
  onRefreshData?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  candidates,
  jobs,
  interviews = [],
  setActiveTab,
  onSelectCandidateForAnalysis,
  onOpenUploadModal,
  onOpenJobModal,
  onRefreshData,
}) => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  const [agentPrompt, setAgentPrompt] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Quick Action Dispatcher directly into the agent copilot
  const handleDispatchAgentAction = (promptText: string) => {
    setIsCopilotOpen(true);
    setAgentPrompt(promptText);
  };

  const handleCopyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Pipeline counts calculation
  const pipeline = stats?.pipeline || {
    applied: candidates.filter(c => !c.status || c.status === 'Applied').length,
    screening: candidates.filter(c => c.status === 'Screening').length,
    shortlisted: candidates.filter(c => c.status === 'Shortlisted').length,
    interviewing: candidates.filter(
      c => c.status === 'Technical Interview' || c.status === 'Executive Review'
    ).length,
    offer: candidates.filter(c => c.status === 'Offer Sent' || c.status === 'Hired').length,
  };

  const [selectedStage, setSelectedStage] = useState<string>('all');

  const filteredCandidates = candidates.filter(c => {
    if (selectedStage === 'all') return true;
    if (selectedStage === 'applied') return !c.status || c.status === 'Applied';
    if (selectedStage === 'screening') return c.status === 'Screening';
    if (selectedStage === 'shortlisted') return c.status === 'Shortlisted';
    if (selectedStage === 'interviewing') return c.status === 'Technical Interview' || c.status === 'Executive Review';
    if (selectedStage === 'offer') return c.status === 'Offer Sent' || c.status === 'Hired';
    return true;
  });

  const upcomingInterviews = stats?.upcomingInterviews || interviews;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Recruitment Intelligence Dashboard
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              LLM + RAG Agent Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Grounded candidate-job matching, vector search, automated pipeline actions, and live interview operations.
          </p>
        </div>

        {/* Quick Access Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition border ${
              isCopilotOpen
                ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle Agent Copilot beside dashboard"
          >
            {isCopilotOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
            <span>{isCopilotOpen ? 'Hide Agent Copilot' : 'Show Agent Copilot'}</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Resume</span>
          </button>

          <button
            onClick={onOpenJobModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Requisition</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Full Agent View</span>
          </button>
        </div>
      </div>

      {/* Quick Agent Command Triggers Strip */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200/80 p-3.5 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Agent Quick-Action Dispatcher (Click to Execute Alongside Dashboard):
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => handleDispatchAgentAction('Shortlist Priya Sharma for the Senior Full-Stack role')}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 hover:border-blue-400 text-slate-800 hover:text-blue-700 text-xs font-medium whitespace-nowrap shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Shortlist Priya Sharma</span>
          </button>

          <button
            onClick={() => handleDispatchAgentAction('Schedule technical interview for Alex Chen on Friday at 2 PM')}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 text-slate-800 hover:text-indigo-700 text-xs font-medium whitespace-nowrap shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Schedule Interview for Alex Chen</span>
          </button>

          <button
            onClick={() => handleDispatchAgentAction('Shortlist Sarah Jenkins for Front-End UI Engineer position')}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-200 hover:border-amber-400 text-slate-800 hover:text-amber-700 text-xs font-medium whitespace-nowrap shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Shortlist Sarah Jenkins</span>
          </button>

          <button
            onClick={() => handleDispatchAgentAction('Move David Kumar to Technical Interview stage')}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 hover:border-purple-400 text-slate-800 hover:text-purple-700 text-xs font-medium whitespace-nowrap shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Advance David Kumar</span>
          </button>

          <button
            onClick={() => handleDispatchAgentAction('Draft formal offer letter for Priya Sharma for Full-Stack role')}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-200 hover:border-emerald-400 text-slate-800 hover:text-emerald-700 text-xs font-medium whitespace-nowrap shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
            <span>Draft Offer for Priya</span>
          </button>

          <button
            onClick={() => handleDispatchAgentAction('Create job for Senior DevOps Engineer with Docker, Kubernetes, AWS')}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 hover:border-blue-400 text-slate-800 hover:text-blue-700 text-xs font-medium whitespace-nowrap shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>Post DevOps Requisition</span>
          </button>

          <button
            onClick={() => handleDispatchAgentAction('Compare Priya Sharma and Alex Chen for Senior Full-Stack opening')}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-purple-200 hover:border-purple-400 text-slate-800 hover:text-purple-700 text-xs font-medium whitespace-nowrap shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Compare Candidates</span>
          </button>
        </div>
      </div>

      {/* Talent Pipeline Stage Metrics Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <span>Active Recruitment Pipeline Stages</span>
          <span className="text-[11px] font-normal normal-case text-slate-400">
            Updated in real time by AI Agent & Recruiter
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Applied</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{pipeline.applied}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Incoming resumes</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200">
            <div className="text-xs text-blue-700 font-medium">Screening</div>
            <div className="text-xl font-bold text-blue-900 mt-1">{pipeline.screening}</div>
            <div className="text-[10px] text-blue-600 mt-0.5">Qualification check</div>
          </div>
          <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200">
            <div className="text-xs text-amber-700 font-medium">Shortlisted</div>
            <div className="text-xl font-bold text-amber-900 mt-1">{pipeline.shortlisted}</div>
            <div className="text-[10px] text-amber-600 mt-0.5">Passed AI screening</div>
          </div>
          <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-200">
            <div className="text-xs text-indigo-700 font-medium">Interviewing</div>
            <div className="text-xl font-bold text-indigo-900 mt-1">{pipeline.interviewing}</div>
            <div className="text-[10px] text-indigo-600 mt-0.5">Rounds scheduled</div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200">
            <div className="text-xs text-emerald-700 font-medium">Offer / Hired</div>
            <div className="text-xl font-bold text-emerald-900 mt-1">{pipeline.offer}</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Offer stage</div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Dashboard Left + Agent Copilot Right */}
      <div className={`grid grid-cols-1 ${isCopilotOpen ? 'lg:grid-cols-12 gap-6' : 'gap-6'}`}>
        {/* Left Column: Dashboard Content */}
        <div className={`space-y-6 ${isCopilotOpen ? 'lg:col-span-7' : 'w-full'}`}>
          {/* Primary KPI Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-medium uppercase tracking-wider">Candidate Resumes</span>
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">
                  {stats?.totalResumes ?? candidates.length}
                </span>
                <span className="text-xs text-slate-500">parsed</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-medium uppercase tracking-wider">Open Requisitions</span>
                <Briefcase className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">
                  {stats?.totalJobs ?? jobs.length}
                </span>
                <span className="text-xs text-slate-500">roles</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-medium uppercase tracking-wider">Match Analyses</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">
                  {stats?.candidatesAnalyzed ?? 4}
                </span>
                <span className="text-xs text-slate-500">evaluations</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-medium uppercase tracking-wider">Avg Match Score</span>
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-slate-900">
                  {stats?.averageMatchScore ?? 82}%
                </span>
                <span className="text-xs text-slate-500">estimated</span>
              </div>
            </div>
          </div>

          {/* Upcoming Scheduled Interviews Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Upcoming Scheduled Interviews
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dispatched by Agent or HR Coordinator with meeting links
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDispatchAgentAction('Schedule an interview for one of our candidates')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Book via Agent</span>
              </button>
            </div>

            {upcomingInterviews && upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {upcomingInterviews.slice(0, 3).map(interview => (
                  <div
                    key={interview.id}
                    className="p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{interview.candidateName}</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-semibold">
                          {interview.interviewType}
                        </span>
                        {interview.jobTitle && (
                          <span className="text-slate-500 text-[11px]">for {interview.jobTitle}</span>
                        )}
                      </div>
                      <div className="text-slate-500 flex items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-600" />
                          {new Date(interview.scheduledTime).toLocaleString([], {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span>Interviewer: <strong>{interview.interviewer}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyMeetingLink(interview.meetingLink)}
                        className="px-2.5 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                        title="Copy Meet link"
                      >
                        {copiedLink === interview.meetingLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedLink === interview.meetingLink ? 'Copied' : 'Meet Link'}</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('interview', { candidateId: interview.candidateId, jobId: interview.jobId })}
                        className="px-2.5 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>Interview Kit</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No upcoming interviews scheduled yet. Ask the Agent Copilot to schedule one!
              </div>
            )}
          </div>

          {/* Candidate Talent Pool with Live Pipeline Stage & Agent Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Talent Pool & Pipeline Management
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click quick action buttons to dispatch commands directly to the Agent Copilot
                </p>
              </div>
              <button
                onClick={() => setActiveTab('resumes')}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View all ({candidates.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pipeline Stage Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 border-b border-slate-100">
              <button
                onClick={() => setSelectedStage('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedStage === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({candidates.length})
              </button>
              <button
                onClick={() => setSelectedStage('applied')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedStage === 'applied'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Applied ({pipeline.applied})
              </button>
              <button
                onClick={() => setSelectedStage('screening')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedStage === 'screening'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                Screening ({pipeline.screening})
              </button>
              <button
                onClick={() => setSelectedStage('shortlisted')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedStage === 'shortlisted'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Shortlisted ({pipeline.shortlisted})
              </button>
              <button
                onClick={() => setSelectedStage('interviewing')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedStage === 'interviewing'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                Interviewing ({pipeline.interviewing})
              </button>
              <button
                onClick={() => setSelectedStage('offer')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedStage === 'offer'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Offer / Hired ({pipeline.offer})
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {candidate.name}
                        </span>
                        {/* Pipeline Status Tag */}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            candidate.status === 'Shortlisted'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : candidate.status === 'Technical Interview' || candidate.status === 'Executive Review'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : candidate.status === 'Offer Sent' || candidate.status === 'Hired'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : candidate.status === 'Screening'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : candidate.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {candidate.status || 'Applied'}
                        </span>
                        <span className="text-[11px] text-slate-400 hidden md:inline">
                          {candidate.location}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 4).map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Agent Action Buttons per Candidate */}
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      <button
                        onClick={() =>
                          handleDispatchAgentAction(
                            `Shortlist candidate ${candidate.name} and provide summary of key qualifications.`
                          )
                        }
                        className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-medium transition cursor-pointer"
                        title="Dispatch Shortlist action to Agent"
                      >
                        ⚡ Shortlist
                      </button>

                      <button
                        onClick={() =>
                          handleDispatchAgentAction(
                            `Schedule technical interview for ${candidate.name} with meeting link.`
                          )
                        }
                        className="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-[11px] font-medium transition cursor-pointer"
                        title="Dispatch Schedule action to Agent"
                      >
                        ⚡ Schedule
                      </button>

                      <button
                        onClick={() =>
                          handleDispatchAgentAction(
                            `Draft personalized interview invitation email for ${candidate.name}.`
                          )
                        }
                        className="px-2 py-1 rounded bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-[11px] font-medium transition cursor-pointer"
                        title="Dispatch Email Draft action to Agent"
                      >
                        ⚡ Draft Email
                      </button>

                      <button
                        onClick={() =>
                          handleDispatchAgentAction(
                            `Advance candidate ${candidate.name} to the next recruitment stage.`
                          )
                        }
                        className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-medium transition cursor-pointer"
                        title="Advance pipeline stage with Copilot"
                      >
                        ⚡ Advance
                      </button>

                      <button
                        onClick={() => {
                          if (jobs.length > 0 && onSelectCandidateForAnalysis) {
                            onSelectCandidateForAnalysis(candidate.id, jobs[0].id);
                          } else {
                            setActiveTab('analysis');
                          }
                        }}
                        className="px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-medium transition cursor-pointer"
                      >
                        Analyze Match
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No candidates currently in "{selectedStage}" stage.
                </div>
              )}
            </div>
          </div>

          {/* Open Job Requisitions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Active Requisitions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Benchmarks used for candidate matching and interview guide generation
                </p>
              </div>
              <button
                onClick={() => setActiveTab('jobs')}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
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

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs flex-wrap gap-2">
                    <span className="text-slate-500">Exp: {job.experienceRequired}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          handleDispatchAgentAction(
                            `Analyze and rank matching candidates for ${job.title} requisition.`
                          )
                        }
                        className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition cursor-pointer text-[11px]"
                        title="Rank candidates using Copilot"
                      >
                        ⚡ Rank Matches
                      </button>
                      <button
                        onClick={() =>
                          handleDispatchAgentAction(
                            `Generate structured interview questions for ${job.title}.`
                          )
                        }
                        className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition cursor-pointer text-[11px]"
                        title="Generate interview kit with Copilot"
                      >
                        ⚡ Interview Kit
                      </button>
                      <button
                        onClick={() => setActiveTab('comparison', { jobId: job.id })}
                        className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer text-[11px]"
                      >
                        Compare →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">Recent Recruitment Actions</h3>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
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
                <div className="text-xs text-slate-400 py-3 text-center">
                  No recent activities recorded.
                </div>
              )}
            </div>
          </div>

          {/* Ethical AI Compliance Rules Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ethical AI Compliance Rules</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
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
                  <strong>Human-in-the-loop:</strong> Match scores serve strictly as assistive aids; final hiring decisions remain under human control.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: AI Agent Copilot Working Alongside Dashboard */}
        {isCopilotOpen && (
          <div className="lg:col-span-5 h-[800px] lg:h-[calc(100vh-170px)] sticky top-6 rounded-xl border border-slate-300 shadow-md overflow-hidden bg-white flex flex-col">
            <AgentChatView
              isEmbedded={true}
              onClose={() => setIsCopilotOpen(false)}
              onNavigateTab={setActiveTab}
              initialPrompt={agentPrompt}
              onClearInitialPrompt={() => setAgentPrompt('')}
              onActionExecuted={() => {
                // Instantly re-fetch dashboard stats and candidates to reflect live changes!
                onRefreshData?.();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
