import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '../design-system/components/PageHeader';
import { Button } from '../design-system/components/Button';
import { Avatar } from '../design-system/components/Avatar';
import {
  Sparkles,
  Send,
  Paperclip,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tableData?: { headers: string[]; rows: string[][] };
  actionButtons?: { label: string; path?: string; action?: () => void }[];
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  period: 'Today' | 'Yesterday' | 'Last 7 Days';
}

export const Copilot: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');

  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 'sess-1', title: 'Q3 Supplier Risk Audit', timestamp: '10:30 AM', period: 'Today' },
    { id: 'sess-2', title: 'Hot-Rolled Steel Pricing Forecast', timestamp: '2:15 PM', period: 'Today' },
    { id: 'sess-3', title: 'Contract Renewal: Nucor Steel', timestamp: 'Yesterday', period: 'Yesterday' },
    { id: 'sess-4', title: 'GlobalChem Industrial Delay Review', timestamp: '3 days ago', period: 'Last 7 Days' },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('sess-1');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content:
        'Hello. I am your SmartProcure AI copilot, trained on your enterprise supplier contracts, historical purchase orders, and global commodity price feeds. How can I assist your procurement workflows today?',
      timestamp: '10:30 AM',
    },
  ]);

  const [inputValue, setInputValue] = useState(initialQuery || '');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, []);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let reply: ChatMessage;

      const lower = text.toLowerCase();
      if (lower.includes('risk') || lower.includes('suppliers at risk')) {
        reply = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content:
            'Based on current risk telemetry, **12 suppliers** require active attention this quarter. The most critical exposure is **Norilsk Nickel** (Risk: 86.5/100, Suspended) and **GlobalChem Industrial** (Risk: 74.2/100, High delivery variance).',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tableData: {
            headers: ['Supplier', 'Commodity', 'Risk Score', 'Primary Driver', 'Recommended Action'],
            rows: [
              ['Norilsk Nickel', 'Class 1 Nickel', '86.5', 'Geopolitical Trade Sanctions', 'Halt spot allocations'],
              ['GlobalChem Industrial', 'Specialty Chemicals', '74.2', 'Port & Logistics Delays', 'Re-route via Rotterdam'],
              ['TSMC', '3nm Wafers', '48.5', 'Geopolitical Concentration', 'Monitor Taiwan Strait feeds'],
            ],
          },
          actionButtons: [
            { label: 'View Risk Matrix', path: '/risk' },
            { label: 'Draft Supplier Letter', action: () => alert('Generating formal SLA inquiry draft...') },
          ],
        };
      } else if (lower.includes('steel') || lower.includes('forecast')) {
        reply = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content:
            'Prophet time-series projections indicate **Hot-Rolled Steel Coil** prices will climb from **$845/MT** to **$862/MT** over the next 90 days (+2.0%). Our recommendation is to execute 6-month framework contracts with **Tata Steel** and **Nucor** before mid-October to lock in volume margins.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tableData: {
            headers: ['Time Horizon', 'Spot Benchmark', 'Projected Target', 'Confidence Band'],
            rows: [
              ['30 Days', '$845.00', '$848.50', '$842 - $855'],
              ['60 Days', '$845.00', '$856.20', '$848 - $864'],
              ['90 Days', '$845.00', '$862.00', '$851 - $873'],
            ],
          },
          actionButtons: [
            { label: 'Open Forecasting Chart', path: '/forecasting' },
            { label: 'View Steel Suppliers', path: '/suppliers' },
          ],
        };
      } else if (lower.includes('negotiation') || lower.includes('email') || lower.includes('globalchem')) {
        reply = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content:
            "Here is a formal executive negotiation draft addressing GlobalChem's recent SLA breach:\n\n**Subject:** Notice of Delivery SLA Variance — Purchase Order Remediation\n\nDear Mr. Ndlovu,\n\nWe appreciate our ongoing partnership with GlobalChem Industrial. However, our internal logistics intelligence shows an on-time delivery rate of 77.8% over the past 90 days, with average lead times slipping to 42 days against our agreed 30-day baseline.\n\nUnder Section 4.2 of our Master Supply Agreement, we request an expedited remediation plan within 5 business days and a 3% rebate credit on pending PO-2024-00452 to offset port demurrage costs.\n\nSincerely,\nElena Rostova\nHead of Strategic Procurement",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButtons: [
            { label: 'Copy Email to Clipboard', action: () => alert('Copied negotiation email to clipboard.') },
            { label: 'View GlobalChem Profile', path: '/suppliers/SUP-015' },
          ],
        };
      } else {
        reply = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: `I analyzed your query: "${text}". Based on your 24-month spend history, our top recommendations are:\n\n1. **Consolidate Vendor Base:** Shift tail spend into tier-1 vendors (Tata Steel, Baosteel, BASF) for 4.2% volume rebate capture.\n2. **Inventory Rebalancing:** Zone A copper holding is at 22 MT (below safety point). Issue reorder PO within 48 hours.\n3. **Contract Audits:** 3 vendor MSAs are approaching renewal in Q4.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButtons: [
            { label: 'Explore Analytics', path: '/analytics' },
            { label: 'Review Inventory', path: '/inventory' },
          ],
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, reply]);
    }, 700);
  };

  const handleNewChat = () => {
    const newSess: ChatSession = {
      id: `sess-${Date.now()}`,
      title: 'New Procurement Query',
      timestamp: 'Just now',
      period: 'Today',
    };
    setSessions([newSess, ...sessions]);
    setActiveSessionId(newSess.id);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Started a fresh session. Ask any query regarding supplier performance, contract terms, or commodity forecasts.',
        timestamp: 'Just now',
      },
    ]);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(sessions.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-[16px] h-[calc(100vh-100px)] flex flex-col">
      <PageHeader
        title="AI Procurement Copilot"
        description="Generative reasoning engine powered by GPT-4 and trained on enterprise contract libraries, ERP orders, and market indices."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'AI Copilot' }]}
        className="pb-[12px] mb-[12px]"
      />

      <div className="flex-1 flex bg-white border border-border-default rounded-[14px] shadow-xs overflow-hidden">
        {/* LEFT SIDEBAR: CONVERSATION HISTORY (260px) */}
        <div className="w-[260px] border-r border-border-default bg-subtle/30 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="p-[12px] border-b border-border-default">
            <Button
              variant="secondary"
              size="sm"
              icon={<Plus size={14} />}
              className="w-full justify-start text-[13px]"
              onClick={handleNewChat}
            >
              New Conversation
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-[10px] space-y-[16px]">
            {(['Today', 'Yesterday', 'Last 7 Days'] as const).map((period) => {
              const periodSessions = sessions.filter((s) => s.period === period);
              if (periodSessions.length === 0) return null;
              return (
                <div key={period} className="space-y-[4px]">
                  <div className="px-[8px] py-[2px] text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                    {period}
                  </div>
                  {periodSessions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setActiveSessionId(s.id)}
                      className={`group flex items-center justify-between px-[10px] py-[7px] rounded-[6px] text-[13px] cursor-pointer transition-colors ${activeSessionId === s.id ? 'bg-white font-medium text-text-primary shadow-xs border border-border-default' : 'text-text-secondary hover:bg-subtle hover:text-text-primary'}`}
                    >
                      <span className="truncate pr-[6px]">{s.title}</span>
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-semantic-danger p-[2px]"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="p-[12px] border-t border-border-default text-[11px] text-text-tertiary text-center">
            GPT-4 Enterprise • In-Context Memory Enabled
          </div>
        </div>

        {/* CENTER & RIGHT: CHAT AREA */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-canvas">
          {/* MESSAGES LIST */}
          <div className="flex-1 overflow-y-auto p-[20px] sm:p-[28px] space-y-[20px]">
            {messages.length === 1 && (
              <div className="max-w-[620px] mx-auto py-[20px] text-center space-y-[16px]">
                <div className="w-[44px] h-[44px] rounded-full bg-accent-subtle border border-blue-200 text-accent-primary flex items-center justify-center mx-auto shadow-xs">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-[20px] font-semibold text-text-primary">
                  How can I help you today?
                </h3>
                <p className="text-[13px] text-text-secondary max-w-[460px] mx-auto">
                  Ask questions across your entire supplier base, simulate contract negotiations, or analyze upcoming price shifts.
                </p>

                {/* 2x2 SUGGESTION PROMPTS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] text-left pt-[8px]">
                  {[
                    { title: 'Which suppliers are at risk this quarter?', icon: <AlertTriangle size={15} /> },
                    { title: 'Forecast steel prices for next 90 days', icon: <TrendingUp size={15} /> },
                    { title: 'Show me the top 5 performing suppliers', icon: <CheckCircle2 size={15} /> },
                    { title: 'Draft a negotiation email to GlobalChem', icon: <FileText size={15} /> },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p.title)}
                      className="p-[14px] bg-white border border-border-default hover:border-accent-primary rounded-[10px] text-[13px] text-text-primary hover:shadow-xs transition-all flex items-start gap-[10px] group text-left"
                    >
                      <span className="text-accent-primary mt-[2px] shrink-0">{p.icon}</span>
                      <span className="font-medium group-hover:text-accent-primary">{p.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-[12px] ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-accent-primary text-white flex items-center justify-center shrink-0 shadow-xs font-semibold text-[13px]">
                    SP
                  </div>
                )}

                <div
                  className={`max-w-[760px] rounded-[12px] p-[16px] text-[14px] leading-[22px] space-y-[12px] ${m.role === 'user' ? 'bg-subtle text-text-primary border border-border-default' : 'bg-white border border-border-default shadow-xs text-text-primary'}`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {/* Embedded Rich Data Table if present */}
                  {m.tableData && (
                    <div className="border border-border-default rounded-[8px] overflow-hidden text-[12px] mt-[10px]">
                      <table className="w-full text-left">
                        <thead className="bg-subtle/80 border-b border-border-default font-semibold text-text-secondary">
                          <tr>
                            {m.tableData.headers.map((h, i) => (
                              <th key={i} className="p-[8px] px-[12px]">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-default">
                          {m.tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-subtle/40">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-[8px] px-[12px]">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Interactive Action Buttons */}
                  {m.actionButtons && (
                    <div className="flex flex-wrap gap-[8px] pt-[6px]">
                      {m.actionButtons.map((btn, i) => (
                        <Button
                          key={i}
                          variant="secondary"
                          size="sm"
                          className="text-[12px] h-[28px] px-[10px]"
                          onClick={() => {
                            if (btn.action) btn.action();
                            else if (btn.path) navigate(btn.path);
                          }}
                        >
                          {btn.label} <ArrowRight size={12} className="ml-[4px]" />
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-text-tertiary text-right">{m.timestamp}</div>
                </div>

                {m.role === 'user' && (
                  <Avatar name="Demo User" size="sm" />
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-[12px] items-center text-text-tertiary text-[13px]">
                <div className="w-[32px] h-[32px] rounded-[8px] bg-accent-primary text-white flex items-center justify-center shrink-0 font-semibold text-[13px]">
                  SP
                </div>
                <div className="bg-white border border-border-default rounded-[12px] px-[14px] py-[10px] shadow-xs flex items-center gap-[6px]">
                  <span className="w-[6px] h-[6px] bg-accent-primary rounded-full animate-bounce" />
                  <span className="w-[6px] h-[6px] bg-accent-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-[6px] h-[6px] bg-accent-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[12px] text-text-secondary ml-[4px]">Analyzing ERP datasets...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* BOTTOM INPUT AREA */}
          <div className="p-[16px] sm:p-[20px] bg-white border-t border-border-default">
            <div className="max-w-[800px] mx-auto space-y-[8px]">
              <div className="relative border border-border-default rounded-[10px] shadow-xs bg-white focus-within:border-accent-primary focus-within:ring-2 focus-within:ring-accent-primary/10 transition-all flex flex-col p-[10px]">
                <textarea
                  rows={2}
                  placeholder="Ask a question about contracts, price forecasts, or supplier performance..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="w-full resize-none text-[14px] text-text-primary placeholder:text-text-disabled outline-none"
                />

                <div className="flex items-center justify-between pt-[8px] border-t border-border-default/60">
                  <button
                    type="button"
                    onClick={() => alert('Contract PDF attachment analyzer selected. Please select a contract PDF to extract terms.')}
                    className="text-text-tertiary hover:text-text-primary flex items-center gap-[4px] text-[12px] px-[6px] py-[4px] rounded hover:bg-subtle transition-colors"
                  >
                    <Paperclip size={14} /> Attach Contract PDF
                  </button>

                  <div className="flex items-center gap-[8px]">
                    <span className="text-[11px] text-text-tertiary hidden sm:inline">
                      Press <kbd className="px-[4px] py-[1px] bg-subtle border border-border-default rounded font-mono">⌘+Enter</kbd> to send
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={!inputValue.trim() || isTyping}
                      onClick={() => handleSendMessage()}
                      icon={<Send size={13} />}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
