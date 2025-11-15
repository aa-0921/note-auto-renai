#!/usr/bin/env node
// scripts/generateTrendArticle.js
// Googleトレンド記事自動生成・自動投稿スクリプト
// Googleトレンドの最初のキーワードを自動取得して記事を生成します

import { runWithCore, GoogleTrendArticleService, Logger } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    const logger = new Logger();
    
    logger.info('========================================');
    logger.info('🔥 Googleトレンド記事自動生成・自動投稿');
    logger.info('========================================');
    logger.info('');
    logger.info('キーワード: 自動取得（Googleトレンドの最初のキーワード）');
    logger.info('');
    
    // coreから設定を取得（config/account.yamlから読み込まれた設定）
    const config = core.configManager.config;
    
    const trendService = new GoogleTrendArticleService(config, logger);
    
    try {
      // Googleトレンド記事を生成・投稿
      const result = await trendService.generateAndPublishTrendArticle({
        keyword: null, // 常に自動取得
        aiOptions: {
          systemMessage: [
            'あなたは恋愛・人間関係の専門ライターです。',
            '収集した情報を基に、恋愛・人間関係の視点から読みやすく興味深い記事を作成してください。',
          ].join('\n'),
          // 追加の指示部分（基本部分はcore側で自動的に追加される）
          userPrompt: [
            '上記の情報のみを基に、以下の要件で記事を作成してください:',
            '- 収集した情報以外には言及せず、提供された情報のみを使用する',
            '- 見出し（##）を使って構造化する',
            '- 情報の要点を分かりやすく説明する',
            '- 収集した情報に対して、無難で建設的な自分の意見や考察を加える',
            '- 恋愛・人間関係の視点から、情報を解釈し、読者にとって価値のある洞察を提供する',
            '- 最後にまとめを追加する',
            '- 記事の長さは1500文字以上2000文字以内とする',
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
      throw error; // runWithCoreがエラーハンドリングする
    } finally {
      await trendService.cleanup();
    }
  });
})();

