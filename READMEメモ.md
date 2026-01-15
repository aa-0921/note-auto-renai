# note-auto-hakushikisan

何でも知ってる博識さん系note自動化スクリプト

## 📝 概要

このプロジェクトは、note.comでの記事投稿やTwitter投稿を自動化するためのスクリプト集です。`@aa-0921/note-auto-core` ライブラリを使用しています。

## 🚀 主な機能

- **記事の自動生成と投稿**: AIを使用した記事の自動生成とnoteへの投稿
- **いいね機能**: 指定された記事への自動いいね
- **フォロー機能**: 記事からユーザーの自動フォロー
- **Amazonランキング記事生成**: Amazon売れ筋ランキングから記事を自動生成
- **Twitter投稿**: アフィリエイトリンクをTwitterへ自動投稿 ⭐ NEW

## 📦 インストール

```bash
npm install
```

## ⚙️ 環境変数の設定

`.env` ファイルを作成し、以下の環境変数を設定してください：

```bash
# note.com認証情報
NOTE_EMAIL=your-email@example.com
NOTE_PASSWORD=your-password
NOTE_ACCOUNT_NAME=hakushiki_san

# Twitter認証情報
TWITTER_PASSWORD=your-twitter-password
TWITTER_USER_NAME=your-twitter-username  # 追加認証用（オプション）

# AI API設定
OPENROUTER_API_KEY=your-api-key
```

**重要：** Twitter投稿機能を使用する場合、`NOTE_ACCOUNT_NAME` は必須です。未設定の場合はエラーになります。

## 📚 使用方法

### 基本的なスクリプト

```bash
# 記事の自動生成と下書き保存
npm run autoCreateAndDraftNote

# 下書き記事の自動投稿
npm run autoPublishNotes

# いいね機能
npm run likeUnlikedNotes

# フォロー機能
npm run followFromArticles

# Amazonランキング記事生成
npm run createAmazonTopSellersRankingNote
```

### Twitter投稿機能 ⭐ NEW

アフィリエイトリンクをTwitterに投稿できます。

```bash
# ランダムに3件投稿（デフォルト）
npm run twitterPostAffiliateLinks

# ランダムに5件投稿
node scripts/twitterPostAffiliateLinks.js --random 5

# すべてのアフィリエイトリンクを投稿（60秒間隔）
node scripts/twitterPostAffiliateLinks.js --all --interval 60

# 特定のインデックスを指定して投稿
node scripts/twitterPostAffiliateLinks.js --index 0

# ヘッドレスモードで実行
node scripts/twitterPostAffiliateLinks.js --random 3 --headless
```

詳細な使用方法は [TWITTER_POST_USAGE.md](./TWITTER_POST_USAGE.md) を参照してください。

## 📖 ドキュメント

- [TWITTER_POST_USAGE.md](./TWITTER_POST_USAGE.md) - Twitter投稿機能の詳細な使用方法
- [AMAZON_RANKING_USAGE.md](./AMAZON_RANKING_USAGE.md) - Amazonランキング記事生成の使用方法

## 🔧 設定ファイル

### `config/account.yaml`

アカウント固有の設定を管理します。

```yaml
genre: "renai"
locale: "ja-JP"
posting:
  time_window: ["09:00", "11:00"]
  days: [Mon, Tue, Wed, Thu, Fri]
ai:
  provider: "openrouter"
  model: "deepseek/deepseek-chat-v3.1:free"
  temperature: 0.7
```

### `scripts/affiliateConfig.js`

アフィリエイトリンクの設定を管理します。Twitter投稿やnote記事に使用されます。

### `scripts/twitterConfig.js`

Twitter投稿の設定を管理します。投稿間隔や投稿数などをカスタマイズできます。

## 🎯 ベストプラクティス

### Twitter投稿

- 投稿間隔は最低30秒以上を推奨
- 1日あたりの投稿数は10〜20件以内に抑える
- ヘッドレスモードで自動化する場合は `--headless` オプションを使用

### note記事投稿

- 投稿時間帯は `config/account.yaml` で設定
- AI APIのレート制限に注意

## 📝 スクリプト一覧

| スクリプト | 説明 |
|----------|------|
| `autoCreateAndDraftNote` | AIを使用した記事の自動生成と下書き保存 |
| `autoPublishNotes` | 下書き記事の自動投稿 |
| `likeUnlikedNotes` | いいね機能 |
| `likeNotesByUrl` | 特定URLへのいいね |
| `followFromArticles` | フォロー機能 |
| `createAmazonTopSellersRankingNote` | Amazonランキング記事生成 |
| `twitterPostAffiliateLinks` | Twitter投稿機能 ⭐ NEW |

## 🤝 サポート

問題が発生した場合は、GitHubのIssueで報告してください。

## 📄 ライセンス

MIT License

## 🔗 関連リポジトリ

- [@aa-0921/note-auto-core](https://github.com/aa-0921/note-auto-core) - 共通ライブラリ
