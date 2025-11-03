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

## 📸 スクリーンショット自動取得機能

スクリプトは**Puppeteerを使ってAmazonのランキングページのスクリーンショットを自動取得**し、画像付きツイートを投稿します。

### 動作フロー

1. **Puppeteer起動**: ヘッドレスブラウザを起動
2. **ページアクセス**: Amazonのランキングページへアクセス
3. **レンダリング待機**: ページが完全に読み込まれるまで待機
4. **自動スクロール**: 「〇〇の売れ筋ランキング」見出しまで自動スクロール 📜
   - XPathで「売れ筋ランキング」を含む見出しを検索
   - 複数のセレクタパターンで要素を検出
   - 見出しが見つからない場合は300pxスクロール
5. **スクリーンショット撮影**: 1200x675px（16:9比率）でスクリーンショットを撮影
6. **Twitterに投稿**: Twitter API v1.1でメディアをアップロードし、画像付きツイートを投稿
7. **クリーンアップ**: ブラウザを閉じてリソースを解放

### メリット

- ✅ **視認性が高い**: 画像付きツイートはクリック率が高い
- ✅ **完全自動**: 画像を手動で準備する必要がない
- ✅ **実際のページ**: Amazonの実際のランキングページが表示される
- ✅ **わかりやすい**: スクリーンショットなので、どんなページかすぐわかる
- ✅ **最適な構図**: ランキング見出しが画面内に収まるよう自動スクロール 📜

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

**+ スクリーンショット画像（Puppeteerで自動撮影）** 📸

### 投稿例

```
ビューティーの売れ筋ランキング

人気のコスメ・スキンケアをチェック！💄✨
美容に関心のある方必見！今注目のアイテムが見つかります😊

#amazon #アマゾン #ランキング #ranking

↓↓↓↓

https://www.amazon.co.jp/gp/bestsellers/beauty?&linkCode=ll2&tag=counselor888a-22&linkId=...
```

**+ 画像**: Amazonランキングページのスクリーンショット（1200x675px）が添付されます 📸

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

### Dryrunモード（スクリーンショット取得あり）

```
[2025/11/03 16:55:35] [INFO] 📸 Puppeteerでスクリーンショットを取得します...
[2025/11/03 16:55:36] [INFO] ✅ Puppeteerを初期化しました
[2025/11/03 16:55:36] [INFO] ✅ ページを作成しました
[2025/11/03 16:55:36] [INFO] 🌐 Amazonランキングページへアクセスしています...
[2025/11/03 16:55:38] [INFO] ✅ ページの読み込みが完了しました
[2025/11/03 16:55:40] [INFO] 📜 ランキング見出しまでスクロールしています...
[2025/11/03 16:55:40] [INFO] ✅ ランキング要素を発見: [id*="zg_banner_text"]
[2025/11/03 16:55:42] [INFO] ✅ スクロールが完了しました
[2025/11/03 16:55:42] [INFO] 📷 スクリーンショットを撮影しています...
[2025/11/03 16:55:42] [INFO] ✅ スクリーンショットを取得しました（サイズ: 70.80 KB, タイプ: image/jpeg）
[2025/11/03 16:55:42] [INFO] ブラウザを閉じました
[2025/11/03 16:55:42] [INFO] ✅ Puppeteerをクリーンアップしました
[2025/11/03 16:55:42] [INFO] ✅ 画像取得成功: 70.80 KB (image/jpeg)
```

### 実際の投稿（スクリーンショット付き）

```
[2025/11/03 16:55:56] [INFO] 📜 ランキング見出しまでスクロールしています...
[2025/11/03 16:55:56] [INFO] ✅ ランキング要素を発見: [id*="zg_banner_text"]
[2025/11/03 16:55:58] [INFO] ✅ スクロールが完了しました
[2025/11/03 16:55:58] [INFO] 📷 スクリーンショットを撮影しています...
[2025/11/03 16:55:58] [INFO] ✅ スクリーンショットを取得しました（サイズ: 73.31 KB, タイプ: image/jpeg）
[2025/11/03 16:55:58] [INFO] 📤 ツイート投稿処理
[2025/11/03 16:55:58] [INFO] 📷 画像付きでツイートを投稿しています...
[2025/11/03 16:55:59] [INFO] メディアアップロード完了: 1985254612732166144
[2025/11/03 16:55:59] [INFO] ✅ ツイート投稿成功！
[2025/11/03 16:55:59] [INFO] ツイートID: 1985254616360210908
[2025/11/03 16:55:59] [INFO] ツイートURL: https://twitter.com/_counselor_risa/status/1985254616360210908
[2025/11/03 16:55:59] [INFO] 画像サイズ: 73.31 KB (image/jpeg)
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

