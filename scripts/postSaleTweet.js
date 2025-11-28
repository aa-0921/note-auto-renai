#!/usr/bin/env node
// scripts/postSaleTweet.js
// Amazonセール情報（ブラックフライデーセール）をTwitterに自動投稿するスクリプト

import { Logger, postSaleTweet } from '@aa-0921/note-auto-core';
import { 
  saleTweetMessages, 
  saleTweetHashtags, 
  saleTweetAffiliateLinks,
  saleTweetPrefixVariations,
} from './saleTweetContent.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger();

/**
 * 配列からランダムに1要素を取得
 * @param {Array<any>} array - 対象配列
 * @returns {any} - ランダムに選ばれた要素
 */
function getRandomElement(array) {
  if (!Array.isArray(array) || array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

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

  // 差分用の短い文章を1つ選択して、各メインメッセージの先頭に付与する
  const prefix = getRandomElement(saleTweetPrefixVariations);
  if (prefix) {
    logger.info(`差分用メッセージ候補数: ${saleTweetPrefixVariations.length}`);
    logger.info(`今回使用する差分用メッセージ: ${prefix}`);
  } else {
    logger.warn('差分用メッセージ候補が空のため、そのまま投稿します');
  }

  const messagesWithPrefix = prefix
    ? saleTweetMessages.map((message) => `${prefix}\n\n${message}`)
    : saleTweetMessages;

  await postSaleTweet({
    messages: messagesWithPrefix,
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

