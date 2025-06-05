require('dotenv').config();
const puppeteer = require('puppeteer');
const { login } = require('./noteAutoDraftAndSheetUpdate');

(async () => {
  console.log('Puppeteer起動オプションを取得します');
  const isCI = process.env.CI === 'true';
  console.log('process.env.CIの値:', process.env.CI);
  console.log('isCI:', isCI);
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

  const targetUrl = 'https://note.com/interests/%E3%81%AF%E3%81%98%E3%82%81%E3%81%A6%E3%81%AEnote';
  console.log('対象ページへ遷移します:', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  console.log('ページ遷移完了');

  // 記事一覧ページで5回スクロール
  for (let i = 0; i < 5; i++) {
    console.log(`下までスクロールします (${i + 1}/5)`);
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  console.log('スクロール完了');

  // 記事リンクを取得
  const articleLinks = await page.$$eval('a.m-largeNoteWrapper__link', links => links.map(a => a.href));
  console.log(`記事リンクを${articleLinks.length}件取得しました`);

  let followCount = 0;
  for (let i = 0; i < articleLinks.length && followCount < 15; i++) {
    console.log(`記事${i + 1}へ遷移します: ${articleLinks[i]}`);
    await page.goto(articleLinks[i], { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1500));
    // フォローボタン（記事詳細ページのbutton.o-noteContentHeader__actionFollow）を探す
    let followBtn = null;
    try {
      followBtn = await page.waitForSelector('button.o-noteContentHeader__actionFollow', { visible: true, timeout: 5000 });
    } catch (e) {
      console.log('フォローボタンが見つかりませんでした（waitForSelectorタイムアウト）');
    }
    if (followBtn) {
      try {
        await followBtn.evaluate(btn => btn.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await followBtn.click();
        // タイトルと投稿者名を取得
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待機
        const info = await page.evaluate(() => {
          const titleElem = document.querySelector('h1.o-noteContentHeader__title');
          const title = titleElem ? titleElem.textContent.trim() : 'タイトル不明';
          const userElem = document.querySelector('.o-noteContentHeader__name a.a-link');
          const user = userElem ? userElem.textContent.trim() : '投稿者不明';
          return { title, user };
        });
        console.log(`フォローボタンをクリックしました（${followCount + 1}件目）｜ ■ タイトル: ${info.title} ■ 投稿者: ${info.user}`);
        followCount++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.log('フォローボタンのクリックに失敗しました:', e.message);
      }
    } else {
      console.log('フォローボタンが見つかりませんでした。');
    }
    // 一覧ページに戻る
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log(`フォロー処理が完了しました。合計${followCount}件フォローしました。`);
  await browser.close();
  console.log('ブラウザを閉じました');
})(); 
