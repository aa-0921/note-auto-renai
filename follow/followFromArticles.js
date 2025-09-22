// follow/followFromArticles.js
// 薄いラッパー：既存のCLI引数・動作は維持しつつ、実装は共有ライブラリに委譲

import NoteAutomationCore from '@aa-0921/note-auto-core';

(async () => {
  try {
    // 実行引数からheadlessを決定（--bg があればheadless、それ以外は可視）
    const argv = process.argv.slice(2);
    const wantsBackground = argv.includes('--bg');
    
    console.log('headlessモード:', wantsBackground ? 'バックグラウンド(headless)' : '可視(visible)');
    
    // 共通ライブラリを初期化
    const core = new NoteAutomationCore('config/account.yaml');
    await core.initialize();
    
    // フォロー機能を実行
    await core.runFollowFromArticles({ 
      background: wantsBackground,
      maxFollows: 15
    });
    
    // クリーンアップ
    await core.cleanup();
    
    console.log('フォロー処理が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
})();
