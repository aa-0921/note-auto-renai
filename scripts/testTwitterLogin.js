// scripts/testTwitterLogin.js
// Twitterログインテストスクリプト

import { runWithCore, TwitterPublisher } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    // TwitterPublisherを初期化
    const twitterPublisher = new TwitterPublisher(core.configManager.config, core.puppeteerManager);
    console.log('TwitterPublisherを初期化しました');

    // ページを作成
    const page = await core.puppeteerManager.createPage();
    console.log('ページを作成しました');

    // 環境変数から認証情報を取得
    // 最初の入力にはメールアドレスを使用（NOTE_EMAILを優先、TWITTER_EMAILも許容）
    const twitterEmail = process.env.NOTE_EMAIL || process.env.TWITTER_EMAIL;
    const twitterPassword = process.env.TWITTER_PASSWORD;
    const twitterUsername = process.env.TWITTER_USERNAME || null; // 追加認証用（電話番号確認画面などで使用）

    if (!twitterEmail || !twitterPassword) {
      throw new Error('環境変数 NOTE_EMAIL（またはTWITTER_EMAIL）と TWITTER_PASSWORD が設定されていません');
    }

    // メールアドレスかどうかを簡易チェック（@を含むか）
    const isEmail = twitterEmail.includes('@');
    console.log(`Twitterログインを試みます（${isEmail ? 'メールアドレス' : 'ユーザー名'}: ${twitterEmail}${twitterUsername ? `, 追加認証用ユーザー名: ${twitterUsername}` : ''}）`);

    // Twitterログイン実行
    await twitterPublisher.login(page, twitterEmail, twitterPassword, twitterUsername);

    console.log('');
    console.log('✅ Twitterログインが成功しました！');
    console.log('現在のURL:', await page.url());
    console.log('現在のタイトル:', await page.title());

    // 10秒待機（確認のため）
    console.log('10秒待機します（確認のため）...');
    await new Promise(resolve => setTimeout(resolve, 10000));
  });
})();

