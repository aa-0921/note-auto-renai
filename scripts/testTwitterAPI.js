#!/usr/bin/env node
// scripts/testTwitterAPI.js
// Twitter API v2のテストスクリプト

import { TwitterAPIClient } from '@aa-0921/note-auto-core';
import dotenv from 'dotenv';

// .envファイルを読み込む
dotenv.config();

console.log('========================================');
console.log('Twitter API v2 テストスクリプト');
console.log('========================================');
console.log('');

async function testTwitterAPI() {
  try {
    // TwitterAPIクライアントを作成
    const twitterClient = new TwitterAPIClient();
    
    console.log('✅ TwitterAPIクライアントを作成しました');
    console.log('');
    
    // クライアントを初期化
    twitterClient.initialize();
    console.log('✅ クライアントを初期化しました');
    console.log('');
    
    // 認証情報を確認
    console.log('🔍 認証情報を確認しています...');
    console.log('');
    const user = await twitterClient.verifyCredentials();
    
    console.log('');
    console.log('========================================');
    console.log('✅ 認証成功！');
    console.log('========================================');
    console.log('');
    console.log(`ユーザー名: @${user.username}`);
    console.log(`名前: ${user.name}`);
    console.log(`ユーザーID: ${user.id}`);
    console.log('');
    
    // テストツイートを投稿するか確認
    console.log('========================================');
    console.log('テストツイートを投稿しますか？');
    console.log('========================================');
    console.log('');
    console.log('投稿する場合は、以下のコマンドを実行してください:');
    console.log('  node scripts/testTwitterAPI.js --post');
    console.log('');
    
    // --postフラグがある場合はテストツイートを投稿
    if (process.argv.includes('--post')) {
      console.log('📝 テストツイートを投稿します...');
      console.log('');
      
      const tweetText = `テストツイート from Twitter API v2 🚀\n\n${new Date().toLocaleString('ja-JP')}`;
      const tweet = await twitterClient.postTweet(tweetText);
      
      console.log('');
      console.log('========================================');
      console.log('✅ ツイート投稿成功！');
      console.log('========================================');
      console.log('');
      console.log(`ツイートID: ${tweet.id}`);
      console.log(`ツイートURL: https://twitter.com/${user.username}/status/${tweet.id}`);
      console.log('');
    }
    
    console.log('========================================');
    console.log('✅ すべてのテストが完了しました');
    console.log('========================================');
    
  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('❌ エラーが発生しました');
    console.error('========================================');
    console.error('');
    console.error('エラー内容:', error.message);
    console.error('');
    
    if (error.message.includes('環境変数に設定されていません')) {
      console.error('以下を確認してください:');
      console.error('1. .envファイルにTwitter API認証情報を追加しましたか？');
      console.error('2. 環境変数名は正しいですか？');
      console.error('   - TWITTER_API_KEY');
      console.error('   - TWITTER_API_SECRET');
      console.error('   - TWITTER_ACCESS_TOKEN');
      console.error('   - TWITTER_ACCESS_TOKEN_SECRET');
      console.error('');
    }
    
    process.exit(1);
  }
}

// 実行
testTwitterAPI();

