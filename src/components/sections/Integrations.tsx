import Icon from '@/components/ui/icon';
import { useState } from 'react';

const integrations = [
  { id: 1, name: 'Telegram', description: 'Отправка уведомлений и команд через бот', icon: 'MessageCircle', color: 'text-sky-400', connected: true },
  { id: 2, name: 'Google Календарь', description: 'Синхронизация встреч и событий', icon: 'Calendar', color: 'text-emerald-400', connected: true },
  { id: 3, name: 'Gmail', description: 'Чтение и отправка писем', icon: 'Mail', color: 'text-rose-400', connected: false },
  { id: 4, name: 'Notion', description: 'Создание заметок и страниц', icon: 'FileText', color: 'text-white', connected: false },
  { id: 5, name: 'Bitrix24 / AmoCRM', description: 'Управление сделками и контактами', icon: 'Users', color: 'text-violet-400', connected: false },
  { id: 6, name: 'WhatsApp', description: 'Отправка сообщений клиентам', icon: 'MessageSquare', color: 'text-green-400', connected: false },
];

export default function Integrations() {
  const [items, setItems] = useState(integrations);

  const toggle = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
  };

  const connected = items.filter(i => i.connected).length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Интеграции</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{connected} из {items.length} подключены</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-card border rounded-lg p-5 flex flex-col gap-4 transition-all
              ${item.connected ? 'border-primary/30' : 'border-border'}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Icon name={item.icon} size={20} className={item.color} fallback="Link" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className={`flex items-center gap-1.5 text-xs ${item.connected ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${item.connected ? 'bg-emerald-400' : 'bg-muted-foreground'}`}></span>
                {item.connected ? 'Подключено' : 'Не подключено'}
              </span>
              <button
                onClick={() => toggle(item.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors
                  ${item.connected
                    ? 'bg-secondary text-muted-foreground hover:text-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
              >
                {item.connected ? 'Отключить' : 'Подключить'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
