# note-auto-core

共通のnote自動化ライブラリ

## 概要

複数のnoteアカウントで同種の自動処理を運用するための共通ライブラリです。
各アカウント側は最小限の差分設定のみで維持・拡張できるように設計されています。

## 機能

- **記事の自動生成**: AIを使用した記事の自動生成
- **下書き保存**: note.comへの下書き自動保存
- **記事の自動投稿**: 下書きからの自動投稿
- **いいね機能**: 指定された記事へのいいね
- **フォロー機能**: 記事からユーザーの自動フォロー
- **設定駆動**: YAML設定ファイルによる柔軟な設定管理

## インストール

```bash
npm install @aa-0921/note-auto-core
```

## 使用方法

### 基本的な使用方法

```javascript
import NoteAutomationCore from '@aa-0921/note-auto-core';

const core = new NoteAutomationCore('config/account.yaml');
await core.initialize();

// いいね機能の実行
await core.runLikeUnlikedNotes({ background: true });

// 記事の自動投稿
await core.runAutoPublishNotes({ background: true });

// フォロー機能
await core.runFollowFromArticles({ background: true });

// 特定URLへのいいね
await core.runLikeNotesByUrl('https://note.com/example', { background: true });

// 記事の自動生成と下書き保存
await core.runAutoCreateAndDraftNote({ background: true });

await core.cleanup();
```

### CLI使用

```bash
# いいね機能
npx note-core like-unliked --bg

# 記事投稿
npx note-core publish --bg

# フォロー
npx note-core follow --bg

# 特定URLへのいいね
npx note-core like-url --bg https://note.com/example
```

## 設定

### アカウント設定 (config/account.yaml)

```yaml
genre: 'renai'
locale: 'ja-JP'
posting:
  time_window: ['09:00', '11:00']
  days: [Mon, Tue, Wed, Thu, Fri]
ai:
  provider: 'openrouter'
  model: 'deepseek/deepseek-chat-v3.1:free'
  temperature: 0.7
note:
  login_method: 'email_password'
sheets:
  enabled: true
```

### 検索ワードの指定方法（アカウント側スクリプト）

アカウント側で `options.searchWords` に配列を渡してください。未指定時はコアの既定語彙にフォールバックします。

```javascript
// likeUnlikedNotes.js（アカウント側）
import { runWithCore } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    const searchWords = ['恋愛', '人間関係', '自己肯定感'];
    await core.runLikeUnlikedNotes({
      background: wantsBackground,
      searchWords,
    });
  });
})();
```

### スケジュール設定 (config/schedule.yaml)

```yaml
scripts:
  likeUnlikedNotes:
    frequency: 'daily'
    time_offset: 0
    max_likes: 24
  autoPublishNotes:
    frequency: 'weekdays'
    time_offset: 5
    post_limit: 1
```

## 環境変数

```bash
# note.com認証情報
NOTE_EMAIL=your-email@example.com
NOTE_PASSWORD=your-password

# AI API設定
OPENROUTER_API_KEY=your-api-key

# AWS Lambda設定（オプション）
AWS_LAMBDA_FUNCTION_NAME=your-function-name
```

## ライセンス

MIT

## 開発者

aa-0921
