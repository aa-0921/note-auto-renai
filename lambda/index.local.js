// ローカル環境でnoteに自動投稿をテストするPuppeteerスクリプト
// .envファイルや環境変数でNOTE_EMAIL, NOTE_PASSWORDを管理してください

const puppeteer = require('puppeteer');
require('dotenv').config(); // .envから環境変数を読み込む

(async () => {
  // headless: false でブラウザ画面を表示しながら動作確認
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // MacのChromeを明示的に指定
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });
  const page = await browser.newPage();

  // noteログインページへ（最新URLに修正）
  await page.goto('https://note.com/login?redirectPath=https%3A%2F%2Fnote.com%2F', { waitUntil: 'networkidle2' });
  await page.type('input[name="email"]', process.env.NOTE_EMAIL);
  await page.type('input[name="password"]', process.env.NOTE_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  // 新規投稿ページへ
  await page.goto('https://note.com/notes/new', { waitUntil: 'networkidle2' });
  await page.type('input[name="title"]', 'ローカル自動投稿テスト');
  await page.type('div[contenteditable="true"]', 'これはローカルPuppeteerによる自動投稿テストです。');

  // 公開ボタンのセレクタはnoteのUIによって変わる場合あり
  // 実際に公開したくない場合はコメントアウトのままでもOK
  // await page.click('button:has-text("公開")');
  // await page.waitForTimeout(3000);

  // テスト時は公開せず、ここで止めてもOK
  // await browser.close();
})(); 
