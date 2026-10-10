import React, { useState } from 'react';
import {
  Database,
  Search,
  BookOpen,
  Sparkles,
  ShieldCheck,
  FileText,
  Briefcase,
  Layers,
  Plus,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
} from 'lucide-react';
import { HRPolicy, GroundedRAGAnswer } from '../../server/types';
import { api } from '../services/api';

interface RAGKnowledgeViewProps {
  policies: HRPolicy[];
  onRefresh: () => void;
}

const formatCleanText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();
};

export const RAGKnowledgeView: React.FC<RAGKnowledgeViewProps> = ({
  policies,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'rag-search' | 'policy-library'>('rag-search');
  const [query, setQuery] = useState('What are the recruitment steps and notice period rules in HR policy?');
  const [ragResult, setRagResult] = useState<GroundedRAGAnswer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedChunkIdx, setExpandedChunkIdx] = useState<number | null>(null);

  // Policy modal
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Recruitment & Hiring');
  const [newContent, setNewContent] = useState('');
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [isSubmittingPolicy, setIsSubmittingPolicy] = useState(false);

  const sampleQuestions = [
    'What are the recruitment steps and notice period rules in HR policy?',
    'Which candidate has verified experience with PyTorch and RAG pipelines?',
    'What are the compensation bands and remote work equipment allowances?',
    'Does Priya Sharma have experience with AWS and container microservices?',
    'What are the STAR methodology guidelines for behavioral interviews?',
  ];

  const handleRunRAGQuery = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setRagResult(null);

    try {
      const res = await api.queryRAG(q);
      setRagResult(res);
      setQuery(q);
    } catch (err) {
      alert('Failed to retrieve knowledge base context.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setPolicyError('Title and content are required.');
      return;
    }

    setIsSubmittingPolicy(true);
    setPolicyError(null);

    try {
      await api.createPolicy({
        title: newTitle,
        category: newCategory,
        content: newContent,
      });

      onRefresh();
      setIsPolicyModalOpen(false);
      setNewTitle('');
      setNewContent('');
    } catch (err: any) {
      setPolicyError(err?.message || 'Failed to save policy');
    } finally {
      setIsSubmittingPolicy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            RAG Knowledge Base & Retrieval Explorer
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Semantic vector search across candidate resumes, job requisitions, and company HR policy documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtab navigation */}
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('rag-search')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeSubTab === 'rag-search'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grounded RAG Query
            </button>
            <button
              onClick={() => setActiveSubTab('policy-library')}
              className={`px-3 py-1.5 rounded-md transition ${
                activeSubTab === 'policy-library'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HR Policy Library ({policies.length})
            </button>
          </div>

          {activeSubTab === 'policy-library' && (
            <button
              onClick={() => setIsPolicyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Policy</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'rag-search' ? (
        <div className="space-y-6">
          {/* Query Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ask Recruitment Knowledge Base
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ask any question regarding candidate skills, job requirements, or HR policies..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRunRAGQuery()}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
              </div>

              <button
                onClick={() => handleRunRAGQuery()}
                disabled={isLoading || !query.trim()}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2 shrink-0"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Retrieving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Grounded Search</span>
                  </>
                )}
              </button>
            </div>

            {/* Suggested Prompt Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
              <span className="text-slate-400 text-[11px] font-medium mr-1">Sample queries:</span>
              {sampleQuestions.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunRAGQuery(sq)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] transition text-left"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>

          {/* RAG Answer & Retrieved Chunks */}
          {ragResult && (
            <div className="space-y-6">
              {/* Grounded LLM Response */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Grounded Response (Gemini 3.8 Flash)
                    </h3>
                  </div>

                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded font-mono ${
                      ragResult.isGrounded
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {ragResult.isGrounded ? 'Grounded in Source Docs' : 'Unverified in Docs'}
                  </span>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {formatCleanText(ragResult.answer)}
                </div>

                {ragResult.unverifiedNote && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{ragResult.unverifiedNote}</span>
                  </div>
                )}
              </div>

              {/* Retrieved Document Chunks with Similarity Scores */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Retrieved Knowledge Chunks ({ragResult.sources.length})</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Top ranking vectors retrieved from vector store via cosine similarity
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {ragResult.sources.map((src, idx) => {
                    const isExpanded = expandedChunkIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-900">{src.documentTitle}</span>
                            <div className="text-[11px] text-slate-500">
                              Type: {src.documentType.toUpperCase()} · Section: {src.sectionTitle || 'General'}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded">
                              Sim: {(src.similarityScore * 100).toFixed(1)}%
                            </span>
                            <button
                              onClick={() => setExpandedChunkIdx(isExpanded ? null : idx)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="text-slate-700 leading-relaxed font-mono text-[11px] bg-white p-3 rounded border border-slate-100">
                          {isExpanded ? src.snippet : src.snippet.slice(0, 180) + '...'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* HR Policy Library Subtab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map(policy => (
            <div
              key={policy.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{policy.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold shrink-0">
                    v{policy.version}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Category: {policy.category} · Updated {policy.lastUpdated}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {policy.summary}
                </p>

                <div className="text-xs text-slate-700 font-mono text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap p-3 bg-slate-50/50 rounded border border-slate-100">
                  {policy.content}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Vector Indexed in RAG Store</span>
                <button
                  onClick={() => {
                    setActiveSubTab('rag-search');
                    handleRunRAGQuery(`What are the key provisions of ${policy.title}?`);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Query with RAG →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Policy Modal */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add New HR Policy Document</h3>
              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {policyError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg">
                {policyError}
              </div>
            )}

            <form onSubmit={handleCreatePolicy} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Policy Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parental Leave & Flexible Working Hours"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Recruitment & Hiring">Recruitment & Hiring</option>
                  <option value="Equal Opportunity">Equal Opportunity</option>
                  <option value="Interview Conduct">Interview Conduct</option>
                  <option value="Compensation & Benefits">Compensation & Benefits</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Policy Text *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste complete policy text with sections..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPolicyModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPolicy}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isSubmittingPolicy ? 'Indexing...' : 'Save & Index in RAG'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
