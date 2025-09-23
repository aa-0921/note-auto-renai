// likeAsGuestByAccounts.js
// 未ログインで、コア管理のID一覧に対してスキを実行するスクリプト

import { runWithCore, NotePublisher } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    const publisher = new NotePublisher(
      core.configManager?.config || {},
      core.puppeteerManager
    );

    await publisher.likeAsGuestByAccounts({ maxLikesPerAccount: 10 });

    console.log('ゲストいいね処理が完了しました');
  });
})();
