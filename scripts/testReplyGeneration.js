// scripts/testReplyGeneration.js
// AI返信生成のテストスクリプト（レスポンス確認用）

import { runWithCore } from '@aa-0921/note-auto-core';

(async () => {
  await runWithCore(async ({ core, wantsBackground }) => {
    console.log('=== AI返信生成テスト ===');
    console.log('');

    // テスト用のコメント配列（タイプ名とコメントのペア）
    const testComments = [
      {
        type: '感謝・共感系（長文・フォロー依頼あり）',
        text: 'コメント失礼します🌙フォロー・スキもさせていただきました💕 最近孤独感を感じることが多かったので、この記事はとても心に刺さりました。特にSNSでの比較について、まさにそれだと思う。他人のキラキラした投稿と自分を比べてしまうのはやめようと思います。小さなことでも自分を大切にすることが大切だね。もしよろしければなのですが、私の記事にもコメント・フォロー・スキをいただけますと大変励みになります🙇‍♂️'
      },
      {
        type: '体験談・実践報告系',
        text: 'フォロー・スキさせていただきました😁 食生活の改善って本当に大切だよね。私も最近朝食をしっかり摂るようにしたら、午後の眠気が減って驚いています。血糖値の急激な上下を防ぐ方法は納得です。健康的な食事が仕事の効率にもつながるなんて、本当にやってよかったですよね。もし良ければフォロー'
      },
      {
        type: 'シンプルな感謝系（短文）',
        text: 'コメントありがとうございます！励みになります🙇‍♂️'
      },
      {
        type: '共感・感想系（中程度）',
        text: 'とても参考になりました。特にSNSでの比較についての部分が心に刺さりました。自分もついつい他人と比べてしまいがちなので、気をつけようと思います。'
      },
      {
        type: '質問系',
        text: '興味深い記事でした！血糖値の急激な上下を防ぐ方法について、具体的にどのような食事を心がければいいのでしょうか？朝食の内容など、詳しく知りたいです。'
      },
      {
        type: '体験談・成功報告系',
        text: 'この記事を読んで実践してみました！朝食をしっかり摂るようにしたら、午後の眠気が本当に減りました。血糖値の管理って大切なんですね。これからも続けていきたいと思います。'
      },
      {
        type: '短いコメント（最小限）',
        text: 'いいね！'
      },
      {
        type: '絵文字多め・カジュアル系',
        text: 'フォローしました✨ この記事、めっちゃ参考になった😊 特にSNSの比較の話、わかる〜💦 これからも楽しみにしてます🎉'
      },
      {
        type: '丁寧な感謝・感想系',
        text: 'いつも素敵な記事をありがとうございます。今回の記事も大変勉強になりました。特に小さな成功体験を積み重ねるという考え方は、私の生活にも取り入れたいと思います。これからも応援しています。'
      },
      {
        type: '共感・悩み相談系',
        text: '孤独感を感じることが多くて、この記事を読んで少し気持ちが楽になりました。SNSでの比較は本当に疲れますよね。自分を大切にするって、簡単そうで難しいです。'
      },
      {
        type: '長文・詳細な感想系',
        text: 'コメント失礼します。この記事を読んで、自分自身の生活を見直すきっかけになりました。特に食生活の改善について書かれていた部分が印象的でした。私も最近、朝食を抜くことが多かったのですが、この記事を読んで朝食の重要性を再認識しました。血糖値の急激な上下を防ぐ方法についても、とても参考になりました。健康的な食事が仕事の効率にもつながるという点は、実際に実践してみて実感しています。これからもこのような有益な記事を楽しみにしています。'
      },
      {
        type: '批判的・意見系（建設的）',
        text: '興味深い内容でしたが、もう少し具体的な実践方法が知りたいです。例えば、朝食のメニュー例や、血糖値を安定させるための具体的な食材などがあれば、もっと実践しやすいと思います。'
      }
    ];

    console.log(`=== ${testComments.length}種類のコメントを順番にテストします ===`);
    console.log('');

    try {
      // generateReply関数と同じロジックを実装
      const defaultPromptTemplate = `{{commentText}}`;

      const defaultSystemMessage = `あなたはnote.comの記事にコメントをくれた読者に対して返信する記事作成者です。

【最重要・絶対に守ってください】
返信のテキストだけを直接出力してください。以下の内容は一切出力に含めないでください：
- 「これに対する返信を作成する必要があります」「要件を確認しましょう」などのシステム側の文言
- 「返信案:」「返信案1」「返信案2」「返信案3」などの複数の案やラベル
- 「返信案を作成します」「返信を作成します」などのラベル
- 「返信は以下の要素を含める必要があります」などの説明
- 「これらの返信案を評価し」「最適なものを選びます」などの評価や選択の説明
- 「30文字以上100文字以内で返信を作成します」「これはXX文字です」などの説明
- 「返信のポイント」「返信案をいくつか考えます」などの前置き
- 説明文、分析、要件、思考過程、システムメッセージの内容
- 引用符（「」）も含めず、返信のテキストだけを出力
- 複数の返信案を列挙しないでください。1つの返信テキストだけを出力してください

【出力形式】
- 返信案を複数提示しないでください
- 返信案の評価や比較をしないでください
- 返信案の選択理由を書かないでください
- 直接、1つの返信テキストだけを出力してください

コメントの内容を読み取り、「コメントありがとうございます。」に加えて、コメントの内容に応じた自然な返信を30文字以上で書いてください（文字数の上限はありません）。

【文体の指示】
- 基本的に「ですます調」で書き、一部だけ「だ・である調」を入れてください
- 「だよね。」という語尾は使用せず、「ですね。」「ですよね。」「だと思います。」などを使用してください
- 親しみやすく、優しい表現を心がけてください
- 共感を示す表現（「わかる！」「そうそう」など）を自然に使ってください
- 丁寧さを保ちつつ、カジュアルな表現も混ぜてください

【出力の絶対ルール】
思考過程や分析を一切書かず、返信のテキストだけを直接出力してください。
システム側の文言、要件の説明、分析、思考過程、複数の返信案、評価などは一切出力に含めないでください。
返信案を複数提示したり、評価したりせず、1つの返信テキストだけを直接出力してください。`;

      // 追加プロンプト（実際の使用時と同じ）
      const additionalPrompt = `一般的な大人の女性の口調で書いてください。
- 親しみやすく、優しい表現を心がけてください
- 共感を示す表現（「わかる！」「そうそう」など）を自然に使ってください
- 丁寧さを保ちつつ、カジュアルな表現も混ぜてください`;

      // 追加システムメッセージ（実際の使用時と同じ）
      const additionalSystemMessage = `あなたは一般的な大人の女性ユーザーです。
親しみやすく、優しい口調で返信を書いてください。
共感を示す表現を自然に使いながら、丁寧さも保ってください。`;

      let prompt = defaultPromptTemplate;
      let systemMessage = defaultSystemMessage;

      // 追加プロンプトを追加
      if (additionalPrompt) {
        prompt += `\n\n${additionalPrompt}`;
      }

      // 追加システムメッセージを追加
      if (additionalSystemMessage) {
        systemMessage += `\n\n${additionalSystemMessage}`;
      }

      // テスト結果を記録
      const testResults = [];

      // 各コメントに対して順番にテスト
      for (let i = 0; i < testComments.length; i++) {
        try {
          const testCommentData = testComments[i];
          const testComment = testCommentData.text;
          const commentType = testCommentData.type;
          
          console.log('');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(`テスト ${i + 1}/${testComments.length}: ${commentType}`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('');
          
          console.log(`コメントタイプ: ${commentType}`);
          console.log(`コメント長さ: ${testComment.length}文字`);
          console.log('');
          console.log('テストコメント:');
          console.log(testComment);
          console.log('');
          console.log('--- AI返信生成開始 ---');
          console.log('');

          // プロンプト内の変数を置換
          const currentPrompt = prompt.replace(/{{commentText}}/g, testComment);

          console.log('送信するシステムメッセージ:');
          console.log(systemMessage);
          console.log('');
          console.log('送信するユーザープロンプト:');
          console.log(currentPrompt);
          console.log('');
          console.log('--- AI API呼び出し ---');
          console.log('');

          // AIで返信を生成
          // maxTokensを600に増やす（reasoning用300 + content用300で、返信が途切れないようにする）
          const reply = await core.aiGenerator.callAI(
            [
              { role: 'system', content: systemMessage },
              { role: 'user', content: currentPrompt }
            ],
            600,  // maxTokens: reasoningに消費される分を考慮して増やす
            0.7,  // temperature
            core.aiGenerator.models.article,  // 記事生成と同じプライマリモデルを使用
            'reply'  // purpose: 返信生成の場合は'reply'を指定してreasoningを無効化
          );

          console.log('');
          console.log('--- 生成結果 ---');
          console.log('');
          console.log('生成された返信:');
          console.log(reply);
          console.log('');
          console.log(`返信の長さ: ${reply.length}文字`);
          
          // 返信の妥当性チェック（文字数制限は30文字以上のみ、上限なし）
          const isValid = reply.length >= 30;
          const hasUnwantedText = reply.includes('返信案') || 
                                  reply.includes('30文字以上') || 
                                  reply.includes('100文字以内') ||
                                  reply.includes('返信のポイント') ||
                                  reply.includes('返信案を作成') ||
                                  reply.includes('これに対する返信を作成する必要があります') ||
                                  reply.includes('要件を確認しましょう') ||
                                  reply.includes('返信を作成する必要があります') ||
                                  reply.includes('返信では以下の点を含める必要があります') ||
                                  reply.includes('返信のポイント：') ||
                                  reply.includes('返信案を考えます') ||
                                  reply.includes('返信案を作成します') ||
                                  reply.includes('返信を作成します') ||
                                  reply.includes('これで返信を作成します') ||
                                  reply.includes('これで出力します') ||
                                  reply.includes('これで出力しましょう') ||
                                  reply.includes('指示に従って') ||
                                  reply.includes('要件を満たしています') ||
                                  reply.includes('文字数を確認') ||
                                  reply.includes('文字数は') ||
                                  reply.includes('約') && reply.includes('文字') ||
                                  reply.includes('これで') && reply.includes('文字');
          
          const isSuccess = isValid && !hasUnwantedText;
          
          console.log(`妥当性チェック: ${isValid ? '✅ OK' : '❌ NG'} (30文字以上)`);
          if (hasUnwantedText) {
            console.log('⚠️  警告: 不要なテキストが含まれている可能性があります');
          }
          console.log('');
          
          // テスト結果を記録
          testResults.push({
            index: i + 1,
            type: commentType,
            comment: testComment,
            commentLength: testComment.length,
            reply: reply,
            replyLength: reply.length,
            isValid: isValid,
            hasUnwantedText: hasUnwantedText,
            isSuccess: isSuccess
          });
          
          // 次のテストの前に少し待機（API制限を考慮）
          if (i < testComments.length - 1) {
            console.log('次のテストまで2秒待機します...');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.error(`❌ テスト ${i + 1} でエラーが発生しました:`, error.message);
          if (error.stack) {
            console.error('スタックトレース:', error.stack);
          }
          
          // エラーが発生した場合も結果を記録
          testResults.push({
            index: i + 1,
            type: testComments[i].type,
            comment: testComments[i].text,
            commentLength: testComments[i].text.length,
            reply: `エラー: ${error.message}`,
            replyLength: 0,
            isValid: false,
            hasUnwantedText: false,
            isSuccess: false,
            error: error.message
          });
          
          // エラーが発生しても次のテストを続行
          if (i < testComments.length - 1) {
            console.log('次のテストまで2秒待機します...');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }

      // テスト結果サマリーを表示
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 テスト結果サマリー');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      
      const successCount = testResults.filter(r => r.isSuccess).length;
      const failCount = testResults.length - successCount;
      
      console.log(`総テスト数: ${testResults.length}件`);
      console.log(`成功: ${successCount}件 ✅`);
      console.log(`失敗: ${failCount}件 ❌`);
      console.log(`成功率: ${((successCount / testResults.length) * 100).toFixed(1)}%`);
      console.log('');
      
      // 詳細結果
      console.log('詳細結果:');
      testResults.forEach(result => {
        const status = result.isSuccess ? '✅' : '❌';
        console.log(`  ${status} テスト${result.index}: ${result.type}`);
        console.log(`     コメント: ${result.commentLength}文字 → 返信: ${result.replyLength}文字`);
        if (!result.isValid) {
          console.log(`     ⚠️  文字数が30文字未満`);
        }
        if (result.hasUnwantedText) {
          console.log(`     ⚠️  不要なテキストが含まれています`);
        }
      });
      
      // すべてのコメントと返信の一覧を表示
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📝 すべてのコメントと返信の一覧');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      
      testResults.forEach((result, index) => {
        const status = result.isSuccess ? '✅' : '❌';
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`${status} テスト ${result.index}/${testResults.length}: ${result.type}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log('');
        console.log('【コメント】');
        console.log(`  長さ: ${result.commentLength}文字`);
        console.log(`  内容: ${result.comment}`);
        console.log('');
        console.log('【生成された返信】');
        console.log(`  長さ: ${result.replyLength}文字`);
        console.log(`  内容: ${result.reply}`);
        console.log('');
        
        if (!result.isValid) {
          console.log('  ⚠️  文字数が30文字未満');
        }
        if (result.hasUnwantedText) {
          console.log('  ⚠️  不要なテキストが含まれています');
        }
        console.log('');
        
        // 最後の項目以外は区切り線を追加
        if (index < testResults.length - 1) {
          console.log('');
        }
      });
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ すべてのテスト完了');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
    } catch (error) {
      console.error('❌ エラーが発生しました:', error.message);
      if (error.stack) {
        console.error('スタックトレース:', error.stack);
      }
      throw error;
    }
  });
})();
