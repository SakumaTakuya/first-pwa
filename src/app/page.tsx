'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/session-store';

export default function HomePage() {
  const router = useRouter();
  const { isActive, startSession } = useSessionStore();

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-main">
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
    </div>
  );
}