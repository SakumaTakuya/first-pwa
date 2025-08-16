# 機能仕様: 要求1 - 迅速な記録開始

## 1. 概要
本仕様書は、要求仕様書に記載された「要求1：迅速な記録開始」を満たすための技術的な実装計画を定義する。

---

# 機能仕様: 要求2 - 簡単な種目追加 (修正版)

## 1. 概要
本仕様は、ユーザーからの「可能な限り1画面で操作を完結させたい」というフィードバックを反映した修正版の実装計画である。
画面遷移を最小限に抑え、単一の画面上で種目の追加からセットの記録までをシームレスに行えるUI/UXを実現する。

---

# 機能仕様: 要求3 - 完了した記録の永続化

## 1. 概要
トレーニング完了時に、そのセッションの記録を永続的に保存する機能を実装する。これにより、ユーザーは過去のトレーニング履歴を後から参照できるようになる。

## 2. 技術選定
- **データベース**: ブラウザ内で大容量の構造化データを扱え、高速なクエリが可能な **IndexedDB** を採用する。
- **ライブラリ**: IndexedDBの複雑なAPIを簡易に扱うため、ラッパーライブラリである **`Dexie.js`** を利用する。

## 3. 実装詳細

### Step 1: `Dexie.js`の導入
- `npm install dexie` を実行し、ライブラリをプロジェクトに追加する。

### Step 2: データベースの定義ファイル作成
- **ファイルパス**: `src/lib/db.ts`
- **データベース名**: 他のアプリケーションとの衝突を避けるため、リバースドメイン形式（例: `com.sakumatakuya.first-pwa.db`）で命名する。
- **テーブル設計**:
  - `completedWorkouts` テーブルを定義する。
  - `++id`: `auto-increment`される主キー。
  - `date`: トレーニング日。検索パフォーマンス向上のためインデックスを設定する。
  - `exercises`: その日のトレーニング内容（オブジェクトの配列）。

```typescript
// src/lib/db.ts (イメージ)
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
```

### Step 3: 「トレーニング終了」処理のロジック変更
- **対象ファイル**: `src/app/session/ongoing/page.tsx` の `handleEndSession` 関数。
- **変更フロー**:
  1. `handleEndSession` が呼ばれたら、まず `session-store` から現在の `exercises` データを取得する。
  2. `db.completedWorkouts.add()` を使用し、取得したデータに `date` を加えてIndexedDBに保存する。
  3. IndexedDBへの保存が成功したら、`session-store` の `clearSession()` を呼び出して現在のセッション情報をクリアし、ホームページへリダイレクトする。
