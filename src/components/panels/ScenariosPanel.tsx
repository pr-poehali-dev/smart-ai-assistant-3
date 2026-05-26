import { useState } from 'react';
import Icon from '@/components/ui/icon';

const INIT = [
  { id: 1, name: 'Утренний брифинг', desc: 'Сводка задач, встреч и новостей на день', trigger: 'Каждый день в 08:30', steps: ['Получить задачи', 'Проверить календарь', 'Отправить в Telegram'], active: true, runs: 42, lastRun: '26 мая, 08:30' },
  { id: 2, name: 'Еженедельный отчёт', desc: 'Автоматическая генерация и отправка отчёта', trigger: 'Каждую пятницу в 17:00', steps: ['Собрать данные', 'Сформировать отчёт', 'Отправить по email'], active: true, runs: 8, lastRun: '23 мая, 17:00' },
  { id: 3, name: 'Обработка заявок', desc: 'Автоответ на заявки и создание задач в CRM', trigger: 'При получении письма', steps: ['Читать входящие', 'Создать задачу в CRM', 'Отправить автоответ'], active: false, runs: 127, lastRun: '24 мая, 14:22' },
  { id: 4, name: 'Напоминания о встречах', desc: 'Уведомление за 15 и 5 минут до встречи', trigger: 'По расписанию встреч', steps: ['Проверить календарь', 'Отправить напоминание'], active: true, runs: 89, lastRun: '26 мая, 10:45' },
];

export default function ScenariosPanel() {
  const [items, setItems] = useState(INIT);
  const [selected, setSelected] = useState<number | null>(null);

  const toggle = (id: number) => setItems(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  const sel = items.find(s => s.id === selected);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Сценарии</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.filter(s => s.active).length} активных из {items.length}</p>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground text-xs rounded-xl font-medium hover:bg-primary/90 transition-colors">
          <Icon name="Plus" size={13} fallback="Plus" />
          Новый сценарий
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 space-y-2">
          {items.map(s => (
            <div key={s.id} onClick={() => setSelected(s.id === selected ? null : s.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${selected === s.id ? 'border-primary/40 bg-primary/5' : 'border-[hsl(220,15%,15%)] bg-[hsl(220,18%,9%)] hover:border-[hsl(220,15%,20%)]'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.active ? 'bg-primary/15' : 'bg-[hsl(220,15%,14%)]'}`}>
                  <Icon name="GitBranch" size={16} className={s.active ? 'text-primary' : 'text-muted-foreground'} fallback="GitBranch" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground">{s.name}</h3>
                    {!s.active && <span className="text-[10px] px-1.5 py-0.5 bg-[hsl(220,15%,14%)] rounded text-muted-foreground">Пауза</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Icon name="Clock" size={10} fallback="Clock" />{s.trigger}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{s.runs} запусков</span>
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); toggle(s.id); }}
                  className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${s.active ? 'bg-primary' : 'bg-[hsl(220,15%,18%)] border border-[hsl(220,15%,22%)]'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${s.active ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="xl:col-span-2">
          {sel ? (
            <div className="p-5 rounded-xl border border-primary/30 bg-primary/4 space-y-4 sticky top-0">
              <h3 className="text-sm font-semibold text-foreground">{sel.name}</h3>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Триггер</p>
                <p className="text-sm text-foreground">{sel.trigger}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Шаги</p>
                {sel.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-lg bg-[hsl(220,15%,14%)] text-[10px] font-mono text-muted-foreground flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-sm text-foreground">{step}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-[hsl(220,15%,15%)]">
                <span>Последний запуск</span>
                <span className="font-mono">{sel.lastRun}</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground text-sm rounded-xl font-medium hover:bg-primary/90 transition-colors">
                <Icon name="Play" size={13} fallback="Play" />
                Запустить сейчас
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-dashed border-[hsl(220,15%,17%)] flex flex-col items-center justify-center gap-3 text-center">
              <Icon name="MousePointer" size={22} className="text-muted-foreground/40" fallback="Cursor" />
              <p className="text-xs text-muted-foreground/60">Выберите сценарий для просмотра деталей</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
