import Dexie, { type Table } from 'dexie';
import type { SessionExercise } from '@/stores/session-store';

export interface CompletedWorkout {
  id?: number;
  date: Date;
  exercises: SessionExercise[];
}

export class MySubClassedDexie extends Dexie {
  completedWorkouts!: Table<CompletedWorkout>;

  constructor() {
    super('com.sakumatakuya.first-pwa.db');
    this.version(1).stores({
      completedWorkouts: '++id, date', // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
