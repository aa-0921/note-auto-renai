require('dotenv').config();
const puppeteer = require('puppeteer');
const { login } = require('./noteAutoDraftAndSheetUpdate'); // login関数をexports.loginで取得

(async () => {
  console.log('Puppeteer起動オプションを取得します');
  // CI環境（GitHub Actions等）ではheadless:'old'、ローカルではheadless:false
  const isCI = process.env.CI === 'true';
  console.log('process.env.CIの値:', process.env.CI);
  console.log('isCI:', isCI);
  const browser = await puppeteer.launch({
    headless: isCI ? 'old' : false, // 自動切り替え
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
  // const targetUrl = 'https://note.com/search?q=%E5%88%9D%E3%82%81%E3%81%A6%E3%81%AEnote&context=note&mode=search';

  // 今日のあなたに
  // const targetUrl = 'https://note.com/recommends/for_you';

  // ママ友
  const targetUrl = 'https://note.com/search?q=%E3%83%9E%E3%83%9E%E5%8F%8B&context=note&mode=search';


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
  const likeCount = Math.min(maxLikes, unlikedButtons.length);
  console.log(`これから${likeCount}件のスキを付けます。`);
  for (let i = 0; i < likeCount; i++) {
    // ボタンの親要素からタイトルと投稿者名を取得し、クリック
    const info = await unlikedButtons[i].evaluate((btn) => {
      // 記事タイトルを取得
      let title = 'タイトル不明';
      let user = '投稿者不明';
      // .m-largeNoteWrapper__body からタイトルを探す
      const body = btn.closest('.m-largeNoteWrapper__card');
      if (body) {
        const titleElem = body.querySelector('.m-noteBodyTitle__title');
        if (titleElem) {
          title = titleElem.textContent.trim();
        }
        // .m-largeNoteWrapper__body の親要素からユーザー名を探す
        const infoElem = body.parentElement?.querySelector('.o-largeNoteSummary__userName');
        if (infoElem) {
          user = infoElem.textContent.trim();
        }
      }
      // クリック
      btn.dispatchEvent(new MouseEvent('click', { view: window, bubbles: true, cancelable: true }));
      return { title, user };
    });
    console.log(`ボタン${i + 1}をクリックしました｜タイトル: ${info.title}｜投稿者: ${info.user}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待機
  }
  console.log('クリック処理が全て完了しました');

  await browser.close();
  console.log('ブラウザを閉じました');
})(); 
