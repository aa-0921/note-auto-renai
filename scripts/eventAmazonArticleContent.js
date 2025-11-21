// イベント告知記事（アマゾンセール）の投稿内容定義
// セクション配列とタイトル配列を定義

import { affiliateConfig } from './affiliateConfig.js';

const { affiliateTag } = affiliateConfig;

// タイトル候補配列
export const eventAmazonArticleTitles = [
  '🎉 アマゾンブラックフライデーセール開催中！お得な商品をチェック',
  '🛍️ アマゾンブラックフライデーセール情報をお届けします！',
  '💰 今だけの特別価格！お見逃しなく！ブラックフライデーセール',
  '✨ Amazonブラックフライデーセール情報まとめ',
  '🎁 Amazonブラックフライデーセールお得な情報をお届けします',
  '🔥 Amazonブラックフライデーセールでお買い物！',
  '💸 Amazonブラックフライデーセールセール情報',
  '🎊 Amazonブラックフライデーセール開催！要チェック商品まとめ',
];

// 固定セクション（記事の先頭に必ず表示）
export const eventAmazonArticleHeaderSections = [
  {
    title: '## 🎉 アマゾンセール開催中！',
    text: `アマゾンで開催中のセール情報をお届けします🛍️
お得な商品をチェックして、お気に入りのアイテムを見つけてください✨
期間限定の特別価格なので、見逃さないようにご注意ください💰

セール期間：
🉐 先行：11月21日（金）0:00～11月23日（日）23:59
🉐 本セール：11月24日（月）0:00～12月1日（月）23:59`,
  },
];

// 投稿内容のセクション配列（オブジェクト形式）
export const eventAmazonArticleSections = [
  {
    title: '## 📱 スマートフォン・タブレット',
    text: `最新のスマートフォンやタブレットがお得に購入できます📱
高性能な端末を特別価格で手に入れるチャンスです✨
人気のiPhoneやAndroid端末、iPadなどがセール中です💫`,
  },
  {
    title: '## 💻 PC・周辺機器',
    text: `ノートPCやデスクトップPC、周辺機器がお得です💻
仕事や勉強に最適な機種を見つけましょう📚
高性能なPCを特別価格で購入できるチャンスです🎯`,
  },
  {
    title: '## 🎧 オーディオ機器',
    text: `ヘッドフォンやイヤホン、スピーカーなどがセール中です🎧
高音質なオーディオ機器をお得に購入できます✨
ワイヤレスイヤホンやノイズキャンセリングヘッドフォンもおすすめです🎵`,
  },
  {
    title: '## 🏠 家電・生活用品',
    text: `家電製品や生活用品がお得に購入できます🏠
日々の生活を快適にするアイテムを見つけましょう✨
掃除機やエアコン、冷蔵庫など、大型家電もセール中です💡`,
  },
  {
    title: '## 📚 書籍・電子書籍',
    text: `書籍や電子書籍がセール中です📚
読みたい本をお得に購入するチャンスです✨
ベストセラーや話題の本も特別価格で購入できます📖`,
  },
  {
    title: '## 🎮 ゲーム・エンタメ',
    text: `ゲーム機やソフト、エンタメ関連商品がお得です🎮
最新のゲームを楽しみましょう✨
PlayStationやNintendo Switch、ゲームソフトもセール中です🎯`,
  },
  {
    title: '## 👕 ファッション・アクセサリー',
    text: `ファッションアイテムやアクセサリーがセール中です👕
お気に入りのアイテムを見つけて、おしゃれを楽しみましょう✨
春夏の新作アイテムも特別価格で購入できます💫`,
  },
  {
    title: '## 🏃 スポーツ・アウトドア',
    text: `スポーツ用品やアウトドアグッズがお得に購入できます🏃
アクティブな生活をサポートするアイテムを見つけましょう✨
ランニングシューズやトレーニングウェアもセール中です🎯`,
  },
  {
    title: '## 🍳 キッチン・調理器具',
    text: `キッチン用品や調理器具がセール中です🍳
料理を楽しむためのアイテムをお得に購入できます✨
調理家電や食器、キッチンツールも特別価格です💡`,
  },
  {
    title: '## 🎨 ホビー・手芸',
    text: `ホビー用品や手芸用品がお得です🎨
趣味を楽しむためのアイテムを見つけましょう✨
工作用品や手芸材料もセール中です🎯`,
  },
  {
    title: '## 🧴 コスメ・スキンケア',
    text: `コスメやスキンケア商品がセール中です🧴
美容アイテムをお得に購入できるチャンスです✨
人気の化粧品やスキンケア商品も特別価格です💫`,
  },
  {
    title: '## 🧸 ベビー・キッズ用品',
    text: `ベビー用品やキッズ用品がお得に購入できます🧸
お子様の成長をサポートするアイテムを見つけましょう✨
おもちゃやベビー用品もセール中です🎯`,
  },
  {
    title: '## 🐕 ペット用品',
    text: `ペット用品がセール中です🐕
愛犬・愛猫のためのアイテムをお得に購入できます✨
ペットフードやおもちゃ、ベッドなども特別価格です💫`,
  },
  {
    title: '## 🚗 カー用品',
    text: `カー用品がお得に購入できます🚗
車のメンテナンスや快適性を向上させるアイテムを見つけましょう✨
カーアクセサリーやメンテナンス用品もセール中です🎯`,
  },
  {
    title: '## 🏡 インテリア・家具',
    text: `インテリアや家具がセール中です🏡
お部屋を快適にするアイテムをお得に購入できます✨
ソファやテーブル、収納家具も特別価格です💫`,
  },
];

// 固定アフィリエイトリンク（必ず表示される2つ）
export const eventAmazonArticleFixedAffiliateLinks = [
  `[㊙️　割引率　80%以上の商品一覧](https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522rangeRefinementFilters%255C%2522%253A%257B%255C%2522percentOff%255C%2522%253A%257B%255C%2522min%255C%2522%253A80%252C%255C%2522max%255C%2522%253A100%257D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl)`,
  `[㊙️　割引率　60%以上の商品一覧](https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522rangeRefinementFilters%255C%2522%253A%257B%255C%2522percentOff%255C%2522%253A%257B%255C%2522min%255C%2522%253A60%252C%255C%2522max%255C%2522%253A100%257D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl)`,
];

// ランダムアフィリエイトリンク配列（6つから3つをランダムに選択）
export const eventAmazonArticleRandomAffiliateLinks = [
  `[パソコン・周辺機器のセール商品一覧](https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%25222127210051%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl)`,
  `[食品・飲料・お酒のセール商品一覧](https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%252257240051%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl)`,
  `[ドラッグストアのセール商品一覧](https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%2522161669011%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl)`,
  `[ビューティー関連のセール商品一覧](https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%252252391051%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl)`,
  `[ホビー・おもちゃ関連のセール商品一覧](https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%252213299551%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl)`,
  `[Amazonデバイス等のセール商品一覧](https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%25224976280051%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl)`,
];

// 後方互換性のため、旧形式の配列も残す（使用されない）
export const eventAmazonArticleAffiliateLinks = [
  `[【開催中】ブラックフライデー 先行セール！セール会場はこちら。](https://www.amazon.co.jp/blackfriday?&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl)`,
];

// 記事末尾に追加する固定ハッシュタグ
export const eventAmazonArticleFooterHashtags = `#アマゾンセール #お得情報 #セール情報 #お買い物 #おすすめ商品 #Amazon #アマゾン #セール #特価 #お買い得 #商品レビュー #おすすめ`;

