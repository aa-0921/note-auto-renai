# 既存スクリプト仕様書

## スクリプト一覧と仕様

### 1. autoCreateAndDraftNote.js

**機能**: AIで記事を生成し、note.comに下書き保存
**引数**:

- `--bg`: バックグラウンド実行（headlessモード）
  **環境変数**:
- `OPENROUTER_API_KEY`: AI APIキー
- `NOTE_EMAIL`: note.comのメールアドレス
- `NOTE_PASSWORD`: note.comのパスワード
  **出力**: コンソールログ（記事タイトル、生成状況など）

### 2. autoPublishNotes.js

**機能**: 下書き記事を自動投稿
**引数**:

- `--bg`: バックグラウンド実行（headlessモード）
  **環境変数**:
- `NOTE_EMAIL`: note.comのメールアドレス
- `NOTE_PASSWORD`: note.comのパスワード
  **出力**: コンソールログ（投稿状況など）

### 3. likeUnlikedNotes.js

**機能**: 検索結果から記事にいいね
**引数**:

- `--bg`: バックグラウンド実行（headlessモード）
  **環境変数**:
- `NOTE_EMAIL`: note.comのメールアドレス
- `NOTE_PASSWORD`: note.comのパスワード
  **出力**: コンソールログ（いいね状況など）

### 4. likeNotesByUrl.js

**機能**: 指定URLの記事にいいね
**引数**:

- `--bg`: バックグラウンド実行（headlessモード）
- `URL`: いいねする記事のURL
  **環境変数**:
- `NOTE_EMAIL`: note.comのメールアドレス
- `NOTE_PASSWORD`: note.comのパスワード
  **出力**: コンソールログ（いいね状況など）

### 5. follow/followFromArticles.js

**機能**: 記事からユーザーをフォロー
**引数**:

- `--bg`: バックグラウンド実行（headlessモード）
  **環境変数**:
- `NOTE_EMAIL`: note.comのメールアドレス
- `NOTE_PASSWORD`: note.comのパスワード
  **出力**: コンソールログ（フォロー状況など）

### 6. noteAutoDraftAndSheetUpdate.js

**機能**: 管理表から記事を読み込んで下書き保存
**引数**: なし（直接実行）
**環境変数**:

- `NOTE_EMAIL`: note.comのメールアドレス
- `NOTE_PASSWORD`: note.comのパスワード
  **出力**: コンソールログ（下書き保存状況など）

## 共通パターン

### 引数処理

- `--bg`フラグでheadlessモード切り替え
- `process.argv`でコマンドライン引数を解析

### Puppeteer設定

- headlessモード: `--bg`フラグで制御
- 共通の起動オプション（sandbox無効化、GPU無効化など）

### ログイン処理

- `login()`関数でnote.comにログイン
- 環境変数から認証情報を取得

### エラーハンドリング

- try-catch文でエラーキャッチ
- コンソールログで状況報告
