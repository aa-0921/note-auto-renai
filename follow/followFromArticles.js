// はじめてのnoteページの記事一覧から、クリックして遷移
// フォローする、という流れ
// アクティブで、フォロバしてくれそうなユーザーをフォローする上ではこの形が良さそう

// github actions 使用時間累積確認ページ
// https://github.com/settings/billing/usage?period=3&group=1&customer=5978784

require('dotenv').config();
const puppeteer = require('puppeteer');
const { login } = require('../noteAutoDraftAndSheetUpdate');

// logTime関数を必ず先頭で定義
function logTime(label) {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${label}`);
}

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
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--window-size=1280,900'    
    ],
    defaultViewport: null
  });
  const page = await browser.newPage();

  // ダイアログ（alert等）検知時に即座に処理を停止
  page.on('dialog', async dialog => {
    const msg = dialog.message();
    console.log('[ALERT検知]', msg);
    if (msg.includes('上限に達したためご利用できません')) {
      await dialog.dismiss(); // OKボタンを押す
      console.log('【noteフォロー上限に達したため、処理を中断します】');
      await browser.close(); // ブラウザを閉じる
      process.exit(1); // スクリプトを即時終了
    } else {
      await dialog.dismiss();
    }
  });
  
  
  
  console.log('noteにログインします');
  await login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);
  console.log('ログイン完了');



  // ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  // はじめてのnoteのページ
  // const targetUrl = 'https://note.com/interests/%E3%81%AF%E3%81%98%E3%82%81%E3%81%A6%E3%81%AEnote';

  // 注目のページ
  // const targetUrl = 'https://note.com/notemagazine/m/mf2e92ffd6658'

  // 検索ワードリスト
  const searchWords = [
    '日記',
    'フォロバ',
    'メンタル',
    '人間関係',
    'ママ友',
    '職場',
    '学校',
    '引き寄せ',
    'マインド',
    'はじめて',
    '初めて',
  ];

  // 日付と時刻からインデックスを計算し、順番に切り替え
  const now = new Date();
  // インデックス計算の解説ログ
  console.log('【インデックス計算解説】');
  console.log('searchWords.length =', searchWords.length);
  console.log('now.getDate() =', now.getDate(), '（本日の日付）');
  console.log('now.getHours() =', now.getHours(), '（現在の時刻[0-23]）');
  console.log('インデックス = (日付 + 時刻) % 検索ワード数 で計算します');
  const index = (now.getDate() + now.getHours()) % searchWords.length;
  console.log(`計算式: (${now.getDate()} + ${now.getHours()}) % ${searchWords.length} = ${index}`);
  const word = searchWords[index];
  const encoded = encodeURIComponent(word);
  const targetUrl = `https://note.com/search?q=${encoded}&context=note&mode=search`;

  // ログ出力（デバッグ用）
  console.log('【検索ワード選択ログ】');
  console.log('現在日時:', now.toString());
  console.log('インデックス:', index);
  console.log('選択ワード:', word);
  console.log('検索URL:', targetUrl);

  // ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

  console.log('対象ページへ遷移します:', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });
  console.log('ページ遷移完了');


  // 記事一覧ページで10回スクロール
  for (let i = 0; i < 10; i++) {
    console.log(`下までスクロールします (${i + 1}/10)`);
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  console.log('スクロール完了');

  // クリエイターリンクの取得セレクターを指定
  let creatorLinkTargetSelector

  // 検索ページの場合、div
  if (targetUrl.includes('search')) {
    creatorLinkTargetSelector = 'div.o-largeNoteSummary__userName';
  } else {
    creatorLinkTargetSelector = 'span.o-noteItem__userText';
  }

  // クリエイターリンクとクリエイター名を取得
  const creatorLinkAndNames = await page.$$eval(creatorLinkTargetSelector, elements =>
    elements.map(element => {
      // クリエイター名を取得
      const creatorName = element.textContent.trim();

      // ↓必要かわからないので一旦コメントアウト
      // クリエイター名の親要素（または近く）にaタグがある場合
      let a = element.closest('a') || element.parentElement.querySelector('a');
      return a ? { url: a.href, name: creatorName } : null;

    }).filter(Boolean)
  );

  // クリエイター名で重複を除外
  const uniqueCreators = [];
  const seenNames = new Set();
  for (const item of creatorLinkAndNames) {
    if (!seenNames.has(item.name)) {
      uniqueCreators.push(item);
      seenNames.add(item.name);
    }
  }

  console.log('ユニークなクリエイターを', uniqueCreators.length, '件取得しました');

  let followCount = 0;
  // let consecutiveFailures = 0; // 連続失敗回数
  // const maxConsecutiveFailures = 3; // 最大連続失敗回数

  // タイムアウト付きPromiseラッパー関数
  async function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(`タイムアウト: ${ms/1000}秒経過`)), ms))
    ]);
  }

  // 検索結果ページ上でポップアップのフォローボタンをクリックする方式に変更
  for (let i = 0; i < uniqueCreators.length && followCount < 15; i++) {
    const name = uniqueCreators[i].name;
    logTime(`クリエイター${i + 1}のホバー＆ポップアップフォロー処理開始:（${name}）`);
    try {
      // 検索結果ページの各クリエイター要素を再取得
      const userWrappers = await page.$$('.o-largeNoteSummary__userWrapper');
      if (!userWrappers[i]) continue;
      // aタグを取得してhover
      const aTag = await userWrappers[i].$('a.o-largeNoteSummary__user');
      if (!aTag) continue;
      await aTag.hover();
      // ホバー後に明示的な待機時間を追加（ポップアップが見やすくなるように）
      // await new Promise(resolve => setTimeout(resolve, 800)); // 0.8秒待機
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3秒待機
      // ポップアップが出るまで待機（最大2.5秒に延長）
      await page.waitForSelector('.o-quickLook', { visible: true, timeout: 2500 });
      // ポップアップ内のフォローボタンを取得
      const followBtn = await page.$('.o-quickLook .a-button');
      if (!followBtn) {
        logTime('フォローボタンが見つかりませんでした');
        continue;
      }
      // ボタンのテキストが「フォロー」か確認
      const btnText = await followBtn.evaluate(el => el.innerText.trim());
      if (btnText === 'フォロー') {
        await followBtn.click();
        // 状態変化を待つ（「フォロー中」になるまで or 最大1.5秒）
        await Promise.race([
          page.waitForFunction(
            () => {
              const btn = document.querySelector('.o-quickLook .a-button');
              return btn && btn.innerText.trim() === 'フォロー中';
            },
            { timeout: 1500 }
          ),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);
        logTime(`ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー`);
        logTime(`フォロー成功！！（${followCount + 1}件目）｜クリエイター名（${name}）`);
        logTime(`ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー`);
        followCount++;
      } else {
        logTime('すでにフォロー済み、またはボタン状態が「フォロー」ではありません');
      }
      // 少し待ってから次へ（0.3秒）
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (e) {
      logTime(`エラー発生: ${e.message}`);
      continue;
    }
  }
  console.log(`フォロー処理が完了しました。合計${followCount}件フォローしました。`);
  await browser.close();
  console.log('ブラウザを閉じました');
})(); 
