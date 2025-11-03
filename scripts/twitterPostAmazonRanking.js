#!/usr/bin/env node
// scripts/twitterPostAmazonRanking.js
// Amazon売れ筋ランキングリンクをTwitterに投稿するスクリプト

import { TwitterAPIClient, Logger } from '@aa-0921/note-auto-core';
import { amazonTopSellersRankingLinks } from './affiliateConfig.js';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
 * URLからOGP画像を取得
 * @param {string} url - 画像を取得するURL
 * @returns {Object|null} - {buffer: Buffer, mimeType: string} または null
 */
async function fetchOgImage(url) {
  try {
    logger.info('🔍 URLからOGP画像を取得しています...');
    logger.info(`URL: ${url.substring(0, 80)}...`);
    
    // AmazonのHTMLを取得
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      },
      timeout: 30000, // 30秒タイムアウト
    });
    
    // HTMLをパース
    const $ = cheerio.load(response.data);
    
    // デバッグ: 全てのmetaタグを確認
    logger.info('🔍 ページ内のmetaタグを確認しています...');
    const metaTags = [];
    $('meta').each((i, elem) => {
      const property = $(elem).attr('property');
      const name = $(elem).attr('name');
      const content = $(elem).attr('content');
      if ((property || name) && content) {
        if (property && (property.includes('og:') || property.includes('twitter:'))) {
          metaTags.push(`${property}: ${content.substring(0, 100)}`);
        }
        if (name && name.includes('twitter:')) {
          metaTags.push(`${name}: ${content.substring(0, 100)}`);
        }
      }
    });
    
    if (metaTags.length > 0) {
      logger.info(`見つかったメタタグ（${metaTags.length}件）:`);
      metaTags.slice(0, 10).forEach(tag => logger.info(`  - ${tag}`));
    } else {
      logger.info('OGP/Twitterメタタグが見つかりませんでした');
    }
    
    // OGP画像のURLを取得（複数のパターンを試す）
    let imageUrl = $('meta[property="og:image"]').attr('content') ||
                   $('meta[property="og:image:url"]').attr('content') ||
                   $('meta[name="twitter:image"]').attr('content') ||
                   $('meta[property="twitter:image"]').attr('content');
    
    // 画像が見つからない場合、ページ内の最初の大きな画像を探す
    if (!imageUrl) {
      logger.info('🔍 ページ内の画像要素を探しています...');
      
      // Amazonの商品画像や特定のクラスの画像を探す
      const possibleImages = [
        $('#landingImage').attr('src'),
        $('.s-image').first().attr('src'),
        $('img[data-a-dynamic-image]').first().attr('src'),
        $('img.product-image').first().attr('src'),
      ].filter(Boolean);
      
      if (possibleImages.length > 0) {
        imageUrl = possibleImages[0];
        logger.info(`✅ ページ内から画像を発見: ${imageUrl.substring(0, 80)}...`);
      }
    }
    
    if (!imageUrl) {
      logger.warn('⚠️  OGP画像もページ内画像も見つかりませんでした');
      return null;
    }
    
    logger.info(`✅ OGP画像URLを取得しました: ${imageUrl.substring(0, 80)}...`);
    
    // 画像をダウンロード
    logger.info('📥 画像をダウンロードしています...');
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      timeout: 30000,
    });
    
    const imageBuffer = Buffer.from(imageResponse.data);
    const mimeType = imageResponse.headers['content-type'] || 'image/jpeg';
    logger.info(`✅ 画像をダウンロードしました（サイズ: ${(imageBuffer.length / 1024).toFixed(2)} KB, タイプ: ${mimeType}）`);
    
    return { buffer: imageBuffer, mimeType };
  } catch (error) {
    logger.error('❌ OGP画像の取得に失敗しました:', error.message);
    
    if (error.response) {
      logger.error(`HTTPステータス: ${error.response.status}`);
    }
    
    return null;
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
    
    // URLから画像を取得
    logger.info('');
    logger.info('========================================');
    logger.info('📷 画像取得処理');
    logger.info('========================================');
    logger.info('');
    
    // リンクデータから実際のURLを抽出
    const lines = selectedLink.split('\n');
    const amazonUrl = lines[2]; // インデックス2がURL
    
    const imageData = await fetchOgImage(amazonUrl);
    
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

