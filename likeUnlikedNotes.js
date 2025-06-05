require('dotenv').config();
const puppeteer = require('puppeteer');
const { login } = require('./noteAutoDraftAndSheetUpdate'); // login関数をexports.loginで取得

(async () => {
  console.log('Puppeteer起動オプションを取得します');
  // CI環境（GitHub Actions等）ではheadless:true、ローカルではheadless:false
  const isCI = process.env.CI === 'true';
  const browser = await puppeteer.launch({
    headless: isCI ? true : false, // 自動切り替え
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });
  const page = await browser.newPage();

  console.log('noteにログインします');
  await login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);
  console.log('ログイン完了');

  // 対象ページへ遷移
  // はじめてのnote
  // const targetUrl = 'https://note.com/interests/%E3%81%AF%E3%81%98%E3%82%81%E3%81%A6%E3%81%AEnote';
  // 初めてのnote
  const targetUrl = 'https://note.com/search?q=%E5%88%9D%E3%82%81%E3%81%A6%E3%81%AEnote&context=note&mode=search';
  console.log('対象ページへ遷移します:', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  console.log('ページ遷移完了');

  // 10回下までスクロール
  for (let i = 0; i < 10; i++) {
    console.log(`下までスクロールします (${i + 1}/10)`);
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5秒待機
  }
  console.log('スクロール完了');

  // ページ内で「スキされていない」ハートを最大40件クリック
  console.log('「スキされていない」ハートアイコンを取得し、クリックします');
  const maxLikes = 40;
  const unlikedButtons = await page.$$('i.o-noteLikeV3__icon.a-icon.a-icon--heart.a-icon--size_mediumSmall');
  for (let i = 0; i < Math.min(maxLikes, unlikedButtons.length); i++) {
    await unlikedButtons[i].evaluate(btn => {
      btn.dispatchEvent(new MouseEvent('click', { view: window, bubbles: true, cancelable: true }));
    });
    console.log(`ボタン${i + 1}をクリックしました`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待機
  }
  console.log('クリック処理が全て完了しました');

  await browser.close();
  console.log('ブラウザを閉じました');
})(); 
