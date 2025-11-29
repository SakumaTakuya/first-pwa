'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/session-store';
import { Settings, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsModal } from '@/components/settings-modal';

export default function HomePage() {
  const router = useRouter();
  const { isActive, startSession } = useSessionStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (isActive) {
      router.push('/session/ongoing');
    }
  }, [isActive, router]);

  const handleStart = () => {
    startSession();
    router.push('/session/select-exercise');
  };

  if (isActive) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-main">
      <header className="flex justify-between items-center p-4">
        <div />
        <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
          <Settings className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 p-8 text-center">
        <h1 className="text-2xl font-bold mb-12">
          今日の調子はどうですか？
        </h1>
        <button
          onClick={handleStart}
          className="bg-primary text-white font-bold rounded-lg text-lg px-8 py-4 hover:bg-blue-700 transition-colors"
        >
          本日のトレーニングを開始
        </button>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}