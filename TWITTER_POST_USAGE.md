# Twitter投稿機能 使用方法（note-auto-renai）

## 📝 概要

このスクリプトは、`affiliateConfig.js` で定義されているアフィリエイトリンクを、自動的にTwitter（X）へ投稿する機能を提供します。

## 🚀 セットアップ

### 1. 環境変数の設定

`.env` ファイルに以下の環境変数を設定してください：

```bash
# Twitterログイン用の認証情報
NOTE_EMAIL=your-email@example.com
TWITTER_PASSWORD=your-twitter-password
TWITTER_USER_NAME=your-twitter-username
NOTE_ACCOUNT_NAME=counselor_risa  # noteのアカウント名（Twitter投稿用、必須）
```

**注意事項：**
- `NOTE_EMAIL`: Twitterアカウントに登録されているメールアドレス
- `TWITTER_PASSWORD`: Twitterアカウントのパスワード
- `TWITTER_USER_NAME`: Twitterのユーザー名（@なし）- 追加認証が必要な場合に使用（オプション）
- `NOTE_ACCOUNT_NAME`: noteのアカウント名（@なし）- **必須**。未設定の場合はエラーになります

**重要：** `NOTE_ACCOUNT_NAME` が設定されていない場合、スクリプトは以下のエラーで停止します：
```
Error: NOTE_ACCOUNT_NAME環境変数が設定されていません。.envファイルに NOTE_ACCOUNT_NAME=your_account_name を追加してください。
```

**追加認証について：**
Twitterが「通常とは異なるログイン操作」を検出した場合、電話番号またはユーザー名の入力を求められることがあります。この場合、`TWITTER_USER_NAME`環境変数が必要です。

### 2. note-auto-coreのバージョン確認

最新の `@aa-0921/note-auto-core` を使用していることを確認してください：

```bash
npm install
```

## 📚 基本的な使い方

### 1. ランダムに3件投稿（デフォルト）

```bash
npm run twitterPostAffiliateLinks
```

または

```bash
node scripts/twitterPostAffiliateLinks.js --random 3
```

### 2. ランダムに指定数を投稿

```bash
node scripts/twitterPostAffiliateLinks.js --random 5
```

### 3. すべてのアフィリエイトリンクを投稿

```bash
node scripts/twitterPostAffiliateLinks.js --all
```

**注意：** すべて投稿する場合は、投稿間隔を長めに設定することを推奨します：

```bash
node scripts/twitterPostAffiliateLinks.js --all --interval 60
```

### 4. 特定のインデックスを指定して投稿

```bash
# インデックス0のツイートを投稿
node scripts/twitterPostAffiliateLinks.js --index 0

# 複数のインデックスを指定
node scripts/twitterPostAffiliateLinks.js --indices 0,2,5
```

### 5. ヘッドレスモードで実行

```bash
node scripts/twitterPostAffiliateLinks.js --random 3 --headless
```

---

## 🔧 コマンドラインオプション

### `--random [数]`
ランダムに指定数のツイートを投稿します。

**デフォルト：** 3件

**例：**
```bash
node scripts/twitterPostAffiliateLinks.js --random 5
```

---

### `--all`
すべてのアフィリエイトリンクを投稿します。

**例：**
```bash
node scripts/twitterPostAffiliateLinks.js --all --interval 60
```

---

### `--index [番号]`
指定したインデックスのツイートを投稿します（0始まり）。

**例：**
```bash
node scripts/twitterPostAffiliateLinks.js --index 0
```

---

### `--indices [番号,番号,...]`
複数のインデックスを指定して投稿します。

**例：**
```bash
node scripts/twitterPostAffiliateLinks.js --indices 0,2,5
```

---

### `--interval [秒数]`
投稿間隔を秒で指定します。

**デフォルト：** 30秒

**例：**
```bash
node scripts/twitterPostAffiliateLinks.js --random 3 --interval 60
```

---

### `--headless`
ヘッドレスモードで実行します（ブラウザを表示しない）。

**例：**
```bash
node scripts/twitterPostAffiliateLinks.js --random 3 --headless
```

---

### `--help` / `-h`
ヘルプメッセージを表示します。

```bash
node scripts/twitterPostAffiliateLinks.js --help
```

---

## 📝 投稿内容のカスタマイズ

### `twitterConfig.js` の編集

投稿内容をカスタマイズするには、`scripts/twitterConfig.js` を編集してください。

```javascript
// twitterConfig.js

// Twitter投稿の設定
export const twitterPostConfig = {
  // 投稿間隔（ミリ秒）- デフォルト30秒
  intervalMs: 30000,
  
  // 1回の実行で投稿する最大数
  maxPostsPerRun: 3,
  
  // ヘッドレスモード（false = ブラウザを表示）
  headless: false,
  
  // デバッグモード
  debug: true,
};
```

---

## 🎯 ベストプラクティス

### 1. 投稿間隔の設定

Twitterの利用規約とAPI制限を守るため、投稿間隔は **最低30秒** 以上を推奨します。

```bash
# 推奨：30秒間隔（デフォルト）
node scripts/twitterPostAffiliateLinks.js --random 3

# より安全：60秒間隔
node scripts/twitterPostAffiliateLinks.js --random 3 --interval 60
```

### 2. 投稿数の制限

1日あたりの投稿数は **10〜20件以内** に抑えることを推奨します。

```bash
# 1日3回、各3件ずつ投稿する場合
node scripts/twitterPostAffiliateLinks.js --random 3
```

### 3. 投稿前のプレビュー

スクリプトは投稿前に5秒間の待機時間があり、投稿内容をプレビューできます。この間に内容を確認してください。

---

## 📖 使用例

### 例1：毎日ランダムに3件投稿

```bash
# 毎日実行するスクリプト
npm run twitterPostAffiliateLinks
```

### 例2：週に1回、すべてを投稿（60秒間隔）

```bash
node scripts/twitterPostAffiliateLinks.js --all --interval 60
```

### 例3：特定の商品のみ投稿

```bash
# インデックスを確認
node scripts/twitterPostAffiliateLinks.js --help

# 引き寄せの法則の本（インデックス0）を投稿
node scripts/twitterPostAffiliateLinks.js --index 0
```

### 例4：ヘッドレスモードで自動化

```bash
# cron等で自動実行する場合
node scripts/twitterPostAffiliateLinks.js --random 3 --headless --interval 60
```

---

## 🔍 投稿内容の確認

### すべてのツイート内容を確認する方法

`twitterConfig.js` の `getAllTweets()` 関数を使用して、投稿される内容を確認できます：

```javascript
import { getAllTweets } from './scripts/twitterConfig.js';

const tweets = getAllTweets();
tweets.forEach((tweet, index) => {
  console.log(`\n[${index}] ${tweet.productType}`);
  console.log('---');
  console.log(tweet.content);
  console.log('---');
  console.log(`文字数: ${tweet.content.length}文字`);
});
```

---

## ⚙️ 高度な使い方

### カスタムツイートの作成

`twitterConfig.js` の `createCustomTweet()` 関数を使用して、独自のツイートを作成できます：

```javascript
import { createCustomTweet } from './scripts/twitterConfig.js';

const customTweet = createCustomTweet({
  title: '📚 おすすめ書籍',
  url: 'https://www.amazon.co.jp/dp/XXXXXXXXXX?tag=counselor888a-22',
  descriptions: [
    '✨ この本は人生を変える一冊です',
    '💡 実践的な内容で即効性があります',
  ],
  hashtags: '#読書 #自己啓発 #おすすめ',
});

console.log(customTweet);
```

---

## ⚠️ 注意事項

### セキュリティ

- 環境変数（`.env`）をGitリポジトリにコミットしないでください
- パスワードや認証情報は安全に管理してください
- 二段階認証を有効にしている場合、アプリパスワードの使用を検討してください

### Twitter利用規約

- Twitterの利用規約とポリシーを遵守してください
- スパム行為は避けてください
- 自動化ツールの使用はTwitterのルールに従ってください

### API制限

- 短時間に大量のツイートを投稿すると、アカウントが制限される可能性があります
- 投稿間隔は最低30秒以上を推奨します
- 1日あたりの投稿数にも注意してください（推奨：1日10〜20件以内）

---

## 🐛 トラブルシューティング

### ログインに失敗する

1. **メールアドレスとパスワードを確認**
   - `.env` ファイルの `NOTE_EMAIL` と `TWITTER_PASSWORD` が正しいか確認

2. **追加認証が必要な場合**
   - `.env` ファイルに `TWITTER_USER_NAME` を追加
   - ユーザー名は `@` なしで入力（例：`your_username`）
   - エラーメッセージに「追加認証が必要」と表示された場合

3. **二段階認証が有効な場合**
   - アプリパスワードを生成して使用してください

4. **スクリーンショットを確認**
   - エラー時に `twitter-login-error.png` が生成されるので確認
   - `twitter-password-not-found.png` が生成された場合は追加認証画面の可能性

### ツイートが投稿されない

1. **文字数を確認**
   - 280文字以内に収まっているか確認（自動調整されますが、確認推奨）

2. **投稿間隔を確認**
   - 短時間に多数の投稿を行っていないか確認

3. **スクリーンショットを確認**
   - エラー時に `twitter-post-error.png` が生成されるので確認

### 「投稿するツイートがありません」と表示される

1. **インデックスを確認**
   - 指定したインデックスが存在するか確認
   - `--help` でインデックスの範囲を確認

2. **affiliateConfig.js を確認**
   - `affiliateLinks` が正しく定義されているか確認

---

## 📊 投稿スケジュールの例

### パターン1：毎日3件ランダム投稿

```bash
# 毎日10:00に実行（cron設定例）
0 10 * * * cd /path/to/note-auto-renai && node scripts/twitterPostAffiliateLinks.js --random 3 --headless
```

### パターン2：平日のみ5件投稿

```bash
# 月〜金の12:00に実行
0 12 * * 1-5 cd /path/to/note-auto-renai && node scripts/twitterPostAffiliateLinks.js --random 5 --headless --interval 60
```

### パターン3：週末にすべて投稿

```bash
# 日曜日の20:00に実行
0 20 * * 0 cd /path/to/note-auto-renai && node scripts/twitterPostAffiliateLinks.js --all --headless --interval 120
```

---

## 📄 関連ドキュメント

- [note-auto-core TWITTER_USAGE.md](../note-auto-core/TWITTER_USAGE.md) - TwitterPublisherクラスの詳細
- [affiliateConfig.js](./scripts/affiliateConfig.js) - アフィリエイトリンクの定義
- [twitterConfig.js](./scripts/twitterConfig.js) - Twitter投稿の設定

---

## 🤝 サポート

問題が発生した場合は、GitHubのIssueで報告してください。

---

## 📝 ライセンス

MIT License

