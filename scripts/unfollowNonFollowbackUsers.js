// scripts/unfollowNonFollowbackUsers.js
// フォローバックされていないアカウントのフォローを解除

import { runWithCore } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    await core.runUnfollowNonFollowbackUsers({
      background: wantsBackground,
      username: null, // nullの場合は現在のユーザー
      maxUnfollows: 10, // 一回に10件まで
    });
    console.log('フォロー解除処理が完了しました');
  });
})();

