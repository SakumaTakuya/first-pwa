import Dexie, { type Table } from 'dexie';
import type { SessionExercise } from '@/stores/session-store';
import { MOCK_EXERCISES } from '@/data/mock-exercises';

export interface CompletedWorkout {
  id?: number;
  date: Date;
  exercises: SessionExercise[];
}

export interface Exercise {
  id: string;
  name: string;
}

export class MySubClassedDexie extends Dexie {
  completedWorkouts!: Table<CompletedWorkout>;
  exercises!: Table<Exercise>;

  constructor() {
    super('com.sakumatakuya.first-pwa.db');
    // Version 1: Original schema
    this.version(1).stores({
      completedWorkouts: '++id, date', // Primary key and indexed props
    });

    // Version 2: Add exercises table and migrate data
    this.version(2).stores({
      exercises: 'id, name', // Primary key and indexed props
    }).upgrade(async (tx) => {
      // Seed mock exercises during upgrade (for existing users)
      // Use bulkPut to avoid errors if data somehow exists (though it shouldn't for v1 users)
      await tx.table('exercises').bulkPut(MOCK_EXERCISES);

      // Migrate from localStorage (Zustand persistence)
      if (typeof window !== 'undefined') {
        const storageData = localStorage.getItem('master-data-storage');
        if (storageData) {
          try {
            const parsed = JSON.parse(storageData);
            // Zustand persist stores state in 'state' property
            const masterList = parsed.state?.masterExerciseList;
            if (Array.isArray(masterList)) {
              // Merge user data. User data should overwrite mock data if IDs collide (e.g. if they renamed a standard exercise)
              // or just add new ones. bulkPut handles both (insert or update).
              await tx.table('exercises').bulkPut(masterList);
            }
          } catch (e) {
            console.error('Failed to migrate data from localStorage', e);
          }
        }
      }
    });

    this.on('populate', () => {
      this.exercises.bulkAdd(MOCK_EXERCISES);
    });
  }
}

export const db = new MySubClassedDexie();
