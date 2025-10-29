// scripts/twitterConfig.js
// Twitter投稿用の設定ファイル

import { affiliateLinks, affiliateConfig } from './affiliateConfig.js';

/**
 * Twitter投稿用のコンテンツを生成
 * affiliateConfig.jsの内容からTwitter用のツイートを作成
 */

// noteアカウントURLを生成
function getNoteAccountUrl() {
  const accountName = process.env.NOTE_ACCOUNT_NAME;
  
  if (!accountName) {
    throw new Error('NOTE_ACCOUNT_NAME環境変数が設定されていません。.envファイルに NOTE_ACCOUNT_NAME=your_account_name を追加してください。');
  }
  
  return `https://note.com/${accountName}`;
}

// アフィリエイトリンクからTwitter用のツイートを生成する関数
export function createTweetsFromAffiliateLinks() {
  const tweets = [];
  const noteUrl = getNoteAccountUrl();

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

    // ハッシュタグは一旦削除（投稿の邪魔になる可能性があるため）
    // let hashtags = '#Amazon #おすすめ';
    
    // ツイート本文を構築（280文字以内に収める）
    const tweetParts = [
      `note → ${noteUrl}`,
      '',
      title,
      '',
      ...descriptionLines,
      '',
      urlLine,
    ];

    let tweet = tweetParts.join('\n');

    // 280文字を超える場合は説明文を削減
    if (tweet.length > 280) {
      const shortTweetParts = [
        `note → ${noteUrl}`,
        '',
        title,
        '',
        descriptionLines[0], // 最初の1行のみ
        '',
        urlLine,
      ];
      tweet = shortTweetParts.join('\n');
    }

    // それでも280文字を超える場合は、説明文を完全に削除
    if (tweet.length > 280) {
      tweet = [
        `note → ${noteUrl}`,
        '',
        title,
        '',
        urlLine,
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
 * @returns {string} ツイート本文
 */
export function createCustomTweet({ title, url, descriptions = [] }) {
  const noteUrl = getNoteAccountUrl();
  
  const tweetParts = [
    `note → ${noteUrl}`,
    '',
    title,
    '',
    ...descriptions.slice(0, 2), // 最大2行まで
    '',
    url,
  ];

  let tweet = tweetParts.join('\n');

  // 280文字制限のチェック
  if (tweet.length > 280) {
    const shortTweetParts = [
      `note → ${noteUrl}`,
      '',
      title,
      '',
      descriptions[0] || '',
      '',
      url,
    ];
    tweet = shortTweetParts.join('\n');
  }

  if (tweet.length > 280) {
    tweet = [
      `note → ${noteUrl}`,
      '',
      title,
      '',
      url,
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
  
  // ヘッドレスモード
  // GitHub Actions環境では自動的にtrueに、ローカル環境ではfalse（ブラウザを表示）
  headless: process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true',
  
  // デバッグモード
  debug: true,
};

