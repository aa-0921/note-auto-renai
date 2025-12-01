# Instagram自動投稿機能の使い方

## 概要

このドキュメントでは、note-auto-renaiリポジトリでInstagram自動投稿機能を使用する方法を説明します。

## 前提条件

1. Instagramアカウントが**ビジネスアカウント**または**クリエイターアカウント**であること
2. Instagramアカウントが**Facebookページと連携**されていること
3. Meta for Developersでアプリを作成し、アクセストークンを取得していること

詳細なセットアップ手順は、[core側のドキュメント](../../note-auto-core/docs/InstagramPostUsage.md)を参照してください。

## 環境変数の設定

`.env`ファイルに以下の環境変数を設定してください：

```bash
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_ig_user_id
```

## 投稿内容の設定

投稿内容は`scripts/instagramPostContent.js`で定義します。

### メッセージ候補の追加

```javascript
export const instagramPostMessages = [
  '✨ 今日のおすすめ商品をご紹介します！\n\n#おすすめ #商品紹介 #レビュー',
  '🎁 特別な商品を見つけました！\n\n#特別価格 #お得情報 #商品紹介',
  // 追加のメッセージ...
];
```

### ハッシュタグの追加

```javascript
export const instagramHashtags = [
  '#おすすめ',
  '#商品紹介',
  '#レビュー',
  // 追加のハッシュタグ...
];
```

### 画像URLの設定

```javascript
export const instagramImageUrls = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  // 追加の画像URL...
];
```

**重要**: Instagram Graph APIは公開アクセス可能なURLが必要です。ローカルファイルを直接アップロードすることはできません。

画像をホスティングする方法：
- 自前のサーバーにアップロード
- クラウドストレージ（AWS S3、Google Cloud Storageなど）
- 画像ホスティングサービス（Imgur、Cloudinaryなど）

## 使用方法

### 基本的な使い方（スクリプト例）

`scripts/postInstagram.js`のようなスクリプトを作成して使用します：

```javascript
#!/usr/bin/env node
// scripts/postInstagram.js
// Instagramに自動投稿するスクリプト

import { postInstagram, Logger } from '@aa-0921/note-auto-core';
import {
  instagramPostMessages,
  instagramHashtags,
  instagramImageUrls,
} from './instagramPostContent.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger();

/**
 * 配列からランダムに1要素を取得
 */
function getRandomElement(array) {
  if (!Array.isArray(array) || array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

async function main() {
  const dryrun = process.argv.includes('--dryrun');
  const imageUrl = process.argv.find(arg => arg.startsWith('--image='))?.split('=')[1];
  const message = process.argv.find(arg => arg.startsWith('--message='))?.split('=')[1];

  // 画像URLを決定
  const postImageUrl = imageUrl || getRandomElement(instagramImageUrls);

  if (!postImageUrl) {
    throw new Error('画像URLが指定されていません。--image=オプションで画像URLを指定するか、instagramImageUrlsに画像URLを追加してください。');
  }

  await postInstagram({
    imageUrl: postImageUrl,
    messages: instagramPostMessages,
    message: message, // 直接指定する場合はこちらを使用
    hashtags: instagramHashtags,
    maxHashtags: 5,
    dryrun,
    logger,
  });
}

main().catch((error) => {
  logger.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
```

### 実行例

```bash
# Dryrunモードでテスト実行
node scripts/postInstagram.js --dryrun

# 実際に投稿（ランダムにメッセージと画像を選択）
node scripts/postInstagram.js

# 特定の画像URLを指定
node scripts/postInstagram.js --image=https://example.com/image.jpg

# 特定のメッセージを指定
node scripts/postInstagram.js --message="カスタムメッセージ #ハッシュタグ"
```

## エラーハンドリング

### よくあるエラーと対処法

#### 401エラー: アクセストークンが無効

```
エラー: 401エラーの可能性のある原因:
  1. アクセストークンが無効または期限切れ
  2. アクセストークンに必要な権限がない
```

**対処法**: アクセストークンを再取得してください。

#### 403エラー: 権限不足

```
エラー: 403エラーの可能性のある原因:
  1. アプリの権限設定が不十分
  2. ビジネスアカウントまたはクリエイターアカウントではない
  3. Facebookページと連携されていない
```

**対処法**: 
- Instagramアカウントがビジネスアカウントまたはクリエイターアカウントであることを確認
- Facebookページと連携されていることを確認
- Meta for Developersで必要な権限を申請・承認

#### 400エラー: リクエストパラメータが不正

```
エラー: 400エラーの可能性のある原因:
  1. リクエストパラメータが不正
  2. 画像/動画の形式がサポートされていない
  3. キャプションが長すぎる（最大2200文字）
```

**対処法**:
- 画像URLが公開アクセス可能であることを確認
- キャプションが2200文字以内であることを確認
- 画像形式がサポートされていることを確認（JPEG、PNGなど）

#### 429エラー: レート制限

```
エラー: 429エラー: レート制限に達しました
リトライ推奨時間: 3600秒後
```

**対処法**: リトライ推奨時間まで待機してから再試行してください。

## 注意事項

1. **画像URLについて**
   - 公開アクセス可能なURLが必要です
   - ローカルファイルを直接アップロードすることはできません
   - 画像ホスティングサービスを使用してください

2. **キャプションの制限**
   - 最大2200文字
   - ハッシュタグは30個まで推奨

3. **レート制限**
   - Instagram Graph APIにはレート制限があります
   - 一般的には1時間あたり200リクエスト程度

4. **アクセストークンの有効期限**
   - 長期アクセストークンは通常60日間有効です
   - 期限切れの場合は再取得が必要です

## 実装の構造

- **core側（note-auto-core）**: 基本的なメソッドや処理
  - `InstagramAPIClient`: Instagram Graph APIの基本的なメソッド
  - `InstagramPostService`: 投稿処理の共通化サービス
- **個々のリポジトリ側（note-auto-renai）**: 投稿内容等の引数
  - `instagramPostContent.js`: メッセージ、ハッシュタグ、画像URLの定義
  - 必要に応じて独自の投稿スクリプトを作成

## 参考リンク

- [core側のドキュメント](../../note-auto-core/docs/InstagramPostUsage.md)
- [Instagram Graph API ドキュメント](https://developers.facebook.com/docs/instagram-api/)
- [Meta for Developers](https://developers.facebook.com/)

