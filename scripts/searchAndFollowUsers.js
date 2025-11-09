// scripts/searchAndFollowUsers.js
// Twitterユーザー検索・フォロースクリプト
// Puppeteerを使わず、Twitter APIのみを使用

import 'dotenv/config';
import TwitterAPIClient from '@aa-0921/note-auto-core/src/core/TwitterAPIClient.js';
import Logger from '@aa-0921/note-auto-core/src/utils/Logger.js';

const logger = new Logger();
const args = process.argv.slice(2);
const searchQuery = args.find(arg => !arg.startsWith('--')) || 'フォロバ100';
const isDryrun = args.includes('--dryrun');

(async () => {
  try {
    logger.info('========================================');
    logger.info('Twitterユーザー検索（検索結果表示のみ）');
    logger.info('========================================');
    logger.info(`検索クエリ: "${searchQuery}"`);
    logger.info('');

    const twitterClient = new TwitterAPIClient();
    
    // Twitter APIクライアントを初期化
    await twitterClient.initialize();
    logger.info('Twitter APIクライアントを初期化しました');
    logger.info('');

    // 現在のユーザー情報を取得
    const me = await twitterClient.verifyCredentials();
    logger.info(`現在のユーザー: @${me.username} (ID: ${me.id})`);
    logger.info('');

    // ユーザーを検索
    logger.info(`検索クエリ: "${searchQuery}"`);
    logger.info(`最大検索結果数: 50`);
    logger.info('');

    const searchResults = await twitterClient.searchUsers(searchQuery, {
      maxResults: 50,
      userFields: ['id', 'name', 'username', 'description']
    });

    if (searchResults.length === 0) {
      logger.info('検索結果がありませんでした');
      return;
    }

    logger.info('');
    logger.info('========================================');
    logger.info('検索結果');
    logger.info('========================================');
    logger.info(`見つかったユーザー数: ${searchResults.length}人`);
    logger.info('');

    // 検索結果を表示
    searchResults.forEach((user, index) => {
      logger.info(`[${index + 1}] @${user.username || 'unknown'}`);
      logger.info(`    名前: ${user.name || '不明'}`);
      logger.info(`    ID: ${user.id}`);
      if (user.description) {
        logger.info(`    説明: ${user.description.substring(0, 100)}${user.description.length > 100 ? '...' : ''}`);
      }
      logger.info('');
    });

    logger.info('========================================');
    logger.info('検索完了');
    logger.info('========================================');

    // ========================================
    // 以下は一旦コメントアウト
    // ========================================

    /*
    // フォロー中のユーザーを取得（レート制限を考慮して最大1000件まで）
    logger.info('フォロー中のユーザーを取得しています...');
    let followingSet = new Set();
    
    try {
      followingSet = await twitterClient.getFollowingUsers(currentUserId, {
        maxResults: 1000
      });
      logger.info(`現在フォロー中のユーザー数: ${followingSet.size}人`);
    } catch (error) {
      // 403エラーの場合は、フォロー中ユーザーの取得をスキップして続行
      if (error.code === 403 || error.status === 403) {
        logger.warn('⚠️  フォロー中ユーザーの取得に失敗しました（403エラー）');
        logger.warn('⚠️  Twitter Developer AppがProjectにアタッチされていない可能性があります');
        logger.warn('⚠️  フォロー中ユーザーのチェックをスキップして続行します');
        logger.warn('⚠️  重複フォローを避けるため、手動で確認してください');
        followingSet = new Set(); // 空のセットで続行
      } else {
        throw error;
      }
    }
    
    logger.info('');

    // フォローしていないユーザーをフィルタリング
    const notFollowingUsers = searchResults.filter(user => !followingSet.has(user.id));
    logger.info(`フォローしていないユーザー: ${notFollowingUsers.length}人`);
    logger.info('');

    if (notFollowingUsers.length === 0) {
      logger.info('フォローしていないユーザーがありませんでした');
      return;
    }

    // フォロー実行（レート制限を考慮）
    let followedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const maxFollows = 10;
    const followInterval = 60000; // 1分
    const followLimit = Math.min(maxFollows, notFollowingUsers.length);

    logger.info(`フォローを開始します（最大${followLimit}人）`);
    logger.info(`フォロー間隔: ${followInterval / 1000}秒`);
    logger.info('');

    for (let i = 0; i < followLimit; i++) {
      const user = notFollowingUsers[i];
      logger.info(`[${i + 1}/${followLimit}] @${user.username || 'unknown'} (${user.name || 'unknown'})`);

      if (isDryrun) {
        logger.info('  → DRYRUN: フォローをスキップ');
        skippedCount++;
        continue;
      }

      try {
        // レート制限を避けるため、フォロー間隔を空ける
        if (i > 0) {
          logger.info(`  → ${followInterval / 1000}秒待機中...`);
          await new Promise(resolve => setTimeout(resolve, followInterval));
        }

        const result = await twitterClient.followUser(user.id);

        if (result.success) {
          logger.info(`  ✅ フォロー成功: @${user.username || 'unknown'}`);
          followedCount++;
        } else if (result.alreadyFollowing) {
          logger.info(`  ⏭️  既にフォロー中: @${user.username || 'unknown'}`);
          skippedCount++;
        } else {
          logger.warn(`  ⚠️  フォロー失敗: @${user.username || 'unknown'}`);
          errorCount++;
        }
      } catch (error) {
        logger.error(`  ❌ エラー: @${user.username || 'unknown'} - ${error.message}`);
        errorCount++;

        // 403エラー（client-not-enrolled）の場合は処理を中断
        if (error.code === 403 || error.status === 403) {
          const errorData = error.data || error.response?.data || {};
          if (errorData.reason === 'client-not-enrolled' || errorData.detail?.includes('attached to a Project')) {
            logger.error('');
            logger.error('========================================');
            logger.error('❌ 致命的なエラー: Twitter Developer AppがProjectにアタッチされていません');
            logger.error('========================================');
            logger.error('');
            logger.error('フォロー機能を使用するには、以下の手順が必要です：');
            logger.error('');
            logger.error('1. Twitter Developer Portal (https://developer.twitter.com/en/portal) にログイン');
            logger.error('2. 使用しているAppがProjectにアタッチされているか確認');
            logger.error('3. アタッチされていない場合：');
            logger.error('   - Projectを作成（または既存のProjectを選択）');
            logger.error('   - AppをProjectにアタッチ');
            logger.error('   - 必要に応じて新しいAPIキーとトークンを生成');
            logger.error('');
            logger.error('詳細: https://developer.twitter.com/en/docs/projects/overview');
            logger.error('');
            logger.error('処理を中断します');
            break;
          }
        }

        // 429エラー（レート制限）の場合は処理を中断
        if (error.code === 429 || error.status === 429) {
          const waitTime = twitterClient.calculateWaitTime(error);
          logger.error(`レート制限に達しました。${Math.ceil(waitTime / 1000)}秒待機が必要です`);
          logger.error('処理を中断します');
          break;
        }
      }

      logger.info('');
    }

    logger.info('========================================');
    logger.info('実行結果');
    logger.info('========================================');
    logger.info(`検索結果: ${searchResults.length}人`);
    logger.info(`フォロー成功: ${followedCount}人`);
    logger.info(`スキップ: ${skippedCount}人`);
    logger.info(`エラー: ${errorCount}人`);
    logger.info('========================================');
    */

  } catch (error) {
    logger.error('❌ エラーが発生しました');
    logger.error('エラー内容:', error.message);
    if (error.stack) {
      logger.error('スタックトレース:', error.stack);
    }
    process.exit(1);
  }
})();

