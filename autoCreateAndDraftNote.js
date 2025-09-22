// autoCreateAndDraftNote.js
// 薄いラッパー：既存のCLI引数・動作は維持しつつ、実装は共有ライブラリに委譲

import { runWithCore } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    // 記事の自動生成と下書き保存機能を実行
    await core.runAutoCreateAndDraftNote({
      background: wantsBackground
    });
    console.log('記事の自動生成と下書き保存が完了しました');
  });
})();
