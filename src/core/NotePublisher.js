// src/core/NotePublisher.js
// Note投稿・操作クラス

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Logger from '../utils/Logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class NotePublisher {
  constructor(config, puppeteerManager) {
    this.config = config;
    this.puppeteerManager = puppeteerManager;
    this.logger = new Logger();
  }

  // getSearchWords は廃止（各リポジトリ側で必須指定）

  // ログイン処理（既存コードから移植）
  async login(page, email, password) {
    this.logger.info('=== ログイン処理開始 ===');
    this.logger.info('現在のURL:', await page.url());
    this.logger.info('現在のタイトル:', await page.title());
    
    this.logger.info('noteログインページへ遷移します');
    await page.goto('https://note.com/login?redirectPath=https%3A%2F%2Fnote.com%2F', { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });
    
    this.logger.info('メールアドレスとパスワードを入力します');
    
    // メールアドレス入力
    const emailField = await page.$('#email');
    if (emailField) {
      await emailField.type(email);
      this.logger.info('メールアドレス入力完了');
    } else {
      throw new Error('メールアドレス入力フィールドが見つかりません');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // パスワード入力
    const passwordField = await page.$('#password');
    if (passwordField) {
      await passwordField.type(password);
      this.logger.info('パスワード入力完了');
    } else {
      throw new Error('パスワード入力フィールドが見つかりません');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ログインボタンクリック
    this.logger.info('ログインボタンを探します');
    await page.waitForSelector('button[type="button"]:not([disabled])');
    
    const buttons = await page.$$('button[type="button"]');
    let loginClicked = false;
    
    for (const btn of buttons) {
      const text = await (await btn.getProperty('innerText')).jsonValue();
      if (text && text.trim() === 'ログイン') {
        await btn.click();
        this.logger.info('ログインボタンをクリックしました');
        
        // ログイン処理の待機
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        // ログイン成功の確認
        try {
          await page.waitForSelector('img.a-userIcon--medium', { timeout: 30000 });
          this.logger.info('ログイン成功を確認しました');
          loginClicked = true;
          break;
        } catch (e) {
          this.logger.error('ログイン後のユーザーアイコン検出に失敗:', e);
          throw e;
        }
      }
    }
    
    if (!loginClicked) {
      throw new Error('ログインボタンが見つからずクリックできませんでした');
    }
    
    this.logger.info('=== ログイン処理完了 ===');
  }

  // 投稿画面遷移
  async goToNewPost(page) {
    this.logger.info('ユーザーポップアップがあれば閉じます');
    const closePopupBtn = await page.$('button.o-userPopup__close[aria-label="閉じる"]');
    if (closePopupBtn) {
      await closePopupBtn.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      this.logger.info('ユーザーポップアップを閉じました');
    }
    
    // 投稿ボタン
    this.logger.info('投稿ボタンを探します...');
    const postButtons = await page.$$('button[aria-label="投稿"]');
    let clicked = false;
    
    for (const btn of postButtons) {
      if (await btn.isIntersectingViewport()) {
        this.logger.info('表示されている投稿ボタンをhover→クリックします。');
        await btn.hover();
        await new Promise(resolve => setTimeout(resolve, 500));
        await btn.click();
        clicked = true;
        break;
      }
    }
    
    if (!clicked) {
      throw new Error('表示されている投稿ボタンが見つかりませんでした');
    }

    // 投稿ボタンクリック後、新しく記事を書くボタンが表示されるかどうかを確認
    this.logger.info('投稿ボタンクリック後、新しく記事を書くボタンが表示されるか確認します...');
    await new Promise(resolve => setTimeout(resolve, 1500));

    let newNoteButton = null;
    for (let i = 0; i < 5; i++) {
      newNoteButton = await page.$('a[href="/notes/new"]');
      if (newNoteButton) break;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (newNoteButton) {
      this.logger.info('新しく記事を書くボタンが表示されました。クリックします。');
      await newNoteButton.click();
    } else {
      // 従来のテキストメニューを探す
      this.logger.info('新しく記事を書くボタンが表示されませんでした。従来のテキストメニューをリトライで探します...');
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
        throw new Error('新規投稿画面への遷移に失敗しました');
      }
    }
    
    await page.waitForNavigation();
    this.logger.info('新規投稿画面に遷移しました');
  }

  // 記事入力
  async fillArticle(page, title, body) {
    this.logger.info('タイトル入力欄を探します');
    await page.waitForSelector('textarea[placeholder="記事タイトル"]');
    const titleAreas = await page.$$('textarea[placeholder="記事タイトル"]');
    if (titleAreas.length > 0) {
      await titleAreas[0].focus();
      await titleAreas[0].click({ clickCount: 3 });
      await titleAreas[0].press('Backspace');
      await titleAreas[0].type(title);
      this.logger.info('タイトルを入力しました');
    } else {
      throw new Error('タイトル入力欄が見つかりませんでした');
    }
    
    this.logger.info('本文入力欄を探します');
    await page.waitForSelector('div.ProseMirror.note-common-styles__textnote-body[contenteditable="true"]');
    const bodyArea = await page.$('div.ProseMirror.note-common-styles__textnote-body[contenteditable="true"]');
    if (bodyArea) {
      await bodyArea.focus();
      await bodyArea.click({ clickCount: 3 });
      await bodyArea.press('Backspace');
      await bodyArea.type(body);
      this.logger.info('本文を入力しました');
    } else {
      throw new Error('本文入力欄が見つかりませんでした');
    }
  }

  // 下書き保存
  async saveDraft(page) {
    this.logger.info('「下書き保存」ボタンを探します...');
    await page.waitForSelector('button');
    const draftButtons = await page.$$('button');
    let draftSaved = false;
    
    for (const btn of draftButtons) {
      const text = await (await btn.getProperty('innerText')).jsonValue();
      if (text && text.trim().includes('下書き保存')) {
        await btn.click();
        draftSaved = true;
        this.logger.info('「下書き保存」ボタンをクリックしました');
        break;
      }
    }
    
    if (!draftSaved) {
      throw new Error('「下書き保存」ボタンが見つかりませんでした');
    }
  }

  // 閉じる処理
  async closeDialogs(page) {
    // 1回目
    this.logger.info('「閉じる」ボタン（1回目）を探します...');
    await new Promise(resolve => setTimeout(resolve, 500));
    const closeButtons1 = await page.$$('button');
    let closed1 = false;
    
    for (const btn of closeButtons1) {
      const text = await (await btn.getProperty('innerText')).jsonValue();
      if (text && text.trim() === '閉じる') {
        await btn.click();
        closed1 = true;
        this.logger.info('「閉じる」ボタン（1回目）をクリックしました');
        break;
      }
    }
    
    if (!closed1) throw new Error('「閉じる」ボタン（1回目）が見つかりませんでした');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 2回目（モーダル内）
    this.logger.info('「閉じる」ボタン（2回目/モーダル内）を探します...');
    let closed2 = false;
    for (let retry = 0; retry < 5; retry++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const closeButtons2 = await page.$$('.ReactModal__Content button');
      for (const btn of closeButtons2) {
        const text = await (await btn.getProperty('innerText')).jsonValue();
        if (text && text.trim() === '閉じる') {
          await btn.click();
          closed2 = true;
          this.logger.info('「閉じる」ボタン（2回目/モーダル内）をクリックしました');
          break;
        }
      }
      if (closed2) break;
    }
    
    if (!closed2) {
      this.logger.warn('「閉じる」ボタン（2回目/モーダル内）が見つかりませんでしたが、処理を続行します');
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // いいね機能（likeUnlikedNotes.jsから移植）
  async likeUnlikedNotes(options = {}) {
    const page = await this.puppeteerManager.createPage();
    
    try {
      await this.login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);
      
      // 検索ワードリスト（各リポジトリで必須指定）
      const searchWords = (Array.isArray(options.searchWords) && options.searchWords.length > 0)
        ? options.searchWords
        : null;

      if (!Array.isArray(searchWords) || searchWords.length === 0) {
        throw new Error('検索ワードが未設定のため処理を続行できません。アカウント側で options.searchWords を指定してください。');
      }

      // 検索ワード選択ロジック
      const runsPerDay = 8;
      const now = new Date();
      const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
      const runIndex = Math.floor(now.getHours() / 3);
      const index = (dayOfYear * runsPerDay + runIndex) % searchWords.length;
      const word = searchWords[index];
      const encoded = encodeURIComponent(word);
      const targetUrl = `https://note.com/search?q=${encoded}&context=note&mode=search`;

      this.logger.info('対象ページへ遷移します:', targetUrl);
      await page.goto(targetUrl, { waitUntil: 'networkidle2' });

      // スクロールして記事を読み込む
      for (let i = 0; i < 20; i++) {
        this.logger.info(`下までスクロールします (${i + 1}/20)`);
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // いいねボタンを取得
      const likeButtons = await page.$$('button[aria-label="スキ"]');
      this.logger.info('取得した「スキ」ボタン数:', likeButtons.length);

      const maxLikes = options.maxLikes || 24;
      const likeCount = Math.min(maxLikes, likeButtons.length);
      this.logger.info(`これから${likeCount}件のスキを付けます。`);

      for (let i = 0; i < likeCount; i++) {
        this.logger.info(`--- ${i + 1}件目 ---`);
        const btn = likeButtons[i];
        
        // クリック前の状態
        const ariaPressed = await btn.evaluate(el => el.getAttribute('aria-pressed'));
        this.logger.info('クリック前: aria-pressed:', ariaPressed);
        
        // ボタンの親要素からタイトルと投稿者名を取得
        const info = await btn.evaluate((btn) => {
          let title = 'タイトル不明';
          let user = '投稿者不明';
          const body = btn.closest('.m-largeNoteWrapper__card');
          if (body) {
            const titleElem = body.querySelector('.m-noteBodyTitle__title');
            if (titleElem) {
              title = titleElem.textContent.trim();
            }
            const infoElem = body.parentElement?.querySelector('.o-largeNoteSummary__userName');
            if (infoElem) {
              user = infoElem.textContent.trim();
            }
          }
          return { title, user };
        });
        this.logger.info(`タイトル: ${info.title}｜投稿者: ${info.user}`);
        
        // クリック
        await btn.click({ delay: 100 });
        
        // クリック後、aria-pressedがtrueになるまで待機
        await page.waitForFunction(
          el => el.getAttribute('aria-pressed') === 'true',
          { timeout: 5000 },
          btn
        );
        this.logger.info('クリック後: aria-pressedがtrueになったことを確認');
      }
      
      this.logger.info('クリック処理が全て完了しました');
      
    } finally {
      await this.puppeteerManager.cleanup();
    }
  }

  // 特定URLへのいいね（likeNotesByUrl.jsから移植）
  async likeNotesByUrl(url, options = {}) {
    const page = await this.puppeteerManager.createPage();
    
    try {
      this.logger.info('対象ページへ遷移します:', url);
      await page.goto(url, { waitUntil: 'networkidle2' });

      // ページの読み込みを待つ
      await new Promise(resolve => setTimeout(resolve, 2000));

      // スクロールして記事を読み込む
      for (let i = 0; i < 20; i++) {
        this.logger.info(`下までスクロールします (${i + 1}/20)`);
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // いいねボタンを取得
      let likeButtons = await page.$$('button:has(svg[aria-label="スキ"])');
      this.logger.info('取得した「スキ」ボタン数:', likeButtons.length);

      if (likeButtons.length === 0) {
        this.logger.info('いいねできる記事が見つかりませんでした');
        return;
      }

      const maxLikes = options.maxLikes || 50;
      this.logger.info(`最大${maxLikes}件のスキを付けます。`);

      let successCount = 0;
      let errorCount = 0;
      let processedCount = 0;

      for (let i = 0; i < likeButtons.length && successCount < maxLikes; i++) {
        try {
          processedCount++;
          this.logger.info(`--- ${processedCount}件目処理中 (成功: ${successCount}/${maxLikes}) ---`);
          const btn = likeButtons[i];
          
          // クリック前の状態
          const ariaPressed = await btn.evaluate(el => el.getAttribute('aria-pressed'));
          
          // すでにいいね済みの場合はスキップ
          if (ariaPressed === 'true') {
            this.logger.info('すでにいいね済みのためスキップします');
            continue;
          }
          
          // クリック
          await btn.evaluate(el => el.click());
          
          // クリック後、aria-pressedがtrueになるまで待機
          await page.waitForFunction(
            el => el.getAttribute('aria-pressed') === 'true',
            { timeout: 5000 },
            btn
          );
          this.logger.info('いいね成功！');
          
          successCount++;
          
          // 各いいねの間に少し待機
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          this.logger.info(`いいね処理でエラーが発生しました (${processedCount}件目):`, error.message);
          errorCount++;
          continue;
        }
      }
      
      this.logger.info('【処理完了】');
      this.logger.info(`成功: ${successCount}件`);
      this.logger.info(`エラー: ${errorCount}件`);
      this.logger.info(`合計処理: ${successCount + errorCount}件`);
      
    } finally {
      await this.puppeteerManager.cleanup();
    }
  }

  // 自動投稿（autoPublishNotes.jsから移植）
  async autoPublishNotes(options = {}) {
    const page = await this.puppeteerManager.createPage();
    
    try {
      await this.login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);
      
      const draftUrl = 'https://note.com/notes?page=1&status=draft';
      this.logger.info('下書き一覧ページへ遷移します:', draftUrl);
      await page.goto(draftUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 下書き記事リストを取得
      this.logger.info('下書き記事リストを取得します');
      const articles = await page.$$('div.o-articleList__item');
      this.logger.info(`下書き記事を${articles.length}件検出しました`);

      const postLimit = options.postLimit || 1;
      let postCount = 0;
      
      // 下書き記事リストの一番最後（最新）から投稿するよう逆順ループ
      for (let i = articles.length - 1; i >= 0; i--) {
        if (postCount >= postLimit) break;
        const li = articles[i];
        this.logger.info(`${i + 1}件目の記事タイトルを取得します`);
        const title = await li.$eval('.o-articleList__heading', el => el.textContent.trim());
        this.logger.info(`記事タイトル: ${title}`);
        
        if (title.startsWith('S-')) {
          this.logger.info(`スキップ: ${title}`);
          continue;
        }
        
        this.logger.info(`投稿準備: ${title}`);
        
        // 編集ボタンをクリック
        this.logger.info('編集ボタンをクリックします');
        const editBtn = await li.$('.o-articleList__link');
        await editBtn.click();
        this.logger.info('記事編集ページへの遷移を待機します');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await page.waitForSelector('button', {timeout: 10000});

        // 「公開に進む」ボタンを探してクリック
        this.logger.info('「公開に進む」ボタンを探します');
        let publishBtn = null;
        for (let retry = 0; retry < 10; retry++) {
          const publishBtns = await page.$$('button');
          for (const btn of publishBtns) {
            const text = await btn.evaluate(el => el.innerText.trim());
            if (text && text.includes('公開に進む')) {
              publishBtn = btn;
              break;
            }
          }
          if (publishBtn) break;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (publishBtn) {
          this.logger.info('「公開に進む」ボタンをクリックします');
          await publishBtn.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // 「投稿する」ボタンが現れるまで待機
          await page.waitForFunction(
            () => Array.from(document.querySelectorAll('button')).some(btn => btn.textContent && btn.textContent.includes('投稿する')),
            { timeout: 10000 }
          );
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          this.logger.info('「公開に進む」ボタンが見つかりません');
          await page.goto(draftUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
          continue;
        }

        // 「投稿する」ボタンを探してクリック
        this.logger.info('「投稿する」ボタンを探します');
        const postBtns = await page.$$('button');
        let postBtn = null;
        for (const btn of postBtns) {
          const text = await btn.evaluate(el => el.innerText.trim());
          if (text && text.includes('投稿する')) {
            postBtn = btn;
            break;
          }
        }
        
        if (postBtn) {
          this.logger.info('「投稿する」ボタンをクリックします');
          await postBtn.click();
          
          // 投稿完了ダイアログの「閉じる」ボタンを待機してクリック
          try {
            this.logger.info('投稿完了ダイアログの「閉じる」ボタンを待機します');
            await page.waitForSelector('button[aria-label="閉じる"]', {timeout: 15000});
            const closeBtn = await page.$('button[aria-label="閉じる"]');
            if (closeBtn) {
              this.logger.info('「閉じる」ボタンをクリックします');
              await closeBtn.click();
            }
          } catch (e) {
            this.logger.info('「閉じる」ボタンが表示されませんでした');
          }
          
          this.logger.info(`記事を投稿しました: ${title}`);
          postCount++;
        } else {
          this.logger.info('「投稿する」ボタンが見つかりません');
        }
        
        // 下書き一覧に戻る
        this.logger.info('下書き一覧ページに戻ります');
        await page.goto(draftUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      this.logger.info('自動記事投稿処理が完了しました');
      
    } finally {
      await this.puppeteerManager.cleanup();
    }
  }

  // フォロー機能（followFromArticles.jsから移植）
  async followFromArticles(options = {}) {
    const page = await this.puppeteerManager.createPage();
    
    try {
      await this.login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);
      
      // 検索ワードリスト（各リポジトリで必須指定）
      const searchWords = (Array.isArray(options.searchWords) && options.searchWords.length > 0)
        ? options.searchWords
        : null;

      if (!Array.isArray(searchWords) || searchWords.length === 0) {
        throw new Error('検索ワードが未設定のため処理を続行できません。アカウント側で options.searchWords を指定してください。');
      }

      // 検索ワード選択ロジック
      const runsPerDay = 8;
      const now = new Date();
      const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
      const runIndex = Math.floor(now.getHours() / 3);
      const index = (dayOfYear * runsPerDay + runIndex) % searchWords.length;
      const word = searchWords[index];
      const encoded = encodeURIComponent(word);
      const targetUrl = `https://note.com/search?q=${encoded}&context=note&mode=search`;

      this.logger.info('対象ページへ遷移します:', targetUrl);
      await page.goto(targetUrl, { waitUntil: 'networkidle2' });

      // 記事一覧ページでスクロール
      for (let i = 0; i < 10; i++) {
        this.logger.info(`下までスクロールします (${i + 1}/10)`);
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // クリエイターリンクとクリエイター名を取得
      const creatorLinkAndNames = await page.$$eval('div.o-largeNoteSummary__userName', elements =>
        elements.map(element => {
          const creatorName = element.textContent.trim();
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

      this.logger.info('ユニークなクリエイターを', uniqueCreators.length, '件取得しました');

      let followCount = 0;
      const maxFollows = options.maxFollows || 15;

      // 検索結果ページ上でポップアップのフォローボタンをクリック
      for (let i = 0; i < uniqueCreators.length && followCount < maxFollows; i++) {
        const name = uniqueCreators[i].name;
        this.logger.info(`クリエイター${i + 1}のホバー＆ポップアップフォロー処理開始:（${name}）`);
        
        try {
          // 検索結果ページの各クリエイター要素を再取得
          const userWrappers = await page.$$('.o-largeNoteSummary__userWrapper');
          if (!userWrappers[i]) continue;
          
          // aタグを取得してhover
          const aTag = await userWrappers[i].$('a.o-largeNoteSummary__user');
          if (!aTag) continue;
          await aTag.hover();
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // ポップアップが出るまで待機
          await page.waitForSelector('.o-quickLook', { visible: true, timeout: 2500 });
          
          // ポップアップ内のフォローボタンを取得
          const followBtn = await page.$('.o-quickLook .a-button');
          if (!followBtn) {
            this.logger.info('フォローボタンが見つかりませんでした');
            continue;
          }
          
          // ボタンのテキストが「フォロー」か確認
          const btnText = await followBtn.evaluate(el => el.innerText.trim());
          if (btnText === 'フォロー') {
            await followBtn.click();
            
            // 状態変化を待つ
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
            
            this.logger.info(`フォロー成功！！（${followCount + 1}件目）｜クリエイター名（${name}）`);
            followCount++;
          } else {
            this.logger.info('すでにフォロー済み、またはボタン状態が「フォロー」ではありません');
          }
          
          // 少し待ってから次へ
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (e) {
          this.logger.info(`エラー発生: ${e.message}`);
          continue;
        }
      }
      
      this.logger.info('全フォロー処理完了');
      
    } finally {
      await this.puppeteerManager.cleanup();
    }
  }
}

// 既存コードとの互換性のための関数エクスポート
export const login = async (page, email, password) => {
  const publisher = new NotePublisher({}, null);
  return await publisher.login(page, email, password);
};

export const goToNewPost = async (page) => {
  const publisher = new NotePublisher({}, null);
  return await publisher.goToNewPost(page);
};

export const fillArticle = async (page, title, body) => {
  const publisher = new NotePublisher({}, null);
  return await publisher.fillArticle(page, title, body);
};

export const saveDraft = async (page) => {
  const publisher = new NotePublisher({}, null);
  return await publisher.saveDraft(page);
};

export const closeDialogs = async (page) => {
  const publisher = new NotePublisher({}, null);
  return await publisher.closeDialogs(page);
};
