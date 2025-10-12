'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ja } from 'date-fns/locale';
import { ProgressGraphModal } from '@/components/progress-graph-modal';

export default function HistoryPage() {
  const allWorkouts = useLiveQuery(() => db.completedWorkouts.orderBy('date').toArray(), []);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedExercise, setSelectedExercise] = useState<{ id: string, name: string } | null>(null);

  const workoutDates = allWorkouts?.map(w => w.date) || [];

  const selectedWorkout = allWorkouts?.find(w =>
    selectedDate && w.date.toDateString() === selectedDate.toDateString()
  );

  return (
    <>
      <div className="min-h-screen bg-background text-text-main p-4 sm:p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">トレーニング履歴</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ workoutDay: workoutDates }}
              modifiersStyles={{ workoutDay: { fontWeight: 'bold', color: '#34D399' } }}
              locale={ja}
              className="bg-surface rounded-xl p-4"
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
          workouts={allWorkouts}
          exerciseId={selectedExercise.id}
          exerciseName={selectedExercise.name}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </>
  );
}