# Implement Data Export/Import Feature

## Goal Description
Implement a feature to export and import all local application data (Zustand state and Dexie database) to/from a JSON file. This allows users to backup and restore their data. Additionally, setup unit tests to ensure the reliability of the backup logic.

## User Review Required
- [ ] Confirm where the export/import button should be placed. -> **Settings Modal accessible from Header.**

## Proposed Changes
### Infrastructure
- Install `jest`, `ts-jest`, `@types/jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/dom`.
- Configure `jest.config.js` or `jest.config.ts`.

### Logic
#### [NEW] [src/lib/backup.ts](file:///Users/sakumatakuya/src/github.com/SakumaTakuya/test-next-pwa/first-pwa/src/lib/backup.ts)
- `exportData()`:
    - Fetch `master-data-storage` and `session-storage` from `localStorage`.
    - Fetch all records from `completedWorkouts` and `exercises` (if exists) from Dexie.
    - Return JSON object.
- `importData(jsonData)`:
    - Validate JSON structure.
    - Restore `localStorage` items.
    - Clear and bulkAdd records to Dexie tables.
    - Reload page to apply changes.

#### [NEW] [src/lib/backup.test.ts](file:///Users/sakumatakuya/src/github.com/SakumaTakuya/test-next-pwa/first-pwa/src/lib/backup.test.ts)
- Unit tests for `exportData` and `importData`.
- Mock `localStorage` and `Dexie`.

### UI
#### [NEW] [src/components/settings-modal.tsx](file:///Users/sakumatakuya/src/github.com/SakumaTakuya/test-next-pwa/first-pwa/src/components/settings-modal.tsx)
- "Data Management" section.
- "Export Data" button (Download JSON).
- "Import Data" button (File Input).

#### [MODIFY] [src/app/page.tsx](file:///Users/sakumatakuya/src/github.com/SakumaTakuya/test-next-pwa/first-pwa/src/app/page.tsx)
- Add Settings icon to Header.

## Verification Plan
### Automated Tests
- Run `npm run test` to verify `backup.test.ts`.

### Manual Verification
1. **Export**: Add data, export, check file content.
2. **Import**: Clear data, import file, verify data is restored.
