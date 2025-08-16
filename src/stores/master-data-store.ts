import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_EXERCISES } from '@/data/mock-exercises';

interface Exercise {
  id: string;
  name: string;
}

interface MasterDataState {
  masterExerciseList: Exercise[];
  exerciseHistory: string[];
  addExerciseToHistory: (exerciseId: string) => void;
  addNewExerciseToMasterList: (exerciseName: string) => Exercise;
}

export const useMasterDataStore = create<MasterDataState>()(
  persist(
    (set, get) => ({
      masterExerciseList: MOCK_EXERCISES,
      exerciseHistory: [],
      addExerciseToHistory: (exerciseId) => {
        const { exerciseHistory } = get();
        if (!exerciseHistory.includes(exerciseId)) {
          set({ exerciseHistory: [exerciseId, ...exerciseHistory] });
        }
      },
      addNewExerciseToMasterList: (exerciseName) => {
        const { masterExerciseList } = get();
        const newExercise = {
          id: exerciseName.toLowerCase().replace(/\s+/g, '-'), // simple id generation
          name: exerciseName,
        };
        set({ masterExerciseList: [...masterExerciseList, newExercise] });
        return newExercise;
      },
    }),
    { name: 'master-data-storage' }
  )
);
