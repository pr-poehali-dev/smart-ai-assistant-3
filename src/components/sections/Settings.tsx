import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function Settings() {
  const [name, setName] = useState('АУРА');
  const [language, setLanguage] = useState('ru');
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(false);
  const [autoScenarios, setAutoScenarios] = useState(true);
  const [tone, setTone] = useState('professional');

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Настройки</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Конфигурация вашего ИИ-ассистента</p>
      </div>

      {/* Identity */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Личность ассистента</span>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Имя ассистента</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Стиль общения</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'professional', label: 'Деловой' },
                { value: 'friendly', label: 'Дружелюбный' },
                { value: 'concise', label: 'Лаконичный' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTone(opt.value)}
                  className={`py-2 rounded text-sm font-medium transition-colors
                    ${tone === opt.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Язык</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Уведомления</span>
        </div>
        <div className="divide-y divide-border">
          {[
            { label: 'Push-уведомления', desc: 'Показывать уведомления в браузере', value: notifications, set: setNotifications },
            { label: 'Звуковые сигналы', desc: 'Звук при новых уведомлениях', value: sound, set: setSound },
            { label: 'Автозапуск сценариев', desc: 'Запускать по расписанию автоматически', value: autoScenarios, set: setAutoScenarios },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => item.set(!item.value)}
                className={`relative w-10 h-5 rounded-full transition-colors shrink-0
                  ${item.value ? 'bg-primary' : 'bg-secondary border border-border'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all
                  ${item.value ? 'left-5' : 'left-0.5'}`}></span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Данные</span>
        </div>
        <div className="p-5 flex flex-col sm:flex-row gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-sm text-foreground rounded hover:bg-secondary/80 transition-colors">
            <Icon name="Download" size={14} fallback="Download" />
            Экспортировать данные
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-destructive/15 text-sm text-destructive rounded hover:bg-destructive/25 transition-colors">
            <Icon name="Trash2" size={14} fallback="Trash" />
            Сбросить историю
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-5 py-2 bg-primary text-primary-foreground text-sm rounded font-medium hover:bg-primary/90 transition-colors">
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}
