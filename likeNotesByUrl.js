// likeNotesByUrl.js
// 薄いラッパー：既存のCLI引数・動作は維持しつつ、実装は共有ライブラリに委譲

import NoteAutomationCore from '@aa-0921/note-auto-core';

(async () => {
  try {
    // コマンドライン引数を解析
    const args = process.argv.slice(2);
    const wantsBackground = args.includes('--bg');
    
    // --bgオプションを除いた引数からURLを取得
    const urlArgs = args.filter(arg => arg !== '--bg');
    const targetUrl = urlArgs[0];
    
    // デフォルトURL（引数がない場合）
    const defaultUrl = 'https://note.com/enginner_skill';
    
    // 使用するURLを決定
    const urlToUse = targetUrl || defaultUrl;
    
    console.log('【URL設定】');
    console.log('引数で指定されたURL:', targetUrl || 'なし');
    console.log('使用するURL:', urlToUse);
    
    // URLの形式をチェック
    if (!urlToUse.startsWith('https://note.com/')) {
      console.error('エラー: 有効なnote.comのURLを指定してください');
      console.error('例: node likeNotesByUrl.js https://note.com/enginner_skill');
      console.error('例: node likeNotesByUrl.js --bg https://note.com/enginner_skill');
      process.exit(1);
    }
    
    console.log('headlessモード:', wantsBackground ? 'バックグラウンド(headless)' : '可視(visible)');
    
    // 共通ライブラリを初期化
    const core = new NoteAutomationCore('config/account.yaml');
    await core.initialize();
    
    // 特定URLへのいいね機能を実行
    await core.runLikeNotesByUrl(urlToUse, { 
      background: wantsBackground,
      maxLikes: 50
    });
    
    // クリーンアップ
    await core.cleanup();
    
    console.log('いいね処理が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
})();
