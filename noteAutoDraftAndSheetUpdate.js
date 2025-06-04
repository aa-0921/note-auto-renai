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
  // ファイル名からタイトルを抽出
  const fileName = path.basename(articlePath, '.md');
  // 例: 31__2025-05-25-引き寄せの法則で億万長者になった最強の秘密
  const match = fileName.match(/^\d+__\d{4}-\d{2}-\d{2}-(.+)$/);
  const title = match ? match[1] : fileName;
  const body = fs.readFileSync(articlePath, 'utf-8');
  return { title, body };
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

// 投稿一覧管理表.mdをパースし、下書き保存日が空欄の行のファイル名リストを返す
function parseUnsubmittedArticles(tablePath) {
  const raw = fs.readFileSync(tablePath, 'utf-8');
  const lines = raw.split('\n');
  // テーブル部分のみ抽出
  const tableLines = lines.filter(line => line.trim().startsWith('|'));
  if (tableLines.length < 3) return [];
  const header = tableLines[0].split('|').map(h => h.trim());
  const fileNameIdx = header.findIndex(h => h === 'ファイル名');
  const draftDateIdx = header.findIndex(h => h === '下書き保存日');
  if (fileNameIdx === -1 || draftDateIdx === -1) return [];
  const result = [];
  for (let i = 2; i < tableLines.length; i++) { // データ行のみ
    const cols = tableLines[i].split('|').map(c => c.trim());
    if (!cols[draftDateIdx] && cols[fileNameIdx]) {
      // posts/ で始まらない場合は自動で付与
      let filePath = cols[fileNameIdx];
      if (!filePath.startsWith('posts/')) filePath = 'posts/' + filePath;
      result.push({
        filePath,
        rowIndex: i, // テーブル行番号（後で更新用に使う）
      });
    }
  }
  return result;
}

// 管理表の該当行の下書き保存日を更新する
function updateDraftDate(tablePath, rowIndex, dateStr) {
  const raw = fs.readFileSync(tablePath, 'utf-8');
  const lines = raw.split('\n');
  // テーブル部分のみ抽出
  const tableLines = lines.filter(line => line.trim().startsWith('|'));
  if (rowIndex >= tableLines.length) return;
  const cols = tableLines[rowIndex].split('|');
  // 下書き保存日カラムのインデックスを取得
  const header = tableLines[0].split('|').map(h => h.trim());
  const draftDateIdx = header.findIndex(h => h === '下書き保存日');
  if (draftDateIdx === -1) return;
  // カラム数が足りない場合は拡張
  while (cols.length <= draftDateIdx) cols.push('');
  cols[draftDateIdx] = ' ' + dateStr + ' ';
  tableLines[rowIndex] = cols.join('|');
  // テーブル部分を元のlinesに戻す
  let t = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('|')) {
      lines[i] = tableLines[t++];
    }
  }
  fs.writeFileSync(tablePath, lines.join('\n'), 'utf-8');
}

// メイン処理
async function main() {
  console.log('Puppeteer起動オプションを取得します');
  const options = await launchOptions();
  console.log('Puppeteerを起動します');
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  // 管理表パス
  const tablePath = path.join(__dirname, './投稿一覧管理表.md');
  // 未下書き記事リスト取得
  const unsubmitted = parseUnsubmittedArticles(tablePath);
  if (unsubmitted.length === 0) {
    console.log('下書き保存待ちの記事はありません');
    return { status: 'no-article' };
  }

  // ログインは1回だけ
  await login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);

  try {
    for (const { filePath, rowIndex } of unsubmitted) {
      try {
        // 記事ごとにnoteトップページに遷移してから投稿ボタンを押す
        console.log('noteトップページに遷移します');
        await page.goto('https://note.com/', { waitUntil: 'networkidle2' });
        console.log('記事処理開始: ' + filePath);
        const articlePath = path.join(__dirname, './', filePath);
        let title, body;
        try {
          ({ title, body } = getArticleData(articlePath));
        } catch (e) {
          if (e.code === 'ENOENT') {
            console.log(`記事ファイルが見つかりません: ${articlePath}`);
            continue; // 次の記事へ
          } else {
            throw e;
          }
        }
        await goToNewPost(page);
        await fillArticle(page, title, body);
        await saveDraft(page);
        await closeDialogs(page);
        // スクリーンショット保存
        // await page.screenshot({ path: `after_input_${rowIndex}.png`, fullPage: true });
        // console.log('スクリーンショットを保存しました: after_input_' + rowIndex + '.png');
        // 管理表に日付記入
        const today = new Date().toISOString().slice(0, 10);
        updateDraftDate(tablePath, rowIndex, today);
        console.log(`管理表の下書き保存日を更新: ${filePath} → ${today}`);
      } catch (e) {
        console.error(`記事処理失敗: ${filePath}`, e);
        throw e; // 途中でストップ
      }
    }
  } catch (e) {
    console.error('記事処理中にエラーが発生したため、処理を中断します:', e);
    await browser.close(); // 必要なら有効化
    return { status: 'error', error: e.toString() };
  }
  await browser.close();
  return { status: 'done' };
}

if (isLambda) {
  exports.handler = async (event) => {
    return await main();
  };
} else {
  main().then(() => console.log('完了')).catch(console.error);
} 
