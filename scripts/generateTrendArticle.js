#!/usr/bin/env node
// scripts/generateTrendArticle.js
// Googleトレンド記事自動生成・自動投稿スクリプト
// Googleトレンドの最初のキーワードを自動取得して記事を生成します

import { GoogleTrendArticleService, ConfigManager, Logger } from '@aa-0921/note-auto-core';
import { affiliateConfig } from './affiliateConfig.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger();

async function main() {
  logger.info('========================================');
  logger.info('🔥 Googleトレンド記事自動生成・自動投稿');
  logger.info('========================================');
  logger.info('');
  logger.info('キーワード: 自動取得（Googleトレンドの最初のキーワード）');
  logger.info('');
  
  const configManager = new ConfigManager();
  await configManager.loadConfig();
  
  const trendService = new GoogleTrendArticleService(configManager.config, logger);
  
  try {
    // Googleトレンド記事を生成・投稿
    const result = await trendService.generateAndPublishTrendArticle({
      keyword: null, // 常に自動取得
      aiOptions: {
        systemMessage: [
          'あなたは恋愛・人間関係の専門ライターです。',
          'Googleトレンドの情報を基に、恋愛・人間関係の視点から読みやすく興味深い記事を作成してください。',
          '記事は以下の要件を満たしてください:',
          '- 見出し（##）を使って構造化する',
          '- 恋愛・人間関係の視点を織り交ぜる',
          '- 情報の要点を分かりやすく説明する',
          '- 最後にまとめを追加する',
        ].join('\n'),
        maxTokens: 2000,
        temperature: 0.7,
      },
      publishOptions: {
        titleEmojis: ['🔥', '📈', '💡', '✨', '🎯', '💕', '❤️'], // タイトルに追加する絵文字
      },
    });
    
    logger.info('');
    logger.info('========================================');
    logger.info('✅ 実行完了');
    logger.info('========================================');
    logger.info(`キーワード: ${result.keyword}`);
    logger.info(`タイトル: ${result.title}`);
    logger.info(`ニュースURL: ${result.newsUrl}`);
    logger.info('');
    
  } catch (error) {
    logger.error('❌ エラーが発生しました:', error.message);
    if (error.stack) {
      logger.error('スタックトレース:', error.stack);
    }
    process.exit(1);
  } finally {
    await trendService.cleanup();
  }
}

main().catch((error) => {
  logger.error('❌ 予期しないエラーが発生しました:', error);
  process.exit(1);
});

