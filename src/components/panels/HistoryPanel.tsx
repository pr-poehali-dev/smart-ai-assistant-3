import Icon from '@/components/ui/icon';

const DATA = [
  {
    date: '26 мая 2026',
    items: [
      { time: '09:41', action: 'Отчёт отправлен', detail: 'Еженедельный отчёт → email@company.ru', status: 'success', type: 'scenario' },
      { time: '09:15', action: 'Задача создана', detail: 'Подготовить КП для ООО «Альфа»', status: 'success', type: 'task' },
      { time: '08:50', action: 'Напоминание отправлено', detail: 'Встреча в 11:00 — через 10 мин', status: 'info', type: 'reminder' },
      { time: '08:30', action: 'Сценарий выполнен', detail: '«Утренний брифинг» — 3 шага', status: 'success', type: 'scenario' },
    ],
  },
  {
    date: '25 мая 2026',
    items: [
      { time: '17:02', action: 'Отчёт сгенерирован', detail: 'Еженедельный отчёт за 19–25 мая', status: 'success', type: 'scenario' },
      { time: '14:30', action: 'Заявка обработана', detail: 'Новый лид → задача в CRM', status: 'success', type: 'task' },
      { time: '11:05', action: 'Ошибка интеграции', detail: 'Gmail: токен истёк, требуется переавторизация', status: 'error', type: 'error' },
      { time: '08:30', action: 'Сценарий выполнен', detail: '«Утренний брифинг» — 3 шага', status: 'success', type: 'scenario' },
    ],
  },
];

const SC = { success: 'bg-emerald-400/12 text-emerald-400', info: 'bg-blue-400/12 text-blue-400', error: 'bg-rose-400/12 text-rose-400' };
const TI: Record<string, string> = { scenario: 'GitBranch', task: 'CheckSquare', reminder: 'Bell', error: 'AlertTriangle' };

export default function HistoryPanel() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">История</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Журнал выполненных операций</p>
      </div>

      {DATA.map((day, di) => (
        <div key={di} className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">{day.date}</span>
            <div className="flex-1 h-px bg-[hsl(220,15%,13%)]" />
          </div>
          <div className="rounded-xl border border-[hsl(220,15%,14%)] overflow-hidden divide-y divide-[hsl(220,15%,13%)]">
            {day.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors">
                <span className="font-mono text-[11px] text-muted-foreground/60 w-12 shrink-0">{item.time}</span>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${item.status === 'error' ? 'bg-rose-400/10' : 'bg-[hsl(220,15%,14%)]'}`}>
                  <Icon name={TI[item.type] || 'Circle'} size={12} fallback="Circle"
                    className={item.status === 'error' ? 'text-rose-400' : item.status === 'info' ? 'text-blue-400' : 'text-muted-foreground/60'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium shrink-0 ${SC[item.status as keyof typeof SC]}`}>
                  {{ success: 'Успешно', info: 'Инфо', error: 'Ошибка' }[item.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
