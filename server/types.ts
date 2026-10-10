export type DocumentType = 'resume' | 'job_description' | 'hr_policy';

export type CandidateStatus =
  | 'Applied'
  | 'Screening'
  | 'Shortlisted'
  | 'Technical Interview'
  | 'Executive Review'
  | 'Offer Sent'
  | 'Hired'
  | 'Rejected';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  status?: CandidateStatus;
  notes?: string[];
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    details?: string;
  }>;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    responsibilities: string[];
  }>;
  certifications: string[];
  projects: Array<{
    name: string;
    technologies: string[];
    description: string;
  }>;
  achievements: string[];
  rawText: string;
  fileName: string;
  uploadedAt: string;
}

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experienceRequired: string;
  salaryRange?: string;
  summary: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  qualifications: string[];
  createdAt: string;
  status: 'Active' | 'Draft' | 'Closed';
}

export interface HRPolicy {
  id: string;
  title: string;
  category: 'Recruitment & Hiring' | 'Equal Opportunity' | 'Interview Conduct' | 'Compensation & Benefits';
  version: string;
  lastUpdated: string;
  content: string;
  summary: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentType: DocumentType;
  documentTitle: string;
  sectionTitle?: string;
  pageOrPartNumber?: number;
  text: string;
  tokenCount: number;
  embedding?: number[];
}

export interface MatchAnalysis {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  estimatedMatchScore: number;
  scoreBreakdown: {
    skillsMatch: number;
    experienceMatch: number;
    qualificationsMatch: number;
    projectsMatch: number;
  };
  scoreExplanation: string;
  matchingSkills: Array<{
    skill: string;
    evidence: string;
  }>;
  missingSkills: string[];
  relevantExperience: Array<{
    finding: string;
    evidence: string;
  }>;
  matchingQualifications: string[];
  missingRequirements: string[];
  suggestedQuestions: string[];
  overallSummary: string;
  analyzedAt: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'Behavioral' | 'Situational' | 'Problem Solving' | 'Project Verification';
  question: string;
  purpose: string;
  evaluationCriteria: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
}

export interface InterviewGuide {
  jobId: string;
  jobTitle: string;
  candidateId?: string;
  candidateName?: string;
  questions: InterviewQuestion[];
  interviewerTips: string[];
  generatedAt: string;
}

export interface ComparisonResult {
  jobId: string;
  jobTitle: string;
  candidates: Array<{
    candidateId: string;
    candidateName: string;
    estimatedMatchScore: number;
    matchingSkills: string[];
    missingSkills: string[];
    experienceLevel: string;
    educationSummary: string;
    keyStrengths: string[];
    keyGaps: string[];
    notes: string;
  }>;
  summaryNote: string;
  comparedAt: string;
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  similarityScore: number;
}

export interface GroundedRAGAnswer {
  question: string;
  answer: string;
  isGrounded: boolean;
  unverifiedNote?: string;
  sources: Array<{
    documentId: string;
    documentTitle: string;
    documentType: DocumentType;
    sectionTitle?: string;
    snippet: string;
    similarityScore: number;
  }>;
}

export interface ScheduledInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId?: string;
  jobTitle?: string;
  interviewType: 'Phone Screen' | 'Technical Round' | 'Behavioral Round' | 'Executive Review';
  scheduledTime: string;
  interviewer: string;
  meetingLink: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface CandidateOutreachDraft {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  subject: string;
  body: string;
  type: 'Interview Invitation' | 'Offer Letter' | 'Follow-up' | 'Status Update';
  createdAt: string;
}

export interface AgentActionPayload {
  type:
    | 'job_created'
    | 'candidate_added'
    | 'candidate_status_updated'
    | 'interview_scheduled'
    | 'outreach_drafted'
    | 'analysis_completed'
    | 'interview_guide_generated'
    | 'comparison_completed'
    | 'navigate';
  data: any;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  toolCalls?: Array<{
    toolName: string;
    input: any;
    outputSummary: string;
  }>;
  sources?: Array<{
    documentTitle: string;
    documentType: string;
    snippet: string;
  }>;
  actionPayload?: AgentActionPayload;
}

export interface ActivityLog {
  id: string;
  type:
    | 'upload_resume'
    | 'create_job'
    | 'analyze_resume'
    | 'generate_questions'
    | 'compare_candidates'
    | 'policy_query'
    | 'update_status'
    | 'schedule_interview'
    | 'outreach_draft';
  title: string;
  description: string;
  timestamp: string;
}
