import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Set {
  id: string;
  reps: number;
  weight: number;
}

export interface SessionExercise {
  id: string; // This will be a unique ID for the instance in the session
  exerciseId: string;
  exerciseName: string;
  sets: Set[];
}

interface SessionState {
  isActive: boolean;
  exercises: SessionExercise[];
  startSession: () => void;
  addExerciseToSession: (exercise: { id: string; name: string }) => void;
  addSetToExercise: (sessionExerciseId: string, set: Omit<Set, 'id'>) => void;
  updateSet: (sessionExerciseId: string, setId: string, newWeight: number, newReps: number) => void;
  removeExerciseFromSession: (sessionExerciseId: string) => void;
  removeSetFromExercise: (sessionExerciseId: string, setId: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isActive: false,
      exercises: [],
      startSession: () => set({ isActive: true, exercises: [] }),
      addExerciseToSession: (exercise) => {
        const newSessionExercise: SessionExercise = {
          id: crypto.randomUUID(),
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          sets: [],
        };
        set((state) => ({ exercises: [...state.exercises, newSessionExercise] }));
      },
      addSetToExercise: (sessionExerciseId, newSet) => {
        set((state) => ({
          exercises: state.exercises.map((ex) =>
            ex.id === sessionExerciseId
              ? { ...ex, sets: [...ex.sets, { ...newSet, id: crypto.randomUUID() }] }
              : ex
          ),
        }));
      },
      updateSet: (sessionExerciseId, setId, newWeight, newReps) => {
        set((state) => ({
          exercises: state.exercises.map((ex) =>
            ex.id === sessionExerciseId
              ? {
                ...ex,
                sets: ex.sets.map((set) =>
                  set.id === setId
                    ? { ...set, weight: newWeight, reps: newReps }
                    : set
                ),
              }
              : ex
          ),
        }));
      },
      removeExerciseFromSession: (sessionExerciseId) => {
        set((state) => ({
          exercises: state.exercises.filter((ex) => ex.id !== sessionExerciseId),
        }));
      },
      removeSetFromExercise: (sessionExerciseId, setId) => {
        set((state) => ({
          exercises: state.exercises.map((ex) =>
            ex.id === sessionExerciseId
              ? { ...ex, sets: ex.sets.filter((set) => set.id !== setId) }
              : ex
          ),
        }));
      },
      clearSession: () => set({ isActive: false, exercises: [] }),
    }),
    {
      name: 'workout-session-storage',
    }
  )
);