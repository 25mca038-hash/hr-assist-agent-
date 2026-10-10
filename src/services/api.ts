import {
  Candidate,
  CandidateStatus,
  JobDescription,
  HRPolicy,
  MatchAnalysis,
  InterviewGuide,
  ComparisonResult,
  GroundedRAGAnswer,
  AgentChatMessage,
  ScheduledInterview,
  CandidateOutreachDraft,
} from '../../server/types';

export interface DashboardStats {
  totalResumes: number;
  totalJobs: number;
  candidatesAnalyzed: number;
  averageMatchScore: number;
  pipeline?: {
    applied: number;
    screening: number;
    shortlisted: number;
    interviewing: number;
    offer: number;
  };
  upcomingInterviews?: ScheduledInterview[];
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
  }>;
  recentAnalyses: MatchAnalysis[];
  vectorChunksCount: number;
}

export const api = {
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch('/api/dashboard/stats');
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async getCandidates(): Promise<Candidate[]> {
    const res = await fetch('/api/candidates');
    if (!res.ok) throw new Error('Failed to fetch candidates');
    return res.json();
  },

  async getCandidate(id: string): Promise<Candidate> {
    const res = await fetch(`/api/candidates/${id}`);
    if (!res.ok) throw new Error('Failed to fetch candidate');
    return res.json();
  },

  async uploadResume(payload: {
    fileName: string;
    fileData?: string;
    fileType?: string;
    rawText?: string;
  }): Promise<Candidate> {
    const res = await fetch('/api/candidates/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload and parse resume');
    }
    return res.json();
  },

  async deleteCandidate(id: string): Promise<void> {
    const res = await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete candidate');
  },

  async updateCandidateStatus(
    id: string,
    status: CandidateStatus,
    note?: string
  ): Promise<Candidate> {
    const res = await fetch(`/api/candidates/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    if (!res.ok) throw new Error('Failed to update candidate status');
    return res.json();
  },

  async getInterviews(): Promise<ScheduledInterview[]> {
    const res = await fetch('/api/interviews');
    if (!res.ok) throw new Error('Failed to fetch interviews');
    return res.json();
  },

  async scheduleInterview(interviewData: Partial<ScheduledInterview>): Promise<ScheduledInterview> {
    const res = await fetch('/api/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interviewData),
    });
    if (!res.ok) throw new Error('Failed to schedule interview');
    return res.json();
  },

  async updateInterview(id: string, updates: Partial<ScheduledInterview>): Promise<void> {
    const res = await fetch(`/api/interviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update interview');
  },

  async deleteInterview(id: string): Promise<void> {
    const res = await fetch(`/api/interviews/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete interview');
  },

  async getOutreachDrafts(): Promise<CandidateOutreachDraft[]> {
    const res = await fetch('/api/outreach/drafts');
    if (!res.ok) throw new Error('Failed to fetch outreach drafts');
    return res.json();
  },

  async createOutreachDraft(draftData: Partial<CandidateOutreachDraft>): Promise<CandidateOutreachDraft> {
    const res = await fetch('/api/outreach/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftData),
    });
    if (!res.ok) throw new Error('Failed to create outreach draft');
    return res.json();
  },

  async getJobs(): Promise<JobDescription[]> {
    const res = await fetch('/api/jobs');
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async createJob(jobData: Partial<JobDescription>): Promise<JobDescription> {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
  },

  async deleteJob(id: string): Promise<void> {
    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete job');
  },

  async getPolicies(): Promise<HRPolicy[]> {
    const res = await fetch('/api/policies');
    if (!res.ok) throw new Error('Failed to fetch HR policies');
    return res.json();
  },

  async createPolicy(policyData: {
    title: string;
    category: string;
    content: string;
    summary?: string;
  }): Promise<HRPolicy> {
    const res = await fetch('/api/policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policyData),
    });
    if (!res.ok) throw new Error('Failed to create HR policy');
    return res.json();
  },

  async analyzeResume(candidateId: string, jobId: string): Promise<MatchAnalysis> {
    const res = await fetch('/api/analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId, jobId }),
    });
    if (!res.ok) throw new Error('Failed to analyze resume');
    return res.json();
  },

  async getAnalyses(): Promise<MatchAnalysis[]> {
    const res = await fetch('/api/analysis');
    if (!res.ok) throw new Error('Failed to fetch analyses');
    return res.json();
  },

  async generateInterviewGuide(jobId: string, candidateId?: string): Promise<InterviewGuide> {
    const res = await fetch('/api/interview-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, candidateId }),
    });
    if (!res.ok) throw new Error('Failed to generate interview guide');
    return res.json();
  },

  async compareCandidates(candidateIds: string[], jobId: string): Promise<ComparisonResult> {
    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateIds, jobId }),
    });
    if (!res.ok) throw new Error('Failed to compare candidates');
    return res.json();
  },

  async searchRAG(query: string, documentType?: string): Promise<any> {
    const res = await fetch('/api/rag/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, documentType }),
    });
    if (!res.ok) throw new Error('Failed to search knowledge base');
    return res.json();
  },

  async queryRAG(query: string): Promise<GroundedRAGAnswer> {
    const res = await fetch('/api/rag/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Failed to query RAG assistant');
    return res.json();
  },

  async chatWithAgent(message: string, history: AgentChatMessage[]): Promise<{
    text: string;
    toolCalls: Array<{ toolName: string; input: any; outputSummary: string }>;
    sources: Array<{ documentTitle: string; documentType: string; snippet: string }>;
    actionPayload?: any;
  }> {
    const res = await fetch('/api/agent/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) throw new Error('Failed to chat with agent');
    return res.json();
  },

  async resetDemoData(): Promise<void> {
    const res = await fetch('/api/reset-demo', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo data');
  },
};
