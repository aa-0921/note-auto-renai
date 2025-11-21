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
    title: '## 🛍️ Amazonブラックフライデー 2025：今年最後のビッグチャンスを見逃さないでください！',
    text: `🔥 最高のショッピングフェスティバルが、ついに幕を開けます！

年に一度のAmazon「ブラックフライデー」が今年もやってまいりました。欲しかったあの商品、日頃からチェックされていた憧れのアイテムを手に入れる、2025年最後のビッグチャンスでございます。

このセールはただ安いだけではございません。誰もがご存知のAmazonデバイスから、日々の生活を豊かにする家電製品、最新のファッションアイテム、そして年末年始に備えた食料品や日用品まで、あらゆるカテゴリが史上最大の割引率で登場いたします。`,
  },
  {
    title: '## 🗓️ セール期間をチェック！先行セールでフライングゲットのチャンスです！',
    text: `今回のブラックフライデーは、二段階構成となっております。特に人気のアイテムは先行セールで売り切れてしまう可能性もございますので、スケジュールをしっかりご確認いただき、最高のタイミングを逃さないようにしてください。

🉐 先行セール期間：11月21日（金）0:00～11月23日（日）23:59

🉐 本セール期間：11月24日（月）0:00～12月1日（月）23:59`,
  },
  {
    title: '## 💡 なぜ今買うべき？ブラックフライデーの魅力をご紹介します',
    text: `### 1. Amazonデバイスが超お得！

Fire TV StickやKindle、Echoシリーズなど、Amazon純正デバイスはブラックフライデーの目玉商品です。スマートライフへの第一歩を、驚きの価格でお始めいただけます。`,
  },
  {
    title: '## 🏠 賢く年越し準備！',
    text: `年末の大掃除に活躍する高圧洗浄機やロボット掃除機、新しい年を気持ちよく迎えるための寝具やインテリア、さらには親戚や友人が集まる際に役立つ高級食材まで、この機会にまとめてご準備いただけます。`,
  },
  {
    title: '## 🎁 ポイントアップキャンペーンも見逃せません！',
    text: `セール期間中は、ポイントアップキャンペーンも同時開催されることが恒例です。ぜひエントリーをお忘れなく。ご購入金額に応じてポイント還元率がアップし、さらにお得にお買い物ができます。`,
  },
  {
    title: '## 💖 Amazonブラックフライデー開催！「買ってよかった」と心から思える年末セールの秘密',
    text: `✨ 年末のビッグセールは、私たちにとって最高の味方です

いよいよAmazonの「ブラックフライデー」が始まります！「安いから買う」だけではもったいないこのセール。実は、私たちのお財布と心を助けてくれる、特別なイベントなのです。

なぜ今、買い物をするのが賢い選択なのか。その理由を分かりやすくご説明します。`,
  },
  {
    title: '## 👛 損しない！「安い時に買う」シンプルで最強の節約術',
    text: `ブラックフライデーの最大のメリットは、**「ムダな出費をなくすこと」**です。

生活費をロックオン！ 普段必ず買う洗剤、シャンプー、お米などの「いつもの消耗品」が、この期間は驚くほど安くなります。安い時にまとめて買っておくだけで、毎月コツコツ支払っていた生活費がグッと減ります。これは、手間いらずで確実にできる、最もシンプルな節約方法です。

「欲しいもの」を適正価格でゲット！ 前から欲しかった家電やちょっと良いものも、割引されることで「これなら買ってもいいかな」という価格になります。高い時に買うのを我慢して、一番安いチャンスを狙って手に入れる。これが、賢い大人の買い物術です。`,
  },
  {
    title: '## 🌟 ご褒美は自分を元気に保つ「心の充電器」です',
    text: `「ご褒美」の買い物は、贅沢でも浪費でもありません。実は、忙しい毎日を乗り切るための**「心の健康」**に欠かせない行動なのです。

やる気が満タンに！ 好きなものを手に入れると、私たちはワクワクして「買ってよかった！」と心から嬉しくなりますよね。この「嬉しい気持ち」は、明日への**やる気（モチベーション）**を復活させてくれます。

ストレスをスッキリ！ 年末は何かと忙しいもの。ちょっとした買い物で気分転換をすることは、溜まったストレスをスッキリ解消するのに役立ちます。自分にご褒美をあげることで、「また明日から頑張ろう」という前向きな気持ちが湧いてきます。`,
  },
  {
    title: '## 📅 年末のバタバタを回避！「時間のゆとり」を買う',
    text: `ブラックフライデーで事前に準備を済ませておくことは、年末の「忙しい時間」を減らすことにつながります。

12月は忙しい！ クリスマスや年末の大掃除、年越しの準備などで、12月はあっという間に過ぎていきます。

今買っておけば安心！ 必要なものを今のうちに買ってしまえば、忙しい12月に焦って買い物に出かける必要がなくなります。心と時間に余裕が生まれ、気持ちよく新年を迎える準備ができます。`,
  },
];

// 固定アフィリエイトリンク（必ず表示される3つ）
const fixedLinkBlackFridayMainUrl = `https://www.amazon.co.jp/blackfriday?&linkCode=ll2&tag=${affiliateTag}&linkId=213b50b8f3333d64c518a3817bcc1088&language=ja_JP&ref_=as_li_ss_tl`;
const fixedLink80PercentUrl = `https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522rangeRefinementFilters%255C%2522%253A%257B%255C%2522percentOff%255C%2522%253A%257B%255C%2522min%255C%2522%253A80%252C%255C%2522max%255C%2522%253A100%257D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl`;
const fixedLink60PercentUrl = `https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522rangeRefinementFilters%255C%2522%253A%257B%255C%2522percentOff%255C%2522%253A%257B%255C%2522min%255C%2522%253A60%252C%255C%2522max%255C%2522%253A100%257D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl`;

export const eventAmazonArticleFixedAffiliateLinks = [
  `
💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁
[Amazonブラックフライデーセール会場はこちら！](${fixedLinkBlackFridayMainUrl})
${fixedLinkBlackFridayMainUrl}
💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁
`,
  `
💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁
[㊙️　割引率　80%以上の商品一覧](${fixedLink80PercentUrl})
${fixedLink80PercentUrl}
💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁
`,
  `
💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁
[㊙️　割引率　60%以上の商品一覧](${fixedLink60PercentUrl})
${fixedLink60PercentUrl}
💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁 💰 🎁
`,
];

// ランダムアフィリエイトリンク配列（6つから3つをランダムに選択）
const randomLinkPcUrl = `https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%25222127210051%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl`;
const randomLinkFoodUrl = `https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%252257240051%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl`;
const randomLinkDrugstoreUrl = `https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%2522161669011%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl`;
const randomLinkBeautyUrl = `https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%252252391051%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl`;
const randomLinkHobbyAndToysUrl = `https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%252213299551%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl`;
const randomLinkAmazonDevicesUrl = `https://www.amazon.co.jp/blackfriday?ref_=nav_cs_td_bf_dt_cr&discounts-widget=%2522%257B%255C%2522state%255C%2522%253A%257B%255C%2522refinementFilters%255C%2522%253A%257B%255C%2522departments%255C%2522%253A%255B%255C%25224976280051%255C%2522%255D%257D%257D%252C%255C%2522version%255C%2522%253A1%257D%2522&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl`;

export const eventAmazonArticleRandomAffiliateLinks = [
  `
💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻
[パソコン・周辺機器のセール商品一覧](${randomLinkPcUrl})
${randomLinkPcUrl}
💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻 💻 👨‍💻
`,
  `
🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷
[食品・飲料・お酒のセール商品一覧](${randomLinkFoodUrl})
${randomLinkFoodUrl}
🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷 🍽️ 🍷
`,
  `
💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥
[ドラッグストアのセール商品一覧](${randomLinkDrugstoreUrl})
${randomLinkDrugstoreUrl}
💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥 💊 🏥
`,
  `
💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨
[ビューティー関連のセール商品一覧](${randomLinkBeautyUrl})
${randomLinkBeautyUrl}
💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨ 💄 ✨
`,
  `
🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮
[ホビー・おもちゃ関連のセール商品一覧](${randomLinkHobbyAndToysUrl})
${randomLinkHobbyAndToysUrl}
🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮 🧸 🎮
`,
  `
📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧
[Amazonデバイス等のセール商品一覧](${randomLinkAmazonDevicesUrl})
${randomLinkAmazonDevicesUrl}
📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧 📱 🎧
`,
];

// 後方互換性のため、旧形式の配列も残す（使用されない）
export const eventAmazonArticleAffiliateLinks = [
  `[【開催中】ブラックフライデー 先行セール！セール会場はこちら。](https://www.amazon.co.jp/blackfriday?&linkCode=ll2&tag=${affiliateTag}&linkId=0f9989f6daa8f074182cafb0dfc61121&language=ja_JP&ref_=as_li_ss_tl)`,
];

// 記事末尾に追加する固定ハッシュタグ
export const eventAmazonArticleFooterHashtags = `#Amazonブラックフライデー #ブラックフライデーセール #アマゾンセール #ブラックフライデー #お得情報 #セール情報 #お買い物 #おすすめ商品 #Amazon #アマゾン #セール #特価 #お買い得 #商品レビュー #おすすめ`;

