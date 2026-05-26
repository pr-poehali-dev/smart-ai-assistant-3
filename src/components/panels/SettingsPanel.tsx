import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function SettingsPanel() {
  const [name, setName] = useState('АУРА');
  const [tone, setTone] = useState('professional');
  const [notifs, setNotifs] = useState(true);
  const [sound, setSound] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Настройки</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Конфигурация ассистента</p>
      </div>

      {/* Identity */}
      <div className="rounded-xl border border-[hsl(220,15%,14%)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[hsl(220,15%,14%)] bg-[hsl(220,18%,8%)]">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Личность ассистента</span>
        </div>
        <div className="p-5 space-y-4 bg-[hsl(220,18%,9%)]">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Имя</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-[hsl(220,18%,8%)] border border-[hsl(220,15%,16%)] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Стиль общения</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ v: 'professional', l: 'Деловой' }, { v: 'friendly', l: 'Дружелюбный' }, { v: 'concise', l: 'Лаконичный' }].map(opt => (
                <button key={opt.v} onClick={() => setTone(opt.v)}
                  className={`py-2 rounded-xl text-sm font-medium transition-colors ${tone === opt.v ? 'bg-primary text-primary-foreground' : 'bg-[hsl(220,18%,8%)] border border-[hsl(220,15%,16%)] text-muted-foreground hover:text-foreground'}`}>
                  {opt.l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-[hsl(220,15%,14%)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[hsl(220,15%,14%)] bg-[hsl(220,18%,8%)]">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Уведомления</span>
        </div>
        <div className="bg-[hsl(220,18%,9%)] divide-y divide-[hsl(220,15%,13%)]">
          {[
            { l: 'Push-уведомления', d: 'Показывать уведомления в браузере', v: notifs, s: setNotifs },
            { l: 'Звуковые сигналы', d: 'Звук при новых событиях', v: sound, s: setSound },
            { l: 'Автозапуск сценариев', d: 'Запускать по расписанию автоматически', v: autoRun, s: setAutoRun },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm text-foreground">{item.l}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.d}</p>
              </div>
              <button onClick={() => item.s(!item.v)}
                className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${item.v ? 'bg-primary' : 'bg-[hsl(220,15%,18%)] border border-[hsl(220,15%,22%)]'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${item.v ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger */}
      <div className="rounded-xl border border-[hsl(220,15%,14%)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[hsl(220,15%,14%)] bg-[hsl(220,18%,8%)]">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Данные</span>
        </div>
        <div className="p-5 flex gap-3 bg-[hsl(220,18%,9%)]">
          <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(220,15%,14%)] text-sm text-foreground rounded-xl hover:bg-[hsl(220,15%,18%)] transition-colors">
            <Icon name="Download" size={13} fallback="Download" />
            Экспорт данных
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-sm text-rose-400 rounded-xl hover:bg-rose-500/20 transition-colors">
            <Icon name="Trash2" size={13} fallback="Trash" />
            Сбросить историю
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
          {saved ? <><Icon name="Check" size={14} fallback="Check" />Сохранено</> : 'Сохранить изменения'}
        </button>
      </div>
    </div>
  );
}
