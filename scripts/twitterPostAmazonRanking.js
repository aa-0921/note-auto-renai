#!/usr/bin/env node
// scripts/twitterPostAmazonRanking.js
// Amazon売れ筋ランキングリンクをTwitterに投稿するスクリプト

import { TwitterAPIClient, Logger } from '@aa-0921/note-auto-core';
import { amazonTopSellersRankingLinks } from './affiliateConfig.js';
import dotenv from 'dotenv';

// .envファイルを読み込む
dotenv.config();

const logger = new Logger();

/**
 * Amazon売れ筋ランキングリンクをランダムに1つ選択
 */
function getRandomRankingLink() {
  const randomIndex = Math.floor(Math.random() * amazonTopSellersRankingLinks.length);
  return amazonTopSellersRankingLinks[randomIndex];
}

/**
 * リンク情報をパースしてツイート用テキストを生成
 */
function createTweetText(linkData) {
  // join('\n')された文字列を改行で分割
  const lines = linkData.split('\n');
  
  // 各行を取得
  // インデックス0: 空行
  // インデックス1: 装飾行（絵文字）
  // インデックス2: URL
  // インデックス3: タイトル（👆から始まる）
  // インデックス4以降: 説明
  const url = lines[2];
  const titleLine = lines[3]; // "👆タイトル" の形式
  const title = titleLine.replace('👆', '').trim(); // 👆を削除
  
  // 説明行を収集（装飾行と空行を除く）
  const descriptionLines = [];
  for (let i = 4; i < lines.length - 2; i++) {
    const line = lines[i].trim();
    if (line && !line.includes('　')) { // 装飾行（全角スペース含む）を除外
      descriptionLines.push(line);
    }
  }
  // 最初の1〜2行のみ使用（280文字制限を考慮）
  const description = descriptionLines.slice(0, 2).join('\n');
  
  // ツイート用テキストを生成（URLは1回のみ、280文字以内に収める）
  const tweetText = `${title}

${description}

${url}

#amazon #アマゾン #ランキング #ranking`;
  
  return tweetText;
}

/**
 * メイン処理
 */
async function main() {
  try {
    logger.info('========================================');
    logger.info('Amazon売れ筋ランキング Twitter投稿スクリプト');
    logger.info('========================================');
    logger.info('');
    
    // TwitterAPIクライアントを作成
    const twitterClient = new TwitterAPIClient();
    logger.info('✅ TwitterAPIクライアントを作成しました');
    logger.info('');
    
    // クライアントを初期化
    twitterClient.initialize();
    logger.info('✅ クライアントを初期化しました');
    logger.info('');
    
    // 認証情報を確認
    logger.info('🔍 認証情報を確認しています...');
    logger.info('');
    const user = await twitterClient.verifyCredentials();
    
    logger.info('========================================');
    logger.info('✅ 認証成功！');
    logger.info('========================================');
    logger.info('');
    logger.info(`ユーザー名: @${user.username}`);
    logger.info(`名前: ${user.name}`);
    logger.info('');
    
    // ランキングリンクをランダムに選択
    logger.info('🎲 ランキングリンクをランダムに選択しています...');
    const selectedLink = getRandomRankingLink();
    
    // ツイート用テキストを生成
    const tweetText = createTweetText(selectedLink);
    
    logger.info('');
    logger.info('========================================');
    logger.info('📝 投稿内容');
    logger.info('========================================');
    logger.info('');
    console.log(tweetText);
    logger.info('');
    logger.info(`文字数: ${tweetText.length}文字`);
    logger.info('');
    
    // --dryrunフラグがある場合は投稿せずに終了
    if (process.argv.includes('--dryrun')) {
      logger.info('========================================');
      logger.info('🔍 Dryrunモード: 投稿はスキップされました');
      logger.info('========================================');
      logger.info('');
      logger.info('実際に投稿する場合は、--dryrunフラグを外して実行してください:');
      logger.info('  node scripts/twitterPostAmazonRanking.js');
      logger.info('');
      return;
    }
    
    // ツイートを投稿
    logger.info('📤 ツイートを投稿しています...');
    logger.info('');
    const tweet = await twitterClient.postTweet(tweetText);
    
    logger.info('========================================');
    logger.info('✅ ツイート投稿成功！');
    logger.info('========================================');
    logger.info('');
    logger.info(`ツイートID: ${tweet.id}`);
    logger.info(`ツイートURL: https://twitter.com/${user.username}/status/${tweet.id}`);
    logger.info('');
    
    logger.info('========================================');
    logger.info('✅ すべての処理が完了しました');
    logger.info('========================================');
    
  } catch (error) {
    logger.error('');
    logger.error('========================================');
    logger.error('❌ エラーが発生しました');
    logger.error('========================================');
    logger.error('');
    logger.error('エラー内容:', error.message);
    logger.error('');
    
    if (error.message.includes('環境変数が設定されていません')) {
      logger.error('以下を確認してください:');
      logger.error('1. .envファイルにTwitter API認証情報を追加しましたか？');
      logger.error('2. 環境変数名は正しいですか？');
      logger.error('   - TWITTER_API_KEY');
      logger.error('   - TWITTER_API_SECRET');
      logger.error('   - TWITTER_ACCESS_TOKEN');
      logger.error('   - TWITTER_ACCESS_TOKEN_SECRET');
      logger.error('   - TWITTER_BEARER_TOKEN');
      logger.error('');
    }
    
    process.exit(1);
  }
}

// 実行
main();

