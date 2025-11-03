# Twitter Amazon売れ筋ランキング投稿 使い方

## 📖 概要

Amazon売れ筋ランキングリンクをTwitterに自動投稿するスクリプトです。`amazonTopSellersRankingLinks`からランダムに1つのカテゴリを選択し、フォーマットされたツイートを投稿します。

---

## ✨ 機能

- `amazonTopSellersRankingLinks`からランダムに1つのカテゴリを選択
- 280文字以内に収まるようにフォーマット
- Twitter API v2を使用した投稿
- Dryrunモードで投稿内容を確認可能

---

## 🚀 使い方

### 1. Dryrunモード（投稿内容の確認）

投稿せずに内容を確認する場合：

```bash
node scripts/twitterPostAmazonRanking.js --dryrun
```

または

```bash
npm run twitterPostAmazonRanking -- --dryrun
```

### 2. 実際に投稿

```bash
node scripts/twitterPostAmazonRanking.js
```

または

```bash
npm run twitterPostAmazonRanking
```

---

## 📝 投稿フォーマット

```
{カテゴリタイトル}

{説明1行目}
{説明2行目}

{AmazonアフィリエイトURL}

#amazon #アマゾン #ランキング #ranking
```

### 投稿例

```
ドラッグストアの売れ筋ランキング

人気の医薬品・健康グッズをチェック！💊✨
健康維持に役立つアイテムが満載です😊

https://www.amazon.co.jp/gp/bestsellers/hpc?&linkCode=ll2&tag=counselor888a-22&linkId=92fbb8876beecfa0c8d990d9c045aa51&language=ja_JP&ref_=as_li_ss_tl

#amazon #アマゾン #ランキング #ranking
```

---

## 📦 対象カテゴリ

`scripts/affiliateConfig.js`の`amazonTopSellersRankingLinks`に定義されている全カテゴリからランダムに選択されます：

- Prime Video
- Kindleストア
- 食品・飲料・お酒
- ホーム&キッチン
- ドラッグストア
- ビューティー
- ファッション
- パソコン・周辺機器
- 家電&カメラ
- おもちゃ
- スポーツ&アウトドア
- ベビー&マタニティ
- ...など

---

## ⚙️ 環境変数

`.env`ファイルに以下の環境変数を設定してください：

```bash
# Twitter API v2認証情報
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
TWITTER_BEARER_TOKEN=your_bearer_token
```

---

## 🔄 定期実行

GitHub Actionsやcronで定期実行する場合の例：

### GitHub Actions（毎日午前10時）

```yaml
name: Twitter Amazon Ranking Post

on:
  schedule:
    - cron: '0 1 * * *' # UTC 1:00 = JST 10:00
  workflow_dispatch: # 手動実行も可能

jobs:
  post:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Post Amazon Ranking
        env:
          TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
          TWITTER_API_SECRET: ${{ secrets.TWITTER_API_SECRET }}
          TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
          TWITTER_BEARER_TOKEN: ${{ secrets.TWITTER_BEARER_TOKEN }}
        run: node scripts/twitterPostAmazonRanking.js
```

---

## 📋 ログ出力例

### Dryrunモード

```
[2025/11/03 16:23:24] [INFO] ========================================
[2025/11/03 16:23:24] [INFO] Amazon売れ筋ランキング Twitter投稿スクリプト
[2025/11/03 16:23:24] [INFO] ========================================
[2025/11/03 16:23:24] [INFO] 
[2025/11/03 16:23:24] [INFO] ✅ TwitterAPIクライアントを作成しました
[2025/11/03 16:23:24] [INFO] ✅ クライアントを初期化しました
[2025/11/03 16:23:24] [INFO] 🔍 認証情報を確認しています...
[2025/11/03 16:23:24] [INFO] ✅ 認証成功！
[2025/11/03 16:23:24] [INFO] 🎲 ランキングリンクをランダムに選択しています...
[2025/11/03 16:23:24] [INFO] 
[2025/11/03 16:23:24] [INFO] ========================================
[2025/11/03 16:23:24] [INFO] 📝 投稿内容
[2025/11/03 16:23:24] [INFO] ========================================
[2025/11/03 16:23:24] [INFO] 
食品・飲料・お酒の売れ筋ランキング

人気の食品・飲料・お酒をチェック！🍽️✨
美味しいグルメや話題のドリンクが見つかります😊

https://www.amazon.co.jp/gp/bestsellers/food-beverage?&linkCode=ll2&tag=counselor888a-22&linkId=2e1b3651ef6f32c56cdb8207b592c0d9&language=ja_JP&ref_=as_li_ss_tl

#amazon #アマゾン #ランキング #ranking
[2025/11/03 16:23:24] [INFO] 
[2025/11/03 16:23:24] [INFO] 文字数: 265文字
[2025/11/03 16:23:24] [INFO] 🔍 Dryrunモード: 投稿はスキップされました
```

### 実際の投稿

```
[2025/11/03 16:24:04] [INFO] ✅ 認証成功！
[2025/11/03 16:24:04] [INFO] 🎲 ランキングリンクをランダムに選択しています...
[2025/11/03 16:24:04] [INFO] 📝 投稿内容
[2025/11/03 16:24:04] [INFO] 文字数: 242文字
[2025/11/03 16:24:04] [INFO] 📤 ツイートを投稿しています...
[2025/11/03 16:24:05] [INFO] ✅ ツイート投稿成功！
[2025/11/03 16:24:05] [INFO] ツイートID: 1985246586172276889
[2025/11/03 16:24:05] [INFO] ツイートURL: https://twitter.com/_counselor_risa/status/1985246586172276889
```

---

## 🛠️ カスタマイズ

### カテゴリの追加・編集

`scripts/affiliateConfig.js`の`amazonTopSellersRankingLinks`配列を編集してください。

### フォーマットの変更

`scripts/twitterPostAmazonRanking.js`の`createTweetText`関数を編集してください。

---

## 📌 注意事項

- Twitterの文字数制限は280文字です
- 現在のフォーマットでは、説明は最初の2行のみ使用されます
- URLはTwitterにより自動的に短縮されます（`t.co`形式）
- 投稿頻度に注意してください（Twitter APIのレート制限があります）

---

## 🐛 トラブルシューティング

### エラー: 環境変数が設定されていません

`.env`ファイルにTwitter API認証情報を追加してください。

### エラー: Request failed with code 403

Twitter Appの権限を確認してください。「Read and Write」権限が必要です。

### 文字数が280文字を超える

`createTweetText`関数で使用する説明行の数を減らすか、フォーマットを調整してください。

---

## 📚 関連ファイル

- `scripts/twitterPostAmazonRanking.js` - メインスクリプト
- `scripts/affiliateConfig.js` - アフィリエイトリンク設定
- `src/core/TwitterAPIClient.js` (note-auto-core) - Twitter API v2クライアント

---

現在使用中のモデル: Claude Sonnet 4.5

