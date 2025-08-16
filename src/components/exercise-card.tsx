'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import type { SessionExercise, Set } from '@/stores/session-store';
import { useSessionStore } from '@/stores/session-store';
import { Pencil, Check, X } from 'lucide-react';

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
  const { updateSet } = useSessionStore();
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
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            onKeyDown={handleEditWeightKeyDown}
            enterKeyHint="next"
            className="w-full bg-surface text-text-main rounded-lg px-2 py-1 border-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <span className="text-text-sub">kg x</span>
          <input
            ref={editRepsInputRef}
            type="number"
            value={reps}
            onChange={e => setReps(e.target.value)}
            enterKeyHint="done"
            className="w-full bg-surface text-text-main rounded-lg px-2 py-1 border-none focus:ring-2 focus:ring-primary"
          />
          <span className="text-text-sub">reps</span>
          <button type="submit" className="p-1 text-green-400 hover:text-green-300"><Check size={20} /></button>
          <button type="button" onClick={onCancelEdit} className="p-1 text-red-400 hover:text-red-300"><X size={20} /></button>
        </form>
      </li>
    );
  }

  return (
    <li className="flex justify-between items-center bg-background p-2 rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-text-main font-medium">{set.weight} kg</span>
        <span className="text-text-sub">x</span>
        <span className="text-text-main font-medium">{set.reps} reps</span>
      </div>
      <button onClick={() => onStartEdit(set)} className="p-1 text-text-sub hover:text-accent">
        <Pencil size={16} />
      </button>
    </li>
  );
}

// Props for the main ExerciseCard component
interface ExerciseCardProps {
  sessionExercise: SessionExercise;
}

export const ExerciseCard = ({ sessionExercise }: ExerciseCardProps) => {
  const { addSetToExercise } = useSessionStore();
  const [newWeight, setNewWeight] = useState('');
  const [newReps, setNewReps] = useState('');
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  const weightInputRef = useRef<HTMLInputElement>(null);
  const repsInputRef = useRef<HTMLInputElement>(null);

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
    <div className="bg-surface rounded-xl shadow-md p-4 w-full">
      <h3 className="text-xl font-bold text-text-main mb-4">{sessionExercise.exerciseName}</h3>

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
            className="w-full bg-background text-text-main rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-primary"
          />
          <input
            ref={repsInputRef}
            type="number"
            placeholder="回数"
            value={newReps}
            onChange={(e) => setNewReps(e.target.value)}
            enterKeyHint="done"
            className="w-full bg-background text-text-main rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="p-1 text-green-400 hover:text-green-300"><Check size={20} /></button>
        </div>
      </form>
    </div>
  );
};