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
  // 全体のタイムアウト制御（10分で自動終了）
  const startTime = Date.now();
  const MAX_EXECUTION_TIME = 10 * 60 * 1000; // 10分
  
  // タイムアウトチェック関数
  function checkTimeout() {
    if (Date.now() - startTime > MAX_EXECUTION_TIME) {
      console.log('【タイムアウト】10分経過したため処理を終了します');
      process.exit(0);
    }
  }

  console.log('Puppeteer起動オプションを取得します');
  // 実行引数からheadlessを決定（--bg があればheadless、それ以外は可視）
  const argv = process.argv.slice(2);
  const wantsBackground = argv.includes('--bg');
  const isCI = process.env.CI === 'true';
  const headlessMode = wantsBackground ? 'new' : false;
  console.log('headlessモード:', headlessMode === false ? '可視(visible)' : 'バックグラウンド(headless)');
  const browser = await puppeteer.launch({
    headless: headlessMode,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--window-size=1280,900',
      // CircleCI環境用の追加オプション
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-plugins',
      '--disable-images',
      '--disable-default-apps',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-field-trial-config',
      '--disable-back-forward-cache',
      '--disable-ipc-flooding-protection',
      '--no-first-run',
      '--no-default-browser-check',
      '--no-zygote',
      '--single-process',
      '--disable-background-networking'
    ],
    defaultViewport: null,
    protocolTimeout: 30000 // 30秒のプロトコルタイムアウト
  });
  const page = await browser.newPage();

  let isLimit = false; // 上限検知フラグ

  // ダイアログ（alert等）検知時に即座に処理を停止
  page.on('dialog', async dialog => {
    const msg = dialog.message();
    console.log('[ALERT検知]', msg);
    if (msg.includes('上限に達したためご利用できません')) {
      await dialog.dismiss(); // OKボタンを押す
      console.log('【noteフォロー上限に達したため、処理を中断します】');
      isLimit = true; // 上限フラグを立てる
      await browser.close(); // ブラウザを閉じる
      // ここでは process.exit(1) を呼ばない
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
    '恋愛',
    '婚活',
    '結婚',
    '出会い',
    'モテ',
    '自分磨き',
    '心理学',
    'ストレス',
    '不安',
    '悩み',
    '相談',
    '腸活',
    '健康',
    '美容',
    'ダイエット',
    '自己肯定感',
    '自己啓発',
    '成長',
    '習慣',
    '継続',
    'モチベーション',
    '目標',
    '夢',
    '願望',
    '実現',
    '成功',
    '幸せ',
    '癒し',
    'リラックス',
    '疲れ',
    '睡眠',
    '休息',
    '家族',
    '友達',
    '同僚',
    '上司',
    '部下',
    '先輩',
    '後輩',
    '子育て',
    '育児',
    '教育',
    '学習',
    '勉強',
    '仕事',
    '転職',
    '副業',
    '起業',
    'キャリア',
    'スキル',
    '資格',
    '趣味',
    '読書',
    '映画',
    '音楽',
    '旅行',
    '料理',
    '運動',
    'ヨガ',
    '散歩',
    'カフェ',
    'グルメ',
    'ファッション',
    'コスメ',
    'ライフスタイル',
    '暮らし',
    '節約',
    '貯金',
    '投資',
    'お金',
    '時間管理',
    '整理整頓',
    '断捨離',
    'ミニマリスト',
    'SNS',
    '別れ',
    '失恋',
    '離婚',
    '復縁',
    '不倫',
    '浮気',
    '嫉妬',
    '束縛',
    '依存',
    'マインドフルネス',
    'ヒーリング',
    'セラピー',
    'カウンセリング',
    'コーチング',
    'コンサル',
    'アドバイス',
    'サポート',
    'ヘルプ',
    'SOS',
    '助けて',
    '辛い',
    '苦しい',
    '痛い',
    '泣きたい',
    '叫びたい',
    '逃げたい',
    '消えたい',
    '死にたい',
    '生きたい',
    '頑張りたい',
    '変わりたい',
    '成長したい',
    '幸せになりたい',
    '愛されたい',
    '認められたい',
    '理解されたい',
    '支えられたい',
    '守られたい',
    '癒されたい',
    '休みたい',
    '眠りたい',
    '忘れたい',
    '許したい',
    '許されたい',
    '謝りたい',
    '感謝したい',
    'ありがとう',
    'ごめんなさい',
    '大丈夫',
  ];

  // ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  // 例：searchWords.length = 11, runsPerDay = 8（3時間ごと: 0,3,6,9,12,15,18,21時）
  //
  // 1月1日（dayOfYear = 1）
  // 時刻   runIndex  index計算式              index  増分
  // 0時    0         (8×1 + 0) % 11 = 8      8     
  // 3時    1         (8×1 + 1) % 11 = 9      9     +1
  // 6時    2         (8×1 + 2) % 11 = 10     10    +1
  // 9時    3         (8×1 + 3) % 11 = 0      0     +1(10→0)
  // 12時   4         (8×1 + 4) % 11 = 1      1     +1
  // 15時   5         (8×1 + 5) % 11 = 2      2     +1
  // 18時   6         (8×1 + 6) % 11 = 3      3     +1
  // 21時   7         (8×1 + 7) % 11 = 4      4     +1
  //
  // 1月2日（dayOfYear = 2）
  // 時刻   runIndex  index計算式              index  増分
  // 0時    0         (8×2 + 0) % 11 = 16 % 11 = 5     
  // 3時    1         (8×2 + 1) % 11 = 17 % 11 = 6     +1
  // 6時    2         (8×2 + 2) % 11 = 18 % 11 = 7     +1
  // 9時    3         (8×2 + 3) % 11 = 19 % 11 = 8     +1
  // 12時   4         (8×2 + 4) % 11 = 20 % 11 = 9     +1
  // 15時   5         (8×2 + 5) % 11 = 21 % 11 = 10    +1
  // 18時   6         (8×2 + 6) % 11 = 22 % 11 = 0     +1(10→0)
  // 21時   7         (8×2 + 7) % 11 = 23 % 11 = 1     +1
  //
  // ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー

  // 1日あたりの実行回数（cronの回数に合わせて調整）
  const runsPerDay = 8; // 例: 0,3,6,9,12,15,18,21時
  const now = new Date();
  // 年初からの日数（1月1日が1）
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  // 今日の何回目の実行か（3時間ごとなら0～7）
  const runIndex = Math.floor(now.getHours() / 3);
  // 実行回数に応じて順番に消化
  const index = (dayOfYear * runsPerDay + runIndex) % searchWords.length;
  // デバッグ用ログ
  console.log('【順番インデックス計算】');
  console.log('searchWords.length =', searchWords.length);
  console.log('runsPerDay =', runsPerDay);
  console.log('dayOfYear =', dayOfYear);
  console.log('runIndex =', runIndex);
  console.log('index = (dayOfYear * runsPerDay + runIndex) % searchWords.length =', index);
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
    // タイムアウトチェック
    checkTimeout();
    
    if (isLimit) break; // 上限検知時は即座にループを抜ける
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
      // CI環境では短縮、ローカルでは通常の待機時間
      const hoverWaitTime = isCI ? 500 : 800;
      await new Promise(resolve => setTimeout(resolve, hoverWaitTime));
      
      // ポップアップが出るまで待機（CI環境では短縮）
      const popupTimeout = isCI ? 1500 : 2500;
      await page.waitForSelector('.o-quickLook', { visible: true, timeout: popupTimeout });
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
        // 状態変化を待つ（CI環境では短縮）
        const stateChangeTimeout = isCI ? 1000 : 1500;
        await Promise.race([
          page.waitForFunction(
            () => {
              const btn = document.querySelector('.o-quickLook .a-button');
              return btn && btn.innerText.trim() === 'フォロー中';
            },
            { timeout: stateChangeTimeout }
          ),
          new Promise(resolve => setTimeout(resolve, stateChangeTimeout))
        ]);
        logTime(`ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー`);
        logTime(`フォロー成功！！（${followCount + 1}件目）｜クリエイター名（${name}）`);
        logTime(`ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー`);
        followCount++;
      } else {
        logTime('すでにフォロー済み、またはボタン状態が「フォロー」ではありません');
      }
      // 少し待ってから次へ（CI環境では短縮）
      const nextWaitTime = isCI ? 200 : 300;
      await new Promise(resolve => setTimeout(resolve, nextWaitTime));
    } catch (e) {
      logTime(`エラー発生: ${e.message}`);
      continue;
    }
  }
  logTime('全フォロー処理完了');
  // 上限検知時はここで安全に終了（正常終了として扱う）
  if (isLimit) {
    console.log('フォロー上限に達しましたが、正常終了として処理を継続します');
    process.exit(0);
  }
  await browser.close();
  console.log('ブラウザを閉じました');
})(); 
