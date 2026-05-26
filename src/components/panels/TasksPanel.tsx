import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Task {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'done';
  due: string;
  tags: string[];
}

const INIT: Task[] = [
  { id: 1, title: 'Подготовить коммерческое предложение', priority: 'high', status: 'in_progress', due: '26 мая', tags: ['Продажи'] },
  { id: 2, title: 'Провести встречу с клиентом', priority: 'high', status: 'pending', due: '26 мая', tags: ['Встреча'] },
  { id: 3, title: 'Обновить базу контактов CRM', priority: 'medium', status: 'pending', due: '27 мая', tags: ['CRM'] },
  { id: 4, title: 'Написать еженедельный отчёт', priority: 'medium', status: 'done', due: '25 мая', tags: ['Отчёт'] },
  { id: 5, title: 'Проверить входящие заявки', priority: 'low', status: 'done', due: '25 мая', tags: ['Операции'] },
];

const PR = { high: { c: 'text-rose-400', bg: 'bg-rose-400/10', l: 'Высокий' }, medium: { c: 'text-amber-400', bg: 'bg-amber-400/10', l: 'Средний' }, low: { c: 'text-emerald-400', bg: 'bg-emerald-400/10', l: 'Низкий' } };
const ST = { pending: { l: 'Ожидает', ic: 'Circle' }, in_progress: { l: 'В работе', ic: 'RefreshCw' }, done: { l: 'Готово', ic: 'CheckCircle2' } };

export default function TasksPanel() {
  const [tasks, setTasks] = useState<Task[]>(INIT);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'done'>('all');
  const [newTask, setNewTask] = useState('');

  const filtered = tasks.filter(t => filter === 'all' || t.status === filter);

  const toggle = (id: number) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t));

  const add = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), title: newTask.trim(), priority: 'medium', status: 'pending', due: '26 мая', tags: ['Новая'] }]);
    setNewTask('');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Задачи</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tasks.filter(t => t.status !== 'done').length} активных</p>
        </div>
      </div>

      {/* Add */}
      <div className="flex gap-2">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Добавить задачу…"
          className="flex-1 bg-[hsl(220,18%,9%)] border border-[hsl(220,15%,16%)] rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
        />
        <button onClick={add} className="px-4 py-2.5 bg-primary text-primary-foreground text-sm rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shrink-0">
          <Icon name="Plus" size={14} fallback="Plus" />
          Добавить
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5">
        {(['all', 'pending', 'in_progress', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-[hsl(220,18%,9%)] text-muted-foreground hover:text-foreground border border-[hsl(220,15%,16%)]'}`}>
            {{ all: 'Все', pending: 'Ожидают', in_progress: 'В работе', done: 'Готово' }[f]}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(task => {
          const pr = PR[task.priority];
          const st = ST[task.status];
          return (
            <div key={task.id} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all hover:border-primary/20 ${task.status === 'done' ? 'bg-[hsl(220,18%,8%)] border-[hsl(220,15%,13%)] opacity-55' : 'bg-[hsl(220,18%,9%)] border-[hsl(220,15%,15%)]'}`}>
              <button onClick={() => toggle(task.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${task.status === 'done' ? 'bg-emerald-500/20 border-emerald-500/40' : 'border-[hsl(220,15%,22%)] hover:border-primary/60'}`}>
                {task.status === 'done' && <Icon name="Check" size={11} className="text-emerald-400" fallback="Check" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground font-mono">{task.due}</span>
                  {task.tags.map(tag => <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-[hsl(220,15%,14%)] rounded text-muted-foreground">{tag}</span>)}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${pr.bg} ${pr.c}`}>{pr.l}</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Icon name={st.ic} size={12} fallback="Circle" className={task.status === 'done' ? 'text-emerald-400' : task.status === 'in_progress' ? 'text-blue-400' : ''} />
                  <span className="text-[10px] hidden sm:inline">{st.l}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
