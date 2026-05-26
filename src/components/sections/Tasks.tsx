import { useState } from 'react';
import Icon from '@/components/ui/icon';

const initialTasks = [
  { id: 1, title: 'Подготовить коммерческое предложение', priority: 'high', status: 'in_progress', due: '26 мая', tags: ['Продажи'] },
  { id: 2, title: 'Провести встречу с клиентом', priority: 'high', status: 'pending', due: '26 мая', tags: ['Встреча'] },
  { id: 3, title: 'Обновить базу контактов CRM', priority: 'medium', status: 'pending', due: '27 мая', tags: ['CRM'] },
  { id: 4, title: 'Написать еженедельный отчёт', priority: 'medium', status: 'done', due: '25 мая', tags: ['Отчёт'] },
  { id: 5, title: 'Проверить входящие заявки', priority: 'low', status: 'done', due: '25 мая', tags: ['Операции'] },
];

const priorityConfig = {
  high: { label: 'Высокий', color: 'text-rose-400', bg: 'bg-rose-400/10' },
  medium: { label: 'Средний', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  low: { label: 'Низкий', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
};

const statusConfig = {
  pending: { label: 'Ожидает', icon: 'Circle' },
  in_progress: { label: 'В работе', icon: 'RefreshCw' },
  done: { label: 'Готово', icon: 'CheckCircle' },
};

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'done'>('all');
  const [newTask, setNewTask] = useState('');

  const filtered = tasks.filter(t => filter === 'all' || t.status === filter);

  const toggleDone = (id: number) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t
    ));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now(),
      title: newTask.trim(),
      priority: 'medium',
      status: 'pending',
      due: '26 мая',
      tags: ['Новая'],
    }]);
    setNewTask('');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Задачи</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tasks.filter(t => t.status !== 'done').length} активных задач</p>
        </div>
      </div>

      {/* Add task */}
      <div className="bg-card border border-border rounded-lg p-4 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Добавить задачу..."
          className="flex-1 bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Icon name="Plus" size={14} fallback="Plus" />
          Добавить
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-1">
        {(['all', 'pending', 'in_progress', 'done'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors
              ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
          >
            {{ all: 'Все', pending: 'Ожидают', in_progress: 'В работе', done: 'Готово' }[f]}
          </button>
        ))}
      </div>

      {/* Tasks list */}
      <div className="space-y-2">
        {filtered.map((task) => {
          const pr = priorityConfig[task.priority as keyof typeof priorityConfig];
          const st = statusConfig[task.status as keyof typeof statusConfig];
          return (
            <div
              key={task.id}
              className={`bg-card border rounded-lg px-4 py-3 flex items-center gap-3 group transition-all hover:border-primary/30
                ${task.status === 'done' ? 'border-border opacity-60' : 'border-border'}`}
            >
              <button
                onClick={() => toggleDone(task.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all
                  ${task.status === 'done' ? 'bg-emerald-500/20 border-emerald-500/50' : 'border-border hover:border-primary'}`}
              >
                {task.status === 'done' && <Icon name="Check" size={11} className="text-emerald-400" fallback="Check" />}
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground font-mono">{task.due}</span>
                  {task.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${pr.bg} ${pr.color}`}>{pr.label}</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Icon name={st.icon} size={12} fallback="Circle" className={task.status === 'done' ? 'text-emerald-400' : task.status === 'in_progress' ? 'text-blue-400' : ''} />
                  <span className="text-[10px] hidden sm:inline">{st.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
