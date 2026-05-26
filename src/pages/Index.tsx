import { useState, useEffect } from 'react';
import ChatView from '@/components/ChatView';
import SetupScreen from '@/components/SetupScreen';
import { checkKey } from '@/lib/api';

export default function Index() {
  const [status, setStatus] = useState<'loading' | 'setup' | 'ready'>('loading');

  useEffect(() => {
    checkKey()
      .then(r => setStatus(r.has_key ? 'ready' : 'setup'))
      .catch(() => setStatus('setup'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[hsl(222,24%,4%)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-sm font-bold font-mono text-primary-foreground">AI</span>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (status === 'setup') {
    return <SetupScreen onDone={() => setStatus('ready')} />;
  }

  return <ChatView onNeedSetup={() => setStatus('setup')} />;
}
