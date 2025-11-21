#!/usr/bin/env node
// scripts/postSaleTweet.js
// Amazonセール情報（ブラックフライデーセール）をTwitterに自動投稿するスクリプト

import { Logger, postSaleTweet } from '@aa-0921/note-auto-core';
import { 
  saleTweetMessages, 
  saleTweetHashtags, 
  saleTweetAffiliateLinks
} from './saleTweetContent.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger();

async function main() {
  const dryrun = process.argv.includes('--dryrun');
  const maxLinks = process.argv.find(arg => arg.startsWith('--maxLinks='))?.split('=')[1];
  // maxLinksが指定されていない場合は1（デフォルト）

  logger.info('========================================');
  logger.info('🎉 Amazonセール情報（ブラックフライデーセール）のTwitter投稿処理');
  logger.info('========================================');
  logger.info('');
  logger.info(`モード: ${dryrun ? 'Dryrun（テスト実行）' : '本番投稿'}`);
  logger.info(`メッセージ候補数: ${saleTweetMessages.length}`);
  logger.info(`ハッシュタグ数: ${saleTweetHashtags.length}`);
  logger.info(`アフィリエイトリンク数: ${saleTweetAffiliateLinks.length}`);
  logger.info(`使用するアフィリエイトリンク数: ${maxLinks ? parseInt(maxLinks, 10) : 1}`);
  logger.info('');

  await postSaleTweet({
    messages: saleTweetMessages,
    hashtags: saleTweetHashtags,
    affiliateLinks: saleTweetAffiliateLinks,
    maxLinks: maxLinks ? parseInt(maxLinks, 10) : 1,
    dryrun,
    logger,
  });
}

main().catch((error) => {
  logger.error('❌ エラーが発生しました:', error);
  process.exit(1);
});

