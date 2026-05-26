import { useState } from 'react';
import Icon from '@/components/ui/icon';

const scenarios = [
  {
    id: 1,
    name: 'Утренний брифинг',
    description: 'Сборка сводки новостей, задач и встреч на день',
    trigger: 'Каждый день в 08:30',
    steps: ['Получить задачи', 'Проверить календарь', 'Отправить в Telegram'],
    active: true,
    runs: 42,
    lastRun: '26 мая, 08:30',
  },
  {
    id: 2,
    name: 'Еженедельный отчёт',
    description: 'Автоматическая генерация и отправка отчёта руководству',
    trigger: 'Каждую пятницу в 17:00',
    steps: ['Собрать данные', 'Сформировать отчёт', 'Отправить по email'],
    active: true,
    runs: 8,
    lastRun: '23 мая, 17:00',
  },
  {
    id: 3,
    name: 'Обработка заявок',
    description: 'Автоответ на входящие заявки и создание задач в CRM',
    trigger: 'При получении письма',
    steps: ['Читать входящие', 'Создать задачу в CRM', 'Отправить автоответ'],
    active: false,
    runs: 127,
    lastRun: '24 мая, 14:22',
  },
  {
    id: 4,
    name: 'Напоминания о встречах',
    description: 'Уведомление за 15 и 5 минут до каждой встречи',
    trigger: 'По расписанию встреч',
    steps: ['Проверить календарь', 'Отправить напоминание'],
    active: true,
    runs: 89,
    lastRun: '26 мая, 10:45',
  },
];

export default function Scenarios() {
  const [items, setItems] = useState(scenarios);
  const [selected, setSelected] = useState<number | null>(null);

  const toggleActive = (id: number) => {
    setItems(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const selectedScenario = items.find(s => s.id === selected);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Сценарии автоматизации</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.filter(s => s.active).length} активных из {items.length}</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-sm rounded font-medium hover:bg-primary/90 transition-colors">
          <Icon name="Plus" size={14} fallback="Plus" />
          Новый сценарий
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* List */}
        <div className="xl:col-span-3 space-y-2">
          {items.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelected(s.id === selected ? null : s.id)}
              className={`bg-card border rounded-lg p-4 cursor-pointer transition-all
                ${selected === s.id ? 'border-primary/50 ai-glow' : 'border-border hover:border-border/80'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded shrink-0 flex items-center justify-center
                  ${s.active ? 'bg-primary/15' : 'bg-secondary'}`}>
                  <Icon name="GitBranch" size={16} className={s.active ? 'text-primary' : 'text-muted-foreground'} fallback="GitBranch" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground">{s.name}</h3>
                    {!s.active && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">Пауза</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Icon name="Clock" size={11} fallback="Clock" />
                      {s.trigger}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{s.runs} запусков</span>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); toggleActive(s.id); }}
                  className={`relative w-9 h-5 rounded-full transition-colors shrink-0
                    ${s.active ? 'bg-primary' : 'bg-secondary border border-border'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all
                    ${s.active ? 'left-[18px]' : 'left-0.5'}`}></span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="xl:col-span-2">
          {selectedScenario ? (
            <div className="bg-card border border-primary/30 rounded-lg p-5 space-y-4 animate-scale-in sticky top-5">
              <h3 className="text-sm font-semibold text-foreground">{selectedScenario.name}</h3>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Триггер</p>
                <p className="text-sm text-foreground">{selectedScenario.trigger}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Шаги</p>
                {selectedScenario.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded bg-secondary text-[10px] font-mono text-muted-foreground flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-sm text-foreground">{step}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Последний запуск</span>
                <span className="font-mono">{selectedScenario.lastRun}</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground text-sm rounded font-medium hover:bg-primary/90 transition-colors">
                <Icon name="Play" size={13} fallback="Play" />
                Запустить сейчас
              </button>
            </div>
          ) : (
            <div className="bg-card border border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center gap-3">
              <Icon name="MousePointer" size={24} className="text-muted-foreground" fallback="Cursor" />
              <p className="text-sm text-muted-foreground">Выберите сценарий для просмотра деталей</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
