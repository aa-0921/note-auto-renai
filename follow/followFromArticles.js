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
        console.log(`[DEBUG] クリエイターページへの遷移開始: ${link}`);
        // 新しいタブ（ページ）を開く
        const detailPage = await browser.newPage();
        console.log('[DEBUG] 新しいタブを作成しました');
        
        await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        console.log('[DEBUG] UserAgentを設定しました');
        
        console.log('[DEBUG] ページ遷移を開始します...');
        await detailPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('[DEBUG] ページ遷移が完了しました');
        
        // フォローボタンが出現するまで待機
        console.log('[DEBUG] フォローボタンの待機を開始します...');
        await detailPage.waitForSelector('button', { visible: true, timeout: 10000 });
        console.log('[DEBUG] ボタン要素の検出が完了しました');
        
        // ボタン取得
        console.log('[DEBUG] ボタン要素の検索を開始します...');
        const btns = await detailPage.$$('button');
        console.log(`[DEBUG] 検出されたボタン数: ${btns.length}`);
        
        let followBtn = null;
        for (const b of btns) {
          const text = await b.evaluate(el => el.innerText.trim());
          console.log(`[DEBUG] ボタンテキスト: "${text}"`);
          if (text === 'フォロー') {
            followBtn = b;
            console.log('[DEBUG] フォローボタンを特定しました');
            break;
          }
        }
        
        if (followBtn) {
          console.log('[DEBUG] フォローボタンの可視性チェックを開始します...');
          // 画面内に移動
          const isInView = await followBtn.isIntersectingViewport();
          console.log(`[DEBUG] ボタンの可視状態: ${isInView ? '表示中' : '非表示'}`);
          
          if (!isInView) {
            console.log('[DEBUG] ボタンを画面内にスクロールします...');
            await followBtn.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
            console.log('[DEBUG] スクロール完了');
          }
          
          // 本当のユーザー操作をエミュレートしてクリック
          console.log('[DEBUG] クリックイベントの発火を開始します...');
          await detailPage.evaluate(el => {
            console.log('[DEBUG] mousedownイベントを発火');
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
            console.log('[DEBUG] mouseupイベントを発火');
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
            console.log('[DEBUG] clickイベントを発火');
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          }, followBtn);
          console.log(`[DEBUG] クリックイベントの発火が完了しました（${followCount + 1}件目）｜クリエイター: ${link}`);
          followCount++;
        } else {
          console.log('[DEBUG] フォローボタンが見つかりませんでした');
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
