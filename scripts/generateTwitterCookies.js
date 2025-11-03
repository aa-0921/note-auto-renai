#!/usr/bin/env node
// scripts/generateTwitterCookies.js
// Twitterログイン後のCookieを取得してBase64エンコードするスクリプト

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cookie保存パスを設定
const cookiesPath = path.join(process.cwd(), 'twitter-cookies.json');

console.log('Twitter Cookie生成スクリプト');
console.log('================================');
console.log('');
console.log('手順:');
console.log('1. まず、以下のコマンドでTwitterにログインしてください:');
console.log('   node scripts/manualTwitterLogin.js');
console.log('');
console.log('2. ログインに成功すると、twitter-cookies.jsonファイルが生成されます');
console.log('');
console.log('3. このスクリプトを実行して、CookieをBase64エンコードします:');
console.log('   node scripts/generateTwitterCookies.js');
console.log('');

// Cookieファイルの存在確認
if (!fs.existsSync(cookiesPath)) {
  console.error('❌ エラー: twitter-cookies.jsonファイルが見つかりません');
  console.error('');
  console.error('先に以下のコマンドでTwitterにログインしてください:');
  console.error('  node scripts/manualTwitterLogin.js');
  process.exit(1);
}

try {
  // Cookieファイルを読み込む
  const cookiesString = fs.readFileSync(cookiesPath, 'utf-8');
  const cookies = JSON.parse(cookiesString);
  
  console.log(`✅ Cookieファイルを読み込みました: ${cookiesPath}`);
  console.log(`   Cookie数: ${cookies.length}個`);
  console.log('');
  
  // CookieをBase64エンコード
  const base64Cookies = Buffer.from(cookiesString).toString('base64');
  
  console.log('================================');
  console.log('GitHub Secretsに登録する値:');
  console.log('================================');
  console.log('');
  console.log('Secret名: TWITTER_COOKIES');
  console.log('');
  console.log('Secret値（以下の文字列をコピーしてください）:');
  console.log('---');
  console.log(base64Cookies);
  console.log('---');
  console.log('');
  console.log('GitHub Secretsへの登録方法:');
  console.log('1. GitHubリポジトリのSettings → Secrets and variables → Actions');
  console.log('2. "New repository secret"をクリック');
  console.log('3. Name: TWITTER_COOKIES');
  console.log('4. Secret: 上記のBase64文字列をペースト');
  console.log('5. "Add secret"をクリック');
  console.log('');
  console.log('✅ Cookie生成完了！');
  
} catch (error) {
  console.error('❌ エラーが発生しました:', error.message);
  process.exit(1);
}

