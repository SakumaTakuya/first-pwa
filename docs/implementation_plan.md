# Migrate masterExerciseList to Dexie

## Goal Description
Migrate the management of `masterExerciseList` from Zustand state management to Dexie (IndexedDB) to improve extensibility and persistence, while ensuring existing user data in `localStorage` is preserved.

## User Review Required
- [ ] Confirm if existing data in Zustand needs to be migrated (likely static or initial data). -> **YES, User confirmed need to preserve user data.**

## Proposed Changes
### Data Layer
#### [MODIFY] [db.ts](file:///Users/sakumatakuya/src/github.com/SakumaTakuya/test-next-pwa/first-pwa/src/lib/db.ts)
- Define `Exercise` interface.
- Define Version 1 schema (only `completedWorkouts`).
- Define Version 2 schema (adds `exercises`).
- Implement `upgrade` handler for Version 2:
    - Seed with `MOCK_EXERCISES`.
    - Read `master-data-storage` from `localStorage`.
    - Parse and merge existing exercises into `exercises` table.

### State Management
#### [MODIFY] [master-data-store.ts](file:///Users/sakumatakuya/src/github.com/SakumaTakuya/test-next-pwa/first-pwa/src/stores/master-data-store.ts)
- Remove `masterExerciseList` state and `addNewExerciseToMasterList` action. (Already done)
- Keep `exerciseHistory` as is. (Already done)

### Components
#### [MODIFY] [add-exercise-modal.tsx](file:///Users/sakumatakuya/src/github.com/SakumaTakuya/test-next-pwa/first-pwa/src/components/add-exercise-modal.tsx)
- Use `useLiveQuery` to fetch exercises. (Already done)

## Verification Plan
### Automated Tests
- Run `npm run build`.
- Run `npm run lint`.

### Manual Verification
1. **Migration Test**:
    - Manually set `localStorage` item `master-data-storage` with some custom exercises.
    - Clear IndexedDB.
    - Reload the page.
    - Verify custom exercises appear in the list.
2. **Standard Functionality**:
    - Verify adding new exercises works.
