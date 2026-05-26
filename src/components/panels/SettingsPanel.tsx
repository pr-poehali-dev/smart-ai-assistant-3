import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { checkKey, saveKey } from '@/lib/api';

export default function SettingsPanel({ onChangeKey }: { onChangeKey?: () => void }) {
  const [name, setName] = useState('АУРА');
  const [tone, setTone] = useState('professional');
  const [notifs, setNotifs] = useState(true);
  const [sound, setSound] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [saved, setSaved] = useState(false);

  const [masked, setMasked] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    checkKey().then(r => { if (r.masked) setMasked(r.masked); });
  }, []);

  const handleSaveKey = async () => {
    if (!newKey.trim()) return;
    setKeyLoading(true);
    setKeyError('');
    const res = await saveKey(newKey.trim());
    setKeyLoading(false);
    if (res.error) { setKeyError(res.error); return; }
    const r = await checkKey();
    if (r.masked) setMasked(r.masked);
    setNewKey('');
    setShowKeyInput(false);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

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

      {/* API Key block */}
      <div className="rounded-xl border border-[hsl(220,15%,14%)] overflow-hidden">
        <div className="px-5 py-3 border-b border-[hsl(220,15%,14%)] bg-[hsl(220,18%,8%)] flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">API-ключ OpenRouter</span>
          {keySaved && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
              <Icon name="Check" size={11} fallback="Check" /> Сохранён
            </span>
          )}
        </div>
        <div className="p-5 bg-[hsl(220,18%,9%)] space-y-3">
          {masked && !showKeyInput ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Icon name="ShieldCheck" size={15} className="text-emerald-400" fallback="Shield" />
                </div>
                <div>
                  <p className="text-sm text-foreground font-mono">{masked}</p>
                  <p className="text-xs text-emerald-400 mt-0.5">Ключ подключён</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyInput(true)}
                className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-[hsl(220,15%,18%)] hover:border-[hsl(220,15%,24%)] transition-all"
              >
                Сменить
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Получи бесплатный ключ на{' '}
                <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="text-primary hover:underline">openrouter.ai</a>
                {' '}→ Keys → Create Key
              </p>
              <div className="relative flex items-center">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={newKey}
                  onChange={e => { setNewKey(e.target.value); setKeyError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSaveKey()}
                  placeholder="sk-or-v1-••••••••••••"
                  className="w-full bg-[hsl(220,20%,6%)] border border-[hsl(220,15%,16%)] rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 transition-colors pr-10 font-mono"
                />
                <button onClick={() => setShowKey(v => !v)} className="absolute right-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  <Icon name={showKey ? 'EyeOff' : 'Eye'} size={14} fallback="Eye" />
                </button>
              </div>
              {keyError && <p className="text-xs text-rose-400">{keyError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveKey}
                  disabled={!newKey.trim() || keyLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-xl font-medium hover:bg-primary/90 disabled:opacity-30 transition-all"
                >
                  {keyLoading ? <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" /> : <Icon name="Save" size={13} fallback="Save" />}
                  Сохранить
                </button>
                {masked && (
                  <button onClick={() => { setShowKeyInput(false); setNewKey(''); setKeyError(''); }}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-xl border border-[hsl(220,15%,16%)] hover:border-[hsl(220,15%,22%)] transition-all">
                    Отмена
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
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

      {/* Data */}
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
