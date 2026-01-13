// follow/followFromUserSearch.js
// 薄いラッパー：既存のCLI引数・動作は維持しつつ、実装は共有ライブラリに委譲

import { runWithCore } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    // アカウント固有の検索ワード配列（ここで管理）
    const baseSearchWords = [
      'フォロバ',
      'フォロバ100',
      '相互',
      'フォローバック',
    ];

    const workTroubleSearchWords = [
    ];

    const otherSearchWords = [
    ];

    // すべてのリストを結合
    const searchWords = [...baseSearchWords, ...workTroubleSearchWords, ...otherSearchWords];

    await core.runFollowFromUserSearch({
      background: wantsBackground,
      maxFollows: 30,
      // コア側で options.searchWords を優先使用
      searchWords,
    });
    console.log('フォロー処理が完了しました');
  });
})();

