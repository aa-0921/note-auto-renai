// scripts/commentOnAccountsArticles.js
// 薄いラッパー：既存のCLI引数・動作は維持しつつ、実装は共有ライブラリに委譲

import { runWithCore } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    // ======================================
    // ここをカスタマイズしてください
    // ======================================
    
    // 現在のアカウント名（このスクリプトを実行しているアカウント）
    const currentAccount = 'counselor_risa';  // 例: 'counselor_risa'
    
    // アカウントごとの最大コメント数
    const maxCommentsPerAccount = 5;  // 例: 1（各アカウントの記事1件にコメント）
    
    // 対象アカウントリスト（オプション、未指定の場合はDEFAULT_LIKE_TARGET_ACCOUNTSを使用）
    // const targetAccounts = ['counselor_risa', 'investment_happy'];  // 例: 特定のアカウントのみ
    const targetAccounts = undefined;  // デフォルトを使用する場合は undefined
    
    // 追加プロンプト（オプション）
    // 例：アカウントの属性（年齢、性別など）を指定
    const additionalPrompt = `一般的な大人の女性の口調で書いてください。
- 親しみやすく、優しい表現を心がけてください
- 共感を示す表現（「わかる！」「そうそう」など）を自然に使ってください
- 丁寧さを保ちつつ、カジュアルな表現も混ぜてください
- コメントの最初に必ず「フォロー・スキさせていただきました💜」を追加してください
- コメントの最後に必ず「もしよろしければなのですが、フォロー・スキいただけますと大変励みになりますー🙇‍♂️」を追加してください`;

    // ベースシステムメッセージに追加するメッセージ（オプション）
    // 例：アカウントの属性（年齢、性別など）を指定
    const additionalSystemMessage = `あなたは一般的な大人の女性ユーザーです。
親しみやすく、優しい口調でコメントを書いてください。
共感を示す表現を自然に使いながら、丁寧さも保ってください。`;
    
    // ======================================
    
    console.log('=== アカウント間コメント投稿処理を開始します ===');
    console.log(`アカウントごとの最大コメント数: ${maxCommentsPerAccount}件`);
    console.log('');
    
    // オプション設定
    const options = {
      currentAccount: currentAccount,
      maxCommentsPerAccount: maxCommentsPerAccount,
      targetAccounts: targetAccounts,
      additionalPrompt: additionalPrompt,
      additionalSystemMessage: additionalSystemMessage
    };
    
    // アカウント間コメント投稿を実行
    const result = await core.runCommentOnAccountsArticles(options);
    
    console.log('');
    console.log('✅ アカウント間コメント投稿が完了しました');
    console.log(`総コメント成功件数: ${result.commentCount}件`);
    console.log(`処理したアカウント数: ${result.accountsProcessed}件`);
    
    if (result.accounts && result.accounts.length > 0) {
      console.log('');
      console.log('アカウントごとの処理結果:');
      result.accounts.forEach((accountResult, index) => {
        console.log(`  ${index + 1}. @${accountResult.account}: ${accountResult.commentCount}件 / ${accountResult.targetCount}件${accountResult.error ? ` (エラー: ${accountResult.error})` : ''}`);
      });
    }
  });
})();
