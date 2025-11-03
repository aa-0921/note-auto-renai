# Twitter Amazon売れ筋ランキング投稿 使い方

## 📖 概要

Amazon売れ筋ランキングリンクをTwitterに自動投稿するスクリプトです。`amazonTopSellersRankingLinks`からランダムに1つのカテゴリを選択し、**URLに対応した画像を自動的に取得**してフォーマットされたツイートを投稿します。

---

## ✨ 機能

- `amazonTopSellersRankingLinks`からランダムに1つのカテゴリを選択
- 280文字以内に収まるようにフォーマット
- **AmazonのURLから画像を自動取得**して画像付きツイートを投稿 🎉
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

## 🖼️ 画像自動取得機能

スクリプトは**AmazonのURLから自動的に画像を取得**し、画像付きツイートを投稿します。

### 動作フロー

1. **HTMLを取得**: AmazonのランキングページにアクセスしてHTMLを取得
2. **画像を検出**: ページ内の商品画像要素（`.s-image`など）を探索
3. **画像をダウンロード**: 見つかった画像をダウンロード（BufferとMIMEタイプを取得）
4. **Twitterに投稿**: Twitter API v1.1でメディアをアップロードし、画像付きツイートを投稿

### メリット

- ✅ **視認性が高い**: 画像付きツイートはクリック率が高い
- ✅ **完全自動**: 画像を手動で準備する必要がない
- ✅ **最新の画像**: Amazonの最新の商品画像が自動的に使用される

---

## 📝 投稿フォーマット

```
{カテゴリタイトル}

{説明1行目}
{説明2行目}

#amazon #アマゾン #ランキング #ranking

↓↓↓↓

{AmazonアフィリエイトURL}
```

**+ 画像（Amazonから自動取得）** 📷

### 投稿例

```
ビューティーの売れ筋ランキング

人気のコスメ・スキンケアをチェック！💄✨
美容に関心のある方必見！今注目のアイテムが見つかります😊

#amazon #アマゾン #ランキング #ranking

↓↓↓↓

https://www.amazon.co.jp/gp/bestsellers/beauty?&linkCode=ll2&tag=counselor888a-22&linkId=...
```

**+ 画像**: Amazonから自動取得された商品画像が添付されます 📷

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

### Dryrunモード（画像取得あり）

```
[2025/11/03 16:40:21] [INFO] ========================================
[2025/11/03 16:40:21] [INFO] 📷 画像取得処理
[2025/11/03 16:40:21] [INFO] ========================================
[2025/11/03 16:40:21] [INFO] 🔍 URLからOGP画像を取得しています...
[2025/11/03 16:40:23] [INFO] 🔍 ページ内のmetaタグを確認しています...
[2025/11/03 16:40:23] [INFO] OGP/Twitterメタタグが見つかりませんでした
[2025/11/03 16:40:23] [INFO] 🔍 ページ内の画像要素を探しています...
[2025/11/03 16:40:23] [INFO] ✅ ページ内から画像を発見: https://m.media-amazon.com/images/I/31MkSSIX5+L.png...
[2025/11/03 16:40:23] [INFO] 📥 画像をダウンロードしています...
[2025/11/03 16:40:23] [INFO] ✅ 画像をダウンロードしました（サイズ: 15.54 KB, タイプ: image/png）
[2025/11/03 16:40:23] [INFO] ✅ 画像取得成功: 15.54 KB (image/png)
```

### 実際の投稿（画像付き）

```
[2025/11/03 16:41:26] [INFO] 📤 ツイート投稿処理
[2025/11/03 16:41:26] [INFO] 📷 画像付きでツイートを投稿しています...
[2025/11/03 16:41:26] [INFO] メディアをアップロードしています...
[2025/11/03 16:41:27] [INFO] メディアアップロード完了: 1985250956293132288
[2025/11/03 16:41:27] [INFO] 画像付きツイートの投稿に成功しました
[2025/11/03 16:41:27] [INFO] ✅ ツイート投稿成功！
[2025/11/03 16:41:27] [INFO] ツイートID: 1985250959791190152
[2025/11/03 16:41:27] [INFO] ツイートURL: https://twitter.com/_counselor_risa/status/1985250959791190152
[2025/11/03 16:41:27] [INFO] 画像サイズ: 15.54 KB (image/png)
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

