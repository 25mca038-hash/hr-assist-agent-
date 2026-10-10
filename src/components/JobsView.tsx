import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Users,
  HelpCircle,
  X,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { JobDescription } from '../../server/types';
import { api } from '../services/api';

interface JobsViewProps {
  jobs: JobDescription[];
  onRefresh: () => void;
  onNavigateToComparison: (jobId: string) => void;
  onNavigateToInterviewGuide: (jobId: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  onRefresh,
  onNavigateToComparison,
  onNavigateToInterviewGuide,
  isCreateModalOpen,
  setIsCreateModalOpen,
}) => {
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(jobs[0] || null);

  // New Job Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Remote / US');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Contract'>('Full-time');
  const [experienceRequired, setExperienceRequired] = useState('3+ years');
  const [salaryRange, setSalaryRange] = useState('$130,000 - $160,000');
  const [summary, setSummary] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [requiredSkillsText, setRequiredSkillsText] = useState('');
  const [preferredSkillsText, setPreferredSkillsText] = useState('');
  const [qualificationsText, setQualificationsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !department.trim()) {
      setFormError('Please provide a job title and department.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const newJob = await api.createJob({
        title,
        department,
        location,
        employmentType,
        experienceRequired,
        salaryRange,
        summary: summary || `${title} opening in ${department}.`,
        responsibilities: responsibilitiesText
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
        requiredSkills: requiredSkillsText
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        preferredSkills: preferredSkillsText
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        qualifications: qualificationsText
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
      });

      onRefresh();
      setSelectedJob(newJob);
      setIsCreateModalOpen(false);

      // Reset form
      setTitle('');
      setSummary('');
      setResponsibilitiesText('');
      setRequiredSkillsText('');
      setPreferredSkillsText('');
      setQualificationsText('');
    } catch (err: any) {
      setFormError(err?.message || 'Failed to create job posting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm('Are you sure you want to delete this job requisition?')) {
      try {
        await api.deleteJob(id);
        onRefresh();
        if (selectedJob?.id === id) {
          const remaining = jobs.filter(j => j.id !== id);
          setSelectedJob(remaining[0] || null);
        }
      } catch (err) {
        alert('Failed to delete job');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Job Requisitions Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Define requirements, competencies, and benchmarks for candidate evaluation and RAG retrieval.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post New Requisition</span>
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Requisitions List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Active Openings ({jobs.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[700px] overflow-y-auto">
            {jobs.map(job => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 cursor-pointer transition flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-blue-50/80 border-l-4 border-blue-600'
                      : 'hover:bg-slate-50/70 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{job.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {job.department} · {job.employmentType}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-semibold">
                      {job.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{job.summary}</p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span>Exp: {job.experienceRequired}</span>
                    <span>·</span>
                    <span>{job.requiredSkills.length} required skills</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Requisition Card */}
        <div className="lg:col-span-7">
          {selectedJob ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{selectedJob.title}</h3>
                    <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono rounded">
                      {selectedJob.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {selectedJob.department}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {selectedJob.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {selectedJob.experienceRequired}
                    </span>
                    {selectedJob.salaryRange && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                          {selectedJob.salaryRange}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToComparison(selectedJob.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Compare Candidates</span>
                  </button>

                  <button
                    onClick={() => onNavigateToInterviewGuide(selectedJob.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Interview Kit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteJob(selectedJob.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Role Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role Overview
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  {selectedJob.summary}
                </p>
              </div>

              {/* Key Responsibilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Core Responsibilities
                </h4>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside bg-slate-50/40 p-3.5 rounded-lg border border-slate-100">
                  {selectedJob.responsibilities.map((r, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required & Preferred Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Mandatory Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.requiredSkills.map(skill => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-blue-50 text-blue-800 text-xs rounded font-medium border border-blue-200/50"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Preferred Competencies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.preferredSkills.map(skill => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium border border-slate-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Education & Baseline Qualifications
                </h4>
                <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                  {selectedJob.qualifications.map((q, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              Select a job requisition to inspect requirements and launch matching.
            </div>
          )}
        </div>
      </div>

      {/* Create Job Requisition Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Create New Job Requisition</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Cloud Architect"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Platform Infrastructure"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / US"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Experience Req.</label>
                  <input
                    type="text"
                    placeholder="e.g. 4+ years"
                    value={experienceRequired}
                    onChange={e => setExperienceRequired(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    placeholder="e.g. $140,000 - $170,000"
                    value={salaryRange}
                    onChange={e => setSalaryRange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Role Summary</label>
                <textarea
                  rows={2}
                  placeholder="High-level overview of the role and its organizational mission..."
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Key Responsibilities (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Lead architecture design reviews&#10;Implement containerized microservices&#10;Mentor engineering staff"
                  value={responsibilitiesText}
                  onChange={e => setResponsibilitiesText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Required Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="AWS, Kubernetes, Terraform, Go, Docker"
                    value={requiredSkillsText}
                    onChange={e => setRequiredSkillsText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Preferred Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Prometheus, Grafana, Istio"
                    value={preferredSkillsText}
                    onChange={e => setPreferredSkillsText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Qualifications (One per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="B.S. or M.S. in Computer Science or related degree&#10;4+ years in cloud infrastructure engineering"
                  value={qualificationsText}
                  onChange={e => setQualificationsText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isSubmitting ? 'Creating Requisition...' : 'Save Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
