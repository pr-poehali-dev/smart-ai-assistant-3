import { useState } from 'react';
import { saveKey } from '@/lib/api';
import Icon from '@/components/ui/icon';

interface Props {
  onDone: () => void;
}

export default function SetupScreen({ onDone }: Props) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = async () => {
    if (!key.trim()) return;
    setLoading(true);
    setError('');
    const res = await saveKey(key.trim());
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    onDone();
  };

  return (
    <div className="min-h-screen bg-[hsl(222,24%,4%)] flex items-center justify-center px-4">
      {/* background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
            <span className="text-2xl font-bold font-mono text-primary-foreground tracking-tight">AI</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">АУРА</h1>
          <p className="text-sm text-muted-foreground mt-1">Персональный ИИ-ассистент</p>
        </div>

        {/* Card */}
        <div className="bg-[hsl(222,20%,8%)] border border-[hsl(222,15%,14%)] rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">Подключение ИИ</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Для работы нужен бесплатный ключ OpenRouter. Модель бесплатная — списаний не будет.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {[
              { n: '1', text: 'Зайди на', link: 'openrouter.ai', href: 'https://openrouter.ai' },
              { n: '2', text: 'Зарегистрируйся → Keys → Create Key' },
              { n: '3', text: 'Скопируй ключ и вставь ниже' },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-md bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
                <p className="text-sm text-muted-foreground">
                  {s.text}{' '}
                  {s.link && (
                    <a href={s.href} target="_blank" rel="noreferrer"
                      className="text-primary hover:underline font-medium">{s.link}</a>
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">API-ключ</label>
            <div className="relative flex items-center">
              <input
                type={show ? 'text' : 'password'}
                value={key}
                onChange={e => { setKey(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="sk-or-v1-••••••••••••••••"
                className="w-full bg-[hsl(222,20%,6%)] border border-[hsl(222,15%,16%)] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 transition-colors pr-10 font-mono"
              />
              <button onClick={() => setShow(v => !v)}
                className="absolute right-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                <Icon name={show ? 'EyeOff' : 'Eye'} size={15} fallback="Eye" />
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5">
                <Icon name="AlertCircle" size={12} fallback="AlertCircle" />{error}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!key.trim() || loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Проверяю…
              </>
            ) : (
              <>
                <Icon name="Zap" size={15} fallback="Zap" />
                Подключить АУРУ
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/40 mt-4">
          Ключ хранится только в вашей базе данных
        </p>
      </div>
    </div>
  );
}
