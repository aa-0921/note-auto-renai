require('dotenv').config();
const puppeteer = require('puppeteer');
const { login } = require('./noteAutoDraftAndSheetUpdate');

(async () => {
  console.log('Puppeteer起動オプションを取得します');
  const isCI = process.env.CI === 'true';
  const browser = await puppeteer.launch({
    headless: isCI ? 'old' : false,
    slowMo: 100,
    protocolTimeout: 30000,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });
  const page = await browser.newPage();
  // page.setDefaultTimeout(60000);

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

  const MAX_CLICKS = 13;
  let clickCount = 0;
  let totalFailures = 0;
  const maxFailures = 2;
  for (let i = 0; i < followBtns.length && clickCount < MAX_CLICKS; i++) {
    if (totalFailures >= maxFailures) {
      console.log(`クリックに累計${maxFailures}回失敗したため、処理を中断します。`);
      break;
    }
    const btn = followBtns[i];
    const text = await btn.evaluate(el => el.innerText.trim());
    if (text === 'フォロー') {
      try {
        // クリック前にボタンが有効か確認
        const isDisabled = await btn.evaluate(el => el.disabled);
        if (isDisabled) {
          console.log(`フォローボタン${i + 1}は無効化されています。スキップします。`);
          continue;
        }
        // クリック前に画面内に移動
        await btn.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        // クリックイベントを直接発火（軽量化）
        await btn.evaluate(el => el.click());
        clickCount++;

        // フォローに成功する場合はフォローしたクリエイター名を表示する
        const creatorName = await btn.evaluate(el => {
          const nameElem = el.closest('.m-userListItem')?.querySelector('.m-userListItem__nameLabel');
          return nameElem ? nameElem.textContent.trim() : 'クリエイター名不明';
        });
        console.log(`フォローボタン${clickCount}件目をクリックしました｜クリエイター名: ${creatorName}`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5秒待機
      } catch (e) {
        // 失敗時に1回だけリトライ
        try {
          console.log(`クリック失敗、リトライします:`, e.message);
          await btn.evaluate(el => el.click());
          clickCount++;
          console.log(`リトライ成功: フォローボタン${clickCount}件目をクリックしました`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (e2) {
          totalFailures++;
          console.log(`フォローボタン${i + 1}のクリックに失敗しました（リトライも失敗）:`, e2.message);
        }
      }
    }
  }
  console.log(`フォロー処理が完了しました。合計${clickCount}件フォローしました。`);
  await browser.close();
  console.log('ブラウザを閉じました');
})(); 
