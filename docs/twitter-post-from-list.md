# フォロワー増加用Twitter投稿

## 概要

投稿データのリストからランダムに選択してTwitterに投稿するシステムです。

コアロジックは `@aa-0921/note-auto-core` の `RandomPostService` で実装されています。

## 特徴

- **ランダム選択**: 投稿リストからランダムに1つ選択
- **画像対応**: テキストのみ / 画像付き 両対応
- **DRYRUNモード**: 実際に投稿せずに動作確認可能

## ファイル構成

```
note-auto-renai/
├── scripts/
│   └── postFollowerGrowthTweet.js    # メインスクリプト
├── data/
│   └── follower-growth-posts.js      # 投稿データ（編集可能）
└── docs/
    └── twitter-post-from-list.md     # このファイル
```

## 投稿データの形式

`data/follower-growth-posts.js` に投稿データを配列で定義します。

### データ構造

```javascript
export const posts = [
  {
    title: '投稿のタイトル（オプション）',  // 管理用（投稿されない）
    text: 'ツイート本文',                    // 必須
    image: '/path/to/image.png'             // オプション（画像なしの場合はnull）
  },
  {
    title: '別の投稿',
    text: 'ツイート本文2',
    image: null  // 画像なし
  }
];
```

### フィールド説明

- **title** (オプション): 投稿の管理用タイトル。ログに表示されるが、実際のツイートには含まれない。
- **text** (必須): ツイート本文。280文字（半角）/ 140文字（全角換算）以内。
- **image** (オプション): 画像ファイルのパス。画像がない場合は`null`を指定。

### 例

```javascript
export const posts = [
  {
    title: 'コスメレビュー1',
    text: `【本音レビュー】💄

話題の○○リップ使ってみた

《良い点》
・発色がめちゃくちゃ良い
・色持ち8時間

《結論》
デート用に◎

#リップ #コスメレビュー`,
    image: null
  },
  {
    title: 'Before/After',
    text: `【Before/After】✨

○○を1ヶ月使った結果

効果ありました😊

#ビフォーアフター #スキンケア`,
    image: '/Users/aa/projects/note-automation/note-auto-renai/images/before-after.png'
  }
];
```

## 使い方

### 1. DRYRUNモード（投稿せずに確認）

```bash
node scripts/postFollowerGrowthTweet.js --dryrun
```

実際には投稿せず、選択された投稿内容を表示します。

### 2. 実際に投稿

```bash
node scripts/postFollowerGrowthTweet.js
```

ランダムに選択された投稿がTwitterに投稿されます。

## GitHub Actionsでの自動化

### ワークフローファイル例

`.github/workflows/post-follower-growth-tweet.yml`

```yaml
name: Twitter Post from List

on:
  schedule:
    - cron: '0 */3 * * *'  # 3時間おき
  workflow_dispatch:
    inputs:
      dryrun:
        description: 'DRYRUNモード'
        required: false
        default: 'false'

jobs:
  post:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run post script
        env:
          TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
          TWITTER_API_SECRET: ${{ secrets.TWITTER_API_SECRET }}
          TWITTER_ACCESS_TOKEN: ${{ secrets.TWITTER_ACCESS_TOKEN }}
          TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
          TWITTER_BEARER_TOKEN: ${{ secrets.TWITTER_BEARER_TOKEN }}
        run: |
          if [ "${{ github.event.inputs.dryrun }}" = "true" ]; then
            node scripts/postFollowerGrowthTweet.js --dryrun
          else
            node scripts/postFollowerGrowthTweet.js
          fi
```

## レート制限対応

X API無料プランでは**1日17件**までの投稿制限があります。

### 推奨スケジュール

- **3時間おき**: 1日8回 = 8ツイート
- **4時間おき**: 1日6回 = 6ツイート
- **6時間おき**: 1日4回 = 4ツイート

レート制限に達した場合、エラーが発生します。

## トラブルシューティング

### Q1: 画像が投稿されない

A: 画像ファイルのパスを確認してください。絶対パスで指定することを推奨します。

```javascript
// ✅ 推奨
image: '/Users/aa/projects/note-automation/note-auto-renai/images/sample.png'

// ❌ 相対パスは動作しない場合がある
image: './images/sample.png'
```

### Q2: レート制限エラー

A: 1日17件の制限に達しています。リセット時間（約16時間後）まで待機してください。

## データの追加

新しい投稿を追加するには、`data/follower-growth-posts.js` の配列に追加します。

```javascript
export const posts = [
  // 既存の投稿...
  
  // 新しい投稿を追加
  {
    title: '新しい投稿',
    text: '新しいツイート本文',
    image: null
  }
];
```

## まとめ

1. `data/follower-growth-posts.js` に投稿データを追加
2. `node scripts/postFollowerGrowthTweet.js --dryrun` で動作確認
3. `node scripts/postFollowerGrowthTweet.js` で実際に投稿
4. GitHub Actionsで自動化

コアロジックは `@aa-0921/note-auto-core` で管理され、
アカウント側は投稿データのみ管理する、シンプルで保守性の高いシステムです！

詳細は [`@aa-0921/note-auto-core/docs/RandomPostService.md`](../../note-auto-core/docs/RandomPostService.md) を参照してください。

