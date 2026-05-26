import Icon from '@/components/ui/icon';
import { useState } from 'react';

const notifications = [
  { id: 1, type: 'task', title: 'Задача просрочена', text: '«Подготовить КП» истёк срок', time: '10 мин назад', read: false },
  { id: 2, type: 'scenario', title: 'Сценарий выполнен', text: '«Утренний брифинг» успешно запущен', time: '2 ч назад', read: false },
  { id: 3, type: 'reminder', title: 'Напоминание', text: 'Встреча «Стратегия Q2» через 15 минут', time: '3 ч назад', read: false },
  { id: 4, type: 'info', title: 'Новый лид', text: 'Получена заявка с сайта: Антон К.', time: '5 ч назад', read: true },
  { id: 5, type: 'scenario', title: 'Ошибка сценария', text: '«Обработка заявок» прервана: нет доступа к почте', time: 'вчера', read: true },
  { id: 6, type: 'task', title: 'Задача выполнена', text: 'Еженедельный отчёт отправлен', time: 'вчера', read: true },
];

const typeIcon: Record<string, { icon: string; color: string }> = {
  task: { icon: 'CheckSquare', color: 'text-blue-400' },
  scenario: { icon: 'GitBranch', color: 'text-violet-400' },
  reminder: { icon: 'Bell', color: 'text-amber-400' },
  info: { icon: 'Info', color: 'text-cyan-400' },
};

export default function Notifications() {
  const [items, setItems] = useState(notifications);

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const unread = items.filter(n => !n.read).length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Уведомления</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{unread} непрочитанных</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-primary hover:underline">
            Отметить все прочитанными
          </button>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg divide-y divide-border overflow-hidden">
        {items.map((n) => {
          const ic = typeIcon[n.type] || { icon: 'Bell', color: 'text-muted-foreground' };
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors hover:bg-secondary/50
                ${!n.read ? 'bg-primary/5' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon name={ic.icon} size={14} className={ic.color} fallback="Bell" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.text}</p>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono shrink-0">{n.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
