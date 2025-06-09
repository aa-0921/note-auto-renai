// はじめてのnoteページの記事一覧から、クリックして遷移
// フォローする、という流れ
// アクティブで、フォロバしてくれそうなユーザーをフォローする上ではこの形が良さそう


require('dotenv').config();
const puppeteer = require('puppeteer');
const { login } = require('../noteAutoDraftAndSheetUpdate');

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


  // はじめてのnoteのページ
  const targetUrl = 'https://note.com/interests/%E3%81%AF%E3%81%98%E3%82%81%E3%81%A6%E3%81%AEnote';
  console.log('対象ページへ遷移します:', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  console.log('ページ遷移完了');


  // 記事一覧ページで5回スクロール
  for (let i = 0; i < 10; i++) {
    console.log(`下までスクロールします (${i + 1}/10)`);
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

  // タイムアウト付きPromiseラッパー関数
  async function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(`タイムアウト: ${ms/1000}秒経過`)), ms))
    ]);
  }

  for (let i = 0; i < articleLinks.length && followCount < 15; i++) {
    const link = articleLinks[i];
    console.log(`記事${i + 1}へ遷移します: ${link}`);
    let followBtn = null;
    try {
      await withTimeout((async () => {
        // 新しいタブ（ページ）を開く
        const detailPage = await browser.newPage();
        await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        console.log('新しいタブで記事詳細ページへ遷移します');
        await detailPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });
        // フォローボタンが出現するまで待機
        await detailPage.waitForSelector('button', { visible: true, timeout: 10000 });
        // ボタン取得
        const btns = await detailPage.$$('button');
        for (const b of btns) {
          const text = await b.evaluate(el => el.innerText.trim());
          if (text === 'フォロー') {
            followBtn = b;
            break;
          }
        }
        if (followBtn) {
          // クリック処理
          console.log('クリック処理開始');
          try {
            console.log('クリック前: フォローボタンが画面内か確認');
            const isInView = await followBtn.isIntersectingViewport();
            if (!isInView) {
              console.log('クリック前: scrollIntoView実行');
              await followBtn.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
            } else {
              console.log('クリック前: すでに画面内');
            }
            // // クリック前の状態確認
            // const isDisabled = await followBtn.evaluate(el => el.disabled);
            // console.log('クリック前: isDisabled:', isDisabled);
            // if (isDisabled) {
            //   throw new Error('フォローボタンが無効化されています');
            // }
            // // Puppeteerの標準clickでクリック
            console.log('クリック前: ElementHandle.click()実行');
            await followBtn.click({ delay: 100 });
            // クリック後、ボタンのテキストが変わるまで待機
            // await detailPage.waitForFunction(
            //   el => el.innerText.trim() !== 'フォロー',
            //   { timeout: 5000 },
            //   followBtn
            // );
            console.log('クリック後: clickイベント完了＆状態変化確認');
            consecutiveFailures = 0;
          } catch (e) {
            console.log('クリック処理で失敗:', e.message);
            consecutiveFailures++;
            success = false;
          }
          // 記事情報取得
          console.log('記事情報取得処理開始');
          try {
            console.log('記事情報取得: タイトル要素待機開始');
            await detailPage.waitForSelector('h1.o-noteContentHeader__title', { timeout: 10000 });
            console.log('記事情報取得: タイトル要素出現');
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('記事情報取得: page.evaluate実行');
            const info = await detailPage.evaluate(() => {
              let debug = {};
              const titleElem = document.querySelector('h1.o-noteContentHeader__title');
              debug.titleElemFound = !!titleElem;
              const title = titleElem ? titleElem.textContent.trim() : 'タイトル不明';
              debug.title = title;
              const userElem = document.querySelector('.o-noteContentHeader__name a.a-link');
              debug.userElemFound = !!userElem;
              const user = userElem ? userElem.textContent.trim() : '投稿者不明';
              debug.user = user;
              return { title, user, debug };
            });
            console.log('記事情報取得: page.evaluate内デバッグ:', info.debug);
            console.log('記事情報取得: page.evaluate完了');
            console.log(`フォローボタンをクリックしました（${followCount + 1}件目）｜ ■ タイトル: ${info.title} ■ 投稿者: ${info.user}`);
            followCount++;
            console.log('記事情報取得: 1秒待機開始');
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('記事情報取得: 1秒待機完了');
          } catch (e) {
            console.log('記事情報取得で失敗:', e.message);
            consecutiveFailures++;
          }
        } else {
          console.log('フォローボタンが見つかりません');
        }
        await detailPage.close();
      })(), 60000);
    } catch (e) {
      console.log('記事処理でタイムアウトまたはエラー:', e.message);
      continue;
    }
  }
  console.log(`フォロー処理が完了しました。合計${followCount}件フォローしました。`);
  await browser.close();
  console.log('ブラウザを閉じました');
})(); 
