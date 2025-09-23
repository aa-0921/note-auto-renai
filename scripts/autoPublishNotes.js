// autoPublishNotes.js
// 薄いラッパー：既存のCLI引数・動作は維持しつつ、実装は共有ライブラリに委譲

import { runWithCore } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    await core.runAutoPublishNotes({
      background: wantsBackground,
      postLimit: 1,
    });
    console.log('自動投稿処理が完了しました');
  });
})();
