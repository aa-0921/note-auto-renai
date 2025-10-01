// scripts/affiliateDraftTest.js
// 記事生成は行わず、ログイン→新規記事→本文に軽い文言→Kindle画像貼付け→画像にURL適用→下書き保存 のみを実行
// 実行例:
//   node scripts/affiliateDraftTest.js --bg --config config/account.yaml
// 必要環境変数: NOTE_EMAIL, NOTE_PASSWORD
// Kindleアフィリエイト設定は直接コード内で指定

import 'dotenv/config';
import NoteAutomationCore from '@aa-0921/note-auto-core';

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
}

async function main() {
  const background = process.argv.includes('--bg');
  const configPath = getArgValue('--config') || 'config/account.yaml';

  // Kindleアフィリエイト設定（直接指定）
  const kindleAffiliateTag = 'note-enginner-22';
  const kindleAffiliateEnabled = true;

  const core = new NoteAutomationCore(configPath);
  await core.initialize(background);

  const page = await core.puppeteerManager.createPage();

  try {
    // ログイン
    await core.notePublisher.login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);

    // 新規投稿画面へ
    await core.notePublisher.goToNewPost(page);

    // サムネイル（既存処理）
    await core.notePublisher.dragAndDropToAddButton(page);

    // タイトルと本文（簡易文言）
    const title = 'Kindleバナー挿入テスト';
    const body = 'この下にKindleのバナー画像を挿入し、その画像にリンクを適用します。';
    await core.notePublisher.fillArticle(page, title, body);

    // Kindleバナー画像の挿入とリンク適用（NotePublisherの専用メソッドを使用）
    await core.notePublisher.insertKindleBannerAndLink(page, {
      kindleAffiliateTag: kindleAffiliateTag,
      kindleAffiliateEnabled: kindleAffiliateEnabled
    });

    // 下書き保存→ダイアログを閉じる
    await core.notePublisher.saveDraft(page);
    await core.notePublisher.closeDialogs(page);

    console.log('下書き保存が完了しました（Kindle画像リンク適用テスト）');
  } finally {
    await core.cleanup();
  }
}

main().catch(e => {
  console.error('エラー:', e);
  process.exit(1);
});

