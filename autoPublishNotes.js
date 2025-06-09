require('dotenv').config();
const puppeteer = require('puppeteer');
const { login } = require('./noteAutoDraftAndSheetUpdate');

(async () => {
  const isCI = process.env.CI === 'true';
  console.log('Puppeteerを起動します');
  const browser = await puppeteer.launch({
    headless: isCI ? 'old' : false,
    protocolTimeout: 120000,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });
  const page = await browser.newPage();
  console.log('User-Agentを設定します');
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  // ログイン
  console.log('noteにログインします');
  await login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);
  console.log('ログイン完了');

  const draftUrl = 'https://note.com/notes?page=1&status=draft';
  console.log('下書き一覧ページへ遷移します:', draftUrl);
  await page.goto(draftUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('下書き一覧ページに到達しました');
  // ページ遷移後に少し待機

  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5秒待機

  // 下書き記事リストを取得
  console.log('下書き記事リストを取得します');
  const articles = await page.$$('div.o-articleList__item');
  console.log(`下書き記事を${articles.length}件検出しました`);

  const POST_LIMIT = 1; // 投稿数の上限（必要に応じて変更）
  let postCount = 0;
  for (let i = 0; i < articles.length; i++) {
    if (postCount >= POST_LIMIT) break;
    const li = articles[i];
    console.log(`${i + 1}件目の記事タイトルを取得します`);
    const title = await li.$eval('.o-articleList__heading', el => el.textContent.trim());
    console.log(`記事タイトル: ${title}`);
    if (title.startsWith('S-')) {
      console.log(`スキップ: ${title}`);
      continue;
    }
    console.log(`投稿準備: ${title}`);
    // 編集ボタンをクリック
    console.log('編集ボタンをクリックします');
    const editBtn = await li.$('.o-articleList__link');
    await editBtn.click();
    console.log('記事編集ページへの遷移を待機します');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.waitForSelector('button', {timeout: 10000});

    // 「公開に進む」ボタンを探してクリック
    console.log('「公開に進む」ボタンを探します');
    await page.waitForSelector('button', {timeout: 10000});
    const publishBtns = await page.$$('button');
    let publishBtn = null;
    for (const btn of publishBtns) {
      const text = await btn.evaluate(el => el.innerText.trim());
      if (text && text.includes('公開に進む')) {
        publishBtn = btn;
        break;
      }
    }
    if (publishBtn) {
      console.log('「公開に進む」ボタンをクリックします');
      // 画面内に移動
      const isInView = await publishBtn.isIntersectingViewport();
      if (!isInView) {
        await publishBtn.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      }
      // 本当のユーザー操作をエミュレートしてクリック
      await page.evaluate(el => {
        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }, publishBtn);
      // クリック後に2秒待機
      await new Promise(resolve => setTimeout(resolve, 2000));
      // 「投稿する」ボタンが現れるまで最大10秒待機
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll('button')).some(btn => btn.textContent && btn.textContent.includes('投稿する')),
        { timeout: 10000 }
      );
      await new Promise(resolve => setTimeout(resolve, 300)); // 追加で少し待機
    } else {
      console.log('「公開に進む」ボタンが見つかりません');
      console.log('下書き一覧ページに戻ります');
      await page.goto(draftUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      continue;
    }

    await page.waitForSelector('button', {timeout: 10000});
    // 「投稿する」ボタンを探してクリック
    console.log('「投稿する」ボタンを探します');
    // デバッグ用: 全ボタンのテキストを出力
    const postBtns = await page.$$('button');
    for (const btn of postBtns) {
      const text = await btn.evaluate(el => el.innerText.trim());
      console.log('ボタンテキスト:', text);
    }
    let postBtn = null;
    for (const btn of postBtns) {
      const text = await btn.evaluate(el => el.innerText.trim());
      if (text && text.includes('投稿する')) {
        postBtn = btn;
        break;
      }
    }
    if (postBtn) {
      console.log('「投稿する」ボタンをクリックします');
      const isInView = await postBtn.isIntersectingViewport();
      if (!isInView) {
        await postBtn.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      }
      await page.evaluate(el => {
        el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }, postBtn);
      // 投稿完了ダイアログの「閉じる」ボタンを待機してクリック
      try {
        console.log('投稿完了ダイアログの「閉じる」ボタンを待機します');
        await page.waitForSelector('button[aria-label="閉じる"]', {timeout: 15000});
        const closeBtn = await page.$('button[aria-label="閉じる"]');
        if (closeBtn) {
          console.log('「閉じる」ボタンをクリックします');
          await closeBtn.click();
        } else {
          console.log('「閉じる」ボタンが見つかりません');
        }
      } catch (e) {
        console.log('「閉じる」ボタンが表示されませんでした');
      }
      console.log(`記事を投稿しました: ${title}`);
      postCount++;
    } else {
      console.log('「投稿する」ボタンが見つかりません');
    }
    // 下書き一覧に戻る
    console.log('下書き一覧ページに戻ります');
    await page.goto(draftUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  await browser.close();
  console.log('自動記事投稿処理が完了しました');
})(); 
