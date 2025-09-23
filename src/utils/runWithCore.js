// src/utils/runWithCore.js
// 日本語コメント: 実行時の共通ブートストラップ（dotenv読込・引数解析・初期化・後片付け）

import 'dotenv/config';
import NoteAutomationCore from '../core/NoteAutomationCore.js';

export async function runWithCore(executor, options = {}) {
  const { accountConfigPath = 'config/account.yaml' } = options;

  // 引数解析
  const argv = process.argv.slice(2);
  const wantsBackground = argv.includes('--bg');

  console.log(
    'headlessモード:',
    wantsBackground ? 'バックグラウンド(headless)' : '可視(visible)'
  );

  const core = new NoteAutomationCore(accountConfigPath);
  try {
    await core.initialize(wantsBackground);
    await executor({ core, argv, wantsBackground });
    console.log('処理が完了しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exitCode = 1;
  } finally {
    try {
      await core.cleanup();
    } catch (e) {
      console.error('クリーンアップ中にエラー:', e);
    }
  }
}

export default runWithCore;
