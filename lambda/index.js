// Lambda本番用 + ローカルテスト両対応のnote自動投稿スクリプト
const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;
require('dotenv').config();

let puppeteer, launchOptions;

if (isLambda) {
  // Lambda本番用
  puppeteer = require('puppeteer-core');
  const chromium = require('chrome-aws-lambda');
  launchOptions = async () => ({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
} else {
  // ローカルテスト用
  puppeteer = require('puppeteer');
  launchOptions = async () => ({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });
}

async function main() {
  const options = await launchOptions();
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  // noteログインページへ
  await page.goto('https://note.com/login?redirectPath=https%3A%2F%2Fnote.com%2F', { waitUntil: 'networkidle2' });

  // 新しいセレクタで入力
  await page.type('#email', process.env.NOTE_EMAIL);
  await page.type('#password', process.env.NOTE_PASSWORD);

  // ログインボタンが有効化されるのを待つ
  await page.waitForSelector('button[type="button"]:not([disabled])');

  // ログインボタン（テキストが「ログイン」）をクリック
  const buttons = await page.$$('button[type="button"]');
  for (const btn of buttons) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text && text.trim() === 'ログイン') {
      await btn.click();
      break;
    }
  }
  await page.waitForNavigation();

  // ログイン後、ユーザーポップアップがあれば閉じる
  const closePopupBtn = await page.$('button.o-userPopup__close[aria-label="閉じる"]');
  if (closePopupBtn) {
    console.log('ユーザーポップアップを閉じます');
    await closePopupBtn.click();
    await page.waitForTimeout(500);
  }

  // 投稿ボタンを探してクリック
  console.log('投稿ボタンを探します...');
  const postButtons = await page.$$('button[aria-label="投稿"]');
  let clicked = false;
  for (const btn of postButtons) {
    // 画面上に表示されているか確認
    const isVisible = await btn.isIntersectingViewport();
    if (isVisible) {
      console.log('表示されている投稿ボタンをクリックします。');
      await btn.click();
      clicked = true;
      break;
    }
  }
  if (!clicked) {
    const html = await page.content();
    console.error('表示されている投稿ボタンが見つかりませんでした。HTMLの一部:', html.slice(0, 1000));
    throw new Error('表示されている投稿ボタンが見つかりませんでした');
  }

  // 「テキスト」メニューをクリック
  console.log('テキストメニューを探します...');
  await page.waitForSelector('a[href="/notes/new"]');
  await page.click('a[href="/notes/new"]');
  await page.waitForNavigation();
  console.log('新規投稿画面に遷移しました');

  // === ここから新規投稿画面での入力処理 ===
  // 記事データの読み込み
  const fs = require('fs');
  const path = require('path');
  const articlePath = path.join(__dirname, '../posts/8__2025-05-25-大失恋から自分を好きになるまでのリアルストーリー＜前編＞.md');
  const articleRaw = fs.readFileSync(articlePath, 'utf-8');
  // タイトルはファイル先頭の# ...行から抽出
  const titleMatch = articleRaw.match(/^#\s*(.+)$/m);
  const articleTitle = titleMatch ? titleMatch[1].trim() : 'タイトル未取得';
  // 本文はファイル内容全体
  const articleBody = articleRaw;

  // タイトル<textarea>を取得して入力
  await page.waitForSelector('textarea[placeholder="記事タイトル"]');
  const titleAreas = await page.$$('textarea[placeholder="記事タイトル"]');
  if (titleAreas.length > 0) {
    await titleAreas[0].focus();
    await titleAreas[0].click({ clickCount: 3 }); // 全選択して上書き
    await titleAreas[0].press('Backspace');
    await titleAreas[0].type(articleTitle);
  } else {
    throw new Error('タイトル入力欄が見つかりませんでした');
  }

  // 本文エリア（ProseMirror）を取得して入力
  await page.waitForSelector('div.ProseMirror.note-common-styles__textnote-body[contenteditable="true"]');
  const bodyArea = await page.$('div.ProseMirror.note-common-styles__textnote-body[contenteditable="true"]');
  if (bodyArea) {
    await bodyArea.focus();
    await bodyArea.click({ clickCount: 3 });
    await bodyArea.press('Backspace');
    await bodyArea.type(articleBody);
  } else {
    throw new Error('本文入力欄が見つかりませんでした');
  }

  // スクリーンショットを保存
  await page.screenshot({ path: 'after_input.png', fullPage: true });
  console.log('スクリーンショットを保存しました: after_input.png');

  // 「公開に進む」ボタンを探してクリック
  console.log('「公開に進む」ボタンを探します...');
  await page.waitForSelector('button');
  const publishButtons = await page.$$('button');
  let published = false;
  for (const btn of publishButtons) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text && text.trim().includes('公開に進む')) {
      await btn.click();
      published = true;
      console.log('「公開に進む」ボタンをクリックしました');
      break;
    }
  }
  if (!published) {
    throw new Error('「公開に進む」ボタンが見つかりませんでした');
  }

  // await browser.close(); // ブラウザは自動で閉じない

  return { status: 'ok' };
}

if (isLambda) {
  exports.handler = async (event) => {
    return await main();
  };
} else {
  main().then(() => console.log('完了')).catch(console.error);
} 
