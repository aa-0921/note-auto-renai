// scripts/twitterPostAffiliateLinks.js
// Twitter（X）へアフィリエイトリンクを投稿するスクリプト

import { 
  Logger, 
  runTwitterPostSimple,
  createGetTweetsCallback
} from '@aa-0921/note-auto-core';
import { 
  getAllTweets, 
  getRandomTweets, 
  getTweetByIndex,
  twitterPostConfig 
} from './twitterConfig.js';

const logger = new Logger();

// Twitter投稿を実行
runTwitterPostSimple({
  getTweetsCallback: createGetTweetsCallback({
    getAll: getAllTweets,
    getRandom: getRandomTweets,
    getByIndex: getTweetByIndex
  }),
  defaultConfig: twitterPostConfig,
  scriptPath: import.meta.url
}).catch(error => {
  logger.error('スクリプト実行エラー:', error);
  process.exit(1);
});

