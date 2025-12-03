// scripts/instagramPostContent.js
// Instagram投稿用のコンテンツ定義

/**
 * Instagram投稿用のメッセージ候補
 * 各メッセージはキャプションとして使用されます
 */
export const instagramPostMessages = [
  '✨ 今日のおすすめ商品をご紹介します！\n\n#おすすめ #商品紹介 #レビュー',
  '🎁 特別な商品を見つけました！\n\n#特別価格 #お得情報 #商品紹介',
  '💡 この商品、本当におすすめです！\n\n#おすすめ #レビュー #商品紹介',
  '🌟 人気の商品をチェックしてみてください\n\n#人気商品 #おすすめ #商品紹介',
  '🔥 今話題の商品をご紹介します！\n\n#話題 #商品紹介 #おすすめ',
];

/**
 * Instagram投稿用のハッシュタグ
 */
export const instagramHashtags = [
  '#おすすめ',
  '#商品紹介',
  '#レビュー',
  '#お得情報',
  '#特別価格',
  '#人気商品',
  '#話題',
];

/**
 * 画像URLの候補
 * 注意: Instagram Graph APIは公開アクセス可能なURLが必要です
 * ローカルファイルを直接アップロードすることはできません
 */
export const instagramImageUrls = [
  // 例: 画像ホスティングサービスのURL
  // 'https://example.com/image1.jpg',
  // 'https://example.com/image2.jpg',
];

/**
 * デフォルトの投稿メッセージ
 */
export const defaultInstagramMessage = '✨ 今日も素敵な1日を！\n\n#日常 #投稿 #instagram';
