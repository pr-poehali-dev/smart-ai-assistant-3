import Icon from '@/components/ui/icon';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Дашборд', icon: 'LayoutDashboard' },
  { id: 'tasks', label: 'Задачи', icon: 'CheckSquare' },
  { id: 'scenarios', label: 'Сценарии', icon: 'GitBranch' },
  { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
  { id: 'integrations', label: 'Интеграции', icon: 'Plug' },
  { id: 'history', label: 'История', icon: 'Clock' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-56 h-screen flex flex-col bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs font-mono">AI</span>
          </div>
          <span className="font-semibold text-[hsl(var(--sidebar-accent-foreground))] tracking-wide text-sm">АУРА</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot block"></span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <div className="mb-2 px-3">
          <span className="text-[10px] font-semibold tracking-widest text-[hsl(var(--muted-foreground))] uppercase">Навигация</span>
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded mb-0.5 text-sm transition-all duration-150 text-left
              ${activeSection === item.id
                ? 'bg-primary/15 text-primary font-medium'
                : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]'
              }`}
          >
            <Icon name={item.icon} size={15} fallback="Circle" />
            <span>{item.label}</span>
            {item.id === 'notifications' && (
              <span className="ml-auto w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">3</span>
            )}
            {item.id === 'tasks' && (
              <span className="ml-auto w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[9px] font-bold flex items-center justify-center">5</span>
            )}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded hover:bg-[hsl(var(--sidebar-accent))] cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-foreground">А</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Администратор</p>
            <p className="text-[10px] text-muted-foreground truncate">Pro план</p>
          </div>
          <Icon name="ChevronUp" size={12} fallback="ChevronUp" className="text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
}
