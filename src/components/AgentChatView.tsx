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
} from 'lucide-react';
import { AgentChatMessage } from '../../server/types';
import { api } from '../services/api';

const formatCleanText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();
};

export const AgentChatView: React.FC = () => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'm-init',
      sender: 'agent',
      text: `Hello! I am your TalentScout HR Recruitment Assistance Agent. 

I utilize Gemini 3.8 Flash combined with Retrieval-Augmented Generation (RAG) over your candidate resumes, job descriptions, and corporate HR policy documents.

Here are tasks I can assist you with:
- Search candidate resumes for specific technologies or qualifications
- Verify candidate claims against job requisitions
- Retrieve HR policies regarding interview conduct, notice periods, or compensation
- Generate structured technical and behavioral interview questions
- Synthesize multi-candidate comparisons for your hiring committee

What would you like to explore?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Which candidates have experience with Python and machine learning?',
    'What are the recruitment steps and notice period rules in HR policy?',
    'Does Priya Sharma have verified experience with AWS and containerization?',
    'Generate behavioral STAR interview questions for the Full-Stack role',
    'Compare Priya Sharma and Alex Chen for the Senior Full-Stack opening',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
      };

      setMessages(prev => [...prev, agentMsg]);
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
    <div className="space-y-4 max-w-5xl mx-auto pb-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              AI Recruitment Chatbot & Agent
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
              Tool-Calling RAG
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Conversational assistant equipped with resume search, policy retrieval, and candidate analysis tools.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Conversation</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-5 overflow-y-auto space-y-5 shadow-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'agent' && (
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-xl p-4 space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
              }`}
            >
              {/* Tool Execution Badges */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="space-y-1.5 pb-2 border-b border-slate-200/80">
                  {msg.toolCalls.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-white border border-slate-200/90 text-[11px] text-slate-600 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5 font-mono font-medium text-blue-700">
                        <Wrench className="w-3 h-3" />
                        <span>Tool: {t.toolName}()</span>
                      </div>
                      <span className="text-slate-500">{t.outputSummary}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Content */}
              <div className="leading-relaxed whitespace-pre-wrap font-sans">
                {formatCleanText(msg.text)}
              </div>

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
                        className="bg-white/80 p-2 rounded border border-slate-200/60 text-slate-600 text-[11px]"
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
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 max-w-sm">
              <div className="flex items-center gap-2 text-blue-700 font-medium">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Executing agent tools & RAG retrieval...</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Querying vector store embeddings and checking HR policy / resume schemas.
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Prompt Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 shrink-0">
        <span className="text-[11px] text-slate-400 font-medium shrink-0">Try asking:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            disabled={isLoading}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] whitespace-nowrap transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs shrink-0 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask a question about candidates, requisitions, HR policies, or interview questions..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-xs bg-transparent focus:outline-none text-slate-800 font-medium"
        />

        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition shadow-xs"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
