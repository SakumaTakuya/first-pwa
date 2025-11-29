# Migrate masterExerciseList to Dexie

- [x] Explore current implementation <!-- id: 0 -->
    - [x] Search for `masterExerciseList` usage <!-- id: 1 -->
    - [x] Analyze `src/lib/db.ts` <!-- id: 2 -->
- [x] Plan migration <!-- id: 3 -->
    - [x] Create implementation plan <!-- id: 4 -->
- [x] Implement migration <!-- id: 5 -->
    - [x] Update Dexie schema in `src/lib/db.ts` <!-- id: 6 -->
    - [x] Create/Update hooks for accessing exercises from Dexie <!-- id: 7 -->
    - [x] Remove `masterExerciseList` from Zustand store <!-- id: 8 -->
    - [x] Update components to use Dexie instead of Zustand <!-- id: 9 -->
- [ ] Handle Legacy Data Migration <!-- id: 13 -->
    - [ ] Update `db.ts` to handle version upgrade and migration from localStorage <!-- id: 14 -->
- [ ] Verify changes <!-- id: 10 -->
    - [ ] Verify application builds <!-- id: 11 -->
    - [ ] Verify functionality (add/list exercises) <!-- id: 12 -->
    - [ ] Verify data migration from localStorage <!-- id: 15 -->
