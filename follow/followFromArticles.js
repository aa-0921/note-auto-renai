// はじめてのnoteページの記事一覧から、クリックして遷移
// フォローする、という流れ
// アクティブで、フォロバしてくれそうなユーザーをフォローする上ではこの形が良さそう

// github actions 使用時間累積確認ページ
// https://github.com/settings/billing/usage?period=3&group=1&customer=5978784

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

  for (let i = 0; i < uniqueCreators.length && followCount < 15; i++) {
    const link = uniqueCreators[i].url;
    const name = uniqueCreators[i].name;
    console.log(`クリエイターページ${i + 1}へ遷移します:（${name}）| ${link}`);
    let followBtn = null;
    try {
      await withTimeout((async () => {
        console.log(`[DEBUG] クリエイターページへの遷移開始: ${link}`);
        // 新しいタブ（ページ）を開く
        const detailPage = await browser.newPage();
        console.log('[DEBUG] 新しいタブを作成しました');


        // ----------------------------------        // 
        // ダイアログ（alert等）検知時に即座に処理を停止
        detailPage.on('dialog', async dialog => {
          console.log('[ERROR] ダイアログ検知:', dialog.message());
          await dialog.dismiss(); // OKボタンを押す
          throw new Error('上限エラー検知のため処理を停止します');
        });
        // ----------------------------------        // 
        
        await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        console.log('[DEBUG] UserAgentを設定しました');
        
        // ページ遷移の完了を待機
        // 注意: networkidle0を指定することで、すべてのネットワークリクエストが完了するまで待機
        // タイムアウトは30秒に設定（ページの読み込みに十分な時間を確保）
        console.log('[DEBUG] ページ遷移を開始します...');
        await detailPage.goto(link, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });
        console.log('[DEBUG] ページ遷移が完了しました');
        
        // ページの完全な読み込みを待機
        // 注意: networkidle0の後も、JavaScriptの実行やDOMの更新が続く可能性があるため
        // 追加で3秒の待機を設定（これにより、動的な要素の読み込みを確実に待機）
        console.log('[DEBUG] ページの完全な読み込みを待機します...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // ボタン要素の検索を開始
        // 注意: data-name="ToggleButton"属性を持つボタンを検索
        // このセレクタはnoteのフォローボタンに特有の属性
        console.log('[DEBUG] ボタン要素の検索を開始します...');
        const btns = await detailPage.$$('button[data-name="ToggleButton"]');
        console.log(`[DEBUG] 検出されたボタン数: ${btns.length}`);
        
        // 各ボタンの情報を表示
        // 注意: ボタンの状態を詳細に確認（テキスト、アイコン、可視性、有効性）
        // 可視性チェックは以下の3つのCSSプロパティを考慮:
        // - display: none でないこと
        // - visibility: hidden でないこと
        // - opacity: 0 でないこと
        for (const btn of btns) {
          const text = await btn.evaluate(el => el.innerText.trim());
          const hasIcon = await btn.evaluate(el => el.querySelector('svg') !== null);
          const isVisible = await btn.evaluate(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && 
                   style.display !== 'none' && 
                   style.visibility !== 'hidden' && 
                   style.opacity !== '0';
          });
          const isEnabled = await btn.evaluate(el => !el.disabled);
          console.log(`[DEBUG] ボタン情報: テキスト="${text}", アイコン有無=${hasIcon}, 可視性=${isVisible}, 有効=${isEnabled}`);
        }
        
        // フォローボタンを特定
        // 注意: 以下の条件でボタンを特定
        // 1. テキストが"フォロー"であること
        // 2. 可視性がtrueであること（display, visibility, opacityの条件を満たす）
        // 3. ボタンが有効であること（disabledでない）
        // 重要: アイコンの有無は条件から除外（実際のUIでは、クリック可能なボタンは必ずしもアイコンを持たない）
        let followBtn = null;
        for (const btn of btns) {
          const text = await btn.evaluate(el => el.innerText.trim());
          const isVisible = await btn.evaluate(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && 
                   style.display !== 'none' && 
                   style.visibility !== 'hidden' && 
                   style.opacity !== '0';
          });
          const isEnabled = await btn.evaluate(el => !el.disabled);
          
          if (text === 'フォロー' && isVisible && isEnabled) {
            followBtn = btn;
            console.log('[DEBUG] フォローボタンを特定しました（条件: テキスト="フォロー", 可視, 有効）');
            break;
          }
        }
        
        if (followBtn) {
          // フォローボタンの詳細情報を取得
          // 注意: クリック前にボタンの状態を詳細に確認
          // 位置情報、スタイル情報、有効状態などを記録
          console.log('[DEBUG] フォローボタンの詳細情報を取得します...');
          const btnInfo = await followBtn.evaluate(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return {
              text: el.innerText.trim(),
              isVisible: rect.width > 0 && rect.height > 0 && 
                        style.display !== 'none' && 
                        style.visibility !== 'hidden' && 
                        style.opacity !== '0',
              position: {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
              },
              isEnabled: !el.disabled,
              classes: el.className,
              hasIcon: el.querySelector('svg') !== null,
              style: {
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                pointerEvents: style.pointerEvents
              }
            };
          });
          console.log('[DEBUG] フォローボタン情報:', JSON.stringify(btnInfo, null, 2));
          
          // クリック前の待機
          // 注意: 2秒の待機を設定（ボタンの状態が安定するのを待つ）
          console.log('[DEBUG] クリック前の待機を開始（2秒）...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // ボタンが表示されるまでスクロール
          // 注意: ボタンを画面の中央に配置（より確実なクリックのため）
          console.log('[DEBUG] ボタンを画面内にスクロールします...');
          await followBtn.evaluate(el => {
            const rect = el.getBoundingClientRect();
            const scrollY = window.scrollY + rect.top - (window.innerHeight / 2);
            window.scrollTo({
              top: scrollY,
              behavior: 'smooth'
            });
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // クリック処理
          // 注意: 2段階のクリック処理を実装
          // 1. 通常のクリックを試みる（より自然な操作）
          // 2. 失敗した場合、マウスイベントを手動で発火（フォールバック）
          console.log('[DEBUG] クリック処理を開始します...');
          try {
            // まず通常のクリックを試みる（200msの遅延を設定）
            await followBtn.click({ delay: 200 });
            console.log('[DEBUG] 通常クリックを実行しました');
          } catch (error) {
            console.log('[DEBUG] 通常クリックが失敗したため、イベント発火方式に切り替えます');
            // クリックが失敗した場合、イベント発火方式にフォールバック
            // 注意: マウスイベントを順番に発火（mouseover → mousedown → mouseup → click）
            // 各イベント間に200msの遅延を設定（より自然な操作をシミュレート）
            await followBtn.evaluate(el => {
              const rect = el.getBoundingClientRect();
              const x = rect.left + (rect.width / 2);
              const y = rect.top + (rect.height / 2);
              
              const events = ['mouseover', 'mousedown', 'mouseup', 'click'];
              events.forEach((eventType, index) => {
                setTimeout(() => {
                  const event = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: x,
                    clientY: y
                  });
                  el.dispatchEvent(event);
                  console.log(`[DEBUG] ${eventType}イベントを発火しました`);
                }, index * 200);
              });
            });
          }
          
          console.log('[DEBUG] クリックイベントを発火しました');
          
          // クリック後の待機
          // 注意: 3秒の待機を設定（フォロー状態の変更を待つ）
          console.log('[DEBUG] クリック後の待機を開始（3秒）...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // フォロー状態の変更を待機
          // 注意: 以下の条件でフォロー状態の変更を確認
          // 1. ボタンのテキストが"フォロー中"に変更されていること
          // 2. ボタンが可視状態であること
          // タイムアウトは15秒に設定（ネットワーク遅延などを考慮）
          console.log('[DEBUG] フォロー状態の変更を待機します...');
          try {
            const followStateChange = await detailPage.waitForFunction(
              () => {
                const buttons = Array.from(document.querySelectorAll('button[data-name="ToggleButton"]'));
                const followButton = buttons.find(btn => {
                  const text = btn.innerText.trim();
                  const isVisible = (() => {
                    const rect = btn.getBoundingClientRect();
                    const style = window.getComputedStyle(btn);
                    return rect.width > 0 && rect.height > 0 && 
                           style.display !== 'none' && 
                           style.visibility !== 'hidden' && 
                           style.opacity !== '0';
                  })();
                  return text === 'フォロー中' && isVisible;
                });
                
                if (followButton) {
                  return {
                    success: true,
                    buttonText: followButton.innerText.trim(),
                    buttonClasses: followButton.className,
                    buttonStyle: {
                      display: window.getComputedStyle(followButton).display,
                      visibility: window.getComputedStyle(followButton).visibility,
                      opacity: window.getComputedStyle(followButton).opacity
                    }
                  };
                }
                
                return {
                  success: false,
                  currentButtons: buttons.map(btn => ({
                    text: btn.innerText.trim(),
                    isVisible: (() => {
                      const rect = btn.getBoundingClientRect();
                      const style = window.getComputedStyle(btn);
                      return rect.width > 0 && rect.height > 0 && 
                             style.display !== 'none' && 
                             style.visibility !== 'hidden' && 
                             style.opacity !== '0';
                    })(),
                    classes: btn.className
                  }))
                };
              },
              { timeout: 15000 }
            );
            
            const followState = await followStateChange.jsonValue();
            console.log('[DEBUG] フォロー状態の変更結果:', JSON.stringify(followState, null, 2));
            
            if (followState.success) {
              console.log('[DEBUG] フォロー状態の変更を確認しました');
              followCount++;
              console.log(`[DEBUG] フォロー成功（${followCount}件目）｜（${name}）｜クリエイター: ${link}`);
              
              // フォロー成功後の待機
              // 注意: 3秒の待機を設定（次のページ遷移前に状態を安定させる）
              console.log('[DEBUG] フォロー成功後の待機を開始（3秒）...');
              await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
              console.log('[DEBUG] フォロー状態の変更が確認できませんでした');
              console.log('[DEBUG] 現在のボタン状態:', followState.currentButtons);
            }
          } catch (error) {
            console.log('[DEBUG] フォロー状態の変更を確認できませんでした');
            console.log('[DEBUG] エラー詳細:', error.message);
          }
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
