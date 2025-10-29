# Amazonランキング記事の投稿機能

## 概要

Amazonの各カテゴリのランキングページへのリンクを含む記事を**直接投稿**する機能です。

## ファイル構成

### 設定ファイル

**`scripts/affiliateConfig.js`**

Amazonランキングリンクを定義する配列 `amazonRankingLinks` を追加しています。

```javascript
export const amazonRankingLinks = [
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

### スクリプトファイル

#### **記事作成・投稿スクリプト**: `scripts/createAmazonRankingNote.js`

Amazonランキング記事を自動生成して**即座に投稿**します。

**実行方法：**

```bash
cd /Users/aa/projects/note-automation/note-auto-renai
node scripts/createAmazonRankingNote.js
```

または、バックグラウンドモードで実行：

```bash
node scripts/createAmazonRankingNote.js --bg
```

**記事の内容：**
- タイトル: `🛍️✨ Amazonランキング　人気商品チェック！`
- 冒頭にAmazonランキングの説明（小さく表示）
- 導入文で記事の目的を説明
- `amazonRankingLinks` 配列に定義された各カテゴリのランキングリンクを掲載
- 締めの文章でスキ・フォローを促す
- **自動的に公開まで実行**（`publish: true` オプション）

## 使用方法

### 1. ランキングリンクのカスタマイズ（任意）

`scripts/affiliateConfig.js` の `amazonRankingLinks` 配列を編集して、
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
node scripts/createAmazonRankingNote.js
```

これで完了です！記事が自動的に作成され、即座に投稿されます。

### オプション: 下書き保存のみしたい場合

下書き保存のみの機能は現在サポートされていません。
記事を事前に確認したい場合は、Core側の `runCreateAndPublishAmazonRankingNote` メソッドをカスタマイズするか、
投稿後にnote.comの管理画面から記事を非公開に設定してください。

## 定期実行の設定例

GitHub Actionsなどで定期的に実行する場合の例：

```yaml
# 週1回、毎週月曜日の10:00に実行
- cron: '0 10 * * 1'
```

## 注意事項

1. **アフィリエイトタグ**: `affiliateConfig.js` の `affiliateTag` に正しいアソシエイトタグが設定されていることを確認してください。

2. **記事タイトル**: 投稿スクリプトは、タイトルに「Amazonランキング」などのキーワードを含む記事のみを対象とします。

3. **環境変数**: `.env` ファイルに以下の環境変数が設定されていることを確認してください：
   - `NOTE_EMAIL`: note.comのログインメールアドレス
   - `NOTE_PASSWORD`: note.comのログインパスワード

## Core側の実装

### NoteAutomationCore.js

Amazonランキング専用のメソッド `runCreateAndPublishAmazonRankingNote` を追加しました。

**特徴:**
- `runCreateProductRecommendationNote` とは完全に独立した実装
- Amazonランキング記事の作成と直接投稿に特化
- シンプルな処理フロー（リンクの結合 → 下書き保存 → 即座に公開）
- 複雑なアフィリエイトリンク挿入処理は不要

**パラメータ:**
- `title`: 記事タイトル
- `rankingLinks`: Amazonランキングリンクの配列
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

## 今後の拡張

- より多くのAmazonカテゴリを追加
- ランキング記事のテンプレートをカスタマイズ可能にする
- スケジュール設定を `config/schedule.yaml` に統合

---

以上でAmazonランキング記事の投稿機能の使い方は完了です！

