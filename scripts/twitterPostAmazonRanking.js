#!/usr/bin/env node
// scripts/twitterPostAmazonRanking.js
// Amazon売れ筋ランキングリンクをTwitterに投稿するスクリプト

import { TwitterAPIClient, Logger, PuppeteerManager, ConfigManager } from '@aa-0921/note-auto-core';
import { amazonTopSellersRankingLinks } from './affiliateConfig.js';
import dotenv from 'dotenv';

// .envファイルを読み込む
dotenv.config();

const logger = new Logger();

/**
 * Amazon売れ筋ランキングリンクをランダムに1つ選択
 */
function getRandomRankingLink() {
  const randomIndex = Math.floor(Math.random() * amazonTopSellersRankingLinks.length);
  return amazonTopSellersRankingLinks[randomIndex];
}

/**
 * Puppeteerを使ってAmazonランキングページのスクリーンショットを取得
 * @param {string} url - スクリーンショットを取得するURL
 * @returns {Object|null} - {buffer: Buffer, mimeType: string} または null
 */
async function captureScreenshot(url) {
  let puppeteerManager = null;
  let page = null;
  
  try {
    logger.info('📸 Puppeteerでスクリーンショットを取得します...');
    logger.info(`URL: ${url.substring(0, 80)}...`);
    
    // ConfigManagerとPuppeteerManagerを初期化
    const configManager = new ConfigManager();
    puppeteerManager = new PuppeteerManager(configManager.config, true); // backgroundモード
    
    await puppeteerManager.initialize();
    logger.info('✅ Puppeteerを初期化しました');
    
    // ページを作成
    page = await puppeteerManager.createPage();
    logger.info('✅ ページを作成しました');
    
    // Amazonのランキングページへ遷移
    logger.info('🌐 Amazonランキングページへアクセスしています...');
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000, // 60秒タイムアウト
    });
    
    logger.info('✅ ページの読み込みが完了しました');
    
    // ビューポートサイズを設定（環境変数で調整可能／デフォルトは16:9で広め）
    const viewportWidth = parseInt(process.env.TWITTER_SS_WIDTH || '1600', 10);
    const viewportHeight = parseInt(process.env.TWITTER_SS_HEIGHT || '900', 10);
    await page.setViewport({
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: 1,
    });
    
    // ページが完全にレンダリングされるまで少し待つ
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 「〇〇の売れ筋ランキング」部分までスクロール
    logger.info('📜 ランキング見出しまでスクロールしています...');
    
    try {
      // 複数のセレクタパターンを試す
      const selectors = [
        'h1:has-text("売れ筋ランキング")', // h1タグ
        'h2:has-text("売れ筋ランキング")', // h2タグ
        '[id*="zg_banner_text"]', // Amazonのランキングバナー
        '.zg-banner-text', // クラス名
        '#zg-banner-headline', // ID
        // ランキング一覧のグリッド本体
        '[data-client-recs-list]',
        'ol.p13n-gridRow',
        'ol.a-ordered-list.p13n-gridRow',
        '.p13n-desktop-grid',
        '#gridItemRoot',
        '.zg-grid-general-faceout',
      ];
      
      let scrolled = false;
      
      // セレクタを順番に試す
      for (const selector of selectors) {
        try {
          // has-text はPuppeteerでサポートされていないので、別の方法で
          if (selector.includes('has-text')) {
            // XPathで「売れ筋ランキング」を含むh1/h2を探す
            const tag = selector.split(':')[0]; // h1 または h2
            const elements = await page.$x(`//${tag}[contains(text(), "売れ筋ランキング")]`);
            
            if (elements.length > 0) {
              logger.info(`✅ ランキング見出しを発見: ${tag}タグ`);
              
              // 要素までスクロール（少し上にマージンを持たせる）
              await elements[0].evaluate(el => {
                const y = el.getBoundingClientRect().top + window.pageYOffset - 50;
                window.scrollTo({ top: y, behavior: 'smooth' });
              });
              
              scrolled = true;
              break;
            }
          } else {
            // 通常のセレクタ
            const element = await page.$(selector);
            if (element) {
              logger.info(`✅ ランキング要素を発見: ${selector}`);
              
              // 要素までスクロール（少し上にマージンを持たせる）
              await element.evaluate(el => {
                const y = el.getBoundingClientRect().top + window.pageYOffset - 50;
                window.scrollTo({ top: y, behavior: 'smooth' });
              });
              
              scrolled = true;
              break;
            }
          }
        } catch (e) {
          // このセレクタでは見つからなかったので次を試す
          continue;
        }
      }
      
      // 追加のフォールバック: 最初のランキング商品カードの先頭までスクロール
      if (!scrolled) {
        const firstCard = await page.$('ol[class*="p13n-gridRow"] li, #gridItemRoot, .p13n-desktop-grid ol li');
        if (firstCard) {
          logger.info('✅ ランキングの最初のカードを発見: 先頭カードへスクロール');
          await firstCard.evaluate(el => {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 50;
            window.scrollTo({ top: y, behavior: 'smooth' });
          });
          scrolled = true;
        }
      }

      if (!scrolled) {
        // 見出しが見つからない場合は、デフォルトで300pxスクロール
        logger.info('⚠️  ランキング見出しが見つからなかったため、デフォルトでスクロールします');
        await page.evaluate(() => {
          window.scrollTo({ top: 300, behavior: 'smooth' });
        });
      }
      
      // スクロール後、少し待つ
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      logger.info('✅ スクロールが完了しました');
    } catch (error) {
      logger.warn('⚠️  スクロール中にエラーが発生しました:', error.message);
      logger.info('デフォルトのスクロール位置を使用します');
    }
    
    // スクリーンショットを撮影
    logger.info('📷 スクリーンショットを撮影しています...');
    
    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 90,
      fullPage: false, // ビューポート内のみ
    });
    
    const mimeType = 'image/jpeg';
    logger.info(`✅ スクリーンショットを取得しました（サイズ: ${(screenshotBuffer.length / 1024).toFixed(2)} KB, タイプ: ${mimeType}）`);
    
    return { buffer: screenshotBuffer, mimeType };
  } catch (error) {
    logger.error('❌ スクリーンショットの取得に失敗しました:', error.message);
    return null;
  } finally {
    // クリーンアップ
    if (puppeteerManager) {
      try {
        await puppeteerManager.cleanup();
        logger.info('✅ Puppeteerをクリーンアップしました');
      } catch (cleanupError) {
        logger.error('⚠️  クリーンアップ中にエラーが発生しました:', cleanupError.message);
      }
    }
  }
}

/**
 * リンク情報をパースしてツイート用テキストを生成
 */
function createTweetText(linkData) {
  // join('\n')された文字列を改行で分割
  const lines = linkData.split('\n');
  
  // 各行を取得
  // インデックス0: 空行
  // インデックス1: 装飾行（絵文字）
  // インデックス2: URL
  // インデックス3: タイトル（👆から始まる）
  // インデックス4以降: 説明
  const url = lines[2];
  const titleLine = lines[3]; // "👆タイトル" の形式
  const title = titleLine.replace('👆', '').trim(); // 👆を削除
  
  // 説明行を収集（装飾行と空行を除く）
  const descriptionLines = [];
  for (let i = 4; i < lines.length - 2; i++) {
    const line = lines[i].trim();
    if (line && !line.includes('　')) { // 装飾行（全角スペース含む）を除外
      descriptionLines.push(line);
    }
  }
  // 最初の1〜2行のみ使用（280文字制限を考慮）
  const description = descriptionLines.slice(0, 2).join('\n');
  
  // ツイート用テキストを生成（ハッシュタグ → 矢印 → URL）
  const tweetText = `${title}

${description}

#amazon #アマゾン #ランキング #ranking

↓↓↓↓

${url}`;
  
  return tweetText;
}

/**
 * メイン処理
 */
async function main() {
  try {
    logger.info('========================================');
    logger.info('Amazon売れ筋ランキング Twitter投稿スクリプト');
    logger.info('========================================');
    logger.info('');
    
    // TwitterAPIクライアントを作成
    const twitterClient = new TwitterAPIClient();
    logger.info('✅ TwitterAPIクライアントを作成しました');
    logger.info('');
    
    // クライアントを初期化
    twitterClient.initialize();
    logger.info('✅ クライアントを初期化しました');
    logger.info('');
    
    // 認証情報を確認
    logger.info('🔍 認証情報を確認しています...');
    logger.info('');
    const user = await twitterClient.verifyCredentials();
    
    logger.info('========================================');
    logger.info('✅ 認証成功！');
    logger.info('========================================');
    logger.info('');
    logger.info(`ユーザー名: @${user.username}`);
    logger.info(`名前: ${user.name}`);
    logger.info('');
    
    // ランキングリンクをランダムに選択
    logger.info('🎲 ランキングリンクをランダムに選択しています...');
    const selectedLink = getRandomRankingLink();
    
    // ツイート用テキストを生成
    const tweetText = createTweetText(selectedLink);
    
    logger.info('');
    logger.info('========================================');
    logger.info('📝 投稿内容');
    logger.info('========================================');
    logger.info('');
    console.log(tweetText);
    logger.info('');
    logger.info(`文字数: ${tweetText.length}文字`);
    logger.info('');
    
    // URLからスクリーンショットを取得
    logger.info('');
    logger.info('========================================');
    logger.info('📷 スクリーンショット取得処理');
    logger.info('========================================');
    logger.info('');
    
    // リンクデータから実際のURLを抽出
    const lines = selectedLink.split('\n');
    const amazonUrl = lines[2]; // インデックス2がURL
    
    const imageData = await captureScreenshot(amazonUrl);
    
    if (!imageData) {
      logger.warn('');
      logger.warn('⚠️  画像の取得に失敗しました。画像なしでツイートを投稿します。');
      logger.warn('');
    }
    
    // --dryrunフラグがある場合は投稿せずに終了
    if (process.argv.includes('--dryrun')) {
      logger.info('========================================');
      logger.info('🔍 Dryrunモード: 投稿はスキップされました');
      logger.info('========================================');
      logger.info('');
      if (imageData) {
        logger.info(`✅ 画像取得成功: ${(imageData.buffer.length / 1024).toFixed(2)} KB (${imageData.mimeType})`);
      } else {
        logger.info('⚠️  画像は取得できませんでした');
      }
      logger.info('');
      logger.info('実際に投稿する場合は、--dryrunフラグを外して実行してください:');
      logger.info('  node scripts/twitterPostAmazonRanking.js');
      logger.info('');
      return;
    }
    
    // ツイートを投稿
    logger.info('');
    logger.info('========================================');
    logger.info('📤 ツイート投稿処理');
    logger.info('========================================');
    logger.info('');
    
    let tweet;
    
    if (imageData) {
      // 画像付きツイートを投稿
      logger.info('📷 画像付きでツイートを投稿しています...');
      logger.info('');
      tweet = await twitterClient.postTweetWithMedia(tweetText, imageData.buffer, imageData.mimeType);
    } else {
      // 画像なしでツイートを投稿
      logger.info('📝 画像なしでツイートを投稿しています...');
      logger.info('');
      tweet = await twitterClient.postTweet(tweetText);
    }
    
    logger.info('');
    logger.info('========================================');
    logger.info('✅ ツイート投稿成功！');
    logger.info('========================================');
    logger.info('');
    logger.info(`ツイートID: ${tweet.id}`);
    logger.info(`ツイートURL: https://twitter.com/${user.username}/status/${tweet.id}`);
    if (imageData) {
      logger.info(`画像サイズ: ${(imageData.buffer.length / 1024).toFixed(2)} KB (${imageData.mimeType})`);
    }
    logger.info('');
    
    logger.info('========================================');
    logger.info('✅ すべての処理が完了しました');
    logger.info('========================================');
    
  } catch (error) {
    logger.error('');
    logger.error('========================================');
    logger.error('❌ エラーが発生しました');
    logger.error('========================================');
    logger.error('');
    logger.error('エラー内容:', error.message);
    logger.error('');
    
    if (error.message.includes('環境変数が設定されていません')) {
      logger.error('以下を確認してください:');
      logger.error('1. .envファイルにTwitter API認証情報を追加しましたか？');
      logger.error('2. 環境変数名は正しいですか？');
      logger.error('   - TWITTER_API_KEY');
      logger.error('   - TWITTER_API_SECRET');
      logger.error('   - TWITTER_ACCESS_TOKEN');
      logger.error('   - TWITTER_ACCESS_TOKEN_SECRET');
      logger.error('   - TWITTER_BEARER_TOKEN');
      logger.error('');
    }
    
    process.exit(1);
  }
}

// 実行
main();

