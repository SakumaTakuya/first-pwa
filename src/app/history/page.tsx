'use client';

import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Calendar } from '@/components/ui/calendar';
import { ja } from 'date-fns/locale';
import { ProgressGraphModal } from '@/components/progress-graph-modal';

export default function HistoryPage() {
  const allWorkouts = useLiveQuery(() => db.completedWorkouts.orderBy('date').toArray(), []);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedExercise, setSelectedExercise] = useState<{ id: string, name: string } | null>(null);
  const workoutDates = useMemo(() => allWorkouts?.map(w => new Date(w.date)) || [], [allWorkouts]);

  const selectedWorkout = useMemo(() => allWorkouts?.find(w =>
    selectedDate && new Date(w.date).toDateString() === selectedDate.toDateString()
  ), [allWorkouts, selectedDate]);

  return (
    <>
      <header className="glass border-b border-border z-30 top-0 left-0 right-0 pt-safe-top fixed flex justify-between items-center px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-text-main my-4">トレーニング履歴</h1>
      </header>
      <div className="text-text-main p-4 sm:p-6 pt-20 mt-safe-top">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ workoutDay: workoutDates }}
              modifiersClassNames={{ workoutDay: 'font-bold text-primary' }}
              locale={ja}
            />
          </div>
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">記録詳細</h2>
            {selectedWorkout ? (
              <div className="bg-surface rounded-xl p-4 space-y-4">
                <h3 className="font-bold">{selectedDate?.toLocaleDateString('ja-JP')}</h3>
                {selectedWorkout.exercises.map(ex => (
                  <div key={ex.id}>
                    <button
                      onClick={() => setSelectedExercise({ id: ex.exerciseId, name: ex.exerciseName })}
                      className="font-bold text-text-main hover:text-accent transition-colors w-full text-left"
                    >
                      {ex.exerciseName}
                    </button>
                    <ul className="pl-4 space-y-1 mt-1">
                      {ex.sets.map(set => (
                        <li key={set.id} className="text-text-sub">
                          {set.weight}kg x {set.reps}reps
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface rounded-xl p-4 text-center text-text-sub">
                <p>カレンダーから日付を選択してください。</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedExercise && allWorkouts && (
        <ProgressGraphModal
          isOpen={!!selectedExercise}
          workouts={allWorkouts}
          exerciseId={selectedExercise.id}
          exerciseName={selectedExercise.name}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </>
  );
}