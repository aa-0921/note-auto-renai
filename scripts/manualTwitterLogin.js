#!/usr/bin/env node
// scripts/manualTwitterLogin.js
// 手動でTwitterにログインし、Cookieを保存するスクリプト

import { runWithCore, TwitterPublisher } from '@aa-0921/note-auto-core';
import dotenv from 'dotenv';
import readline from 'readline';

// .envファイルを読み込む
dotenv.config();

console.log('========================================');
console.log('Twitter 手動ログイン & Cookie保存スクリプト');
console.log('========================================');
console.log('');
console.log('このスクリプトは、ブラウザを開いて手動でログインします。');
console.log('ログイン成功後、自動的にCookieを保存します。');
console.log('');
console.log('手順:');
console.log('1. ブラウザが自動的に開きます');
console.log('2. Twitterのログイン画面が表示されます');
console.log('3. 手動でメールアドレス、パスワード、追加認証（必要な場合）を入力してください');
console.log('4. ログインに成功し、ホーム画面が表示されたら、Enterキーを押してください');
console.log('5. Cookieが自動的に保存されます');
console.log('');
console.log('========================================');
console.log('');

async function manualLogin() {
  try {
    const { core } = arguments[0];
    
    // PuppeteerManagerとページを取得
    const puppeteerManager = core.puppeteerManager;
    const page = await puppeteerManager.createPage();
    
    // TwitterPublisherのインスタンスを作成
    const twitterPublisher = new TwitterPublisher(core.configManager.config, puppeteerManager);
    
    // ブラウザ設定を最適化
    await twitterPublisher.setupPageForTwitter(page);
    
    console.log('✅ ブラウザを開きました');
    console.log('');
    
    // Twitterログインページに移動
    console.log('📱 Twitterログインページに移動します...');
    await page.goto('https://x.com/i/flow/login?lang=ja', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    
    console.log('✅ ログインページを開きました');
    console.log('');
    console.log('==========================================');
    console.log('⚠️  手動でログインしてください');
    console.log('==========================================');
    console.log('');
    console.log('1. ブラウザでメールアドレスを入力して「次へ」');
    console.log('2. 追加認証が必要な場合はユーザー名を入力して「次へ」');
    console.log('3. パスワードを入力して「ログイン」');
    console.log('4. ホーム画面（タイムライン）が表示されるまで待機');
    console.log('');
    console.log('ログイン完了後、このターミナルに戻って');
    console.log('Enterキーを押してください...');
    console.log('');
    
    // ユーザーがEnterキーを押すまで待機
    await new Promise(resolve => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('', () => {
        rl.close();
        resolve();
      });
    });
    
    console.log('');
    console.log('🔍 ログイン状態を確認しています...');
    
    // 現在のURLを確認
    const currentUrl = await page.url();
    console.log(`   現在のURL: ${currentUrl}`);
    
    // ログイン済みかどうかを確認
    const isLoggedIn = await page.evaluate(() => {
      const hasTimeline = !!document.querySelector('[data-testid="primaryColumn"]');
      const isHomePage = window.location.href.includes('/home');
      const isNotLoginPage = !window.location.href.includes('/login');
      return (hasTimeline || isHomePage) && isNotLoginPage;
    });
    
    if (!isLoggedIn) {
      console.error('');
      console.error('❌ エラー: ログインが完了していないようです');
      console.error('');
      console.error('以下を確認してください:');
      console.error('- ホーム画面（タイムライン）が表示されていますか？');
      console.error('- URLが https://x.com/home になっていますか？');
      console.error('');
      console.error('ログインが完了してから、もう一度このスクリプトを実行してください。');
      process.exit(1);
    }
    
    console.log('✅ ログインが確認されました');
    console.log('');
    
    // Cookieを保存
    console.log('💾 Cookieを保存しています...');
    await twitterPublisher.saveCookies(page);
    
    console.log('');
    console.log('========================================');
    console.log('✅ Cookie保存完了！');
    console.log('========================================');
    console.log('');
    console.log('次のステップ:');
    console.log('1. 以下のコマンドを実行してBase64エンコードします:');
    console.log('   node scripts/generateTwitterCookies.js');
    console.log('');
    console.log('2. 出力されたBase64文字列をGitHub Secretsに登録:');
    console.log('   Secret名: TWITTER_COOKIES');
    console.log('');
    console.log('========================================');
    
    // ブラウザを3秒後に閉じる
    console.log('');
    console.log('3秒後にブラウザを閉じます...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('');
    console.error('❌ エラーが発生しました:', error.message);
    console.error('');
    throw error;
  }
}

// 実行
console.log('⏳ 初期化中...');
console.log('');

await runWithCore(manualLogin, {
  background: false, // ブラウザを表示
  skipLogin: true,   // 自動ログインをスキップ
});

