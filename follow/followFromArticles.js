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


  // 記事一覧ページで10回スクロール
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
        await detailPage.goto(link, { 
          waitUntil: 'networkidle0',
          timeout: 30000 
        });
        console.log('[DEBUG] ページ遷移が完了しました');
        
        // ページの完全な読み込みを待機
        console.log('[DEBUG] ページの完全な読み込みを待機します...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // ボタン要素の検索を開始
        console.log('[DEBUG] ボタン要素の検索を開始します...');
        const btns = await detailPage.$$('button[data-name="ToggleButton"]');
        console.log(`[DEBUG] 検出されたボタン数: ${btns.length}`);
        
        // 各ボタンの情報を表示
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
        
        // フォローボタンを特定（条件を緩和）
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
          
          // クリック前に待機
          console.log('[DEBUG] クリック前の待機を開始（2秒）...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // ボタンが表示されるまでスクロール
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
          console.log('[DEBUG] クリック処理を開始します...');
          try {
            // まず通常のクリックを試みる
            await followBtn.click({ delay: 200 });
            console.log('[DEBUG] 通常クリックを実行しました');
          } catch (error) {
            console.log('[DEBUG] 通常クリックが失敗したため、イベント発火方式に切り替えます');
            // クリックが失敗した場合、イベント発火方式にフォールバック
            await followBtn.evaluate(el => {
              const rect = el.getBoundingClientRect();
              const x = rect.left + (rect.width / 2);
              const y = rect.top + (rect.height / 2);
              
              // マウスイベントを発火
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
          console.log('[DEBUG] クリック後の待機を開始（3秒）...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // フォロー状態の変更を待機
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
              console.log(`[DEBUG] フォロー成功（${followCount}件目）｜クリエイター: ${link}`);
              
              // フォロー成功後の待機
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
