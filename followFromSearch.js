require('dotenv').config();
const puppeteer = require('puppeteer');
const { login } = require('./noteAutoDraftAndSheetUpdate');

(async () => {
  console.log('Puppeteer起動オプションを取得します');
  const isCI = process.env.CI === 'true';
  const browser = await puppeteer.launch({
    headless: isCI ? 'old' : false,
    // 各操作（クリック・入力・ページ遷移など）ごとに、指定したミリ秒だけ「わざと遅延」を入れるための設定です。
    // たとえば slowMo: 100 とすると、すべてのPuppeteerの操作の間に100ミリ秒（0.1秒）ずつ待つようになります。
    
    // 一旦コメントアウト
    // slowMo: 100,
    protocolTimeout: 120000,
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
  for (let i = 0; i < 10; i++) {
    console.log(`下までスクロールします (${i + 1}/5)`);
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  console.log('スクロール完了');

  // 「フォロー」ボタンのみを取得
  const followBtns = await page.$$('button.a-button');
  // テキストが「フォロー」のボタンだけに絞り込む
  const filteredFollowBtns = [];
  for (const btn of followBtns) {
    const text = await btn.evaluate(el => el.innerText.trim());
    if (text === 'フォロー') filteredFollowBtns.push(btn);
  }
  console.log(`「フォロー」ボタンを${filteredFollowBtns.length}件検出しました`);

  const MAX_CLICKS = 13;
  let clickCount = 0;
  let totalFailures = 0;
  const maxFailures = 2;
  for (let i = 0; i < filteredFollowBtns.length && clickCount < MAX_CLICKS; i++) {
    console.log(`${i + 1}回目の繰り返しが開始しました`);
    if (totalFailures >= maxFailures) {
      console.log(`クリックに累計${maxFailures}回失敗したため、処理を中断します。`);
      break;
    }
    const btn = filteredFollowBtns[i];
    console.log(`ボタン取得: ${i + 1}件目 btn!=null:`, btn != null);
    if (isCI) {
      try {
        console.log('クリック前: waitForSelector開始');
        await page.waitForSelector('button.a-button', { visible: true, timeout: 15000 });
        console.log('クリック前: waitForSelector成功');
      } catch (e) {
        console.log('クリック前のwaitForSelectorでタイムアウト:', e.message);
        totalFailures++;
        continue;
      }
    }
    try {
      console.log('クリック前: scrollIntoView開始');
      await btn.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      console.log('クリック前: scrollIntoView完了');
      console.log('クリック前: clickイベント発火');
      await btn.evaluate(el => el.click());
      console.log('クリック後: clickイベント完了');
      clickCount++;

      // フォローに成功する場合はフォローしたクリエイター名を表示する
      console.log('クリエイター名取得開始');
      const creatorName = await btn.evaluate(el => {
        const nameElem = el.closest('.m-userListItem')?.querySelector('.m-userListItem__nameLabel');
        return nameElem ? nameElem.textContent.trim() : 'クリエイター名不明';
      });
      console.log('クリエイター名取得完了');
      console.log(`フォローボタン${clickCount}件目をクリックしました｜クリエイター名: ${creatorName}`);
      console.log('クリック後: 7秒待機開始');
      await new Promise(resolve => setTimeout(resolve, 7000)); // 7秒待機
      console.log('クリック後: 7秒待機完了');
    } catch (e) {
      // 失敗時に1回だけリトライ
      try {
        console.log(`クリック失敗、リトライします:`, e.message);
        console.log('リトライ: clickイベント発火');
        await btn.evaluate(el => el.click());
        console.log('リトライ: clickイベント完了');
        clickCount++;
        console.log('リトライ: クリエイター名取得開始');
        const creatorName = await btn.evaluate(el => {
          const nameElem = el.closest('.m-userListItem')?.querySelector('.m-userListItem__nameLabel');
          return nameElem ? nameElem.textContent.trim() : 'クリエイター名不明';
        });
        console.log('リトライ: クリエイター名取得完了');
        console.log(`リトライ成功: フォローボタン${clickCount}件目をクリックしました｜クリエイター名: ${creatorName}`);
        console.log('リトライ: 7秒待機開始');
        await new Promise(resolve => setTimeout(resolve, 7000));
        console.log('リトライ: 7秒待機完了');
      } catch (e2) {
        totalFailures++;
        console.error(`フォローボタン${i + 1}のクリックに失敗しました（リトライも失敗）:`, e2.message, e2);
      }
    }
  }
  console.log(`フォロー処理が完了しました。合計${clickCount}件フォローしました。`);
  await browser.close();
  console.log('ブラウザを閉じました');
})();
