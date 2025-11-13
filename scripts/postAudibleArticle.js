#!/usr/bin/env node
// scripts/postAudibleArticle.js
// Audible記事を定期自動投稿するスクリプト

import { Logger, postAudibleArticle, runWithCore } from '@aa-0921/note-auto-core';
import { audibleArticleSections, audibleArticleTitles, audibleArticleHeaderSections, audibleArticleFooterHashtags } from './audibleArticleContent.js';
import { affiliateConfig } from './affiliateConfig.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger();

async function main() {
  const dryrun = process.argv.includes('--dryrun');
  const selectCount = parseInt(process.argv.find(arg => arg.startsWith('--count='))?.split('=')[1] || '10', 10);

  logger.info('========================================');
  logger.info('🎧 Audible記事の投稿処理');
  logger.info('========================================');
  logger.info('');
  logger.info(`モード: ${dryrun ? 'Dryrun（テスト実行）' : '本番投稿'}`);
  logger.info(`選択セクション数: ${selectCount}`);
  logger.info(`全セクション数: ${audibleArticleSections.length}`);
  logger.info(`固定セクション数: ${audibleArticleHeaderSections.length}`);
  logger.info(`タイトル候補数: ${audibleArticleTitles.length}`);
  logger.info('');

  await runWithCore(async ({ core }) => {
    await postAudibleArticle({
      core,
      sections: audibleArticleSections,
      headerSections: audibleArticleHeaderSections,
      footerHashtags: audibleArticleFooterHashtags,
      titles: audibleArticleTitles,
      selectCount,
      thumbnailDir: 'thumbnails/audible',
      affiliateTag: affiliateConfig.affiliateTag,
      dryrun,
      logger,
    });
  });
}

main().catch((error) => {
  logger.error('❌ エラーが発生しました:', error);
  process.exit(1);
});

