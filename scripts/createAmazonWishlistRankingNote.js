#!/usr/bin/env node
// scripts/createAmazonWishlistRankingNote.js
// 日本語コメント: Amazon「ほしい物ランキング」記事の自動生成と直接投稿

import { runWithCore } from '@aa-0921/note-auto-core';
import { amazonWishlistRankingLinks } from './affiliateConfig.js';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    // タイトル候補からランダムに選択（ほしい物ランキング版）
    const titleCandidates = [
      '💝 Amazonほしい物ランキング　カテゴリ別リンクまとめ | Amazon | ランキング | おすすめ | お得 | 買ってよかった | フォロバ100 | フォロバ',
      '🎁 Amazonほしい物ランキング　保存して賢くお買い物 | Amazon | ランキング | おすすめ | お得 | 買ってよかった | フォロバ100 | フォロバ',
      '📝 Amazonほしい物ランキング　気になる商品を比較・管理 | Amazon | ランキング | おすすめ | お得 | 買ってよかった | フォロバ100 | フォロバ',
      '✨ Amazonほしい物ランキング　ギフト選びの近道 | Amazon | ランキング | おすすめ | お得 | 買ってよかった | フォロバ100 | フォロバ',
    ];
    const title = titleCandidates[Math.floor(Math.random() * titleCandidates.length)];

    // 導入文（売れ筋版に寄せて、ほしい物向けに調整）
    const intro = [
      '🉐Amazonほしい物ランキング🆙',
      '最も多くほしい物リストに追加された商品。ランキングは毎日更新されます。',
      '',
      'こんにちは！💕',
      '',
      'Amazonほしい物ランキングページをカテゴリ別にまとめました！📊✨',
      '気になる商品をリストに保存しておくと、セールや値下げを見逃しません！',
      '',
      'ぜひチェックして、あなたにぴったりのアイテムを見つけてください！😊',
      '',
      '---',
    ].join('\n');

    // 締めの文章（売れ筋版のトーンに合わせる）
    const closing = [
      '',
      '---',
      '',
      '最後までお読みいただきありがとうございます！💬',
      '継続して、有益な情報を発信していきますので、スキ・フォローお願いします！',
      '',
      '※ Amazon のアソシエイトとして、「 🏅恋愛・人間関係カウンセラーRisa🏅 」は適格販売により収入を得ています。',
      '',
      '#Amazonランキング #アマゾン #ranking #ほしい物リスト #買ってよかった #ウィッシュリスト #おすすめ #ショッピング #PR',
    ].join('\n');

    // コアライブラリのメソッドを呼び出し（Amazonランキング専用メソッド）
    await core.runCreateAndPublishAmazonRankingNote({
      background: wantsBackground,
      title,
      rankingLinks: amazonWishlistRankingLinks,
      intro,
      closing,
    });

    console.log('✅ Amazonほしい物ランキング記事を投稿しました');
  });
})();

