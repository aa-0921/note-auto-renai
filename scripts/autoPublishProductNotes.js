// autoPublishProductNotes.js
// 「買ってよかった」が含まれる商品記事を自動投稿

import { runWithCore } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    await core.runAutoPublishProductNotes({
      background: wantsBackground,
      postLimit: 1,
    });
    console.log('商品記事の自動投稿処理が完了しました');
  });
})();

