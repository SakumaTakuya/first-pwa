import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface MasterDataState {
  exerciseHistory: string[];
  addExerciseToHistory: (exerciseId: string) => void;
}

export const useMasterDataStore = create<MasterDataState>()(
  persist(
    (set, get) => ({
      exerciseHistory: [],
      addExerciseToHistory: (exerciseId) => {
        const { exerciseHistory } = get();
        if (!exerciseHistory.includes(exerciseId)) {
          set({ exerciseHistory: [exerciseId, ...exerciseHistory] });
        }
      },
    }),
    { name: 'master-data-storage' }
  )
);
