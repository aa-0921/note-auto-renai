// createAmazonRankingNote.js
// Amazonランキング記事の自動生成と直接投稿

import { runWithCore } from '@aa-0921/note-auto-core';
import { amazonRankingLinks } from './affiliateConfig.js';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    // リポジトリ固有の設定
    const title = '🛍️✨ Amazonランキング　人気商品チェック！';

    // 導入文
    const intro = [
      'Amazonランキングについて',
      '',
      'Amazonで販売されているすべての商品の最新販売数と累計販売数を反映して、1時間ごとに更新されます。',
      '',
      '---',
      '',
      'こんにちは！💕',
      '',
      'Amazonランキングページをカテゴリ別にまとめました！📊✨',
      '今売れている人気商品をチェックすることで調査する時間を大幅に短縮できます！',
      '',
      'ぜひチェックして、あなたにぴったりの商品を見つけてください！😊',
      '',
      '---',
      '',
    ].join('\n');

    // 締めの文章
    const closing = [
      '',
      '---',
      '',
      '最後までお読みいただきありがとうございます！💬',
      '継続して、有益な情報を発信していきますので、スキ・フォローお願いします！',
      '',
      '※ Amazon のアソシエイトとして、「恋愛・人間関係カウンセラーRisa」は適格販売により収入を得ています。',
      '',
      '#Amazonランキング #Amazon売れ筋ランキング #人気商品 #おすすめ #ショッピング #PR',
    ].join('\n');

    // コアライブラリのメソッドを呼び出し（Amazonランキング専用メソッド）
    await core.runCreateAndPublishAmazonRankingNote({
      background: wantsBackground,
      title,
      rankingLinks: amazonRankingLinks,
      intro,
      closing,
    });

    console.log('✅ Amazonランキング記事を投稿しました');
  });
})();

