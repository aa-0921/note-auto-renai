#!/usr/bin/env node
// scripts/createSaleProductNote.js
// 日本語コメント: Amazonセール商品まとめ記事の自動生成と直接投稿

import { runWithCore } from '@aa-0921/note-auto-core';
import { affiliateConfig } from './affiliateConfig.js';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    // 使用するセール名を指定（環境変数から取得、またはデフォルト値）
    const saleName = '2025_11_BlackFridaySale';
    
    // セール名からファイルを動的に読み込む
    const configFileName = `saleProductConfig_${saleName}.js`;
    let categoryLinks;
    
    try {
      const configModule = await import(`./${configFileName}`);
      categoryLinks = configModule.saleProductLinks;
    } catch (error) {
      console.error(`❌ エラー: セール設定ファイル "${configFileName}" が見つかりません`);
      console.error(`エラー詳細: ${error.message}`);
      process.exit(1);
    }
    
    if (!categoryLinks || (typeof categoryLinks !== 'object' || Array.isArray(categoryLinks))) {
      console.error(`❌ エラー: セール設定ファイル "${configFileName}" から有効なデータを取得できませんでした`);
      console.error(`期待される形式: オブジェクト（カテゴリ名をキーとして商品配列を持つ）`);
      process.exit(1);
    }

    console.log(`📦 セール名: ${saleName}`);
    console.log(`📊 カテゴリ数: ${Object.keys(categoryLinks).length}`);

    // タイトル候補からランダムに選択（カテゴリ毎のセール商品情報一覧）
    const titleCandidates = [
      '🉐 Amazonブラックフライデーセール商品情報一覧　カテゴリ別まとめ',
      '🎁 Amazonブラックフライデーセール商品情報一覧　カテゴリ毎にチェック',
      '📝 Amazonブラックフライデーセール商品情報一覧　カテゴリ別お得情報',
      '✨ Amazonブラックフライデーセール商品情報一覧　カテゴリ毎リンク集',
      '🛍️ Amazonブラックフライデーセール商品情報一覧　カテゴリ別セール情報',
      '💰 Amazonブラックフライデーセール商品情報一覧　カテゴリ毎お得商品',
    ];
    const title = titleCandidates[Math.floor(Math.random() * titleCandidates.length)];

    // 導入文（セール商品まとめ用）
    const intro = [
      'こんにちは！💕',
      '🉐Amazonブラックフライデーセール商品まとめ🆙',
      '今だけのお得な商品をカテゴリ別にまとめました！！',
      '気になる商品をチェックして、お得にショッピングしましょう！',
      '',
      'ぜひチェックして、あなたにぴったりのアイテムを見つけてください！😊',
      '',
      '---',
    ].join('\n');

    // アフィリエイト開示文に使用する名前を取得（リポジトリ毎に変更可能）
    // affiliateConfig.jsのassociateNameを変更することで、リポジトリ毎に異なる名前を設定できます
    const associateName = affiliateConfig.associateName || '🏅恋愛・人間関係カウンセラーRisa🏅';

    // 締めの文章（売れ筋版のトーンに合わせる）
    const closing = [
      '',
      '---',
      '',
      '最後までお読みいただきありがとうございます！💬',
      '継続して、有益な情報を発信していきますので、スキ・フォローお願いします！',
      '',
      `※ Amazon のアソシエイトとして、「 ${associateName} 」は適格販売により収入を得ています。`,
      '',
      '#Amazonブラックフライデーセール #アマゾン #ブラックフライデー #アマゾン #セール #お得 #買ってよかった #おすすめ #ショッピング #PR',
    ].join('\n');

    // コアライブラリのメソッドを呼び出し（セール商品まとめ専用メソッド）
    await core.runCreateAndPublishSaleProductNote({
      background: wantsBackground,
      title,
      categoryLinks,
      intro,
      closing,
    });

    console.log(`✅ Amazonセール商品まとめ記事を投稿しました（セール名: ${saleName}）`);
  });
})();

