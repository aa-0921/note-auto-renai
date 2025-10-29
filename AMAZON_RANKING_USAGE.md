# Amazon売れ筋ランキング記事の投稿機能

## 概要

Amazonの各カテゴリの**売れ筋ランキング**ページへのリンクを含む記事を**直接投稿**する機能です。

> **Note**: 今後、「人気度ランキング」「ほしい物ランキング」「人気ギフトランキング」などの追加予定があるため、
> この機能は明確に「売れ筋ランキング（Top Sellers）」として実装されています。

## ファイル構成

### 設定ファイル

**`scripts/affiliateConfig.js`**

Amazon売れ筋ランキングリンクを定義する配列 `amazonTopSellersRankingLinks` を追加しています。

```javascript
export const amazonTopSellersRankingLinks = [
  // Prime Videoの売れ筋ランキング
  [...].join('\n'),
  
  // Kindleストアの売れ筋ランキング
  [...].join('\n'),
  
  // その他のカテゴリ...
];
```

現在、以下のカテゴリが含まれています：
1. Prime Video
2. Kindleストア
3. ゲーム
4. パソコン・周辺機器
5. ホーム&キッチン
6. ファッション
7. ビューティー
8. 家電&カメラ
9. スポーツ&アウトドア
10. ベビー&マタニティ
11. 食品・飲料・お酒
12. ファッション（詳細版）
13. バッグ・スーツケース
14. ドラッグストア
15. ビューティー（詳細版）
16. スキンケア・ボディケア
17. ヘアケア・カラー・スタイリング
18. ペット用品
19. Amazon 全カテゴリ総合ランキング
20. タイムセールランキング
21. ふるさと納税ランキング
22. Kindle端末ランキング
23. タブレットの売れ筋ランキング
24. 本の売れ筋ランキング
25. 文房具・オフィス用品の売れ筋ランキング
26. おもちゃの売れ筋ランキング
27. ホーム＆キッチンの売れ筋ランキング
28. インテリアの売れ筋ランキング
29. 家具の売れ筋ランキング
30. 生活雑貨の売れ筋ランキング

### スクリプトファイル

#### **記事作成・投稿スクリプト**: `scripts/createAmazonTopSellersRankingNote.js`

Amazon売れ筋ランキング記事を自動生成して**即座に投稿**します。

**実行方法：**

```bash
cd /Users/aa/projects/note-automation/note-auto-renai
node scripts/createAmazonTopSellersRankingNote.js
```

または、npmスクリプト経由で実行：

```bash
npm run createAmazonTopSellersRankingNote
```

または、バックグラウンドモードで実行：

```bash
node scripts/createAmazonTopSellersRankingNote.js --bg
```

**記事の内容：**
- タイトル: `🛍️✨ Amazon売れ筋ランキング　人気商品チェック！`
- 冒頭にAmazon売れ筋ランキングの説明（小さく表示）
- 導入文で記事の目的を説明
- `amazonTopSellersRankingLinks` 配列に定義された各カテゴリのランキングリンクを掲載
- 締めの文章でスキ・フォローを促す
- **自動的に公開まで実行**（`publish: true` オプション）

## 使用方法

### 1. ランキングリンクのカスタマイズ（任意）

`scripts/affiliateConfig.js` の `amazonTopSellersRankingLinks` 配列を編集して、
追加したいカテゴリや説明文を調整できます。

```javascript
[
  '',
  '🎬　📺　🎬　📺　🎬　📺　...',
  `https://www.amazon.co.jp/gp/bestsellers/instant-video?...`,
  '👆Prime Videoの売れ筋ランキング',
  '最新の人気映画やドラマをチェック！📺✨',
  // ... 説明文を追加
  '🎬　📺　🎬　📺　🎬　📺　...',
  '',
].join('\n'),
```

### 2. 記事を作成して投稿

```bash
npm run createAmazonTopSellersRankingNote
```

または

```bash
node scripts/createAmazonTopSellersRankingNote.js
```

これで完了です！記事が自動的に作成され、即座に投稿されます。

### オプション: 下書き保存のみしたい場合

下書き保存のみの機能は現在サポートされていません。
記事を事前に確認したい場合は、Core側の `runCreateAndPublishAmazonRankingNote` メソッドをカスタマイズするか、
投稿後にnote.comの管理画面から記事を非公開に設定してください。

## 定期実行の設定

GitHub Actionsで定期的に実行されるように設定済みです。

**ワークフローファイル**: `.github/workflows/auto-create-amazon-top-sellers-ranking-note.yml`

**実行スケジュール:**
- 火曜日 17:00（JST）
- 木曜日 17:00（JST）
- 土曜日 17:00（JST）
- 日曜日 17:00（JST）

```yaml
schedule:
  - cron: '0 8 * * 2'   # 火曜日 JST 17:00
  - cron: '0 8 * * 4'   # 木曜日 JST 17:00
  - cron: '0 8 * * 6'   # 土曜日 JST 17:00
  - cron: '0 8 * * 0'   # 日曜日 JST 17:00
```

手動実行も可能です（GitHub Actionsの画面から）。

## 注意事項

1. **アフィリエイトタグ**: `affiliateConfig.js` の `affiliateTag` に正しいアソシエイトタグが設定されていることを確認してください。

2. **記事タイトル**: 投稿スクリプトは、タイトルに「Amazon売れ筋ランキング」などのキーワードを含む記事を生成します。

3. **環境変数**: `.env` ファイルに以下の環境変数が設定されていることを確認してください：
   - `NOTE_EMAIL`: note.comのログインメールアドレス
   - `NOTE_PASSWORD`: note.comのログインパスワード

## Core側の実装

### NoteAutomationCore.js

Amazonランキング専用のメソッド `runCreateAndPublishAmazonRankingNote` を使用します。

**特徴:**
- `runCreateProductRecommendationNote` とは完全に独立した実装
- Amazonランキング記事の作成と直接投稿に特化
- シンプルな処理フロー（リンクの結合 → 下書き保存 → 即座に公開）
- 複雑なアフィリエイトリンク挿入処理は不要
- 複数のランキング種類（売れ筋、人気度、ほしい物、ギフト）に対応できる汎用的な設計

**パラメータ:**
- `title`: 記事タイトル
- `rankingLinks`: Amazonランキングリンクの配列（`amazonTopSellersRankingLinks`など）
- `intro`: 導入文
- `closing`: 締めの文章
- `thumbnailDir`: サムネイル画像のディレクトリ

## トラブルシューティング

### 記事が投稿されない場合

1. 環境変数（`NOTE_EMAIL`、`NOTE_PASSWORD`）が正しく設定されているか確認
2. ログを確認して、エラーメッセージがないか確認
3. ネットワーク接続を確認

### リンクが正しく表示されない場合

1. `affiliateConfig.js` の `affiliateTag` が正しく設定されているか確認
2. リンクURLにアフィリエイトタグが含まれているか確認
3. note.comで記事のプレビューを確認

## 今後の拡張予定

### 追加予定のランキング種類

1. **人気度ランキング** - `amazonMostPopularRankingLinks`（予定）
2. **ほしい物ランキング** - `amazonWishlistRankingLinks`（予定）
3. **人気ギフトランキング** - `amazonGiftRankingLinks`（予定）

これらは `runCreateAndPublishAmazonRankingNote` メソッドを共通で使用し、
リンク配列とタイトル・導入文を変えるだけで実装できます。

### その他の拡張

- より多くのAmazonカテゴリを追加
- ランキング記事のテンプレートをカスタマイズ可能にする
- スケジュール設定の最適化

---

以上でAmazon売れ筋ランキング記事の投稿機能の使い方は完了です！

