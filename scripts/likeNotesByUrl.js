// likeNotesByUrl.js
// 薄いラッパー：既存のCLI引数・動作は維持しつつ、実装は共有ライブラリに委譲

import { runWithCore, extractNoteUrl } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, argv, wantsBackground }) => {
    // デフォルトURL（引数がない場合）
    const defaultUrl = 'https://note.com/enginner_skill';
    const { targetUrl, urlToUse } = extractNoteUrl(argv, defaultUrl);

    console.log('【URL設定】');
    console.log('引数で指定されたURL:', targetUrl || 'なし');
    console.log('使用するURL:', urlToUse);

    // 特定URLへのいいね機能を実行
    await core.runLikeNotesByUrl(urlToUse, {
      background: wantsBackground,
      maxLikes: 50,
    });
    console.log('いいね処理が完了しました');
  });
})();
