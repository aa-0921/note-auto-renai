// scripts/twitterConfig.js
// Twitter投稿用の設定ファイル

import { affiliateLinks, affiliateConfig } from './affiliateConfig.js';

/**
 * Twitter投稿用のコンテンツを生成
 * affiliateConfig.jsの内容からTwitter用のツイートを作成
 */

// アフィリエイトリンクからTwitter用のツイートを生成する関数
export function createTweetsFromAffiliateLinks() {
  const tweets = [];

  affiliateLinks.forEach((linkContent, index) => {
    // 各アフィリエイトリンクをTwitterの280文字制限に合わせて調整
    const lines = linkContent.split('\n');
    
    // URLを抽出
    const urlLine = lines.find(line => line.startsWith('https://'));
    if (!urlLine) return;

    // タイトル行を抽出（👆で始まる行）
    const titleLine = lines.find(line => line.includes('👆'));
    const title = titleLine ? titleLine.replace('👆', '').trim() : '';

    // 説明文を抽出（最初の2行のみ使用してTwitterの文字数制限に対応）
    const descriptionLines = lines.filter(line => 
      !line.startsWith('https://') && 
      !line.includes('👆') &&
      !line.includes('📚') &&
      !line.includes('💧') &&
      !line.includes('🥤') &&
      !line.includes('🍅') &&
      !line.includes('🍵') &&
      !line.includes('💪') &&
      !line.includes('🍚') &&
      !line.includes('☕') &&
      !line.includes('🫖') &&
      !line.includes('🧘') &&
      !line.includes('🧴') &&
      !line.includes('📖') &&
      line.trim() !== ''
    ).slice(0, 2); // 最初の2行のみ

    // ハッシュタグの生成
    let hashtags = '#Amazon #おすすめ';
    if (linkContent.includes('引き寄せ')) {
      hashtags = '#読書 #自己啓発 #引き寄せの法則';
    } else if (linkContent.includes('天然水') || linkContent.includes('炭酸水')) {
      hashtags = '#健康 #水分補給';
    } else if (linkContent.includes('トマトジュース')) {
      hashtags = '#健康 #トマトジュース';
    } else if (linkContent.includes('緑茶')) {
      hashtags = '#健康 #お茶';
    } else if (linkContent.includes('プロテイン')) {
      hashtags = '#筋トレ #プロテイン #ダイエット';
    } else if (linkContent.includes('発芽米')) {
      hashtags = '#健康 #お米';
    }

    // ツイート本文を構築（280文字以内に収める）
    const tweetParts = [
      title,
      '',
      ...descriptionLines,
      '',
      urlLine,
      '',
      hashtags,
    ];

    let tweet = tweetParts.join('\n');

    // 280文字を超える場合は説明文を削減
    if (tweet.length > 280) {
      const shortTweetParts = [
        title,
        '',
        descriptionLines[0], // 最初の1行のみ
        '',
        urlLine,
        '',
        hashtags,
      ];
      tweet = shortTweetParts.join('\n');
    }

    // それでも280文字を超える場合は、説明文を完全に削除
    if (tweet.length > 280) {
      tweet = [
        title,
        '',
        urlLine,
        '',
        hashtags,
      ].join('\n');
    }

    tweets.push({
      content: tweet.trim(),
      index: index + 1,
      productType: title,
    });
  });

  return tweets;
}

/**
 * カスタムツイートを作成する関数
 * @param {string} title - 商品タイトル
 * @param {string} url - AmazonアフィリエイトURL
 * @param {Array<string>} descriptions - 説明文の配列
 * @param {string} hashtags - ハッシュタグ
 * @returns {string} ツイート本文
 */
export function createCustomTweet({ title, url, descriptions = [], hashtags = '#Amazon' }) {
  const tweetParts = [
    title,
    '',
    ...descriptions.slice(0, 2), // 最大2行まで
    '',
    url,
    '',
    hashtags,
  ];

  let tweet = tweetParts.join('\n');

  // 280文字制限のチェック
  if (tweet.length > 280) {
    const shortTweetParts = [
      title,
      '',
      descriptions[0] || '',
      '',
      url,
      '',
      hashtags,
    ];
    tweet = shortTweetParts.join('\n');
  }

  if (tweet.length > 280) {
    tweet = [
      title,
      '',
      url,
      '',
      hashtags,
    ].join('\n');
  }

  return tweet.trim();
}

/**
 * ランダムに指定数のツイートを選択
 * @param {number} count - 選択するツイート数
 * @returns {Array} 選択されたツイートの配列
 */
export function getRandomTweets(count = 3) {
  const allTweets = createTweetsFromAffiliateLinks();
  const shuffled = [...allTweets].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * 特定のインデックスのツイートを取得
 * @param {number} index - ツイートのインデックス（0始まり）
 * @returns {Object|null} ツイートオブジェクト
 */
export function getTweetByIndex(index) {
  const allTweets = createTweetsFromAffiliateLinks();
  return allTweets[index] || null;
}

/**
 * すべてのツイートを取得
 * @returns {Array} すべてのツイートの配列
 */
export function getAllTweets() {
  return createTweetsFromAffiliateLinks();
}

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

