#!/usr/bin/env node
// scripts/twitterPostAmazonRanking.js
// Amazon売れ筋ランキングリンクをTwitterに投稿する（薄いラッパ）

import { Logger, postRandomAmazonRankingTweet } from '@aa-0921/note-auto-core';
import { amazonTopSellersRankingLinks } from './affiliateConfig.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger();

async function main() {
  const viewportWidth = parseInt(process.env.TWITTER_SS_WIDTH || '1600', 10);
  const viewportHeight = parseInt(process.env.TWITTER_SS_HEIGHT || '900', 10);
  const zoom = parseFloat(process.env.TWITTER_SS_ZOOM || '1.0');
  const dryrun = process.argv.includes('--dryrun');

  logger.info('========================================');
  logger.info('Amazon売れ筋ランキング Twitter投稿（coreサービス使用）');
  logger.info('========================================');
  logger.info('');

  await postRandomAmazonRankingTweet({
    links: amazonTopSellersRankingLinks,
    dryrun,
    viewportWidth,
    viewportHeight,
    zoom,
    logger,
  });
}

main().catch(() => process.exit(1));

