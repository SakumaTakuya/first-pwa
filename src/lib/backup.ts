import { db, type Exercise, type CompletedWorkout } from './db';
import { reloadPage } from './utils';

export interface BackupData {
  localStorage: Record<string, string>;
  indexedDB: {
    exercises: unknown[];
    completedWorkouts: unknown[];
  };
  timestamp: number;
  version: number;
}

export const exportData = async (): Promise<BackupData> => {
  const localStorageData: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('storage') || key.includes('theme'))) {
        localStorageData[key] = localStorage.getItem(key) || '';
      }
    }
  }

  const exercises = await db.exercises.toArray();
  const completedWorkouts = await db.completedWorkouts.toArray();

  return {
    localStorage: localStorageData,
    indexedDB: {
      exercises,
      completedWorkouts,
    },
    timestamp: Date.now(),
    version: 1,
  };
};

export const importData = async (data: BackupData): Promise<void> => {
  if (!data.localStorage || !data.indexedDB) {
    throw new Error('Invalid backup data format');
  }

  // Restore localStorage
  if (typeof window !== 'undefined') {
    Object.entries(data.localStorage).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }

  // Restore IndexedDB
  await db.transaction('rw', db.exercises, db.completedWorkouts, async () => {
    await db.exercises.clear();
    await db.exercises.bulkAdd(data.indexedDB.exercises as Exercise[]);

    await db.completedWorkouts.clear();
    await db.completedWorkouts.bulkAdd(data.indexedDB.completedWorkouts as CompletedWorkout[]);
  });

  // Reload to apply changes (especially for Zustand state in localStorage)
  reloadPage();
};

export const downloadBackup = async () => {
  const data = await exportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `first-pwa-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
