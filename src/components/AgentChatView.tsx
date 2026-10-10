import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Wrench,
  Sparkles,
  FileText,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
  X,
  Maximize2,
  Minimize2,
  Zap,
} from 'lucide-react';
import { AgentChatMessage } from '../../server/types';
import { api } from '../services/api';
import { ActionCard } from './ActionCard';
import { ActiveTab } from './Navigation';

const formatCleanText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();
};

interface AgentChatViewProps {
  onNavigateTab?: (tab: ActiveTab, params?: { candidateId?: string; jobId?: string }) => void;
  onActionExecuted?: (payload: any) => void;
  isEmbedded?: boolean;
  onClose?: () => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  onNavigateTab,
  onActionExecuted,
  isEmbedded = false,
  onClose,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'm-init',
      sender: 'agent',
      text: `Hello! I am your TalentScout HR Recruitment Copilot. 

I work alongside your dashboard to directly execute hiring actions and query your knowledge base using Gemini and RAG:

• Shortlist or advance candidates through pipeline stages
• Schedule technical & executive interviews with meeting links
• Draft personalized candidate outreach and offer emails
• Create and publish new job requisitions
• Run deep resume match evaluations and multi-candidate matrices
• Answer HR policy questions regarding probation, stipends, and notice periods

What recruitment task would you like me to perform?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Shortlist Priya Sharma for the Senior Full-Stack role',
    'Schedule technical interview for Alex Chen on Friday at 2 PM',
    'Draft interview invitation email for Priya Sharma',
    'Create job for Senior DevOps Engineer with Docker, Kubernetes, AWS',
    'Compare Priya Sharma and Alex Chen for Full-Stack opening',
    'What are the recruitment steps and notice period rules in HR policy?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
      onClearInitialPrompt?.();
    }
  }, [initialPrompt]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AgentChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.chatWithAgent(textToSend, messages);

      const agentMsg: AgentChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: response.text,
        timestamp: new Date().toISOString(),
        toolCalls: response.toolCalls,
        sources: response.sources,
        actionPayload: response.actionPayload,
      };

      setMessages(prev => [...prev, agentMsg]);

      // If an action was executed, notify parent to refresh dashboard and other views!
      if (response.actionPayload) {
        onActionExecuted?.(response.actionPayload);
      }
    } catch (err: any) {
      const errorMsg: AgentChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: 'I encountered an error connecting to the recruitment knowledge base. Please check that the server is active.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'agent',
        text: 'Chat history cleared. How can I assist you with your recruitment workflow today?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div
      className={`flex flex-col ${
        isEmbedded
          ? 'h-full bg-white'
          : 'space-y-4 max-w-5xl mx-auto pb-6 h-[calc(100vh-140px)]'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b border-slate-200 shrink-0 ${
          isEmbedded ? 'px-4 py-3 bg-slate-50/80' : 'pb-4'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-slate-900">
                {isEmbedded ? 'AI Recruitment Copilot' : 'AI Recruitment Agent & Action Copilot'}
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 flex items-center gap-1 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Copilot</span>
              </span>
            </div>
            {!isEmbedded && (
              <p className="text-xs text-slate-500 mt-0.5">
                Executes candidate pipeline movements, interview scheduling, job creation, and grounded RAG citations.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-md hover:bg-slate-200/70 text-slate-500 hover:text-slate-700 transition"
            title="Clear Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {isEmbedded && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-200/70 text-slate-500 hover:text-slate-700 transition"
              title="Close Copilot"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        className={`flex-1 overflow-y-auto space-y-4 ${
          isEmbedded
            ? 'p-4 bg-slate-50/50'
            : 'bg-white rounded-xl border border-slate-200 p-5 shadow-xs'
        }`}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2.5 text-xs ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'agent' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`rounded-xl p-3.5 space-y-2.5 ${
                isEmbedded ? 'max-w-[90%]' : 'max-w-2xl'
              } ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
              }`}
            >
              {/* Tool Execution Badges */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="space-y-1 pb-2 border-b border-slate-100">
                  {msg.toolCalls.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-slate-50 border border-slate-200/90 text-[11px] text-slate-600 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5 font-mono font-medium text-blue-700">
                        <Wrench className="w-3 h-3 text-blue-600" />
                        <span>Action: {t.toolName}()</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">{t.outputSummary}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Content */}
              <div className="leading-relaxed whitespace-pre-wrap font-sans text-xs">
                {formatCleanText(msg.text)}
              </div>

              {/* Action Card Renderer if agent performed a concrete action */}
              {msg.actionPayload && (
                <div className="pt-2">
                  <ActionCard payload={msg.actionPayload} onNavigateTab={onNavigateTab} />
                </div>
              )}

              {/* Grounded Document Sources / Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 text-[11px] space-y-1">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block">
                    Grounded Document Citations:
                  </span>
                  <div className="space-y-1">
                    {msg.sources.slice(0, 3).map((s, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-2 rounded border border-slate-200/60 text-slate-600 text-[11px]"
                      >
                        <strong>{s.documentTitle}</strong> ({s.documentType})
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          "{s.snippet}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`text-[10px] pt-1 ${
                  msg.sender === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 text-xs justify-start">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 max-w-sm shadow-2xs">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-xs">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Executing agent action & RAG retrieval...</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Updating database state and retrieving grounded vector context.
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Action Prompts */}
      <div
        className={`flex items-center gap-1.5 overflow-x-auto py-1 shrink-0 ${
          isEmbedded ? 'px-3 bg-white border-t border-slate-200' : ''
        }`}
      >
        <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Quick actions:</span>
        </span>
        {samplePrompts.slice(0, isEmbedded ? 3 : 5).map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            disabled={isLoading}
            className="px-2 py-1 bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 rounded-md text-[10px] whitespace-nowrap transition cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div
        className={`shrink-0 ${
          isEmbedded
            ? 'p-3 bg-white border-t border-slate-200'
            : 'bg-white rounded-xl border border-slate-200 p-2 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={
              isEmbedded
                ? 'Issue an action (e.g. Shortlist Priya, Schedule interview, Create job)...'
                : 'Ask a question or issue a recruitment action (e.g. Shortlist candidate, schedule interview, create job)...'
            }
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 font-medium"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition shadow-xs cursor-pointer"
            title="Execute action"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
