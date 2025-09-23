// src/core/PuppeteerManager.js
// Puppeteer管理クラス

import Logger from '../utils/Logger.js';

export default class PuppeteerManager {
  constructor(config, background = false) {
    this.config = config;
    this.background = background;
    this.logger = new Logger();
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    try {
      // ESモジュール用の動的import関数
      const { puppeteer, launchOptions } = await this.getPuppeteerConfig();

      const options = await launchOptions();
      this.logger.info('Puppeteerを起動します');
      this.browser = await puppeteer.launch(options);

      return true;
    } catch (error) {
      this.logger.error('Puppeteer初期化に失敗しました:', error);
      throw error;
    }
  }

  async getPuppeteerConfig() {
    const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

    if (isLambda) {
      // Lambda本番用
      const puppeteerCore = await import('puppeteer-core');
      const chromium = await import('chrome-aws-lambda');
      return {
        puppeteer: puppeteerCore.default,
        launchOptions: async () => ({
          args: chromium.default.args,
          defaultViewport: chromium.default.defaultViewport,
          executablePath: await chromium.default.executablePath,
          headless: chromium.default.headless,
        }),
      };
    } else {
      // ローカルテスト用
      const puppeteerModule = await import('puppeteer');
      return {
        puppeteer: puppeteerModule.default,
        launchOptions: async () => ({
          headless: this.background ? 'new' : false,
          executablePath:
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
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
            '--disable-background-networking',
          ],
          defaultViewport: null,
          protocolTimeout: 30000, // 30秒のプロトコルタイムアウト
        }),
      };
    }
  }

  async createPage() {
    if (!this.browser) {
      throw new Error('Puppeteerが初期化されていません');
    }

    this.page = await this.browser.newPage();

    // User-AgentとAccept-Languageを設定
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    );
    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
    });

    return this.page;
  }

  async login(email, password) {
    if (!this.page) {
      throw new Error('ページが作成されていません');
    }

    this.logger.info('=== ログイン処理開始 ===');
    this.logger.info('現在のURL:', await this.page.url());
    this.logger.info('現在のタイトル:', await this.page.title());

    this.logger.info('noteログインページへ遷移します');
    await this.page.goto(
      'https://note.com/login?redirectPath=https%3A%2F%2Fnote.com%2F',
      {
        waitUntil: 'networkidle2',
        timeout: 60000,
      }
    );

    this.logger.info('メールアドレスとパスワードを入力します');

    // メールアドレス入力
    const emailField = await this.page.$('#email');
    if (emailField) {
      await this.page.type('#email', email);
      this.logger.info('メールアドレス入力完了');
    } else {
      throw new Error('メールアドレス入力フィールドが見つかりません');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // パスワード入力
    const passwordField = await this.page.$('#password');
    if (passwordField) {
      await this.page.type('#password', password);
      this.logger.info('パスワード入力完了');
    } else {
      throw new Error('パスワード入力フィールドが見つかりません');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // ログインボタンクリック
    this.logger.info('ログインボタンを探します');
    await this.page.waitForSelector('button[type="button"]:not([disabled])');

    const buttons = await this.page.$$('button[type="button"]');
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
          await this.page.waitForSelector('img.a-userIcon--medium', {
            timeout: 30000,
          });
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

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.logger.info('ブラウザを閉じました');
    }
  }

  // 既存コードとの互換性のためのメソッド
  getPage() {
    return this.page;
  }

  getBrowser() {
    return this.browser;
  }
}
