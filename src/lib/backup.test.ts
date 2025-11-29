import { exportData, importData, BackupData } from './backup';
import { db } from './db';
import { reloadPage } from './utils';

// Mock Dexie
jest.mock('./db', () => ({
  db: {
    exercises: {
      toArray: jest.fn(),
      clear: jest.fn(),
      bulkAdd: jest.fn(),
    },
    completedWorkouts: {
      toArray: jest.fn(),
      clear: jest.fn(),
      bulkAdd: jest.fn(),
    },
    transaction: jest.fn((mode, t1, t2, callback) => callback()),
  },
}));

// Mock utils
jest.mock('./utils', () => ({
  reloadPage: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    key: (i: number) => Object.keys(store)[i] || null,
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Backup Manager', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('exportData collects data from localStorage and Dexie', async () => {
    // Setup mock data
    localStorage.setItem('master-data-storage', '{"state":{}}');
    (db.exercises.toArray as jest.Mock).mockResolvedValue([{ id: 'ex1' }]);
    (db.completedWorkouts.toArray as jest.Mock).mockResolvedValue([{ id: 1 }]);

    const data = await exportData();

    expect(data.localStorage['master-data-storage']).toBe('{"state":{}}');
    expect(data.indexedDB.exercises).toEqual([{ id: 'ex1' }]);
    expect(data.indexedDB.completedWorkouts).toEqual([{ id: 1 }]);
    expect(data.timestamp).toBeDefined();
  });

  test('importData restores data to localStorage and Dexie', async () => {
    const backupData: BackupData = {
      localStorage: { 'master-data-storage': '{"restored":true}' },
      indexedDB: {
        exercises: [{ id: 'restored-ex' }],
        completedWorkouts: [{ id: 99 }],
      },
      timestamp: 1234567890,
      version: 1,
    };

    await importData(backupData);

    expect(localStorage.getItem('master-data-storage')).toBe('{"restored":true}');
    expect(db.exercises.clear).toHaveBeenCalled();
    expect(db.exercises.bulkAdd).toHaveBeenCalledWith([{ id: 'restored-ex' }]);
    expect(db.completedWorkouts.clear).toHaveBeenCalled();
    expect(db.completedWorkouts.bulkAdd).toHaveBeenCalledWith([{ id: 99 }]);
    expect(reloadPage).toHaveBeenCalled();
  });

  test('importData throws error for invalid data', async () => {
    await expect(importData({} as unknown as BackupData)).rejects.toThrow('Invalid backup data format');
  });
});
