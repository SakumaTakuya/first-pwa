'use client';

import { useEffect, useState, useRef, type KeyboardEvent } from 'react';
import { Pencil, Check, X, Trash2 } from 'lucide-react';

import { db } from '@/lib/db';
import type { SessionExercise, Set } from '@/stores/session-store';
import { useSessionStore } from '@/stores/session-store';

// Props for the SetRow component
interface SetRowProps {
  set: Set;
  sessionExerciseId: string;
  isEditing: boolean;
  onStartEdit: (set: Set) => void;
  onCancelEdit: () => void;
}

// A single row in the logged sets list, handling its own edit state.
const SetRow = ({ set, sessionExerciseId, isEditing, onStartEdit, onCancelEdit }: SetRowProps) => {
  const { updateSet, removeSetFromExercise } = useSessionStore();
  const [weight, setWeight] = useState(set.weight.toString());
  const [reps, setReps] = useState(set.reps.toString());

  const editRepsInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps, 10);
    if (!isNaN(weightNum) && !isNaN(repsNum)) {
      updateSet(sessionExerciseId, set.id, weightNum, repsNum);
    }
    onCancelEdit(); // Exit editing mode
  };

  const handleDelete = () => {
    if (window.confirm('このセットを削除しますか？')) {
      removeSetFromExercise(sessionExerciseId, set.id);
      onCancelEdit(); // Exit editing mode as the set is gone
    }
  };

  const handleEditWeightKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editRepsInputRef.current?.focus();
    }
  };

  if (isEditing) {
    return (
      <li className="bg-background p-2 rounded-lg">
        <form onSubmit={handleSave} className="flex items-center gap-2">
          <button type="button" onClick={handleDelete} className="p-1 text-destructive hover:opacity-75"><Trash2 size={16} /></button>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            onKeyDown={handleEditWeightKeyDown}
            enterKeyHint="next"
            className="w-full bg-surface text-text-main rounded-lg px-2 py-1 border-none focus:ring-2 focus:ring-primary text-right"
            autoFocus
          />
          <span className="text-text-sub text-xs">kg</span>
          <input
            ref={editRepsInputRef}
            type="number"
            value={reps}
            onChange={e => setReps(e.target.value)}
            enterKeyHint="done"
            className="w-full bg-surface text-text-main rounded-lg px-2 py-1 border-none focus:ring-2 focus:ring-primary text-right"
          />
          <span className="text-text-sub text-xs">reps</span>
          <button type="submit" className="p-1 text-green-400 hover:text-green-300"><Check size={20} /></button>
          {/* <button type="button" onClick={onCancelEdit} className="p-1 text-gray-400 hover:text-gray-300"><X size={20} /></button> */}
        </form>
      </li>
    );
  }

  return (
    <li className="flex justify-between items-center bg-background p-2 rounded-lg gap-2">
      <button type="button" onClick={handleDelete} className="p-1 text-destructive hover:opacity-75"><Trash2 size={16} /></button>

      <div className="flex-grow flex items-center gap-2">
        <div className="w-full bg-surface text-text-main rounded-lg px-2 py-1 text-right">
          {set.weight}
        </div>
        <span className="text-text-sub text-xs">kg</span>
        <div className="w-full bg-surface text-text-main rounded-lg px-2 py-1 text-right">
          {set.reps}
        </div>
        <span className="text-text-sub text-xs">reps</span>
      </div>
      <button onClick={() => onStartEdit(set)} className="p-1 text-text-sub hover:text-accent">
        <Pencil size={20} />
      </button>
    </li>
  );
}

// Props for the main ExerciseCard component
interface ExerciseCardProps {
  sessionExercise: SessionExercise;
}

export const ExerciseCard = ({ sessionExercise }: ExerciseCardProps) => {
  const { addSetToExercise, removeExerciseFromSession } = useSessionStore();
  const [newWeight, setNewWeight] = useState('');
  const [newReps, setNewReps] = useState('');
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  const weightInputRef = useRef<HTMLInputElement>(null);
  const repsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchLastRecord = async () => {
      try {
        const lastWorkout = await db.completedWorkouts
          .orderBy('date')
          .reverse()
          .filter(workout => workout.exercises.some(ex => ex.exerciseId === sessionExercise.exerciseId))
          .first();

        if (lastWorkout) {
          const lastExercise = lastWorkout.exercises.find(ex => ex.exerciseId === sessionExercise.exerciseId);
          if (lastExercise && lastExercise.sets.length > 0) {
            const lastSet = lastExercise.sets[lastExercise.sets.length - 1];
            setNewWeight(lastSet.weight.toString());
            setNewReps(lastSet.reps.toString());
          }
        }
      } catch (error) {
        console.error("Failed to fetch last workout record:", error);
      }
    };

    // Only fetch if there are no sets yet for this exercise in the current session.
    if (sessionExercise.sets.length === 0) {
      fetchLastRecord();
    }
  }, [sessionExercise.exerciseId, sessionExercise.sets.length]);

  const handleDelete = () => {
    if (window.confirm(`「${sessionExercise.exerciseName}」を削除しますか？\n記録されたセットもすべて削除されます。`)) {
      removeExerciseFromSession(sessionExercise.id);
    }
  };

  const handleAddSet = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(newWeight);
    const repsNum = parseInt(newReps, 10);

    if (!isNaN(weightNum) && !isNaN(repsNum)) {
      addSetToExercise(sessionExercise.id, { weight: weightNum, reps: repsNum });
      // Per user feedback, inputs are not cleared.
      weightInputRef.current?.focus();
    }
  };

  const handleWeightKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      repsInputRef.current?.focus();
    }
  };

  return (
    <section className="bg-surface rounded-xl shadow-md p-4 w-full">
      <div className="flex gap-2 items-center mb-2">
        <button onClick={handleDelete} className="p-1 text-destructive hover:opacity-75">
          <Trash2 size={16} />
        </button>
        <h3 className="text-xl font-bold text-text-main">{sessionExercise.exerciseName}</h3>
      </div>

      <ul className="space-y-2 mb-4">
        {sessionExercise.sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            sessionExerciseId={sessionExercise.id}
            isEditing={editingSetId === set.id}
            onStartEdit={(setToEdit) => setEditingSetId(setToEdit.id)}
            onCancelEdit={() => setEditingSetId(null)}
          />
        ))}
      </ul>

      <form onSubmit={handleAddSet}>
        <div className="flex items-center gap-2">
          <input
            ref={weightInputRef}
            type="number"
            placeholder="重量(kg)"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            onKeyDown={handleWeightKeyDown}
            enterKeyHint="next"
            className="w-full bg-surface text-text-main rounded-lg px-2 py-1 border-none focus:ring-2 focus:ring-primary text-right"
            autoFocus
          />
          <span className="text-text-sub text-xs">kg</span>
          <input
            ref={repsInputRef}
            type="number"
            placeholder="回数"
            value={newReps}
            onChange={(e) => setNewReps(e.target.value)}
            enterKeyHint="done"
            className="w-full bg-surface text-text-main rounded-lg px-2 py-1 border-none focus:ring-2 focus:ring-primary text-right"
          />
          <span className="text-text-sub text-xs">reps</span>
          <button type="submit" className="p-1 text-green-400 hover:text-green-300"><Check size={20} /></button>

        </div>
      </form>
    </section>
  );
};