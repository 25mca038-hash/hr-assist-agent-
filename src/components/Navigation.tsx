import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Sparkles,
  GitCompare,
  HelpCircle,
  Database,
  Bot,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'resumes'
  | 'jobs'
  | 'analysis'
  | 'comparison'
  | 'interview'
  | 'rag'
  | 'chat';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  candidateCount: number;
  jobCount: number;
  onResetDemo: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  candidateCount,
  jobCount,
  onResetDemo,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'resumes' as ActiveTab,
      label: 'Candidate Resumes',
      icon: FileText,
      badge: candidateCount,
    },
    {
      id: 'jobs' as ActiveTab,
      label: 'Job Requisitions',
      icon: Briefcase,
      badge: jobCount,
    },
    {
      id: 'analysis' as ActiveTab,
      label: 'AI Resume Matching',
      icon: Sparkles,
      badge: null,
    },
    {
      id: 'comparison' as ActiveTab,
      label: 'Candidate Matrix',
      icon: GitCompare,
      badge: null,
    },
    {
      id: 'interview' as ActiveTab,
      label: 'Interview Generator',
      icon: HelpCircle,
      badge: null,
    },
    {
      id: 'rag' as ActiveTab,
      label: 'RAG Knowledge Base',
      icon: Database,
      badge: null,
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Recruitment Agent',
      icon: Bot,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
            TS
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-white leading-tight">
              TalentScout AI
            </h1>
            <p className="text-xs text-slate-400">HR Recruitment Agent</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>LLM & RAG Engine Active</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Core Workflows
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Guardrails and Demo Reset */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="rounded-lg bg-slate-800/80 p-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-blue-400 font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ethical AI Guardrails</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Blind evaluation enforced. Demographic attributes excluded from scoring. Human-in-the-loop decisions.
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
          title="Restore original seed candidates and requisitions"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
