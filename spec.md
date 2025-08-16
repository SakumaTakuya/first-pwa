# 機能仕様: 要求1 - 迅速な記録開始

## 1. 概要
本仕様書は、要求仕様書に記載された「要求1：迅速な記録開始」を満たすための技術的な実装計画を定義する。

主な実装内容は以下の通り。
- 状態管理ライブラリ `zustand` を用いたトレーニングセッションの状態管理機構の構築。
- ユーザーがアプリを開いた際の、進行中セッションの有無に応じた適切な画面への振り分け。
- 新規トレーニング開始から種目選択画面へのスムーズな画面遷移。

## 2. 実装詳細

### Step 1: 状態管理（Zustand）
トレーニングセッションの状態をグローバルに管理するため、`zustand`ストアを導入する。

- **ファイルパス**: `src/stores/session-store.ts`
- **ストア定義**:
  - `isActive` (boolean): トレーニングセッションが進行中かを示すフラグ。
  - `startSession` (function): `isActive`を`true`に設定し、セッションを開始するメソッド。
- **永続化**:
  - `zustand`の`persist`ミドルウェアを使用し、ストアの状態をブラウザの`localStorage`に保存する。これにより、アプリを再起動しても進行中のセッション状態が復元される。
  - ストレージキー: `workout-session-storage`

### Step 2: ホーム画面（`src/app/page.tsx`）
アプリケーションのエントリーポイントとして、ユーザーを適切な画面へ案内する役割を担う。

### Step 3: 新規ページ作成（プレースホルダー）
画面遷移の確認を目的として、以下の2つのページを最小限の構成で作成する。

#### 3.1. 種目選択画面
- **ファイルパス**: `src/app/session/select-exercise/page.tsx`

#### 3.2. 進行中のセッション画面
- **ファイルパス**: `src/app/session/ongoing/page.tsx`

---

# 機能仕様: 要求2 - 簡単な種目追加 (修正版)

## 1. 概要
本仕様は、ユーザーからの「可能な限り1画面で操作を完結させたい」というフィードバックを反映した修正版の実装計画である。
画面遷移を最小限に抑え、単一の画面上で種目の追加からセットの記録までをシームレスに行えるUI/UXを実現する。

## 2. コンセプト
独立した「種目選択ページ」を廃止し、「トレーニング進行中（`/session/ongoing`）」ページを記録のハブとする。種目の追加はモーダルダイアログ内で行い、セットの記録はメイン画面の各種目リスト内で直接行う。

## 3. 実装詳細

### Step 1: 状態管理の拡張

#### 1.1. `session-store.ts` の機能強化
- `exercises` 配列が、セットの情報も保持できるようにインターフェースを更新する。
- `addSetToExercise(exerciseId, set)`: 特定の種目に新しいセットを記録するメソッドを追加する。

```typescript
// src/stores/session-store.ts (更新後イメージ)
interface Set {
  reps: number;
  weight: number;
}

interface SessionExercise {
  exerciseId: string;
  exerciseName: string;
  sets: Set[];
}

interface SessionState {
  isActive: boolean;
  exercises: SessionExercise[];
  startSession: () => void;
  addExerciseToSession: (exercise: { id: string; name: string }) => void;
  addSetToExercise: (exerciseId: string, set: Set) => void;
}
```

#### 1.2. `master-data-store.ts` の新規作成
- `masterExerciseList`: 全ての種目のマスターデータ。初期値として `src/data/mock-exercises.ts` を使用。
- `exerciseHistory`: ユーザーが過去に記録した種目IDの配列。
- `addExerciseToHistory(exerciseId)`: 履歴に種目IDを追加するメソッド。
- `addNewExerciseToMasterList(exerciseName)`: 新しい種目をマスターリストに追加するメソッド。
- `zustand`の`persist`ミドルウェアで永続化する。

### Step 2: メイン画面 (`/session/ongoing/page.tsx`) の実装
この画面がトレーニング記録の中心となる。

- **基本レイアウト**:
  - `session-store`から`exercises`リストを取得し、一覧表示する。
  - 各 `SessionExercise` はカードとして表示され、中には「記録済みセットリスト」と「新規セット入力フォーム（重量・回数）」、「セットを追加ボタン」が含まれる。
  - 画面下部には「種目を追加」ボタンをフローティングまたは固定で配置する。

- **種目追加モーダル**:
  - 「種目を追加」ボタンをタップすると、フルスクリーンのモーダルが開く。
  - モーダル内には以下の要素を配置する。（受け入れ基準 2.1, 2.3, 2.4）
    - 種目検索バー
    - 履歴リスト (`master-data-store`から取得)
    - 検索結果に応じた種目一覧
    - 検索結果がない場合の「新しい種目として追加」オプション

- **操作フロー**:
  1. ユーザーがモーダル内で種目を選択する。
  2. モーダルが閉じる。
  3. `addExerciseToSession`が呼ばれ、メイン画面のリストに新しい種目カードが追加される。**画面遷移は発生しない**。（受け入れ基準 2.2）
  4. ユーザーはそのまま追加された種目のセット入力を開始できる。
  5. ユーザーが重量・回数を入力し「セットを追加」ボタンを押すと、`addSetToExercise`が呼ばれ、同カード内の記録済みセットリストが更新される。

## 4. 受け入れ基準との対応

| 受け入れ基準 | 実装内容 |
| :--- | :--- |
| 2.1: 履歴表示 | Step 2: 種目追加モーダル内に「履歴リスト」を表示することで対応。 |
| 2.2: 種目タップでログ追加と入力画面へ | Step 2: モーダルで種目を選択すると、**同一画面上**にその種目の入力フォームが表示される形で対応。即座に入力に移れる。 |
| 2.3: リアルタイム検索 | Step 2: モーダル内の検索バーの入力値に応じて、種目一覧をリアルタイムでフィルタリングすることで対応。 |
| 2.4: 新規種目追加オプション | Step 2: モーダル内で検索結果が0件の場合に、新規追加オプションを表示することで対応。 |