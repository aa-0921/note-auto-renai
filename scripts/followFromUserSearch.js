// follow/followFromUserSearch.js
// 薄いラッパー：既存のCLI引数・動作は維持しつつ、実装は共有ライブラリに委譲

import { runWithCore } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    // アカウント固有の検索ワード配列（ここで管理）
    const searchWords = [
      'フォロバ',
      'フォロバ',
      'フォロバ',
      '開発',
      'ママ',
      'パパ',
      '子育て',
      '育児',
      'JK',
      'JD',
      '恋愛',
      '教育',
      '感謝',
      '彼女',
      '彼氏',
      '彼氏',
    ];

    await core.runFollowFromUserSearch({
      background: wantsBackground,
      maxFollows: 15,
      // コア側で options.searchWords を優先使用
      searchWords,
    });
    console.log('フォロー処理が完了しました');
  });
})();

