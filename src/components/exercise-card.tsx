'use client';

import { useState } from 'react';
import type { SessionExercise } from '@/stores/session-store';
import { useSessionStore } from '@/stores/session-store';

interface ExerciseCardProps {
  sessionExercise: SessionExercise;
}

export const ExerciseCard = ({ sessionExercise }: ExerciseCardProps) => {
  const { addSetToExercise } = useSessionStore();
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const handleAddSet = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps, 10);

    if (!isNaN(weightNum) && !isNaN(repsNum)) {
      addSetToExercise(sessionExercise.id, { weight: weightNum, reps: repsNum });
      setWeight('');
      setReps('');
    }
  };

  return (
    <div className="bg-surface rounded-xl shadow-md p-4 w-full">
      <h3 className="text-xl font-bold text-text-main mb-4">{sessionExercise.exerciseName}</h3>
      
      {/* Logged Sets */}
      <ul className="space-y-2 mb-4">
        {sessionExercise.sets.map((set, index) => (
          <li key={set.id} className="flex justify-between items-center bg-background p-2 rounded-lg">
            <span className="text-text-sub">{index + 1}.</span>
            <span className="text-text-main font-medium">{set.weight} kg</span>
            <span className="text-text-sub">x</span>
            <span className="text-text-main font-medium">{set.reps} reps</span>
          </li>
        ))}
      </ul>

      {/* Add Set Form */}
      <form onSubmit={handleAddSet} className="flex items-center gap-2">
        <input
          type="number"
          placeholder="重量(kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full bg-background text-text-main rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          placeholder="回数"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-full bg-background text-text-main rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-primary"
        />
        <button type="submit" className="bg-primary text-white font-bold rounded-lg px-4 py-2">
          追加
        </button>
      </form>
    </div>
  );
};
