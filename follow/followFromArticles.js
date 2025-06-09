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


  // 記事一覧ページでクリエイターリンクを取得
  const creatorLinks = await page.$$eval('span.o-noteItem__userText', spans =>
    spans.map(span => {
      // クリエイター名の親要素（または近く）にaタグがある場合
      let a = span.closest('a') || span.parentElement.querySelector('a');
      return a ? a.href : null;
    }).filter(Boolean)
  );
  console.log('クリエイターリンクを', creatorLinks.length, '件取得しました');

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

  for (let i = 0; i < creatorLinks.length && followCount < 15; i++) {
    const link = creatorLinks[i];
    console.log(`クリエイターページ${i + 1}へ遷移します: ${link}`);
    let followBtn = null;
    try {
      await withTimeout((async () => {
        // 新しいタブ（ページ）を開く
        const detailPage = await browser.newPage();
        await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        console.log('新しいタブでクリエイターページへ遷移します');
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
          // 画面内に移動
          const isInView = await followBtn.isIntersectingViewport();
          if (!isInView) {
            await followBtn.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
          }
          // 本当のユーザー操作をエミュレートしてクリック
          await detailPage.evaluate(el => {
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          }, followBtn);
          console.log(`フォローボタンをクリックしました（${followCount + 1}件目）｜クリエイター: ${link}`);
          followCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          console.log('フォローボタンが見つかりません');
        }
        await detailPage.close();
      })(), 60000);
    } catch (e) {
      console.log('クリエイターページ処理でタイムアウトまたはエラー:', e.message);
      continue;
    }
  }
  console.log(`フォロー処理が完了しました。合計${followCount}件フォローしました。`);
  await browser.close();
  console.log('ブラウザを閉じました');
})(); 
