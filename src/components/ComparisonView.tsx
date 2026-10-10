import React, { useState } from 'react';
import {
  GitCompare,
  Briefcase,
  Users,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import { Candidate, JobDescription, ComparisonResult } from '../../server/types';
import { api } from '../services/api';

interface ComparisonViewProps {
  candidates: Candidate[];
  jobs: JobDescription[];
  initialJobId?: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  candidates,
  jobs,
  initialJobId,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(
    initialJobId || (jobs[0]?.id || '')
  );
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(
    candidates.slice(0, 3).map(c => c.id)
  );
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleCandidate = (id: string) => {
    if (selectedCandidateIds.includes(id)) {
      if (selectedCandidateIds.length > 1) {
        setSelectedCandidateIds(selectedCandidateIds.filter(cId => cId !== id));
      }
    } else {
      if (selectedCandidateIds.length < 4) {
        setSelectedCandidateIds([...selectedCandidateIds, id]);
      }
    }
  };

  const handleRunComparison = async () => {
    if (!selectedJobId || selectedCandidateIds.length === 0) return;

    setIsLoading(true);
    try {
      const res = await api.compareCandidates(selectedCandidateIds, selectedJobId);
      setComparison(res);
    } catch (err) {
      alert('Failed to generate candidate comparison.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!comparison) return;
    const text = `CANDIDATE COMPARISON MATRIX: ${comparison.jobTitle}
Hiring Committee Synthesis:
${comparison.summaryNote}

Candidates:
${comparison.candidates
  .map(
    c =>
      `• ${c.candidateName} (Estimated Match: ${c.estimatedMatchScore}%)\n  - Experience: ${c.experienceLevel}\n  - Matching Skills: ${c.matchingSkills.join(', ')}\n  - Gaps: ${c.missingSkills.join(', ')}`
  )
  .join('\n\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Multi-Candidate Comparison Matrix
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Side-by-side evaluation across skills, verified experience, and qualification alignment.
          </p>
        </div>

        {comparison && (
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Committee Summary</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Requisition & Candidates Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Target Requisition</span>
            </label>
            <select
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.department})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-7 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Select 2 to 4 Candidates</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {selectedCandidateIds.length} of {candidates.length} selected
              </span>
            </label>

            <div className="flex flex-wrap gap-2">
              {candidates.map(cand => {
                const isChecked = selectedCandidateIds.includes(cand.id);
                return (
                  <button
                    key={cand.id}
                    type="button"
                    onClick={() => toggleCandidate(cand.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      isChecked
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isChecked ? '✓ ' : '+ '}
                    {cand.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Compare candidate profiles against job requirements simultaneously.
          </div>
          <button
            onClick={handleRunComparison}
            disabled={isLoading || selectedCandidateIds.length < 2}
            className="py-2 px-4 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Evaluating Candidates...</span>
              </>
            ) : (
              <>
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Selected ({selectedCandidateIds.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {comparison ? (
        <div className="space-y-6">
          {/* Executive Committee Synthesis */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-blue-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hiring Committee Executive Synthesis</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {comparison.summaryNote}
            </p>
          </div>

          {/* Matrix Columns */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700">
                    <th className="p-4 font-semibold w-48 shrink-0">Evaluation Dimension</th>
                    {comparison.candidates.map(c => (
                      <th key={c.candidateId} className="p-4 font-bold text-slate-900 min-w-[240px]">
                        <div className="text-sm">{c.candidateName}</div>
                        <div className="text-xs font-normal text-slate-500 mt-0.5">
                          {c.experienceLevel}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Match Score */}
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                      Estimated Match
                    </td>
                    {comparison.candidates.map(c => (
                      <td key={c.candidateId} className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-slate-900">
                            {c.estimatedMatchScore}%
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">
                            alignment
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${c.estimatedMatchScore}%` }}
                          ></div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Matching Skills */}
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                      Verified Matching Skills
                    </td>
                    {comparison.candidates.map(c => (
                      <td key={c.candidateId} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {c.matchingSkills.map(skill => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] rounded font-medium border border-emerald-200/50"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Missing Skills */}
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                      Missing / Gaps
                    </td>
                    {comparison.candidates.map(c => (
                      <td key={c.candidateId} className="p-4">
                        {c.missingSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {c.missingSkills.map(gap => (
                              <span
                                key={gap}
                                className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[11px] rounded font-medium border border-amber-200/50"
                              >
                                ! {gap}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-emerald-600 text-xs">No key gaps</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Education */}
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                      Education Summary
                    </td>
                    {comparison.candidates.map(c => (
                      <td key={c.candidateId} className="p-4 text-slate-600 leading-relaxed">
                        {c.educationSummary}
                      </td>
                    ))}
                  </tr>

                  {/* Key Strengths */}
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                      Key Strengths
                    </td>
                    {comparison.candidates.map(c => (
                      <td key={c.candidateId} className="p-4 space-y-1">
                        {c.keyStrengths.map((str, sIdx) => (
                          <div key={sIdx} className="text-slate-700 leading-relaxed">
                            • {str}
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>

                  {/* Summary Notes */}
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-4 font-semibold text-slate-700 bg-slate-50/30">
                      AI Evaluator Notes
                    </td>
                    {comparison.candidates.map(c => (
                      <td key={c.candidateId} className="p-4 text-slate-600 leading-relaxed italic text-[11px]">
                        "{c.notes}"
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Ethical Footnote */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Final candidate selection rests with the interview panel. Automated comparisons assess job-relevant evidence without automated disqualification.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
          <GitCompare className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm">
            Select 2 or more candidates and click 'Compare Selected' to view the multi-candidate evaluation matrix.
          </p>
        </div>
      )}
    </div>
  );
};
