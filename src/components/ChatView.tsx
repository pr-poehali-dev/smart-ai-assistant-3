import { useState, useRef, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { sendChatMessage, ChatMessage } from '@/lib/api';
import { renderMarkdown } from '@/lib/markdown';
import TasksPanel from '@/components/panels/TasksPanel';
import ScenariosPanel from '@/components/panels/ScenariosPanel';
import HistoryPanel from '@/components/panels/HistoryPanel';
import SettingsPanel from '@/components/panels/SettingsPanel';

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

type View = 'chat' | 'tasks' | 'scenarios' | 'history' | 'settings';

const SUGGESTIONS = [
  { text: 'Составь план задач на сегодня', icon: 'Calendar' },
  { text: 'Напиши деловое письмо партнёру', icon: 'Mail' },
  { text: 'Как автоматизировать отчёты?', icon: 'GitBranch' },
  { text: 'Придумай сценарий рассылки клиентам', icon: 'Send' },
];

const NAV = [
  { id: 'chat' as View, label: 'Чат', icon: 'MessageSquare' },
  { id: 'tasks' as View, label: 'Задачи', icon: 'CheckSquare' },
  { id: 'scenarios' as View, label: 'Сценарии', icon: 'GitBranch' },
  { id: 'history' as View, label: 'История', icon: 'Clock' },
  { id: 'settings' as View, label: 'Настройки', icon: 'Settings' },
];

function MessageBubble({ msg, isLast }: { msg: ChatMessage; isLast: boolean }) {
  const isUser = msg.role === 'user';
  const html = isUser ? '' : renderMarkdown(msg.text);

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} ${isLast ? 'animate-fade-in' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-primary text-[10px] font-bold font-mono tracking-tight">AI</span>
        </div>
      )}
      <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed
        ${isUser
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,17%)] text-foreground rounded-tl-sm'
        }`}
      >
        {isUser
          ? <span className="whitespace-pre-wrap">{msg.text}</span>
          : <div className="prose-ai" dangerouslySetInnerHTML={{ __html: html }} />
        }
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center shrink-0">
        <span className="text-primary text-[10px] font-bold font-mono">AI</span>
      </div>
      <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm bg-[hsl(220,18%,11%)] border border-[hsl(220,15%,17%)] flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '130ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '260ms' }} />
      </div>
    </div>
  );
}

export default function ChatView() {
  const [view, setView] = useState<View>('chat');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find(c => c.id === activeId) ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages.length, loading]);

  const newConversation = useCallback(() => {
    const id = crypto.randomUUID();
    const conv: Conversation = { id, title: 'Новый диалог', messages: [], createdAt: new Date() };
    setConversations(prev => [conv, ...prev]);
    setActiveId(id);
    setError(null);
    setView('chat');
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  const send = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    let convId = activeId;
    let baseMessages: ChatMessage[] = [];

    if (!convId) {
      const id = crypto.randomUUID();
      const title = msg.length > 44 ? msg.slice(0, 44) + '…' : msg;
      const conv: Conversation = { id, title, messages: [], createdAt: new Date() };
      setConversations(prev => [conv, ...prev]);
      setActiveId(id);
      convId = id;
    } else {
      baseMessages = activeConv?.messages ?? [];
    }

    const userMsg: ChatMessage = { role: 'user', text: msg };
    setInput('');
    setError(null);
    setLoading(true);
    if (view !== 'chat') setView('chat');

    const fId = convId;
    setConversations(prev => prev.map(c => {
      if (c.id !== fId) return c;
      return {
        ...c,
        messages: [...c.messages, userMsg],
        title: c.messages.length === 0 ? (msg.length > 44 ? msg.slice(0, 44) + '…' : msg) : c.title,
      };
    }));

    try {
      const reply = await sendChatMessage([...baseMessages, userMsg]);
      setConversations(prev => prev.map(c =>
        c.id === fId ? { ...c, messages: [...c.messages, { role: 'ai', text: reply }] } : c
      ));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка соединения');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [input, loading, activeId, activeConv, view]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const deleteConv = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const isEmpty = !activeConv || activeConv.messages.length === 0;

  return (
    <div className="flex h-screen bg-[hsl(220,20%,5%)] overflow-hidden font-sans">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-0'} transition-[width] duration-300 ease-in-out overflow-hidden flex-shrink-0 border-r border-[hsl(220,15%,11%)] flex flex-col bg-[hsl(220,22%,4%)]`}>
        <div className="w-60 h-full flex flex-col p-3">

          {/* Logo */}
          <div className="flex items-center gap-3 px-2 pt-2 pb-4">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <span className="text-[11px] font-bold font-mono text-primary-foreground">AI</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground tracking-wide leading-none">АУРА</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">Персональный ассистент</p>
            </div>
          </div>

          {/* New chat */}
          <button
            onClick={newConversation}
            className="flex items-center gap-2 w-full px-3 py-2.5 mb-4 rounded-xl border border-dashed border-[hsl(220,14%,19%)] text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/5 transition-all"
          >
            <Icon name="Plus" size={13} fallback="Plus" />
            Новый диалог
          </button>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto space-y-0.5 mb-3 min-h-0">
            {conversations.length > 0 && (
              <p className="text-[9px] font-semibold tracking-widest text-muted-foreground/40 uppercase px-3 mb-2">Диалоги</p>
            )}
            {conversations.length === 0 ? (
              <p className="text-xs text-muted-foreground/40 text-center mt-8 px-4 leading-relaxed">Диалоги появятся здесь</p>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => { setActiveId(conv.id); setView('chat'); setError(null); }}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all
                    ${activeId === conv.id && view === 'chat' ? 'bg-white/7 text-foreground' : 'text-muted-foreground hover:bg-white/4 hover:text-foreground'}`}
                >
                  <Icon name="MessageSquare" size={12} fallback="MessageSquare" className="shrink-0 opacity-50" />
                  <span className="text-xs truncate flex-1">{conv.title}</span>
                  <button
                    onClick={(e) => deleteConv(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-rose-400 transition-all shrink-0"
                  >
                    <Icon name="X" size={11} fallback="X" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Sections nav */}
          <div className="border-t border-[hsl(220,15%,11%)] pt-3 space-y-0.5">
            <p className="text-[9px] font-semibold tracking-widest text-muted-foreground/40 uppercase px-3 mb-2">Разделы</p>
            {NAV.filter(n => n.id !== 'chat').map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs transition-all
                  ${view === item.id ? 'bg-white/7 text-foreground' : 'text-muted-foreground hover:bg-white/4 hover:text-foreground'}`}
              >
                <Icon name={item.icon} size={13} fallback="Circle" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-12 flex items-center px-4 border-b border-[hsl(220,15%,11%)] shrink-0 gap-2">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/6 text-muted-foreground hover:text-foreground transition-all shrink-0"
          >
            <Icon name={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={15} fallback="Menu" />
          </button>

          <div className="flex items-center gap-2 min-w-0 flex-1">
            {view !== 'chat' && (
              <button onClick={() => setView('chat')} className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="ChevronLeft" size={15} fallback="ChevronLeft" />
              </button>
            )}
            <span className="text-sm font-medium text-foreground truncate">
              {view === 'chat' ? (activeConv?.title ?? 'АУРА') : NAV.find(n => n.id === view)?.label}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {view === 'chat' && (
              <button onClick={newConversation} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-white/6 transition-all">
                <Icon name="Plus" size={12} fallback="Plus" />
                Новый
              </button>
            )}
            <button
              onClick={() => setView('settings')}
              className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/6 transition-all ${view === 'settings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon name="Settings" size={14} fallback="Settings" />
            </button>
          </div>
        </header>

        {/* ── Panel view ───────────────────────────────────── */}
        {view !== 'chat' ? (
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              {view === 'tasks' && <TasksPanel />}
              {view === 'scenarios' && <ScenariosPanel />}
              {view === 'history' && <HistoryPanel />}
              {view === 'settings' && <SettingsPanel />}
            </div>
          </div>
        ) : (
          <>
            {/* ── Chat messages ────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
              {isEmpty ? (
                <div className="h-full flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-primary/12 border border-primary/20 flex items-center justify-center mb-6">
                    <span className="text-primary font-bold text-xl font-mono">AI</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Привет, я АУРА</h2>
                  <p className="text-sm text-muted-foreground mb-10 text-center max-w-sm leading-relaxed">
                    Персональный ИИ-ассистент для задач, автоматизации и бизнеса. Спросите что угодно.
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 w-full max-w-md">
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => send(s.text)}
                        className="flex items-start gap-3 text-left px-4 py-3.5 rounded-xl bg-[hsl(220,18%,8%)] border border-[hsl(220,15%,14%)] hover:border-primary/30 hover:bg-primary/5 transition-all group"
                      >
                        <Icon name={s.icon} size={14} fallback="Circle" className="text-primary/60 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{s.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
                  {activeConv!.messages.map((msg, i) => (
                    <MessageBubble key={i} msg={msg} isLast={i === activeConv!.messages.length - 1} />
                  ))}
                  {loading && <TypingDots />}
                  {error && (
                    <div className="flex gap-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-xl bg-rose-500/12 border border-rose-500/20 flex items-center justify-center shrink-0">
                        <Icon name="AlertTriangle" size={13} className="text-rose-400" fallback="AlertTriangle" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-rose-500/8 border border-rose-500/15 text-sm text-rose-300 leading-relaxed">
                        {error}
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* ── Input ────────────────────────────────────── */}
            <div className="px-4 pb-5 pt-2 shrink-0">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-end gap-3 bg-[hsl(220,18%,8%)] border border-[hsl(220,15%,16%)] rounded-2xl px-4 py-3 focus-within:border-[hsl(213,55%,42%)] transition-colors duration-200">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => {
                      setInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите сообщение…"
                    rows={1}
                    disabled={loading}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/45 outline-none resize-none leading-relaxed min-h-[22px]"
                    style={{ maxHeight: '160px' }}
                  />
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || loading}
                    className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/85 disabled:opacity-20 disabled:cursor-not-allowed transition-all shrink-0"
                  >
                    <Icon name="ArrowUp" size={15} className="text-primary-foreground" fallback="Send" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/30 text-center mt-2 select-none">
                  Enter — отправить · Shift+Enter — перенос строки
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
