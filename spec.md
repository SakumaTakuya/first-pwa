# 機能仕様: 要求1 - 迅速な記録開始

(省略)

---

# 機能仕様: 要求2 - 簡単な種目追加 (修正版)

(省略)

---

# 機能仕様: 要求3 - 完了した記録の永続化

(省略)

---

# 機能仕様: 要求5 - トレーニング履歴の確認

(省略)

---

# 機能仕様: 要求6 - セット入力UI/UXの改善

(省略)

---

# 機能仕様: 要求7 - 記録済みセットの編集機能 (修正版)

(省略)

---

# 機能仕様: 要求8 - 仮想キーボードとフローティングボタンの共存 (JS版)

## 1. 課題と解決策
- **目的**: フローティングボタンが、OSの仮想キーボードと重ならないように動的に位置を調整する。
- **課題**: CSSの`env(keyboard-inset-height)`はiOS Safariでサポートされておらず、クロスブラウザでの確実な動作が見込めない。
- **解決策**: JavaScriptの`visualViewport` APIを利用する。このAPIは、キーボード表示時などに変化する実際の表示領域の情報を取得できるため、より確実にキーボードの高さを計算し、ボタンの位置を調整することが可能。

## 2. 設計方針
- **カスタムフック**: `visualViewport`の`resize`イベントを監視し、キーボードの高さを返すカスタムフック `useVirtualKeyboardHeight` を作成する。ロジックをコンポーネントから分離し、再利用性を高める。
- **動的スタイリング**: 作成したフックをコンポーネント内で利用し、取得したキーボードの高さをボタンの`style`属性（`bottom`プロパティ）に適用する。

## 3. 実装詳細

### Step 1: 不要なCSSの削除
- `src/app/globals.css` から、以前追加した `.floating-element` クラスを削除する。

### Step 2: カスタムフックの作成
- **ファイルパス**: `src/hooks/use-virtual-keyboard-height.ts`
- **ロジック**:
  - `useEffect`内で`window.visualViewport.addEventListener('resize', ...)`を登録する。
  - `resize`イベント発生時に、ビューポートの高さの差からキーボードの高さを計算し、stateに保存する。
  - コンポーネントのアンマウント時にイベントリスナーをクリーンアップする。
  - 計算したキーボードの高さを返す。

### Step 3: `OngoingSessionPage.tsx`への適用
- 作成した`useVirtualKeyboardHeight`フックをコンポーネント内で呼び出す。
- フローティングボタンを囲む`div`の`style`属性を動的に設定する。
  - 例: `style={{ bottom: `calc(1.5rem + ${keyboardHeight}px)` }}`
- これにより、キーボードが表示されると、その高さ分だけボタンの位置が上に押し上げられる。

---

# 機能仕様: レイアウト構造の改善とFABの配置

## 1. 概要
`position: fixed`を利用した現在のフローティングアクションボタン（FAB）の実装は、将来的なレイアウト変更（例: ナビゲーションバーの高さ変更）に対するメンテナンス性が低い。
この問題を解決するため、アプリケーション全体のレイアウト構造をCSS Flexboxベースにリファクタリングする。これにより、FABをビューポート（画面全体）ではなく、メインコンテンツエリアを基準に配置し、より堅牢でメンテナンス性の高い実装を実現する。

## 2. 実装詳細

### Step 1: `layout.tsx` の構造変更
アプリケーションのルートレイアウトを、ヘッダー・メイン・フッター（ナビゲーション）が柔軟に配置されるFlexboxコンテナに変更する。

- `<body>`タグに `className="flex flex-col h-screen"` を追加し、画面全体のFlexboxコンテナとする。
- `<main>`タグの`className`を`"pb-16"`から`"relative flex-grow overflow-y-auto"`に変更する。
- `<main>`タグに`style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}`を追加し、iOSのセーフエリアに対応する。

### Step 2: `globals.css` の修正
手動での高さ計算が不要になるため、以前追加した`--nav-height`変数は削除する。

### Step 3: `OngoingSessionPage.tsx` の修正
FABの配置方法を`fixed`から`absolute`に変更し、スタイルを簡潔にする。

- FABのコンテナ`<div>`の`className`から`fixed`を削除し、`absolute`を追加する。
- 複雑な計算を行っていた`style`属性を削除する。
- `bottom-6 right-6`のようなシンプルなTailwindクラスで位置を固定する。
- このレイアウト変更により、キーボード表示時の位置調整がブラウザによって自動的に行われるため、`useVirtualKeyboard`フックは不要になり、コンポーネントから削除する。

## 3. 期待される効果
- ナビゲーションバーの高さなど、レイアウトに関わる他の要素のサイズが変更されても、FABのCSSを修正する必要がなくなる。
- `calc()`やCSS変数を使った複雑な位置計算が不要になり、コードが大幅にシンプルになる。
- より宣言的で堅牢なレイアウト構造が実現される。

---

# 機能仕様: 2025-08-16 ステージングされたUI変更

## 1. 概要
UI/UX向上のため、アプリケーションの全体的なレイアウトとナビゲーション、および主要な操作ボタンの配置方法に関して、以下の変更がステージングされた。

## 2. 変更点詳細

### `src/app/layout.tsx`
- **目的**: モバイルデバイスでの表示を最適化し、アプリのような画面構成を実現する。
- **変更点**:
  - `viewport`メタタグに`viewport-fit=cover`を追加し、iPhone等のノッチがあるデバイスの画面全体を有効活用できるようにした。
  - `<body>`をFlexboxコンテナ (`flex flex-col h-screen`) とし、画面の高さいっぱいに広がるレイアウトに変更した。
  - `<main>`要素に`overflow-y-auto`を設定し、コンテンツエリアのみがスクロールするようにした。
  - iOSのセーフエリアを考慮し、`<main>`の下部に`env(safe-area-inset-bottom)`のパディングを追加した。

### `src/components/main-nav.tsx`
- **目的**: アプリケーションの主要動線を実態に合わせて更新する。
- **変更点**:
  - 「Home」に相当するナビゲーションリンクの遷移先を、`/`から`/session/ongoing`に変更した。
  - `position: fixed`による画面下部への固定配置を解除し、`<body>`のFlexboxレイアウトに従うようにした。

### `src/app/session/ongoing/page.tsx`
- **目的**: フローティングアクションボタン（FAB）のスクロール挙動を改善する。
- **変更点**:
  - FABのCSSプロパティを`position: fixed`から`position: sticky`に変更した。これにより、ボタンはコンテンツの末尾に配置され、スクロールして画面下部に到達すると、そこに「くっつく（stick）」ように留まる挙動になる。

---

# 機能仕様: セーフエリア対応（ボトムナビゲーション）

## 1. 課題
現在のレイアウトでは、ボトムナビゲーションバー（`MainNav`）が画面の最下部に配置されるため、iPhoneのようなホームインジケーターがあるデバイスでは、操作エリアが隠れてしまい、UI/UXを損なう可能性がある。

## 2. 解決方針
`padding`とCSSの`env(safe-area-inset-bottom)`変数を組み合わせ、ナビゲーションバーの背景は画面最下部まで伸ばしつつ、インタラクティブな要素（アイコンなど）は安全な領域に配置されるように修正する。

## 3. 実装詳細

### Step 1: `main-nav.tsx` のリファクタリング
ナビゲーションバーのコンポーネント構造を調整し、セーフエリア対応のパディングと、コンテンツ用のパディングを分離する。

- **変更前:**
  ```jsx
  <nav className="bg-surface border-t border-border p-4 z-30">
    <div className="flex justify-around items-center max-w-md mx-auto">
      {/* ... */}
    </div>
  </nav>
  ```

- **変更後:**
  - 親の`<nav>`から`p-4`を削除し、`style`属性で`padding-bottom`にセーフエリア変数を設定する。
  - 子の`<div>`に`p-4`を移動する。
  ```jsx
  <nav
    className="bg-surface border-t border-border z-30"
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
  >
    <div className="flex justify-around items-center max-w-md mx-auto p-4">
      {/* ... */}
    </div>
  </nav>
  ```

### Step 2: `layout.tsx` のクリーンアップ
`MainNav`側でセーフエリア対応を行うため、`<main>`要素に設定されていた冗長な`padding-bottom`を削除する。

- **対象ファイル:** `src/app/layout.tsx`
- **変更内容:** `<main>`要素の`style`属性を削除する。
```jsx
// 変更前
<main className="overflow-y-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>{children}</main>

// 変更後
<main className="overflow-y-auto">{children}</main>
```

---

# 機能仕様: 種目削除機能

## 1. 課題
トレーニングセッションに誤って追加してしまった種目を、安全かつ簡単に削除する手段が必要。ただし、操作が簡単すぎると、意図しない削除を誘発する危険性がある。

## 2. 解決方針
各エクササイズカードに「削除アイコン」を設置し、クリックすると`window.confirm`による確認ダイアログを表示する方式を採用する。これにより、誤操作を防ぎつつ、ユーザーが意図した時のみ削除を実行できる、安全で直感的なUIを実現する。

## 3. 実装詳細

### Step 1: 状態管理の更新 (`session-store.ts`)
セッションから特定の種目を削除するためのロジックをストアに追加する。

- **追加する関数**: `removeExerciseFromSession(sessionExerciseId: string)`
- **ロジック**: `exercises`配列から、指定された`id`に一致する要素を`filter`で除外して状態を更新する。

### Step 2: UIコンポーネントの修正 (`exercise-card.tsx`)
ユーザーが操作する削除ボタンをUIに追加する。

- **アイコンボタンの追加**: 種目名の横に、`lucide-react`の`Trash2`アイコンを使用したボタンを配置する。
- **クリックイベント**: 
  1. ボタンがクリックされると、`window.confirm`で「`[種目名]`を削除しますか？」という確認ダイアログを表示する。
  2. ユーザーが「OK」を選択した場合、`removeExerciseFromSession`関数を呼び出して該当種目を削除する。
