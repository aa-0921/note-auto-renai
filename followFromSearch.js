require('dotenv').config();
const puppeteer = require('puppeteer');
const { login } = require('./noteAutoDraftAndSheetUpdate');

(async () => {
  console.log('Puppeteer起動オプションを取得します');
  const isCI = process.env.CI === 'true';
  const browser = await puppeteer.launch({
    headless: isCI ? 'old' : false,
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

  const targetUrl = 'https://note.com/search?context=user&q=%E3%83%95%E3%82%A9%E3%83%AD%E3%83%90100&size=10';
  console.log('クリエイター検索ページへ遷移します:', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  console.log('ページ遷移完了');

  // 5回下までスクロール
  for (let i = 0; i < 5; i++) {
    console.log(`下までスクロールします (${i + 1}/5)`);
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  console.log('スクロール完了');

  // フォローボタンを取得
  const followBtns = await page.$$('button.a-button');
  console.log(`フォローボタンを${followBtns.length}件検出しました`);
  let clickCount = 0;
  for (let i = 0; i < followBtns.length && clickCount < 13; i++) {
    const btn = followBtns[i];
    // ボタンのテキストが「フォロー」か確認
    const text = await btn.evaluate(el => el.innerText.trim());
    if (text === 'フォロー') {
      try {
        await btn.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await btn.click();
        clickCount++;
        console.log(`フォローボタン${clickCount}件目をクリックしました`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.log(`フォローボタン${i + 1}のクリックに失敗しました:`, e.message);
      }
    }
  }
  console.log(`フォロー処理が完了しました。合計${clickCount}件フォローしました。`);
  await browser.close();
  console.log('ブラウザを閉じました');
})(); 
