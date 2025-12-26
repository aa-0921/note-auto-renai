// createAmazonTopSellersRankingNote.js
// Amazon売れ筋ランキング記事の自動生成と直接投稿

import { runWithCore } from '@aa-0921/note-auto-core';
import { amazonTopSellersRankingLinks } from './affiliateConfig.js';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    // タイトル候補からランダムに選択
    const titleCandidates = [
      '✨ Amazon売れ筋ランキング　カテゴリ別リンクまとめ | Amazon | ランキング | おすすめ | お得 | 買ってよかった | フォロバ100 | フォロバ',
      '💕 Amazon売れ筋ランキング　人気商品をサクッとチェック | Amazon | ランキング | おすすめ | お得 | 買ってよかった | フォロバ100 | フォロバ',
      '🉐 Amazon売れ筋ランキング　失敗しない商品選び | Amazon | ランキング | おすすめ | お得 | 買ってよかった | フォロバ100 | フォロバ',
      '💡 Amazon売れ筋ランキング　人気商品で時短リサーチ | Amazon | ランキング | おすすめ | お得 | 買ってよかった | フォロバ100 | フォロバ',
    ];
    const title =
      titleCandidates[Math.floor(Math.random() * titleCandidates.length)];

    // 導入文
    const intro = [
      '🉐Amazon売れ筋ランキング🆙',
      '売上に基づいた最も人気の商品のランキングで、頻繁に更新されます！',
      'Amazonで販売されているすべての商品の最新販売数と累計販売数を反映して、1時間ごとに更新されます！',
      '',
      'こんにちは！💕',
      '',
      'Amazon売れ筋ランキングページをカテゴリ別にまとめました！📊✨',
      '今売れている人気商品をチェックすることで調査する時間を大幅に短縮できます！',
      '',
      'ぜひチェックして、あなたにぴったりの商品を見つけてください！😊',
      '',
      '---',
    ].join('\n');

    // 締めの文章
    const closing = [
      '',
      '---',
      '',
      '最後までお読みいただきありがとうございます！💬',
      '継続して、有益な情報を発信していきますので、スキ・フォローお願いします！',
      '',
      '※ Amazon のアソシエイトとして、「 🏅恋愛・人間関係カウンセラーRisa🏅 」は適格販売により収入を得ています。',
      '',
      '#Amazonランキング #Amazon売れ筋ランキング #人気商品 #おすすめ #ショッピング #PR',
    ].join('\n');

    // コアライブラリのメソッドを呼び出し（Amazonランキング専用メソッド）
    await core.runCreateAndPublishAmazonRankingNote({
      background: wantsBackground,
      title,
      rankingLinks: amazonTopSellersRankingLinks,
      intro,
      closing,
    });

    console.log('✅ Amazon売れ筋ランキング記事を投稿しました');
  });
})();

