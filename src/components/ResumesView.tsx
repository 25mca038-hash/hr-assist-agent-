import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Trash2,
  Sparkles,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  FolderGit2,
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { Candidate, JobDescription } from '../../server/types';
import { api } from '../services/api';

interface ResumesViewProps {
  candidates: Candidate[];
  jobs: JobDescription[];
  onRefresh: () => void;
  onAnalyzeCandidate: (candidateId: string, jobId: string) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
}

export const ResumesView: React.FC<ResumesViewProps> = ({
  candidates,
  jobs,
  onRefresh,
  onAnalyzeCandidate,
  isUploadModalOpen,
  setIsUploadModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    candidates[0] || null
  );

  // Upload modal state
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [pastedText, setPastedText] = useState('');
  const [candidateNameInput, setCandidateNameInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Filter candidates
  const filteredCandidates = candidates.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q)) ||
      c.location.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q)
    );
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleUploadSubmit = async () => {
    setIsUploading(true);
    setUploadError(null);

    try {
      if (uploadMode === 'file') {
        if (!selectedFile) {
          throw new Error('Please select a file to upload (PDF, DOCX, or TXT).');
        }

        setUploadStep('Reading document binary...');
        const reader = new FileReader();

        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            // Strip data:application/pdf;base64, prefix
            const base64 = result.split(',')[1] || result;
            resolve(base64);
          };
          reader.onerror = err => reject(err);
          reader.readAsDataURL(selectedFile);
        });

        const base64Data = await base64Promise;

        setUploadStep('Extracting text & running Gemini LLM parser...');
        const newCand = await api.uploadResume({
          fileName: selectedFile.name,
          fileData: base64Data,
          fileType: selectedFile.type,
        });

        setUploadStep('Indexing into RAG vector database...');
        onRefresh();
        setSelectedCandidate(newCand);
        setIsUploadModalOpen(false);
        setSelectedFile(null);
      } else {
        if (!pastedText.trim()) {
          throw new Error('Please enter or paste the resume text.');
        }

        setUploadStep('Analyzing text with Gemini LLM...');
        const newCand = await api.uploadResume({
          fileName: candidateNameInput.trim()
            ? `${candidateNameInput.trim().replace(/\s+/g, '_')}_Resume.txt`
            : 'Pasted_Resume.txt',
          rawText: pastedText,
        });

        setUploadStep('Indexing into RAG vector database...');
        onRefresh();
        setSelectedCandidate(newCand);
        setIsUploadModalOpen(false);
        setPastedText('');
        setCandidateNameInput('');
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err?.message || 'Failed to parse resume document.');
    } finally {
      setIsUploading(false);
      setUploadStep('');
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    if (confirm('Are you sure you want to remove this candidate profile and its vector chunks?')) {
      try {
        await api.deleteCandidate(id);
        onRefresh();
        if (selectedCandidate?.id === id) {
          const remaining = candidates.filter(c => c.id !== id);
          setSelectedCandidate(remaining[0] || null);
        }
      } catch (e) {
        alert('Failed to delete candidate.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Candidate Resume Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Automated PDF/DOCX parsing, structured schema extraction, and RAG vector indexing.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Candidate Resume</span>
        </button>
      </div>

      {/* Main Layout: Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Candidate Directory List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Search Header */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates by name, skill, or role..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Candidates List */}
          <div className="divide-y divide-slate-100 max-h-[720px] overflow-y-auto">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map(c => {
                const isSelected = selectedCandidate?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className={`p-4 cursor-pointer transition flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-blue-50/80 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50/70 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900">{c.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{c.location}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {c.experience.length} roles
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {c.summary}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-500">
                      {c.skills.slice(0, 4).map((s, idx) => (
                        <span key={s}>
                          {s}
                          {idx < Math.min(c.skills.length, 4) - 1 && (
                            <span className="text-slate-300 ml-1.5">/</span>
                          )}
                        </span>
                      ))}
                      {c.skills.length > 4 && (
                        <span className="text-slate-400">+{c.skills.length - 4} more</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No candidates found matching '{searchQuery}'.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Candidate Profile */}
        <div className="lg:col-span-7">
          {selectedCandidate ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
              {/* Profile Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedCandidate.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                    <span>{selectedCandidate.email || 'Email on file'}</span>
                    <span>·</span>
                    <span>{selectedCandidate.phone || 'Phone on file'}</span>
                    <span>·</span>
                    <span>{selectedCandidate.location}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Source: {selectedCandidate.fileName} · Indexed on{' '}
                    {new Date(selectedCandidate.uploadedAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {jobs.length > 0 && (
                    <button
                      onClick={() => onAnalyzeCandidate(selectedCandidate.id, jobs[0].id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze with {jobs[0].title.slice(0, 15)}...</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteCandidate(selectedCandidate.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition"
                    title="Delete Candidate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Professional Summary
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
                  {selectedCandidate.summary}
                </p>
              </div>

              {/* Technical Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-blue-600" />
                  <span>Verified Technical Skills ({selectedCandidate.skills.length})</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs rounded font-medium border border-slate-200/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Work Experience Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Work Experience</span>
                </h4>
                <div className="space-y-3">
                  {selectedCandidate.experience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/40 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{exp.title}</div>
                          <div className="text-xs text-slate-500">{exp.company}</div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">{exp.duration}</span>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                        {exp.responsibilities.map((r, rIdx) => (
                          <li key={rIdx} className="leading-relaxed">
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Qualifications */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Education & Credentials</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCandidate.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1"
                    >
                      <div className="text-xs font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-xs text-slate-600">{edu.institution}</div>
                      <div className="text-[11px] text-slate-400">{edu.year}</div>
                      {edu.details && (
                        <div className="text-[11px] text-slate-500 italic">{edu.details}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects & Certifications */}
              {(selectedCandidate.projects.length > 0 ||
                selectedCandidate.certifications.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Projects */}
                  {selectedCandidate.projects.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Key Projects</span>
                      </h4>
                      <div className="space-y-2">
                        {selectedCandidate.projects.map((proj, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-3 rounded-lg border border-slate-100 bg-slate-50/30 space-y-1 text-xs"
                          >
                            <div className="font-semibold text-slate-900">{proj.name}</div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                              {proj.description}
                            </p>
                            <div className="text-[10px] text-slate-400 pt-1">
                              Stack: {proj.technologies.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications & Achievements */}
                  <div className="space-y-3">
                    {selectedCandidate.certifications.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-purple-600" />
                          <span>Certifications</span>
                        </h4>
                        <ul className="text-xs text-slate-700 space-y-1">
                          {selectedCandidate.certifications.map((cert, cIdx) => (
                            <li key={cIdx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                              <span>{cert}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedCandidate.achievements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Honors & Achievements
                        </h4>
                        <ul className="text-xs text-slate-700 space-y-1">
                          {selectedCandidate.achievements.map((ach, aIdx) => (
                            <li key={aIdx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm">Select a candidate to view their complete parsed profile.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Candidate Resume Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Upload Candidate Resume</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode switch */}
            <div className="flex rounded-lg bg-slate-100 p-1 gap-1 text-xs font-medium">
              <button
                onClick={() => setUploadMode('file')}
                className={`flex-1 py-1.5 rounded-md transition ${
                  uploadMode === 'file'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Document File (PDF / DOCX)
              </button>
              <button
                onClick={() => setUploadMode('text')}
                className={`flex-1 py-1.5 rounded-md transition ${
                  uploadMode === 'text'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Paste Resume Text
              </button>
            </div>

            {uploadError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadMode === 'file' ? (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-700">
                  Select Resume Document (.pdf, .docx, .txt)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer bg-slate-50/50">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-file-input"
                  />
                  <label htmlFor="resume-file-input" className="cursor-pointer space-y-2 block">
                    <Upload className="w-8 h-8 text-blue-500 mx-auto" />
                    <div className="text-xs font-medium text-slate-700">
                      {selectedFile ? selectedFile.name : 'Click to browse or drop file here'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Supports Adobe PDF, Microsoft Word (.docx), and plain text
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Candidate Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={candidateNameInput}
                    onChange={e => setCandidateNameInput(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Resume Text Content
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Paste the full text of the resume here..."
                    value={pastedText}
                    onChange={e => setPastedText(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>
            )}

            {isUploading && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-3 text-xs text-blue-700">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>{uploadStep || 'Processing document with Gemini...'}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                disabled={isUploading}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={isUploading || (uploadMode === 'file' && !selectedFile)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
              >
                {isUploading ? 'Parsing & Indexing...' : 'Parse with Gemini'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
