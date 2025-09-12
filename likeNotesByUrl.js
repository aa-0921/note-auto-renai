require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {
  // コマンドライン引数からURLを取得
  const targetUrl = process.argv[2];
  
  // デフォルトURL（引数がない場合）
  const defaultUrl = 'https://note.com/enginner_skill';
  
  // 使用するURLを決定
  const urlToUse = targetUrl || defaultUrl;
  
  console.log('【URL設定】');
  console.log('引数で指定されたURL:', targetUrl || 'なし');
  console.log('使用するURL:', urlToUse);
  
  // URLの形式をチェック
  if (!urlToUse.startsWith('https://note.com/')) {
    console.error('エラー: 有効なnote.comのURLを指定してください');
    console.error('例: node likeNotesByUrl.js https://note.com/enginner_skill');
    process.exit(1);
  }

  console.log('Puppeteer起動オプションを取得します');
  // CI環境（GitHub Actions等）ではheadless:'old'、ローカルではheadless:false
  const isCI = process.env.CI === 'true';
  console.log('process.env.CIの値:', process.env.CI);
  console.log('isCI:', isCI);
  
  const browser = await puppeteer.launch({
    headless: false, // ブラウザウィンドウを表示
    defaultViewport: null, // ウインドウサイズをargsで指定するためnullに
    args: [
      '--window-size=1280,900',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });
  
  const page = await browser.newPage();

  try {
    console.log('対象ページへ遷移します:', urlToUse);
    await page.goto(urlToUse, { waitUntil: 'networkidle2' });
    console.log('ページ遷移完了');

    // ページの読み込みを待つ
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 記事が表示されるまで少し待機
    console.log('記事の読み込みを待機中...');
    
    // デバッグ用：ページの内容を確認
    console.log('ページのタイトル:', await page.title());
    
    // デバッグ用：ボタン要素を探す
    const allButtons = await page.$$('button');
    console.log('ページ内のボタン数:', allButtons.length);
    
    // デバッグ用：aria-label属性を持つボタンを探す
    const buttonsWithAriaLabel = await page.$$('button[aria-label]');
    console.log('aria-label属性を持つボタン数:', buttonsWithAriaLabel.length);
    
    // デバッグ用：aria-labelの内容を確認
    for (let i = 0; i < Math.min(5, buttonsWithAriaLabel.length); i++) {
      const ariaLabel = await buttonsWithAriaLabel[i].evaluate(el => el.getAttribute('aria-label'));
      console.log(`ボタン${i + 1}のaria-label:`, ariaLabel);
    }
    
    // デバッグ用：実際のいいねボタンを探す
    // まず、aria-label="スキ"のボタンを探す
    let likeButtons = await page.$$('button[aria-label="スキ"]');
    console.log('aria-label="スキ"のボタン数:', likeButtons.length);
    
    // 見つからない場合は、SVG要素でハートマークを探す
    if (likeButtons.length === 0) {
      console.log('SVG要素でハートマークを探します');
      const heartSvg = await page.$$('svg[aria-label="スキ"]');
      console.log('ハートSVG要素数:', heartSvg.length);
      
      if (heartSvg.length > 0) {
        // SVGの親要素（ボタン）を取得
        likeButtons = await page.$$('button:has(svg[aria-label="スキ"])');
        console.log('ハートSVGを含むボタン数:', likeButtons.length);
      }
    }
    
    // まだ見つからない場合は、data-testidやclassで探す
    if (likeButtons.length === 0) {
      console.log('data-testidやclassでいいねボタンを探します');
      likeButtons = await page.$$('button[data-testid*="like"], button[data-testid*="heart"], button[class*="like"], button[class*="heart"]');
      console.log('data-testid/class検索結果:', likeButtons.length);
    }
    
    // デバッグ用：見つかったボタンの詳細を確認
    if (likeButtons.length > 0) {
      console.log('見つかったボタンの詳細:');
      for (let i = 0; i < Math.min(3, likeButtons.length); i++) {
        const ariaLabel = await likeButtons[i].evaluate(el => el.getAttribute('aria-label'));
        const className = await likeButtons[i].evaluate(el => el.className);
        const dataTestId = await likeButtons[i].evaluate(el => el.getAttribute('data-testid'));
        console.log(`ボタン${i + 1}: aria-label="${ariaLabel}", class="${className}", data-testid="${dataTestId}"`);
      }
    }
    
    // いいねボタンが見つからない場合は、スクロールして再試行
    if (likeButtons.length === 0) {
      console.log('いいねボタンが見つからないため、スクロールして再試行します');
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      likeButtons = await page.$$('button:has(svg[aria-label="スキ"])');
      console.log('スクロール後の「スキ」ボタン数:', likeButtons.length);
    }
    
    console.log('記事の読み込み完了');

    // 「もっとみる」ボタンをクリックして記事を読み込む
    console.log('「もっとみる」ボタンを探してクリックします');
    
    // まずページ下部までスクロール
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // デバッグ用：スクロール後のスクリーンショット
    await page.screenshot({ path: 'debug_scroll_after.png', fullPage: true });
    console.log('スクロール後のスクリーンショットを保存しました: debug_scroll_after.png');
    
    // デバッグ用：すべてのボタンとリンクを調査
    const debugElements = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const links = Array.from(document.querySelectorAll('a'));
      const allElements = [...buttons, ...links];
      
      return allElements.map((el, index) => ({
        tagName: el.tagName,
        text: el.textContent.trim(),
        className: el.className,
        id: el.id,
        visible: el.offsetParent !== null,
        rect: el.getBoundingClientRect()
      }));
    });
    
    console.log('【デバッグ】ページ内の「もっとみる」関連要素:');
    debugElements.forEach((el, index) => {
      if (el.text.includes('もっと') || el.text.includes('みる')) {
        console.log(`${el.tagName}${index}: "${el.text}" | 可視: ${el.visible} | rect: ${JSON.stringify(el.rect)}`);
      }
    });
    
    // デバッグ用：HTMLの構造を確認
    const htmlStructure = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const links = Array.from(document.querySelectorAll('a'));
      const allElements = [...buttons, ...links];
      
      return allElements
        .filter(el => el.textContent.includes('もっとみる'))
        .map(el => ({
          tagName: el.tagName,
          text: el.textContent.trim(),
          className: el.className,
          id: el.id,
          outerHTML: el.outerHTML,
          parentHTML: el.parentElement ? el.parentElement.outerHTML : null,
          computedStyle: {
            display: window.getComputedStyle(el).display,
            visibility: window.getComputedStyle(el).visibility,
            opacity: window.getComputedStyle(el).opacity,
            position: window.getComputedStyle(el).position,
            top: window.getComputedStyle(el).top,
            left: window.getComputedStyle(el).left,
            width: window.getComputedStyle(el).width,
            height: window.getComputedStyle(el).height
          }
        }));
    });
    
    console.log('【デバッグ】「もっとみる」要素のHTML構造:');
    htmlStructure.forEach((el, index) => {
      console.log(`要素${index}:`);
      console.log(`  tagName: ${el.tagName}`);
      console.log(`  text: "${el.text}"`);
      console.log(`  className: "${el.className}"`);
      console.log(`  id: "${el.id}"`);
      console.log(`  outerHTML: ${el.outerHTML}`);
      console.log(`  computedStyle: ${JSON.stringify(el.computedStyle, null, 2)}`);
      console.log('---');
    });
    
    // 「もっとみる」ボタンを探す（サイズがあるボタンを優先）
    const loadMoreButton = await page.evaluateHandle(() => {
      // まずbutton要素を探す
      const buttons = Array.from(document.querySelectorAll('button'));
      const loadMoreButtons = buttons.filter(btn => btn.textContent.includes('もっとみる'));
      
      // サイズがあるボタンを探す（getBoundingClientRectでwidth > 0のもの）
      let foundButton = loadMoreButtons.find(btn => {
        const rect = btn.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      
      // サイズがあるボタンが見つからない場合は最初のボタンを使用
      if (!foundButton && loadMoreButtons.length > 0) {
        foundButton = loadMoreButtons[0];
      }
      
      // button要素が見つからない場合はa要素を探す
      if (!foundButton) {
        const links = Array.from(document.querySelectorAll('a'));
        foundButton = links.find(link => link.textContent.includes('もっとみる'));
      }
      
      return foundButton;
    });
    
    if (loadMoreButton && loadMoreButton.asElement && loadMoreButton.asElement() !== null) {
      console.log('「もっとみる」ボタンが見つかりました。詳細を調査します。');
      
      try {
        const buttonElement = loadMoreButton.asElement();
        
        // ボタンの詳細情報を取得
        const buttonInfo = await buttonElement.evaluate(btn => ({
          text: btn.textContent.trim(),
          className: btn.className,
          id: btn.id,
          disabled: btn.disabled,
          style: btn.style.cssText,
          rect: btn.getBoundingClientRect(),
          offsetParent: btn.offsetParent !== null,
          computedStyle: {
            display: window.getComputedStyle(btn).display,
            visibility: window.getComputedStyle(btn).visibility,
            opacity: window.getComputedStyle(btn).opacity,
            pointerEvents: window.getComputedStyle(btn).pointerEvents
          }
        }));
        
        console.log('「もっとみる」ボタンの詳細情報:', JSON.stringify(buttonInfo, null, 2));
        
        // 要素の可視性をチェック
        const isVisible = await buttonElement.isIntersectingViewport();
        console.log('「もっとみる」ボタンの可視性:', isVisible);
        
        // ボタンがクリック可能かチェック
        const isClickable = await buttonElement.evaluate(btn => {
          const rect = btn.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && 
                 !btn.disabled && 
                 !btn.hasAttribute('disabled') &&
                 window.getComputedStyle(btn).pointerEvents !== 'none' &&
                 window.getComputedStyle(btn).visibility !== 'hidden' &&
                 window.getComputedStyle(btn).opacity !== '0';
        });
        console.log('「もっとみる」ボタンのクリック可能性:', isClickable);
        
        if (isVisible && isClickable) {
          // ボタンをハイライトしてスクリーンショット
          await buttonElement.evaluate(btn => {
            btn.style.border = '5px solid red';
            btn.style.backgroundColor = 'yellow';
          });
          await page.screenshot({ path: 'debug_button_highlighted.png', fullPage: true });
          console.log('ハイライトしたボタンのスクリーンショットを保存しました: debug_button_highlighted.png');
          
          // JavaScriptでクリックイベントを発火
          console.log('「もっとみる」ボタンをクリックします...');
          await buttonElement.evaluate(btn => btn.click());
          console.log('「もっとみる」ボタンをクリックしました');
          
          // 新しい記事が読み込まれるまで待機
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          // クリック後のスクリーンショット
          await page.screenshot({ path: 'debug_after_click.png', fullPage: true });
          console.log('クリック後のスクリーンショットを保存しました: debug_after_click.png');
        } else {
          console.log('「もっとみる」ボタンがクリック不可能です');
          console.log(`可視性: ${isVisible}, クリック可能性: ${isClickable}`);
        }
      } catch (error) {
        console.log('「もっとみる」ボタンのクリックでエラー:', error.message);
        console.log('エラーの詳細:', error.stack);
      }
    } else {
      console.log('「もっとみる」ボタンが見つかりませんでした');
      
      // 代替案：テキストに「もっと」を含むボタンを探す
      const alternativeButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => btn.textContent.includes('もっと'));
      });
      
      if (alternativeButton && alternativeButton.asElement && alternativeButton.asElement() !== null) {
        const altButtonText = await alternativeButton.asElement().evaluate(btn => btn.textContent.trim());
        console.log(`代替ボタンが見つかりました: "${altButtonText}"`);
      }
    }
    
    console.log('「もっとみる」ボタンの処理完了');

    // 20回下までスクロールして記事を読み込む（より多くの記事を表示）
    for (let i = 0; i < 20; i++) {
      console.log(`下までスクロールします (${i + 1}/20)`);
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待機
    }
    console.log('スクロール完了');

    // 「スキ」ボタン（button要素）をすべて取得
    likeButtons = await page.$$('button:has(svg[aria-label="スキ"])');
    console.log('取得した「スキ」ボタン数:', likeButtons.length);

    if (likeButtons.length === 0) {
      console.log('いいねできる記事が見つかりませんでした');
      await browser.close();
      return;
    }

    const maxLikes = 50; // 最大いいね数（増加）
    const likeCount = Math.min(maxLikes, likeButtons.length);
    console.log(`これから${likeCount}件のスキを付けます。`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < likeCount; i++) {
      try {
        console.log(`--- ${i + 1}件目 ---`);
        const btn = likeButtons[i];
        
        // ボタンのclass名
        const className = await btn.evaluate(el => el.className);
        console.log('ボタンのclassName:', className);
        
        // クリック前の状態
        const ariaPressed = await btn.evaluate(el => el.getAttribute('aria-pressed'));
        console.log('クリック前: aria-pressed:', ariaPressed);
        
        // すでにいいね済みの場合はスキップ
        if (ariaPressed === 'true') {
          console.log('すでにいいね済みのためスキップします');
          continue;
        }
        
        // ボタンの親要素からタイトルと投稿者名を取得
        const info = await btn.evaluate((btn) => {
          let title = 'タイトル不明';
          let user = '投稿者不明';
          
          // 記事の親要素を探す（複数のパターンを試す）
          let articleElement = btn.closest('article') || 
                              btn.closest('[data-testid="note-card"]') ||
                              btn.closest('.m-largeNoteWrapper__card') ||
                              btn.closest('.o-noteCard');
          
          if (articleElement) {
            // タイトルを探す（複数のパターンを試す）
            const titleElem = articleElement.querySelector('h1, h2, h3, .m-noteBodyTitle__title, [data-testid="note-title"]') ||
                             articleElement.querySelector('a[href*="/n/"]') ||
                             articleElement.querySelector('.o-noteCard__title');
            if (titleElem) {
              title = titleElem.textContent.trim();
            }
            
            // 投稿者名を探す（複数のパターンを試す）
            const userElem = articleElement.querySelector('.o-largeNoteSummary__userName, .o-noteCard__userName, [data-testid="user-name"]') ||
                            articleElement.querySelector('a[href*="/@"]') ||
                            articleElement.querySelector('.o-noteCard__user');
            if (userElem) {
              user = userElem.textContent.trim();
            }
          }
          
          return { title, user };
        });
        console.log(`タイトル: ${info.title}｜投稿者: ${info.user}`);
        
        // CI環境でのみ待機時間を追加
        if (isCI) {
          console.log('CI環境のため、like処理前に2秒待機します');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // 要素の可視性をチェック
        let isVisible = await btn.isIntersectingViewport();
        console.log('いいねボタンの可視性（初回）:', isVisible);
        
        if (!isVisible) {
          // ボタンが可視状態になるまでスクロール
          await btn.scrollIntoView();
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 再度可視性をチェック
          isVisible = await btn.isIntersectingViewport();
          console.log('いいねボタンの可視性（スクロール後）:', isVisible);
          
          if (!isVisible) {
            console.log('いいねボタンが可視状態ではないためスキップします');
            continue;
          }
        }
        
        // 要素がクリック可能かチェック
        const isClickable = await btn.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && 
                 !el.disabled && 
                 !el.hasAttribute('disabled') &&
                 window.getComputedStyle(el).pointerEvents !== 'none';
        });
        console.log('いいねボタンのクリック可能性:', isClickable);
        
        if (!isClickable) {
          console.log('いいねボタンがクリック不可能なためスキップします');
          continue;
        }
        
        // JavaScriptでクリックイベントを発火（より確実）
        console.log('クリック前: JavaScript click()実行');
        await btn.evaluate(el => el.click());
        
        // CI環境でのみ追加の待機時間を設定
        const waitTimeout = isCI ? 10000 : 5000; // CI環境では10秒、ローカルでは5秒
        
        // クリック後、aria-pressedがtrueになるまで待機
        await page.waitForFunction(
          el => el.getAttribute('aria-pressed') === 'true',
          { timeout: waitTimeout },
          btn
        );
        console.log('クリック後: aria-pressedがtrueになったことを確認');
        
        successCount++;
        
        // CI環境でのみlike処理後の待機時間を追加
        if (isCI) {
          console.log('CI環境のため、like処理後に1秒待機します');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // 各いいねの間に少し待機
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`いいね処理でエラーが発生しました (${i + 1}件目):`, error.message);
        errorCount++;
        continue;
      }
    }
    
    console.log('【処理完了】');
    console.log(`成功: ${successCount}件`);
    console.log(`エラー: ${errorCount}件`);
    console.log(`合計処理: ${successCount + errorCount}件`);

  } catch (error) {
    console.error('ページ処理中にエラーが発生しました:', error.message);
  } finally {
    await browser.close();
    console.log('ブラウザを閉じました');
  }
})();
