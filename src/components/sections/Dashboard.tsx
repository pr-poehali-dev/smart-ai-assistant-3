import { useState } from 'react';
import Icon from '@/components/ui/icon';

const quickCommands = [
  { label: 'Создать задачу', icon: 'Plus', color: 'text-blue-400' },
  { label: 'Отправить отчёт', icon: 'Send', color: 'text-emerald-400' },
  { label: 'Запустить сценарий', icon: 'Play', color: 'text-violet-400' },
  { label: 'Проверить почту', icon: 'Mail', color: 'text-amber-400' },
  { label: 'Составить план', icon: 'Calendar', color: 'text-cyan-400' },
  { label: 'Поиск информации', icon: 'Search', color: 'text-rose-400' },
];

const stats = [
  { label: 'Задач сегодня', value: '12', delta: '+3', up: true },
  { label: 'Выполнено', value: '7', delta: '58%', up: true },
  { label: 'Сценариев активно', value: '4', delta: '–', up: null },
  { label: 'Время сэкономлено', value: '2.4ч', delta: '+0.8ч', up: true },
];

const recentActions = [
  { time: '09:41', text: 'Отправлен еженедельный отчёт в Telegram', status: 'done' },
  { time: '09:15', text: 'Создана задача «Подготовить КП»', status: 'done' },
  { time: '08:50', text: 'Напоминание: встреча в 11:00', status: 'info' },
  { time: '08:30', text: 'Сценарий «Утренний брифинг» выполнен', status: 'done' },
];

export default function Dashboard() {
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Доброе утро! Чем могу помочь сегодня?' },
  ]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Понял вас. Задача принята в работу — отслеживайте статус в разделе «Задачи».',
      }]);
    }, 1500);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Панель управления</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Понедельник, 26 мая 2026</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-card text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot block"></span>
          АУРА активна
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-2">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-semibold text-foreground font-mono">{s.value}</p>
            {s.up !== null && (
              <span className={`text-xs font-medium ${s.up ? 'text-emerald-400' : 'text-rose-400'}`}>{s.delta}</span>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* AI Chat */}
        <div className="bg-card border border-border rounded-lg flex flex-col" style={{ minHeight: 320 }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <Icon name="Bot" size={13} className="text-primary" fallback="Cpu" />
            </div>
            <span className="text-sm font-medium text-foreground">Диалог с АУРОЙ</span>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 220 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm
                  ${m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground'
                  }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-secondary px-3 py-2 rounded-lg text-sm text-muted-foreground flex items-center gap-1">
                  <span className="inline-flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Введите команду или вопрос..."
              className="flex-1 bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
            >
              <Icon name="Send" size={14} className="text-primary-foreground" fallback="ArrowRight" />
            </button>
          </div>
        </div>

        {/* Quick Commands */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Icon name="Zap" size={14} className="text-amber-400" fallback="Bolt" />
            <span className="text-sm font-medium text-foreground">Быстрые команды</span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            {quickCommands.map((cmd, i) => (
              <button
                key={i}
                className="flex items-center gap-2.5 px-3 py-3 rounded bg-secondary hover:bg-[hsl(var(--surface-hover))] border border-border hover:border-primary/30 transition-all text-left group"
              >
                <Icon name={cmd.icon} size={15} className={`${cmd.color} shrink-0`} fallback="Circle" />
                <span className="text-xs text-foreground group-hover:text-primary transition-colors">{cmd.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Actions */}
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Icon name="Activity" size={14} className="text-primary" fallback="Pulse" />
          <span className="text-sm font-medium text-foreground">Последние действия</span>
        </div>
        <div className="divide-y divide-border">
          {recentActions.map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors">
              <span className="font-mono text-[11px] text-muted-foreground w-10 shrink-0">{a.time}</span>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.status === 'done' ? 'bg-emerald-400' : 'bg-blue-400'}`}></span>
              <span className="text-sm text-foreground">{a.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
