# ウォークスルー - masterExerciseListのDexieへの移行

`masterExerciseList`をZustandからDexie (IndexedDB) へ移行しました。これにより、より大規模で永続的な種目データベースを扱うことが可能になり、拡張性が向上しました。
また、既存ユーザーのデータを保護するため、`localStorage`からのデータ移行ロジックを実装しました。

## 変更点

### データ層
- **`src/lib/db.ts`の更新**:
    - `Exercise`インターフェースを追加しました。
    - バージョン管理を導入しました：
        - **Version 1**: 既存の`completedWorkouts`のみ。
        - **Version 2**: `exercises`テーブルを追加。
    - **データ移行ロジック**:
        - Version 2へのアップグレード時に、`MOCK_EXERCISES`をシードします。
        - さらに、`localStorage`に保存されているZustandのデータ（`master-data-storage`）を読み込み、カスタム種目をDexieにマージします。

### 状態管理
- **`src/stores/master-data-store.ts`の更新**:
    - Zustandストアから`masterExerciseList`と`addNewExerciseToMasterList`を削除しました。
    - ストアは`exerciseHistory`のみを管理するようになりました。

### コンポーネント
- **`src/components/add-exercise-modal.tsx`の更新**:
    - ストアの`masterExerciseList`の使用を、`dexie-react-hooks`の`useLiveQuery`に置き換え、データベースから種目を取得するようにしました。
    - `handleAddNewExercise`を更新し、新しい種目を直接Dexieデータベースに追加するようにしました。

## 検証結果

### 自動テスト
- `npm run build`: **合格**
- `npm run lint`: **合格**

### 手動検証手順
1.  **アプリケーションを開く**: ブラウザでアプリケーションを読み込みます。
2.  **「種目を追加」モーダルを開く**: セッションに移動し、「種目を追加」をクリックします。
3.  **リストの確認**: 種目リストが表示されていることを確認します（モックデータからシードされているはずです）。
4.  **新しい種目の追加**: 検索バーに新しい種目名を入力し、「新しい種目として追加」をクリックします。
5.  **永続性の確認**: ページをリロードして再度モーダルを開きます。新しい種目がリストに残っていることを確認します。

### データ移行の検証（既存ユーザー向け）
もし既存のデータがある状態でテストしたい場合は、以下の手順を実行してください：
1.  DevToolsのApplicationタブでIndexedDBを削除します。
2.  LocalStorageに`master-data-storage`というキーで、`{"state":{"masterExerciseList":[{"id":"custom-ex","name":"カスタム種目"}]}}`のようなデータを保存します。
3.  ページをリロードします。
4.  「種目を追加」モーダルを開き、「カスタム種目」がリストに含まれていることを確認します。
