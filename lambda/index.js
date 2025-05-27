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

  // 新規投稿ページへ
  await page.goto('https://note.com/notes/new', { waitUntil: 'networkidle2' });

  // タイトル欄のinputまたはtextareaを自動検出して入力
  const titleInput = await page.$('input[placeholder], input, textarea');
  if (titleInput) {
    await titleInput.type('Lambda自動投稿テスト');
  } else {
    throw new Error('タイトル入力欄が見つかりませんでした');
  }

  // 本文欄は従来通り
  await page.type('div[contenteditable="true"]', 'これはLambda+Puppeteerによる自動投稿テストです。');

  // 公開ボタンのセレクタはnoteのUIによって変わる場合あり
  // 実際に公開したくない場合はコメントアウトのままでもOK
  // await page.click('button:has-text("公開")');
  // await page.waitForTimeout(3000);

  await browser.close();
  return { status: 'ok' };
}

if (isLambda) {
  exports.handler = async (event) => {
    return await main();
  };
} else {
  main().then(() => console.log('完了')).catch(console.error);
} 
