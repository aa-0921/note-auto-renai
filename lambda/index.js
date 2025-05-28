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

const fs = require('fs');
const path = require('path');

// 記事データ取得
function getArticleData(articlePath) {
  console.log(`記事データを取得します: ${articlePath}`);
  const raw = fs.readFileSync(articlePath, 'utf-8');
  const titleMatch = raw.match(/^#\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'タイトル未取得';
  console.log(`タイトル抽出: ${title}`);
  return { title, body: raw };
}

// ログイン処理
async function login(page, email, password) {
  console.log('noteログインページへ遷移します');
  await page.goto('https://note.com/login?redirectPath=https%3A%2F%2Fnote.com%2F', { waitUntil: 'networkidle2' });
  console.log('メールアドレスとパスワードを入力します');
  await page.type('#email', email);
  await page.type('#password', password);
  await page.waitForSelector('button[type="button"]:not([disabled])');
  console.log('ログインボタンを探します');
  const buttons = await page.$$('button[type="button"]');
  for (const btn of buttons) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text && text.trim() === 'ログイン') {
      console.log('ログインボタンをクリックします');
      await btn.click();
      break;
    }
  }
  await page.waitForNavigation();
  console.log('ログイン完了');
}

// 投稿画面遷移
async function goToNewPost(page) {
  console.log('ユーザーポップアップがあれば閉じます');
  const closePopupBtn = await page.$('button.o-userPopup__close[aria-label="閉じる"]');
  if (closePopupBtn) {
    await closePopupBtn.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('ユーザーポップアップを閉じました');
  }
  // 投稿ボタン
  console.log('投稿ボタンを探します...');
  const postButtons = await page.$$('button[aria-label="投稿"]');
  let clicked = false;
  for (const btn of postButtons) {
    if (await btn.isIntersectingViewport()) {
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
  // テキストメニュー
  console.log('テキストメニューを探します...');
  await page.waitForSelector('a[href="/notes/new"]');
  await page.click('a[href="/notes/new"]');
  await page.waitForNavigation();
  console.log('新規投稿画面に遷移しました');
}

// 記事入力
async function fillArticle(page, title, body) {
  console.log('タイトル入力欄を探します');
  await page.waitForSelector('textarea[placeholder="記事タイトル"]');
  const titleAreas = await page.$$('textarea[placeholder="記事タイトル"]');
  if (titleAreas.length > 0) {
    await titleAreas[0].focus();
    await titleAreas[0].click({ clickCount: 3 });
    await titleAreas[0].press('Backspace');
    await titleAreas[0].type(title);
    console.log('タイトルを入力しました');
  } else {
    throw new Error('タイトル入力欄が見つかりませんでした');
  }
  console.log('本文入力欄を探します');
  await page.waitForSelector('div.ProseMirror.note-common-styles__textnote-body[contenteditable="true"]');
  const bodyArea = await page.$('div.ProseMirror.note-common-styles__textnote-body[contenteditable="true"]');
  if (bodyArea) {
    await bodyArea.focus();
    await bodyArea.click({ clickCount: 3 });
    await bodyArea.press('Backspace');
    await bodyArea.type(body);
    console.log('本文を入力しました');
  } else {
    throw new Error('本文入力欄が見つかりませんでした');
  }
}

// 下書き保存
async function saveDraft(page) {
  console.log('「下書き保存」ボタンを探します...');
  await page.waitForSelector('button');
  const draftButtons = await page.$$('button');
  let draftSaved = false;
  for (const btn of draftButtons) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text && text.trim().includes('下書き保存')) {
      await btn.click();
      draftSaved = true;
      console.log('「下書き保存」ボタンをクリックしました');
      break;
    }
  }
  if (!draftSaved) {
    throw new Error('「下書き保存」ボタンが見つかりませんでした');
  }
}

// 閉じる処理
async function closeDialogs(page) {
  // 1回目
  console.log('「閉じる」ボタン（1回目）を探します...');
  await new Promise(resolve => setTimeout(resolve, 500));
  const closeButtons1 = await page.$$('button');
  let closed1 = false;
  for (const btn of closeButtons1) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text && text.trim() === '閉じる') {
      await btn.click();
      closed1 = true;
      console.log('「閉じる」ボタン（1回目）をクリックしました');
      break;
    }
  }
  if (!closed1) throw new Error('「閉じる」ボタン（1回目）が見つかりませんでした');
  await new Promise(resolve => setTimeout(resolve, 500));
  // 2回目（モーダル内）
  console.log('「閉じる」ボタン（2回目/モーダル内）を探します...');
  await page.waitForSelector('.ReactModal__Content button');
  const closeButtons2 = await page.$$('.ReactModal__Content button');
  let closed2 = false;
  for (const btn of closeButtons2) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text && text.trim() === '閉じる') {
      await btn.click();
      closed2 = true;
      console.log('「閉じる」ボタン（2回目/モーダル内）をクリックしました');
      break;
    }
  }
  if (!closed2) throw new Error('「閉じる」ボタン（2回目/モーダル内）が見つかりませんでした');
  await new Promise(resolve => setTimeout(resolve, 500));
}

// メイン処理
async function main() {
  console.log('Puppeteer起動オプションを取得します');
  const options = await launchOptions();
  console.log('Puppeteerを起動します');
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  // ここで記事データのパスを指定
  const articlePath = path.join(__dirname, '../posts/8__2025-05-25-大失恋から自分を好きになるまでのリアルストーリー＜前編＞.md');
  const { title, body } = getArticleData(articlePath);

  await login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);
  await goToNewPost(page);
  await fillArticle(page, title, body);
  await saveDraft(page);
  await closeDialogs(page);

  // スクリーンショットを保存
  await page.screenshot({ path: 'after_input.png', fullPage: true });
  console.log('スクリーンショットを保存しました: after_input.png');

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
