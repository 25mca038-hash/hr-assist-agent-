/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation, ActiveTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ResumesView } from './components/ResumesView';
import { JobsView } from './components/JobsView';
import { AnalysisView } from './components/AnalysisView';
import { ComparisonView } from './components/ComparisonView';
import { InterviewGuideView } from './components/InterviewGuideView';
import { RAGKnowledgeView } from './components/RAGKnowledgeView';
import { AgentChatView } from './components/AgentChatView';
import { api, DashboardStats } from './services/api';
import { Candidate, JobDescription, HRPolicy } from '../server/types';
import { RotateCcw, ShieldCheck, Sparkles, Database, Bot, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [policies, setPolicies] = useState<HRPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cross-navigation context
  const [targetCandidateId, setTargetCandidateId] = useState<string>('');
  const [targetJobId, setTargetJobId] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Global drawer copilot when on non-dashboard tabs
  const [isDrawerCopilotOpen, setIsDrawerCopilotOpen] = useState(false);

  const loadData = async () => {
    try {
      const [statsData, candidatesData, jobsData, policiesData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getCandidates().catch(() => []),
        api.getJobs().catch(() => []),
        api.getPolicies().catch(() => []),
      ]);

      if (statsData) setStats(statsData);
      setCandidates(candidatesData);
      setJobs(jobsData);
      setPolicies(policiesData);
    } catch (e) {
      console.error('Error loading application data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleResetDemo = async () => {
    if (confirm('Restore default sample resumes, job requisitions, and HR policy files?')) {
      try {
        await api.resetDemoData();
        await loadData();
        showToast('Demo data restored successfully!');
      } catch (err) {
        alert('Failed to reset demo data.');
      }
    }
  };

  const handleNavigateTab = (tab: ActiveTab, params?: { candidateId?: string; jobId?: string }) => {
    if (params?.candidateId) setTargetCandidateId(params.candidateId);
    if (params?.jobId) setTargetJobId(params.jobId);
    setActiveTab(tab);
  };

  const handleSelectCandidateForAnalysis = (candidateId: string, jobId: string) => {
    setTargetCandidateId(candidateId);
    setTargetJobId(jobId);
    setActiveTab('analysis');
  };

  const handleNavigateToInterview = (jobId: string, candidateId?: string) => {
    setTargetJobId(jobId);
    if (candidateId) setTargetCandidateId(candidateId);
    setActiveTab('interview');
  };

  const handleNavigateToComparison = (jobId: string) => {
    setTargetJobId(jobId);
    setActiveTab('comparison');
  };

  const handleActionExecuted = (payload: any) => {
    loadData();
    if (payload?.type === 'candidate_status_updated') {
      showToast(`Updated ${payload.data.candidate.name}'s stage to "${payload.data.newStatus}"!`);
    } else if (payload?.type === 'interview_scheduled') {
      showToast(`Interview confirmed for ${payload.data.candidateName}!`);
    } else if (payload?.type === 'job_created') {
      showToast(`Published job requisition: "${payload.data.title}"!`);
    } else if (payload?.type === 'outreach_drafted') {
      showToast(`Drafted outreach email for ${payload.data.candidateName}!`);
    } else if (payload?.type === 'analysis_completed') {
      showToast(`Resume analysis completed!`);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        candidateCount={candidates.length}
        jobCount={jobs.length}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Workspace
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-900 capitalize">
              {activeTab === 'rag'
                ? 'RAG Knowledge Base & Retrieval'
                : activeTab === 'chat'
                ? 'AI Recruitment Agent & Action Copilot'
                : activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Vector Store: {stats?.vectorChunksCount || 28} Chunks Indexed</span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ethical Guardrails Enforced</span>
            </div>
          </div>
        </header>

        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-4 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-lg flex items-center gap-2 border border-slate-700 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-xs font-medium">Initializing TalentScout AI Knowledge Engine...</div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  candidates={candidates}
                  jobs={jobs}
                  interviews={stats?.upcomingInterviews || []}
                  setActiveTab={handleNavigateTab}
                  onSelectCandidateForAnalysis={handleSelectCandidateForAnalysis}
                  onRefreshData={loadData}
                  onOpenUploadModal={() => {
                    setActiveTab('resumes');
                    setIsUploadModalOpen(true);
                  }}
                  onOpenJobModal={() => {
                    setActiveTab('jobs');
                    setIsJobModalOpen(true);
                  }}
                />
              )}

              {activeTab === 'resumes' && (
                <ResumesView
                  candidates={candidates}
                  jobs={jobs}
                  onRefresh={loadData}
                  onAnalyzeCandidate={handleSelectCandidateForAnalysis}
                  isUploadModalOpen={isUploadModalOpen}
                  setIsUploadModalOpen={setIsUploadModalOpen}
                />
              )}

              {activeTab === 'jobs' && (
                <JobsView
                  jobs={jobs}
                  onRefresh={loadData}
                  onNavigateToComparison={handleNavigateToComparison}
                  onNavigateToInterviewGuide={handleNavigateToInterview}
                  isCreateModalOpen={isJobModalOpen}
                  setIsCreateModalOpen={setIsJobModalOpen}
                />
              )}

              {activeTab === 'analysis' && (
                <AnalysisView
                  candidates={candidates}
                  jobs={jobs}
                  initialCandidateId={targetCandidateId}
                  initialJobId={targetJobId}
                  onNavigateToInterview={handleNavigateToInterview}
                />
              )}

              {activeTab === 'comparison' && (
                <ComparisonView
                  candidates={candidates}
                  jobs={jobs}
                  initialJobId={targetJobId}
                />
              )}

              {activeTab === 'interview' && (
                <InterviewGuideView
                  candidates={candidates}
                  jobs={jobs}
                  initialJobId={targetJobId}
                  initialCandidateId={targetCandidateId}
                />
              )}

              {activeTab === 'rag' && (
                <RAGKnowledgeView
                  policies={policies}
                  onRefresh={loadData}
                />
              )}

              {activeTab === 'chat' && (
                <AgentChatView
                  onNavigateTab={handleNavigateTab}
                  onActionExecuted={handleActionExecuted}
                />
              )}
            </>
          )}
        </main>

        {/* Global Floating Agent Launcher (Visible on tabs other than Dashboard & Chat) */}
        {activeTab !== 'dashboard' && activeTab !== 'chat' && (
          <aside aria-label="Recruitment Agent Copilot Drawer">
            <button
              onClick={() => setIsDrawerCopilotOpen(!isDrawerCopilotOpen)}
              className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold transition cursor-pointer"
              title="Open AI Recruitment Copilot"
            >
              <Bot className="w-5 h-5" />
              <span className="hidden sm:inline">AI Agent Copilot</span>
            </button>

            {/* Slide-over Drawer Panel */}
            {isDrawerCopilotOpen && (
              <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-300 flex flex-col animate-slide-left">
                <AgentChatView
                  isEmbedded={true}
                  onClose={() => setIsDrawerCopilotOpen(false)}
                  onNavigateTab={handleNavigateTab}
                  onActionExecuted={handleActionExecuted}
                />
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
