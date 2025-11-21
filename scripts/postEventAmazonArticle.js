#!/usr/bin/env node
// scripts/postEventAmazonArticle.js
// イベント告知記事（アマゾンセール）を定期自動投稿するスクリプト

import { Logger, postEventArticle, runWithCore } from '@aa-0921/note-auto-core';
import { 
  eventAmazonArticleSections, 
  eventAmazonArticleTitles, 
  eventAmazonArticleHeaderSections, 
  eventAmazonArticleFooterHashtags,
  eventAmazonArticleFixedAffiliateLinks,
  eventAmazonArticleRandomAffiliateLinks
} from './eventAmazonArticleContent.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger();

async function main() {
  const dryrun = process.argv.includes('--dryrun');
  const selectCount = process.argv.find(arg => arg.startsWith('--count='))?.split('=')[1];
  // selectCountが指定されていない場合はnull（全セクションを使用）

  logger.info('========================================');
  logger.info('🎉 イベント告知記事（アマゾンセール）の投稿処理');
  logger.info('========================================');
  logger.info('');
  logger.info(`モード: ${dryrun ? 'Dryrun（テスト実行）' : '本番投稿'}`);
  logger.info(`選択セクション数: ${selectCount ? selectCount : '全セクションを使用'}`);
  logger.info(`全セクション数: ${eventAmazonArticleSections.length}`);
  logger.info(`固定セクション数: ${eventAmazonArticleHeaderSections.length}`);
  logger.info(`タイトル候補数: ${eventAmazonArticleTitles.length}`);
  logger.info(`固定アフィリエイトリンク数: ${eventAmazonArticleFixedAffiliateLinks.length}`);
  logger.info(`ランダムアフィリエイトリンク数: ${eventAmazonArticleRandomAffiliateLinks.length}（この中から3つを選択）`);
  logger.info('');

  await runWithCore(async ({ core }) => {
    await postEventArticle({
      core,
      sections: eventAmazonArticleSections,
      headerSections: eventAmazonArticleHeaderSections,
      footerHashtags: eventAmazonArticleFooterHashtags,
      titles: eventAmazonArticleTitles,
      fixedAffiliateLinks: eventAmazonArticleFixedAffiliateLinks,
      randomAffiliateLinks: eventAmazonArticleRandomAffiliateLinks,
      selectCount: selectCount ? parseInt(selectCount, 10) : null, // nullの場合は全セクションを使用
      thumbnailDir: 'thumbnails',
      thumbnailPath: null, // 特定のサムネイル画像を指定する場合はここにパスを指定
      dryrun,
      logger,
    });
  });
}

main().catch((error) => {
  logger.error('❌ エラーが発生しました:', error);
  process.exit(1);
});

