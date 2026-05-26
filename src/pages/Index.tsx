import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/sections/Dashboard';
import Tasks from '@/components/sections/Tasks';
import Scenarios from '@/components/sections/Scenarios';
import Notifications from '@/components/sections/Notifications';
import Integrations from '@/components/sections/Integrations';
import History from '@/components/sections/History';
import Settings from '@/components/sections/Settings';
import Icon from '@/components/ui/icon';

type Section = 'dashboard' | 'tasks' | 'scenarios' | 'notifications' | 'integrations' | 'history' | 'settings';

const sectionTitles: Record<Section, string> = {
  dashboard: 'Дашборд',
  tasks: 'Задачи',
  scenarios: 'Сценарии',
  notifications: 'Уведомления',
  integrations: 'Интеграции',
  history: 'История',
  settings: 'Настройки',
};

export default function Index() {
  const [section, setSection] = useState<Section>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderSection = () => {
    switch (section) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <Tasks />;
      case 'scenarios': return <Scenarios />;
      case 'notifications': return <Notifications />;
      case 'integrations': return <Integrations />;
      case 'history': return <History />;
      case 'settings': return <Settings />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar activeSection={section} onSectionChange={(s) => setSection(s as Section)} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-56">
            <Sidebar activeSection={section} onSectionChange={(s) => { setSection(s as Section); setMobileOpen(false); }} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-56">
        {/* Top bar */}
        <header className="h-14 flex items-center px-5 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden mr-3 w-8 h-8 flex items-center justify-center rounded hover:bg-secondary transition-colors"
          >
            <Icon name="Menu" size={18} fallback="Menu" />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-xs font-mono text-muted-foreground/60 tracking-widest">АУРА</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{sectionTitles[section]}</span>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setSection('notifications')}
              className="relative w-8 h-8 flex items-center justify-center rounded hover:bg-secondary transition-colors"
            >
              <Icon name="Bell" size={16} fallback="Bell" className="text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary"></span>
            </button>
            <button
              onClick={() => setSection('settings')}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary transition-colors"
            >
              <Icon name="Settings" size={16} fallback="Settings" className="text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 sm:p-7 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
