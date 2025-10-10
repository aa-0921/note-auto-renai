// checkOpenRouterLimit.js
// OpenRouterのAPIキー情報とレート制限状況を確認するスクリプト
// 実行例: node scripts/checkOpenRouterLimit.js


// https://www.reddit.com/r/openrouter/comments/1jeknm9/when_do_free_daily_limits_reset/?tl=ja
// ↓ "X-RateLimit-Reset":"1760140800000"} を見ればリセット時間がわかると書いてあるがどうだろうか
// レスポンスデータ（error）: {"message":"Rate limit exceeded: free-models-per-day. Add 10 credits to unlock 1000 free model requests per day","code":429,"metadata":{"headers":{"X-RateLimit-Limit":"50","X-RateLimit-Remaining":"0","X-RateLimit-Reset":"1760140800000"},"provider_name":null}}

import 'dotenv/config';

async function checkOpenRouterLimit() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error('❌ エラー: OPENROUTER_API_KEY 環境変数が設定されていません');
    process.exit(1);
  }

  console.log('🔍 OpenRouterのAPIキー情報を取得中...\n');

  try {
    const response = await fetch('https://openrouter.ai/api/v1/key', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error(`❌ APIエラー: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('エラー詳細:', errorText);
      process.exit(1);
    }

    const data = await response.json();
    const keyData = data.data;

    // 結果を見やすく表示
    console.log('✅ APIキー情報の取得に成功しました\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 APIキー情報');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`APIキーラベル: ${keyData.label}`);
    console.log(`  └─ このAPIキーの識別子\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💰 クレジット残高・制限');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const limitDisplay = keyData.limit === null ? '無制限（または未設定）' : `$${keyData.limit.toFixed(4)}`;
    const remainingDisplay = keyData.limit_remaining === null ? '無制限（または未設定）' : `$${keyData.limit_remaining.toFixed(4)}`;
    const resetDisplay = keyData.limit_reset === null ? 'リセットなし' : keyData.limit_reset;
    
    console.log(`クレジット上限: ${limitDisplay}`);
    console.log(`  └─ このAPIキーに設定されたクレジット上限`);
    console.log(`残りクレジット: ${remainingDisplay}`);
    console.log(`  └─ 現在利用可能なクレジット残高`);
    console.log(`リセット方式: ${resetDisplay}`);
    console.log(`  └─ クレジット制限のリセットタイミング\n`);

    console.log(`BYOK使用を制限に含む: ${keyData.include_byok_in_limit ? 'はい' : 'いいえ'}`);
    console.log(`  └─ 外部API（BYOK）の使用量もクレジット制限に含めるか\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📈 使用状況（OpenRouter経由）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`総使用量: $${keyData.usage.toFixed(6)}`);
    console.log(`  └─ このAPIキーで使用したクレジット総額（全期間）`);
    console.log(`今日の使用量: $${keyData.usage_daily.toFixed(6)}`);
    console.log(`  └─ 本日（UTC）の使用量`);
    console.log(`今週の使用量: $${keyData.usage_weekly.toFixed(6)}`);
    console.log(`  └─ 今週（月曜日起算、UTC）の使用量`);
    console.log(`今月の使用量: $${keyData.usage_monthly.toFixed(6)}`);
    console.log(`  └─ 今月（UTC）の使用量\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 外部API使用状況（BYOK: Bring Your Own Key）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`BYOK総使用量: $${keyData.byok_usage.toFixed(6)}`);
    console.log(`  └─ 外部APIキー経由の使用総額（全期間）`);
    console.log(`BYOK今日の使用量: $${keyData.byok_usage_daily.toFixed(6)}`);
    console.log(`  └─ 本日（UTC）の外部API使用量`);
    console.log(`BYOK今週の使用量: $${keyData.byok_usage_weekly.toFixed(6)}`);
    console.log(`  └─ 今週（月曜日起算、UTC）の外部API使用量`);
    console.log(`BYOK今月の使用量: $${keyData.byok_usage_monthly.toFixed(6)}`);
    console.log(`  └─ 今月（UTC）の外部API使用量\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 アカウントステータス');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`無料ティア: ${keyData.is_free_tier ? 'はい' : 'いいえ'}`);
    console.log(`  └─ ${keyData.is_free_tier ? 'クレジット未購入（無料アカウント）' : 'クレジット購入済み'}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 無料モデル (:free) のレート制限');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('【時間制限】');
    console.log('  ・ 1分間に最大20リクエスト\n');
    console.log('【1日の制限】');
    if (keyData.is_free_tier) {
      console.log('  ⚠️  10クレジット未満: 1日50リクエストまで（現在の状態）');
      console.log('  💡 10クレジット以上: 1日1000リクエストまで（購入で拡大可能）');
    } else {
      console.log('  ✅ 10クレジット以上購入済み: 1日1000リクエストまで');
    }
    console.log('\n【注意事項】');
    console.log('  ・ 残高がマイナスの場合、無料モデルでも402エラーが発生');
    console.log('  ・ クレジットを追加すると再び使用可能に');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 モデルごとのレート制限について');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('【重要】OpenRouterでは各モデルごとに異なるレート制限があります\n');
    console.log('✅ モデルごとに制限が異なる仕組み:');
    console.log('  ・ 複数のアカウントやAPIキーを作っても制限は変わりません');
    console.log('  ・ 制限はグローバル（アカウント全体）で管理されています');
    console.log('  ・ ただし、モデルごとに異なるレート制限が設定されています\n');
    console.log('💡 制限回避の方法:');
    console.log('  ・ あるモデルが制限に達した場合、別のモデルを使用することで負荷を分散できます');
    console.log('  ・ 例: google/gemini-2.0-flash-exp:free が制限に達したら');
    console.log('      → meta-llama/llama-3.2-3b-instruct:free や他のモデルを使用\n');
    console.log('📚 詳細: https://openrouter.ai/docs/api-reference/limits');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // クレジット残高の警告
    if (keyData.limit !== null && keyData.limit < 0) {
      console.log('⚠️  警告: 残高がマイナスです！');
      console.log('   無料モデルでも402エラーが発生する可能性があります。');
      console.log('   https://openrouter.ai/settings/limits からクレジットを追加してください。\n');
    }

    // 無料ティアへのヒント
    if (keyData.is_free_tier) {
      console.log('💡 ヒント: 10クレジット（約$10）以上購入すると:');
      console.log('   ・ 無料モデルの1日の制限が 50 → 1000リクエストに拡大（20倍！）');
      console.log('   ・ 有料モデルも使用可能に');
      console.log('   購入はこちら: https://openrouter.ai/settings/limits\n');
    }

    // 生データも表示（デバッグ用）
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 生データ（JSON）');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    process.exit(1);
  }
}

// スクリプトを実行
checkOpenRouterLimit();

