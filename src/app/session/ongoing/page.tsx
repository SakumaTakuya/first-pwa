'use client';

import { useState, useEffect } from 'react';
import { useSessionStore } from '@/stores/session-store';
import { ExerciseCard } from '@/components/exercise-card';
import { AddExerciseModal } from '@/components/add-exercise-modal';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { Plus } from 'lucide-react';
import { MainNav } from '@/components/main-nav';

export default function OngoingSessionPage() {
  const { exercises: exercisesFromStore, clearSession, isActive } = useSessionStore();
  const exercises = exercisesFromStore || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(useSessionStore.persist.hasHydrated());

    const unsub = useSessionStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (hasHydrated && !isActive) {
      router.push('/');
    }
  }, [hasHydrated, isActive, router]);

  const handleEndSession = async () => {
    if (exercises.length > 0 && window.confirm('記録を保存してトレーニングを終了しますか？')) {
      try {
        await db.completedWorkouts.add({
          date: new Date(),
          exercises: exercises,
        });
        clearSession();
        router.push('/');
      } catch (error) {
        console.error('Failed to save workout', error);
        alert('記録の保存に失敗しました。');
      }
    } else if (window.confirm('現在のトレーニングを破棄しますか？')) {
      clearSession();
      router.push('/');
    }
  };

  if (!hasHydrated) {
    return <div className="min-h-screen bg-background"></div>; // Render nothing or a loader
  }

  return (
    <>
      <div className="flex flex-col h-full bg-background text-text-main p-4 sm:p-6">
        <header className="sticky top-0 flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">トレーニング中</h1>
          <button
            onClick={handleEndSession}
            className="bg-destructive text-white font-bold rounded-lg px-4 py-2 text-sm"
          >
            終了
          </button>
        </header>

        <main className="space-y-4 flex-grow"> {/* Add padding to bottom */}
          {exercises.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-sub">まだ種目が追加されていません。</p>
            </div>
          ) : (
            exercises.map((ex) => <ExerciseCard key={ex.id} sessionExercise={ex} />)
          )}
        </main>

        {/* Floating Action Button */}
        <div
          className="fixed bottom-20 bottom-20 right-6 transition-all duration-300 ease-in-out">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-accent text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl font-bold z-40"
          >
            <Plus size={32} />
          </button>
        </div>

        {isModalOpen && <AddExerciseModal onClose={() => setIsModalOpen(false)} />}
      </div>
      <MainNav />
    </>
  );
}