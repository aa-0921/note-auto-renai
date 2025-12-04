// scripts/likeAsLoggedInByAccounts.js
// 日本語コメント: renaiリポジトリ側から、note-auto-core の「ログイン済みスキ処理」を呼び出すスクリプト

import dotenv from 'dotenv';
// 日本語コメント: note-auto-core をパッケージ名でインポート（CI環境でも動作）
// ローカル開発環境では file:../note-auto-core が解決され、CI環境ではnpmパッケージが解決される
import { runWithCore } from '@aa-0921/note-auto-core';

// 日本語コメント: renai側の .env から NOTE_EMAIL / NOTE_PASSWORD などを読み込む
dotenv.config();

async function main() {
  await runWithCore(async ({ core }) => {
    // 日本語コメント: accountIds を省略すると、core側の DEFAULT_LIKE_TARGET_ACCOUNTS が使われる
    await core.runLikeAsLoggedInByAccounts({
      // 必要であれば対象アカウントを限定
      // accountIds: ['_hikiyose'],
      maxLikesPerAccount: 20,
    });
  });
}

main().catch((error) => {
  console.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
