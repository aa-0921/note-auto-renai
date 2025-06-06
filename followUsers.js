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
  for (let i = 0; i < 10; i++) {
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
  let consecutiveFailures = 0; // 連続失敗回数
  const maxConsecutiveFailures = 3; // 最大連続失敗回数
  
  for (let i = 0; i < articleLinks.length && followCount < 15; i++) {
    // 連続失敗が上限に達したら停止
    if (consecutiveFailures >= maxConsecutiveFailures) {
      console.log(`連続${maxConsecutiveFailures}回失敗したため、処理を停止します。`);
      break;
    }

    console.log(`記事${i + 1}へ遷移します: ${articleLinks[i]}`);
    await page.goto(articleLinks[i], { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1000)); // 待機時間を2秒に延長
    
    // フォローボタン（記事詳細ページのbutton.o-noteContentHeader__actionFollow）を即時取得
    let followBtn = await page.$('button.o-noteContentHeader__actionFollow');
    if (!followBtn) {
      console.log('フォローボタンが見つかりませんでした（すでにフォロー済み、またはボタンが存在しません）');
      // 一覧ページに戻る
      await page.goto(targetUrl, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      continue;
    }
    
    if (followBtn) {
      let success = true;

      // 1. クリック処理（スクロール成功時のみ）
      if (success) {
        try {
          console.log('フォローボタンをクリックします');
          await followBtn.click();
          consecutiveFailures = 0; // 成功時は連続失敗回数をリセット
        } catch (e) {
          console.log('クリック処理で失敗しました:', e.message);
          consecutiveFailures++; // ここは実際のエラーなのでカウント
          success = false;
        }
      }

      // 2. 記事情報取得（クリック成功時のみ）
      if (success) {
        try {
          console.log('記事情報を取得します');
          await new Promise(resolve => setTimeout(resolve, 1500));
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
          console.log('記事情報取得で失敗しました:', e.message);
          consecutiveFailures++; // ここは実際のエラーなのでカウント
        }
      }
    }

    // 一覧ページに戻る
    await page.goto(targetUrl, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 1000)); // 待機時間を2秒に延長
  }
  console.log(`フォロー処理が完了しました。合計${followCount}件フォローしました。`);
  await browser.close();
  console.log('ブラウザを閉じました');
})(); 
