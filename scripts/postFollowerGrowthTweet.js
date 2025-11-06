#!/usr/bin/env node

/**
 * フォロワー増加用Twitter投稿スクリプト
 * 
 * 使用例:
 * node scripts/postFollowerGrowthTweet.js
 * node scripts/postFollowerGrowthTweet.js --dryrun
 */

import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import RandomPostService from '@aa-0921/note-auto-core/src/services/RandomPostService.js';
import Logger from '@aa-0921/note-auto-core/src/utils/Logger.js';
import { posts } from '../data/follower-growth-posts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger();

// コマンドライン引数の解析
const args = process.argv.slice(2);
const isDryrun = args.includes('--dryrun');

// プロジェクトルートディレクトリ（相対パスを解決するための基準）
const PROJECT_ROOT = path.resolve(__dirname, '..');

async function main() {
  try {
    logger.info('========================================');
    logger.info('フォロワー増加用Twitter投稿');
    logger.info('========================================');
    logger.info('');

    if (isDryrun) {
      logger.info('⚠️ DRYRUNモード: 実際には投稿しません');
      logger.info('');
    }

    // RandomPostServiceを使用して投稿
    const service = new RandomPostService(logger, {
      baseDir: PROJECT_ROOT  // 相対パスを解決するための基準ディレクトリ
    });

    await service.postRandomTweet(posts, { 
      dryrun: isDryrun,
      // 話題のハッシュタグを追加するか（文字数上限までギリギリ追加）
      includeTrending: false
    });

  } catch (error) {
    logger.error('❌ エラーが発生しました');
    logger.error('エラー内容:', error.message);
    if (error.stack) {
      logger.error('スタックトレース:', error.stack);
    }
    process.exit(1);
  }
}

main();
