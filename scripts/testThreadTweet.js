#!/usr/bin/env node

/**
 * スレッド投稿のテストスクリプト
 * 
 * 使用例:
 * node scripts/testThreadTweet.js
 * node scripts/testThreadTweet.js --dryrun
 */

import 'dotenv/config';
import TwitterAPIClient from '@aa-0921/note-auto-core/src/core/TwitterAPIClient.js';
import Logger from '@aa-0921/note-auto-core/src/utils/Logger.js';

const logger = new Logger();

// コマンドライン引数の解析
const args = process.argv.slice(2);
const isDryrun = args.includes('--dryrun');

async function main() {
  try {
    logger.info('========================================');
    logger.info('スレッド投稿テスト');
    logger.info('========================================');
    logger.info('');

    if (isDryrun) {
      logger.info('⚠️ DRYRUNモード: 実際には投稿しません');
      logger.info('');
      logger.info('🔍 DRYRUNモード: スレッド投稿の内容を表示します');
      logger.info('');
      
      const tweets = [
        '【スレッド】🧵\n\nフォロワーを増やすための10のコツ\n\n1/11',
        '1️⃣ プロフィールを最適化する\n\n・プロフィール画像\n・ヘッダー画像\n・自己紹介文\n・固定ツイート\n\n2/11',
        '2️⃣ 投稿の質を上げる\n\n・保存される投稿\n・共感される投稿\n・議論される投稿\n\n3/11',
        '3️⃣ 投稿時間を最適化する\n\n・朝: 7-8時\n・昼: 12-13時\n・夕: 18-19時\n・夜: 21-22時\n\n4/11',
        '4️⃣ ハッシュタグを活用する\n\n・トレンドハッシュタグ\n・ニッチなハッシュタグ\n・5個以内が理想\n\n5/11',
        '5️⃣ エンゲージメントを高める\n\n・質問形式\n・投票機能\n・リプライに返信\n\n6/11',
        '6️⃣ リプライ戦略\n\n・インフルエンサーにリプライ\n・価値ある内容\n・早めにリプライ\n\n7/11',
        '7️⃣ 画像・動画を活用する\n\n・テキストのみより3倍エンゲージメント\n・画像は必須\n・動画はさらに効果的\n\n8/11',
        '8️⃣ 一貫性を保つ\n\n・毎日投稿\n・同じ時間帯\n・同じトーン\n\n9/11',
        '9️⃣ データを分析する\n\n・アナリティクスをチェック\n・バズった投稿を分析\n・再現する\n\n10/11',
        '🔟 継続する\n\n結局これが一番大事💪\n\n諦めずに続ければ、\n必ず結果は出ます！\n\n11/11 (終)',
      ];

      tweets.forEach((tweet, index) => {
        logger.info(`[${index + 1}/${tweets.length}]:`);
        logger.info(tweet);
        logger.info('---');
      });

      logger.info('✅ DRYRUNモード完了（実際には投稿していません）');
      return;
    }

    // 実際にスレッドを投稿
    logger.info('🚀 スレッド投稿を開始します');
    logger.info('');

    // TwitterAPIクライアントを作成
    const twitterClient = new TwitterAPIClient(logger);
    await twitterClient.initialize();
    logger.info('✅ TwitterAPIクライアントを初期化しました');
    logger.info('');

    // スレッドの内容（テキストのみの例）
    const tweets = [
      '【スレッド】🧵\n\nフォロワーを増やすための10のコツ\n\n1/11',
      '1️⃣ プロフィールを最適化する\n\n・プロフィール画像\n・ヘッダー画像\n・自己紹介文\n・固定ツイート\n\n2/11',
      '2️⃣ 投稿の質を上げる\n\n・保存される投稿\n・共感される投稿\n・議論される投稿\n\n3/11',
      '3️⃣ 投稿時間を最適化する\n\n・朝: 7-8時\n・昼: 12-13時\n・夕: 18-19時\n・夜: 21-22時\n\n4/11',
      '4️⃣ ハッシュタグを活用する\n\n・トレンドハッシュタグ\n・ニッチなハッシュタグ\n・5個以内が理想\n\n5/11',
      '5️⃣ エンゲージメントを高める\n\n・質問形式\n・投票機能\n・リプライに返信\n\n6/11',
      '6️⃣ リプライ戦略\n\n・インフルエンサーにリプライ\n・価値ある内容\n・早めにリプライ\n\n7/11',
      '7️⃣ 画像・動画を活用する\n\n・テキストのみより3倍エンゲージメント\n・画像は必須\n・動画はさらに効果的\n\n8/11',
      '8️⃣ 一貫性を保つ\n\n・毎日投稿\n・同じ時間帯\n・同じトーン\n\n9/11',
      '9️⃣ データを分析する\n\n・アナリティクスをチェック\n・バズった投稿を分析\n・再現する\n\n10/11',
      '🔟 継続する\n\n結局これが一番大事💪\n\n諦めずに続ければ、\n必ず結果は出ます！\n\n11/11 (終)',
    ];

    const result = await twitterClient.postThreadTweets(tweets);

    logger.info('');
    logger.info('========================================');
    logger.info('✅ スレッド投稿が完了しました');
    logger.info('========================================');
    logger.info(`投稿数: ${result.length}件`);
    logger.info(`最初のツイートURL: https://twitter.com/i/status/${result[0].id}`);
    logger.info('');

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

