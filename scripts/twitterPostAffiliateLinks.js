// scripts/twitterPostAffiliateLinks.js
// Twitter（X）へアフィリエイトリンクを投稿するスクリプト

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PuppeteerManager, TwitterPublisher, Logger } from '@aa-0921/note-auto-core';
import { 
  getAllTweets, 
  getRandomTweets, 
  getTweetByIndex,
  twitterPostConfig 
} from './twitterConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .envファイルを読み込み
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const logger = new Logger();

/**
 * コマンドライン引数の解析
 */
function parseArgs() {
  const args = process.argv.slice(2);
  
  const options = {
    mode: 'random', // random, all, single, multiple
    count: 3,       // ランダムモードで投稿する数
    indices: [],    // 個別指定のインデックス
    interval: twitterPostConfig.intervalMs,
    headless: twitterPostConfig.headless,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--all':
        options.mode = 'all';
        break;
      case '--random':
        options.mode = 'random';
        if (args[i + 1] && !args[i + 1].startsWith('--')) {
          options.count = parseInt(args[i + 1], 10);
          i++;
        }
        break;
      case '--index':
        options.mode = 'single';
        if (args[i + 1] && !args[i + 1].startsWith('--')) {
          options.indices = [parseInt(args[i + 1], 10)];
          i++;
        }
        break;
      case '--indices':
        options.mode = 'multiple';
        if (args[i + 1] && !args[i + 1].startsWith('--')) {
          options.indices = args[i + 1].split(',').map(n => parseInt(n.trim(), 10));
          i++;
        }
        break;
      case '--interval':
        if (args[i + 1] && !args[i + 1].startsWith('--')) {
          options.interval = parseInt(args[i + 1], 10) * 1000; // 秒をミリ秒に変換
          i++;
        }
        break;
      case '--headless':
        options.headless = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
    }
  }

  return options;
}

/**
 * ヘルプメッセージの表示
 */
function printHelp() {
  console.log(`
Twitter投稿スクリプト - 使用方法

基本的な使い方:
  node scripts/twitterPostAffiliateLinks.js [オプション]

オプション:
  --random [数]        ランダムに指定数のツイートを投稿（デフォルト: 3）
  --all               すべてのアフィリエイトリンクを投稿
  --index [番号]       指定したインデックスのツイートを投稿（0始まり）
  --indices [番号,番号] 複数のインデックスを指定して投稿（例: 0,2,5）
  --interval [秒数]    投稿間隔を秒で指定（デフォルト: 30秒）
  --headless          ヘッドレスモードで実行
  --help, -h          このヘルプメッセージを表示

使用例:
  # ランダムに3件投稿
  node scripts/twitterPostAffiliateLinks.js --random 3

  # すべて投稿（60秒間隔）
  node scripts/twitterPostAffiliateLinks.js --all --interval 60

  # インデックス0のツイートを投稿
  node scripts/twitterPostAffiliateLinks.js --index 0

  # インデックス0, 2, 5のツイートを投稿
  node scripts/twitterPostAffiliateLinks.js --indices 0,2,5

  # ヘッドレスモードでランダムに5件投稿
  node scripts/twitterPostAffiliateLinks.js --random 5 --headless

環境変数:
  NOTE_EMAIL          - Twitterログイン用のメールアドレス
  TWITTER_PASSWORD    - Twitterのパスワード
  TWITTER_USER_NAME   - Twitterのユーザー名（追加認証用、オプション）
  `);
}

/**
 * 投稿するツイートを取得
 */
function getTweetsToPost(options) {
  switch (options.mode) {
    case 'all':
      return getAllTweets();
    case 'random':
      return getRandomTweets(options.count);
    case 'single':
      const singleTweet = getTweetByIndex(options.indices[0]);
      return singleTweet ? [singleTweet] : [];
    case 'multiple':
      return options.indices
        .map(index => getTweetByIndex(index))
        .filter(tweet => tweet !== null);
    default:
      return getRandomTweets(options.count);
  }
}

/**
 * メイン処理
 */
async function main() {
  let puppeteerManager = null;

  try {
    // 環境変数の確認
    const email = process.env.NOTE_EMAIL;
    const password = process.env.TWITTER_PASSWORD;
    const username = process.env.TWITTER_USER_NAME; // 追加認証用（オプション）

    if (!email || !password) {
      throw new Error('NOTE_EMAIL と TWITTER_PASSWORD の環境変数を設定してください');
    }
    
    if (!username) {
      logger.warn('TWITTER_USER_NAME が設定されていません。追加認証が必要な場合はログインに失敗します。');
    }

    // コマンドライン引数の解析
    const options = parseArgs();

    logger.info('=== Twitter投稿スクリプト開始 ===');
    logger.info(`モード: ${options.mode}`);
    logger.info(`投稿間隔: ${options.interval / 1000}秒`);
    logger.info(`ヘッドレス: ${options.headless ? 'ON' : 'OFF'}`);

    // 投稿するツイートを取得
    const tweetsToPost = getTweetsToPost(options);

    if (tweetsToPost.length === 0) {
      logger.warn('投稿するツイートがありません');
      return;
    }

    logger.info(`投稿するツイート数: ${tweetsToPost.length}件`);
    logger.info('');

    // 投稿内容のプレビュー
    logger.info('=== 投稿内容プレビュー ===');
    tweetsToPost.forEach((tweet, index) => {
      logger.info(`\n[${index + 1}/${tweetsToPost.length}] ${tweet.productType || 'ツイート'}`);
      logger.info('---');
      logger.info(tweet.content);
      logger.info('---');
      logger.info(`文字数: ${tweet.content.length}文字`);
    });
    logger.info('');

    // 5秒待機（内容確認のため）
    logger.info('5秒後に投稿を開始します...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // PuppeteerManagerの初期化
    const config = {};
    puppeteerManager = new PuppeteerManager(config, options.headless);

    await puppeteerManager.initialize();
    const page = await puppeteerManager.createPage();

    // TwitterPublisherの初期化
    const twitterPublisher = new TwitterPublisher(config, puppeteerManager);

    // Twitterにログイン（username は追加認証用）
    logger.info('Twitterにログインします...');
    await twitterPublisher.login(page, email, password, username);

    // ツイートを投稿
    logger.info('');
    logger.info('=== ツイート投稿開始 ===');

    const contents = tweetsToPost.map(tweet => tweet.content);
    await twitterPublisher.postMultipleTweets(page, contents, options.interval);

    logger.info('');
    logger.info('=== Twitter投稿スクリプト完了 ===');
    logger.info(`合計 ${tweetsToPost.length}件のツイートを投稿しました`);

    // 5秒待機してからブラウザを閉じる
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (error) {
    logger.error('エラーが発生しました:', error);
    throw error;
  } finally {
    if (puppeteerManager) {
      await puppeteerManager.cleanup();
    }
  }
}

// スクリプト実行
main().catch(error => {
  logger.error('スクリプト実行エラー:', error);
  process.exit(1);
});

