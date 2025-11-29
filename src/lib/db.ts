import Dexie, { type Table } from 'dexie';
import type { SessionExercise } from '@/stores/session-store';

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
    this.version(1).stores({
      completedWorkouts: '++id, date', // Primary key and indexed props
      exercises: 'id, name', // Add exercises table for backup support
    });
  }
}

export const db = new MySubClassedDexie();
