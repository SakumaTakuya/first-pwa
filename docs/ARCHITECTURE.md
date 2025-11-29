# プロジェクトアーキテクチャ

このドキュメントでは、本プロジェクト（First PWA）のディレクトリ構成、技術スタック、および主要なアーキテクチャ上の決定事項について解説します。

## 1. ディレクトリ構成 (`src/`)

```
src/
├── app/            # Next.js App Routerのページコンポーネント
├── components/     # 再利用可能なUIコンポーネント
│   └── ui/         # shadcn/ui などの基本UIパーツ
├── data/           # モックデータや静的な定数データ
├── hooks/          # カスタムReactフック
├── lib/            # ユーティリティ関数、DB設定など
│   └── db.ts       # Dexie (IndexedDB) の設定とスキーマ定義
├── stores/         # Zustandによるグローバル状態管理
│   ├── master-data-store.ts # マスターデータのキャッシュや履歴管理
│   └── session-store.ts     # 現在進行中のワークアウト管理
```

## 2. 状態管理とデータ永続化の戦略

本プロジェクトでは、データの性質に応じて **Zustand** と **Dexie (IndexedDB)** を使い分けています。

### 判断基準マトリクス

| データ種別 | 推奨技術 | 理由 | 具体例 |
| :--- | :--- | :--- | :--- |
| **一時的なUI状態** | **Zustand** | 高速なレスポンスが必要で、永続化の重要度が低い（またはlocalStorageで十分）ため。 | モーダルの開閉、入力中のフォーム値、現在のタブ選択 |
| **進行中の作業 (Draft)** | **Zustand** | 頻繁に更新され、確定するまではDBに保存する必要がないため。 | **現在行っているワークアウト**（セット数、重量の編集中データ） |
| **マスターデータ** | **Dexie** | データ量が数千件以上に増える可能性があり、検索やフィルタリングが必要なため。 | **種目一覧** (`exercises`) |
| **履歴・ログデータ** | **Dexie** | 無限に蓄積されるデータであり、メモリ（Zustand）に全て載せるのはパフォーマンス上不適切なため。 | **完了したワークアウト** (`completedWorkouts`) |
| **ユーザー設定** | **Zustand** | データ量が小さく、アプリ起動時に即座に適用したいため（persist middlewareでlocalStorageに保存）。 | テーマ設定、表示設定 |

## 3. データベーススキーマ (Dexie)

`src/lib/db.ts` にて定義されています。

### `exercises` テーブル
種目のマスターデータを管理します。
- `id` (string, PK): 種目ID（例: `bench-press`）
- `name` (string): 種目名

### `completedWorkouts` テーブル
完了したトレーニングセッションを記録します。
- `id` (number, PK, AutoIncrement): ログID
- `date` (Date): 実施日時
- `exercises` (Array): 実施した種目とセット内容のスナップショット

## 4. データ移行 (Migration)

### ZustandからDexieへの移行
初期バージョンでは種目リストをZustandで管理していましたが、拡張性の観点からDexieへ移行しました。
`src/lib/db.ts` の `upgrade` ハンドラにて、以下のロジックでデータ移行を行っています。

1. **シードデータの投入**: `MOCK_EXERCISES` を初期データとして投入。
2. **ユーザーデータの引継ぎ**: `localStorage` に保存されている旧Zustandのデータを読み込み、カスタム種目があればDexieにマージします。

## 5. 主要技術スタック

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Dexie.js (IndexedDB wrapper)
- **UI Components**: Radix UI / shadcn/ui
