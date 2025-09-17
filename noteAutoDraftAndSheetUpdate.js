// 投稿一覧管理表.md で下書き保存日がからのものをNoteに下書き保存する

// Lambda本番用 + ローカルテスト両対応のnote自動投稿スクリプト
const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;
require('dotenv').config();

// 必須環境変数のチェック
if (!process.env.NOTE_EMAIL || !process.env.NOTE_PASSWORD) {
  console.error('エラー: NOTE_EMAIL または NOTE_PASSWORD の環境変数が設定されていません。');
  process.exit(1);
}

let puppeteer, launchOptions;

if (isLambda) {
  // Lambda本番用
  puppeteer = require('puppeteer-core');
  const chromium = require('chrome-aws-lambda');
  launchOptions = async () => ({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
} else {
  // ローカルテスト用
  puppeteer = require('puppeteer');
  launchOptions = async () => ({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  });
}

const fs = require('fs');
const path = require('path');

// 記事データ取得
function getArticleData(articlePath) {
  // ファイル名からタイトルを抽出
  const fileName = path.basename(articlePath, '.md');
  // 例: 31__2025-05-25-引き寄せの法則で億万長者になった最強の秘密
  const match = fileName.match(/^\d+__\d{4}-\d{2}-\d{2}-(.+)$/);
  const title = match ? match[1] : fileName;
  const body = fs.readFileSync(articlePath, 'utf-8');
  return { title, body };
}

// サムネイル画像をランダム選択
function getRandomThumbnail() {
  const dir = path.join(__dirname, 'thumbnails');
  const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
  if (files.length === 0) throw new Error('サムネイル画像がありません');
  
  // より強力なランダム化：複数の手法を組み合わせ
  // 1. 現在時刻のミリ秒をシードとして使用
  const now = Date.now();
  const seed1 = now % files.length;
  
  // 2. プロセスの開始時間も組み合わせ
  const seed2 = Math.floor(process.uptime() * 1000) % files.length;
  
  // 3. 複数回のランダム処理を組み合わせ
  let randomIndex = Math.floor(Math.random() * files.length);
  randomIndex = (randomIndex + seed1) % files.length;
  randomIndex = (randomIndex + Math.floor(Math.random() * files.length)) % files.length;
  randomIndex = (randomIndex + seed2) % files.length;
  
  // 4. さらにランダムシャッフルを追加
  for (let i = 0; i < 3; i++) {
    randomIndex = (randomIndex + Math.floor(Math.random() * files.length)) % files.length;
  }
  
  const file = files[randomIndex];
  console.log(`サムネイル選択: ${randomIndex}/${files.length-1} -> ${file}`);
  return path.join(dir, file);
}

// Puppeteerで画像ドラッグ＆ドロップ（画像を追加ボタンに対して）
async function dragAndDropToAddButton(page) {
  try {
    const dropSelector = 'button[aria-label="画像を追加"]';
    await page.waitForSelector(dropSelector, { timeout: 5000 });

    const filePath = getRandomThumbnail();
    const fileName = path.basename(filePath);
    const fileData = fs.readFileSync(filePath);
    const fileBase64 = fileData.toString('base64');
    console.log('ドラッグ＆ドロップでアップロードする画像ファイル:', filePath);

    await page.evaluate(async (dropSelector, fileName, fileBase64) => {
      const dropArea = document.querySelector(dropSelector);
      if (!dropArea) {
        throw new Error('ドロップエリアが見つかりません');
      }
      const bstr = atob(fileBase64);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while(n--) u8arr[n] = bstr.charCodeAt(n);
      const file = new File([u8arr], fileName, { type: "image/jpeg" });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      // dragover
      const dragOverEvent = new DragEvent('dragover', {
        dataTransfer,
        bubbles: true,
        cancelable: true
      });
      dropArea.dispatchEvent(dragOverEvent);
      // drop
      const dropEvent = new DragEvent('drop', {
        dataTransfer,
        bubbles: true,
        cancelable: true
      });
      dropArea.dispatchEvent(dropEvent);
    }, dropSelector, fileName, fileBase64);
    console.log('ドラッグ＆ドロップによる画像アップロードを実行しました:', filePath);

    // 画像アップロード後の「保存」ボタンをモーダル内で探して複合マウスイベントでクリック
    try {
      // --- 画像アップロード後の保存処理を安定化するための待機処理 ---
      // 1. 画像プレビュー(imgタグ)がモーダル内に表示されるまで待機
      //    これにより、画像アップロードが完了してから保存ボタンを押すことができる
      console.log('画像プレビュー(imgタグ)がモーダル内に表示されるのを待機します...');
      await page.waitForSelector('.ReactModal__Content img', { timeout: 15000 });
      console.log('画像プレビュー(imgタグ)が表示されました');

      // 2. 「保存」ボタンが有効（disabled属性やaria-disabledがfalse）になるまで待機
      //    これにより、ボタンが押せる状態になるまで確実に待つことができる
      console.log('「保存」ボタンが有効になるのを待機します...');
      await page.waitForFunction(() => {
        const modal = document.querySelector('.ReactModal__Content');
        if (!modal) return false;
        const btns = Array.from(modal.querySelectorAll('button'));
        return btns.some(btn => btn.innerText.trim() === '保存' && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true');
      }, { timeout: 15000 });
      console.log('「保存」ボタンが有効になりました');

      // 3. モーダル内の全ボタンを取得し、デバッグ出力
      const modalButtons = await page.$$('.ReactModal__Content button');
      console.log('モーダル内のボタン数:', modalButtons.length);
      for (let i = 0; i < modalButtons.length; i++) {
        const html = await modalButtons[i].evaluate(el => el.outerHTML);
        console.log(`モーダル内ボタン[${i}] outerHTML:`, html);
      }
      let clicked = false;
      for (const btn of modalButtons) {
        // ボタンのinnerTextをデバッグ出力
        const text = await btn.evaluate(el => el.innerText.trim());
        console.log('モーダル内ボタンテキスト:', text);
        if (text === '保存') {
          // クリック前に画面内にスクロール
          await btn.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
          // ボタンの有効状態を再確認
          const isDisabled = await btn.evaluate(el => el.disabled || el.getAttribute('aria-disabled') === 'true');
          console.log('保存ボタンのdisabled状態:', isDisabled);
          if (isDisabled) {
            console.error('保存ボタンが無効化されています');
            continue;
          }
          // PuppeteerのElementHandle.click()でクリック（delay付き）
          // これにより、実際のユーザー操作に近い形でクリックイベントが発火する
          await btn.click({ delay: 100 });
          clicked = true;
          break;
        }
      }
      if (clicked) {
        console.log('画像アップロード後の「保存」ボタン（モーダル内）をElementHandle.click()でクリックしました');
        // クリック後、モーダルが消える/非表示になるまで待機
        // これにより、保存処理が完了し次の処理に進めることを保証する
        await page.waitForFunction(() => {
          const modal = document.querySelector('.ReactModal__Content');
          return !modal || modal.offsetParent === null || window.getComputedStyle(modal).display === 'none' || window.getComputedStyle(modal).opacity === '0';
        }, { timeout: 15000 });
        console.log('画像アップロード後のモーダルが閉じました');
      } else {
        console.error('画像アップロード後の「保存」ボタン（モーダル内）が見つかりませんでした');
      }
    } catch (e) {
      console.error('画像アップロード後の「保存」ボタン（モーダル内）のクリック処理中にエラー:', e);
    }
  } catch (e) {
    console.error('ドラッグ＆ドロップ画像アップロード中にエラー:', e);
  }
}
exports.dragAndDropToAddButton = dragAndDropToAddButton;

// ログイン処理
async function login(page, email, password) {
  console.log('=== ログイン処理開始 ===');
  console.log('現在のURL:', await page.url());
  console.log('現在のタイトル:', await page.title());
  
  // NOTE_EMAILとNOTE_PASSWORDの環境変数チェック
  if (!process.env.NOTE_EMAIL || !process.env.NOTE_PASSWORD) {
    console.error('エラー: NOTE_EMAIL または NOTE_PASSWORD の環境変数が設定されていません。');
    process.exit(1);
  }
  
  console.log('環境変数チェック完了');
  console.log('email変数の長さ:', email ? email.length : 'undefined');
  console.log('password変数の長さ:', password ? password.length : 'undefined');
  console.log('NOTE_EMAIL環境変数の長さ:', process.env.NOTE_EMAIL ? process.env.NOTE_EMAIL.length : 'undefined');
  console.log('NOTE_PASSWORD環境変数の長さ:', process.env.NOTE_PASSWORD ? process.env.NOTE_PASSWORD.length : 'undefined');

  // User-AgentとAccept-Languageを日本向けに設定
  console.log('User-AgentとAccept-Languageを設定します');
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7'
  });
  console.log('User-AgentとAccept-Language設定完了');
  
  console.log('noteログインページへ遷移します');
  console.log('遷移前のURL:', await page.url());
  await page.goto('https://note.com/login?redirectPath=https%3A%2F%2Fnote.com%2F', { waitUntil: 'networkidle2', timeout: 60000 });
  console.log('遷移後のURL:', await page.url());
  console.log('遷移後のタイトル:', await page.title());
  console.log('メールアドレスとパスワードを入力します');
  
  // メールアドレス入力フィールドの確認
  console.log('メールアドレス入力フィールドを探します');
  const emailField = await page.$('#email');
  if (emailField) {
    console.log('メールアドレス入力フィールドが見つかりました');
    await page.type('#email', email);
    console.log('メールアドレス入力完了');
  } else {
    console.log('メールアドレス入力フィールドが見つかりません');
    console.log('ページのHTMLの一部:', await page.content().then(content => content.slice(0, 1000)));
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待機
  
  // パスワード入力フィールドの確認
  console.log('パスワード入力フィールドを探します');
  const passwordField = await page.$('#password');
  if (passwordField) {
    console.log('パスワード入力フィールドが見つかりました');
    await page.type('#password', password);
    console.log('パスワード入力完了');
  } else {
    console.log('パスワード入力フィールドが見つかりません');
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待機
  
  console.log('ログインボタンを探します');
  await page.waitForSelector('button[type="button"]:not([disabled])');
  console.log('ログインボタンが有効になりました');
  
  const buttons = await page.$$('button[type="button"]');
  console.log('見つかったボタン数:', buttons.length);
  
  let loginClicked = false;
  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    const text = await (await btn.getProperty('innerText')).jsonValue();
    console.log(`ボタン${i + 1}のテキスト: "${text}"`);
    if (text && text.trim() === 'ログイン') {
      console.log('ログインボタンをクリックします');
      try {
        // 方法1: ボタンクリック
        await btn.click();
        console.log('ログインボタンをクリックしました');
        
        // 方法2: フォーム送信も試す（ボタンクリックが失敗した場合のバックアップ）
        try {
          await page.evaluate(() => {
            const form = document.querySelector('form');
            if (form) {
              form.submit();
            }
          });
          console.log('フォーム送信も実行しました');
        } catch (formErr) {
          console.log('フォーム送信に失敗:', formErr.message);
        }
        console.log('クリック後のURL:', await page.url());
        console.log('クリック後のタイトル:', await page.title());
        
        // ログイン処理の待機
        console.log('ログイン処理の待機を開始します（10秒待機）');
        await new Promise(resolve => setTimeout(resolve, 10000));
        console.log('待機後のURL:', await page.url());
        console.log('待機後のタイトル:', await page.title());
        
        // URLが変わったかチェック
        const currentUrl = await page.url();
        if (currentUrl.includes('/login')) {
          console.log('警告: まだログインページにいます。ログインが失敗している可能性があります');
        } else {
          console.log('ログインページから移動しました。ログインが成功している可能性があります');
        }
        
        // ログインエラーメッセージの確認
        console.log('ログインエラーメッセージを確認します');
        const errorMessages = await page.$$eval('.error, .alert, .warning, [class*="error"], [class*="alert"], [class*="warning"]', elements => 
          elements.map(el => el.textContent.trim()).filter(text => text.length > 0)
        );
        if (errorMessages.length > 0) {
          console.log('エラーメッセージが見つかりました:', errorMessages);
        } else {
          console.log('エラーメッセージは見つかりませんでした');
        }
        
        // ページの状態をより詳しく確認
        console.log('ページの状態を確認します');
        const pageContent = await page.content();
        if (pageContent.includes('ログインに失敗')) {
          console.log('ログイン失敗メッセージが検出されました');
        } else if (pageContent.includes('CAPTCHA') || pageContent.includes('captcha')) {
          console.log('CAPTCHAが検出されました');
        } else if (pageContent.includes('セキュリティ') || pageContent.includes('security')) {
          console.log('セキュリティチェックが検出されました');
        } else {
          console.log('特別なエラーメッセージは検出されませんでした');
        }
        
        // ログイン後のページ遷移を待機（複数の方法で検出）
        try {
          console.log('方法1: ユーザーアイコンを検索中...');
          await page.waitForSelector('img.a-userIcon--medium', { timeout: 30000 });
          console.log('ユーザーアイコンを検出しました');
        } catch (e1) {
          console.log('ユーザーアイコン検出に失敗:', e1.message);
          console.log('現在のURL:', await page.url());
          console.log('現在のタイトル:', await page.title());
          
          try {
            console.log('方法2: ログインページからのリダイレクトを確認中...');
            await page.waitForFunction(
              () => !window.location.href.includes('/login'),
              { timeout: 30000 }
            );
            console.log('ログインページからのリダイレクトを確認しました');
            console.log('リダイレクト後のURL:', await page.url());
          } catch (e2) {
            console.log('リダイレクト検出に失敗:', e2.message);
            console.log('現在のURL:', await page.url());
            
            try {
              console.log('方法3: ダッシュボード要素を検索中...');
              await page.waitForSelector('[data-testid="dashboard"], .o-dashboard, .dashboard', { timeout: 30000 });
              console.log('ダッシュボード要素を検出しました');
            } catch (e3) {
              console.log('ダッシュボード要素検出に失敗:', e3.message);
              
              try {
                console.log('方法4: トップページ要素を検索中...');
                await page.waitForSelector('.o-topPage, .top-page, [data-testid="top"]', { timeout: 30000 });
                console.log('トップページ要素を検出しました');
              } catch (e4) {
                console.log('トップページ要素検出に失敗:', e4.message);
                console.log('すべての検出方法が失敗しました');
                console.log('最終的なURL:', await page.url());
                console.log('最終的なタイトル:', await page.title());
                throw e1; // 最初のエラーを再スロー
              }
            }
          }
        }
        
        console.log('ログイン成功を確認しました');
        loginClicked = true;
      } catch (e) {
        console.error('ログイン後のユーザーアイコン検出に失敗:', e);
        // スクリーンショットとHTMLを保存
        try {
          await page.screenshot({ path: 'login_error.png' });
          console.log('ログイン失敗時のスクリーンショットを保存しました（login_error.png）');
        } catch (screenshotErr) {
          console.error('スクリーンショット保存に失敗:', screenshotErr);
        }
        try {
          const html = await page.content();
          console.error('ログイン失敗時のHTMLの一部:', html.slice(0, 2000));
        } catch (htmlErr) {
          console.error('HTML取得に失敗:', htmlErr);
        }
        throw e;
      }
      break;
    }
  }
  if (!loginClicked) {
    console.log('ログインボタンが見つからないか、クリックに失敗しました');
    console.log('最終的なURL:', await page.url());
    console.log('最終的なタイトル:', await page.title());
    console.error('ログインボタンが見つからずクリックできませんでした');
    try {
      await page.screenshot({ path: 'login_btn_notfound.png' });
      console.log('ログインボタン未検出時のスクリーンショットを保存しました（login_btn_notfound.png）');
    } catch (screenshotErr) {
      console.error('スクリーンショット保存に失敗:', screenshotErr);
    }
    try {
      const html = await page.content();
      console.error('ログインボタン未検出時のHTMLの一部:', html.slice(0, 2000));
    } catch (htmlErr) {
      console.error('HTML取得に失敗:', htmlErr);
    }
    throw new Error('ログインボタンが見つかりませんでした');
  }
  
  console.log('=== ログイン処理完了 ===');
  console.log('ログイン完了');
  // ログイン後のURLとタイトルを出力
  console.log('ログイン後の現在のURL:', await page.url());
  console.log('ログイン後の現在のタイトル:', await page.title());
  // ユーザーアイコンが表示されているかチェック（ログイン判定）
  const userIcon = await page.$('img.a-userIcon--medium');
  if (userIcon) {
    // ユーザーアイコンの画像URLを取得してログ出力
    const iconUrl = await userIcon.evaluate(el => el.src);
    console.log('ユーザーアイコンが検出されました。ログイン成功です。画像URL:', iconUrl);
  } else {
    console.error('ユーザーアイコンが見つかりません。ログインに失敗した可能性があります。');
    try {
      await page.screenshot({ path: 'login_noicon.png' });
      console.log('ユーザーアイコン未検出時のスクリーンショットを保存しました（login_noicon.png）');
    } catch (screenshotErr) {
      console.error('スクリーンショット保存に失敗:', screenshotErr);
    }
    try {
      const html = await page.content();
      console.error('ユーザーアイコン未検出時のHTMLの一部:', html.slice(0, 2000));
    } catch (htmlErr) {
      console.error('HTML取得に失敗:', htmlErr);
    }
    process.exit(1);
  }
  // ログイン直後にユーザーポップアップがあれば閉じる
  const popupCloseBtn = await page.$('button.o-userPopup__close[aria-label="閉じる"]');
  if (popupCloseBtn) {
    console.log('ユーザーポップアップが表示されているため閉じます');
    await popupCloseBtn.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('ユーザーポップアップを閉じました');
  } else {
    console.log('ユーザーポップアップは表示されていません');
  }
  // ポップアップの有無にかかわらず2秒待機してから次の処理へ
  await new Promise(resolve => setTimeout(resolve, 2000));
}
exports.login = login;

// 投稿画面遷移
async function goToNewPost(page) {
  console.log('ユーザーポップアップがあれば閉じます');
  const closePopupBtn = await page.$('button.o-userPopup__close[aria-label="閉じる"]');
  if (closePopupBtn) {
    await closePopupBtn.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('ユーザーポップアップを閉じました');
  }
  // 投稿ボタン
  console.log('投稿ボタンを探します...');
  const postButtons = await page.$$('button[aria-label="投稿"]');
  let clicked = false;
  for (const btn of postButtons) {
    // ボタンのinnerTextとouterHTMLをデバッグ出力
    const innerText = await btn.evaluate(el => el.innerText);
    const outerHTML = await btn.evaluate(el => el.outerHTML);
    console.log('投稿ボタンinnerText:', innerText);
    console.log('投稿ボタンouterHTML:', outerHTML);
    if (await btn.isIntersectingViewport()) {
      console.log('表示されている投稿ボタンをhover→クリックします。');
      await btn.hover();
      await new Promise(resolve => setTimeout(resolve, 500));
      await btn.click();
      clicked = true;
      // 投稿ボタンクリック後のURLとタイトルを出力
      console.log('投稿ボタンクリック後のURL:', await page.url());
      console.log('投稿ボタンクリック後のタイトル:', await page.title());
      // 投稿ボタンクリック直後にスクリーンショットを保存
      // try {
      //   await page.screenshot({ path: 'after_post_btn.png' });
      //   console.log('投稿ボタンクリック後のスクリーンショットを保存しました（after_post_btn.png）');
      // } catch (e) {
      //   console.error('スクリーンショット保存に失敗:', e);
      // }
      // 全リンクを出力
      try {
        const links = await page.$$eval('a', as => as.map(a => ({href: a.getAttribute('href'), text: a.textContent.trim()})));
        // console.log('投稿ボタンクリック後の全リンク:', links);
      } catch (e) {
        console.error('全リンク出力に失敗:', e);
      }
      // page.contentの一部を出力
      try {
        const html = await page.content();
        console.log('投稿ボタンクリック後のHTMLの一部:', html.slice(0, 1000));
      } catch (e) {
        console.error('HTML出力に失敗:', e);
      }
      break;
    }
  }
  if (!clicked) {
    const html = await page.content();
    console.error('表示されている投稿ボタンが見つかりませんでした。HTMLの一部:', html.slice(0, 1000));
    throw new Error('表示されている投稿ボタンが見つかりませんでした');
  }

  // 投稿ボタンクリック後、新しく記事を書くボタンが表示されるかどうかを確認
  console.log('投稿ボタンクリック後、新しく記事を書くボタンが表示されるか確認します...');
  // クリック直後に1.5秒待機
  await new Promise(resolve => setTimeout(resolve, 1500));

  let newNoteButton = null;
  for (let i = 0; i < 5; i++) { // 最大5回リトライ（1秒ごと）
    newNoteButton = await page.$('a[href="/notes/new"]');
    if (newNoteButton) break;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  if (newNoteButton) {
    console.log('新しく記事を書くボタンが表示されました。クリックします。');
    await newNoteButton.click();
  } else {
    // 従来のテキストメニューを探す
    console.log('新しく記事を書くボタンが表示されませんでした。従来のテキストメニューをリトライで探します...');
    let found = false;
    for (let i = 0; i < 5; i++) {
      try {
        await page.waitForSelector('a[href="/notes/new"]', { timeout: 1000 });
        await page.click('a[href="/notes/new"]');
        found = true;
        break;
      } catch (e) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    if (!found) {
      const html = await page.content();
      console.error('従来のテキストメニューが見つかりませんでした。HTMLの一部:', html.slice(0, 1000));
      throw new Error('新規投稿画面への遷移に失敗しました');
    }
  }
  await page.waitForNavigation();
  console.log('新規投稿画面に遷移しました');
}
exports.goToNewPost = goToNewPost;

// 記事入力
async function fillArticle(page, title, body) {
  console.log('タイトル入力欄を探します');
  await page.waitForSelector('textarea[placeholder="記事タイトル"]');
  const titleAreas = await page.$$('textarea[placeholder="記事タイトル"]');
  if (titleAreas.length > 0) {
    await titleAreas[0].focus();
    await titleAreas[0].click({ clickCount: 3 });
    await titleAreas[0].press('Backspace');
    await titleAreas[0].type(title);
    console.log('タイトルを入力しました');
  } else {
    throw new Error('タイトル入力欄が見つかりませんでした');
  }
  console.log('本文入力欄を探します');
  await page.waitForSelector('div.ProseMirror.note-common-styles__textnote-body[contenteditable="true"]');
  const bodyArea = await page.$('div.ProseMirror.note-common-styles__textnote-body[contenteditable="true"]');
  if (bodyArea) {
    await bodyArea.focus();
    await bodyArea.click({ clickCount: 3 });
    await bodyArea.press('Backspace');
    await bodyArea.type(body);
    console.log('本文を入力しました');
  } else {
    throw new Error('本文入力欄が見つかりませんでした');
  }
}
exports.fillArticle = fillArticle;

// 下書き保存
async function saveDraft(page) {
  console.log('「下書き保存」ボタンを探します...');
  await page.waitForSelector('button');
  const draftButtons = await page.$$('button');
  let draftSaved = false;
  for (const btn of draftButtons) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text && text.trim().includes('下書き保存')) {
      await btn.click();
      draftSaved = true;
      console.log('「下書き保存」ボタンをクリックしました');
      break;
    }
  }
  if (!draftSaved) {
    throw new Error('「下書き保存」ボタンが見つかりませんでした');
  }
}
exports.saveDraft = saveDraft;

// 閉じる処理
async function closeDialogs(page) {
  // 1回目
  console.log('「閉じる」ボタン（1回目）を探します...');
  await new Promise(resolve => setTimeout(resolve, 500));
  const closeButtons1 = await page.$$('button');
  let closed1 = false;
  for (const btn of closeButtons1) {
    const text = await (await btn.getProperty('innerText')).jsonValue();
    if (text && text.trim() === '閉じる') {
      await btn.click();
      closed1 = true;
      console.log('「閉じる」ボタン（1回目）をクリックしました');
      break;
    }
  }
  if (!closed1) throw new Error('「閉じる」ボタン（1回目）が見つかりませんでした');
  await new Promise(resolve => setTimeout(resolve, 500));
  // 2回目（モーダル内）
  console.log('「閉じる」ボタン（2回目/モーダル内）を探します...');
  let closed2 = false;
  for (let retry = 0; retry < 5; retry++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const closeButtons2 = await page.$$('.ReactModal__Content button');
    for (const btn of closeButtons2) {
      const text = await (await btn.getProperty('innerText')).jsonValue();
      if (text && text.trim() === '閉じる') {
        await btn.click();
        closed2 = true;
        console.log('「閉じる」ボタン（2回目/モーダル内）をクリックしました');
        break;
      }
    }
    if (closed2) break;
  }
  if (!closed2) {
    console.warn('「閉じる」ボタン（2回目/モーダル内）が見つかりませんでしたが、処理を続行します');
  }
  await new Promise(resolve => setTimeout(resolve, 500));
}
exports.closeDialogs = closeDialogs;

// 投稿一覧管理表.mdをパースし、下書き保存日が空欄の行のファイル名リストを返す
function parseUnsubmittedArticles(tablePath) {
  const raw = fs.readFileSync(tablePath, 'utf-8');
  const lines = raw.split('\n');
  // テーブル部分のみ抽出
  const tableLines = lines.filter(line => line.trim().startsWith('|'));
  if (tableLines.length < 3) return [];
  const header = tableLines[0].split('|').map(h => h.trim());
  const fileNameIdx = header.findIndex(h => h === 'ファイル名');
  const draftDateIdx = header.findIndex(h => h === '下書き保存日');
  if (fileNameIdx === -1 || draftDateIdx === -1) return [];
  const result = [];
  for (let i = 2; i < tableLines.length; i++) { // データ行のみ
    const cols = tableLines[i].split('|').map(c => c.trim());
    if (!cols[draftDateIdx] && cols[fileNameIdx]) {
      // posts/ で始まらない場合は自動で付与
      let filePath = cols[fileNameIdx];
      if (!filePath.startsWith('posts/')) filePath = 'posts/' + filePath;
      result.push({
        filePath,
        rowIndex: i, // テーブル行番号（後で更新用に使う）
      });
    }
  }
  return result;
}

// 管理表の該当行の下書き保存日を更新する
function updateDraftDate(tablePath, rowIndex, dateStr) {
  const raw = fs.readFileSync(tablePath, 'utf-8');
  const lines = raw.split('\n');
  // テーブル部分のみ抽出
  const tableLines = lines.filter(line => line.trim().startsWith('|'));
  if (rowIndex >= tableLines.length) return;
  const cols = tableLines[rowIndex].split('|');
  // 下書き保存日カラムのインデックスを取得
  const header = tableLines[0].split('|').map(h => h.trim());
  const draftDateIdx = header.findIndex(h => h === '下書き保存日');
  if (draftDateIdx === -1) return;
  // カラム数が足りない場合は拡張
  while (cols.length <= draftDateIdx) cols.push('');
  cols[draftDateIdx] = ' ' + dateStr + ' ';
  tableLines[rowIndex] = cols.join('|');
  // テーブル部分を元のlinesに戻す
  let t = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('|')) {
      lines[i] = tableLines[t++];
    }
  }
  fs.writeFileSync(tablePath, lines.join('\n'), 'utf-8');
}

// メイン処理
async function main() {
  console.log('Puppeteer起動オプションを取得します');
  const options = await launchOptions();
  console.log('Puppeteerを起動します');
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  // 管理表パス
  const tablePath = path.join(__dirname, './投稿一覧管理表.md');
  // 未下書き記事リスト取得
  const unsubmitted = parseUnsubmittedArticles(tablePath);
  if (unsubmitted.length === 0) {
    console.log('下書き保存待ちの記事はありません');
    process.exit(0);
  }

  // ログインは1回だけ
  await login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);

  try {
    for (const { filePath, rowIndex } of unsubmitted) {
      try {
        // 記事ごとにnoteトップページに遷移してから投稿ボタンを押す
        console.log('noteトップページに遷移します');
        await page.goto('https://note.com/', { waitUntil: 'networkidle2' });
        console.log('記事処理開始: ' + filePath);
        const articlePath = path.join(__dirname, './', filePath);
        let title, body;
        try {
          ({ title, body } = getArticleData(articlePath));
        } catch (e) {
          if (e.code === 'ENOENT') {
            console.log(`記事ファイルが見つかりません: ${articlePath}`);
            continue; // 次の記事へ
          } else {
            throw e;
          }
        }
        await goToNewPost(page);
        await dragAndDropToAddButton(page);
        await fillArticle(page, title, body);
        await saveDraft(page);
        await closeDialogs(page);
        // スクリーンショット保存
        // await page.screenshot({ path: `after_input_${rowIndex}.png`, fullPage: true });
        // console.log('スクリーンショットを保存しました: after_input_' + rowIndex + '.png');
        // 管理表に日付記入
        const today = new Date().toISOString().slice(0, 10);
        updateDraftDate(tablePath, rowIndex, today);
        console.log(`管理表の下書き保存日を更新: ${filePath} → ${today}`);
      } catch (e) {
        console.error(`記事処理失敗: ${filePath}`, e);
        throw e; // 途中でストップ
      }
    }
  } catch (e) {
    console.error('記事処理中にエラーが発生したため、処理を中断します:', e);
    await browser.close(); // 必要なら有効化
    return { status: 'error', error: e.toString() };
  }
  await browser.close();
  return { status: 'done' };
}

if (isLambda) {
  exports.handler = async (event) => {
    return await main();
  };
} else if (require.main === module) {
  main().then(() => console.log('完了')).catch(console.error);
} 
