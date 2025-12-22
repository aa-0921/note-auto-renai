#!/usr/bin/env node
// scripts/postTimeSaleArticle.js
// タイムセール記事を定期自動投稿するスクリプト

import { Logger, postTimeSaleArticle, runWithCore } from '@aa-0921/note-auto-core';
import { 
  timeSaleArticleSections, 
  timeSaleArticleTitles, 
  timeSaleArticleHeaderSections, 
  timeSaleArticleFooterHashtags,
  timeSaleFixedText
} from './timeSaleArticleContent.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger();

async function main() {
  const dryrun = process.argv.includes('--dryrun');
  const selectCount = process.argv.find(arg => arg.startsWith('--count='))?.split('=')[1];
  // selectCountが指定されていない場合はnull（全セクションを使用）

  logger.info('========================================');
  logger.info('⏰ タイムセール記事の投稿処理');
  logger.info('========================================');
  logger.info('');
  logger.info(`モード: ${dryrun ? 'Dryrun（テスト実行）' : '本番投稿'}`);
  logger.info(`選択セクション数: ${selectCount ? selectCount : '全セクションを使用'}`);
  logger.info(`全セクション数: ${timeSaleArticleSections.length}`);
  logger.info(`固定セクション数: ${timeSaleArticleHeaderSections.length}`);
  logger.info(`タイトル候補数: ${timeSaleArticleTitles.length}`);
  logger.info(`固定テキスト: ${timeSaleFixedText.substring(0, 50)}...`);
  logger.info('');

  await runWithCore(async ({ core }) => {
    await postTimeSaleArticle({
      core,
      sections: timeSaleArticleSections,
      headerSections: timeSaleArticleHeaderSections,
      footerHashtags: timeSaleArticleFooterHashtags,
      titles: timeSaleArticleTitles,
      timeSaleFixedText: timeSaleFixedText,
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

