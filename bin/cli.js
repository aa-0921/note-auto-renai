#!/usr/bin/env node
// bin/cli.js
// note-auto-core CLIツール

import NoteAutomationCore from '../src/index.js';

const commands = {
  'like-unliked': 'いいね機能を実行',
  publish: '記事の自動投稿を実行',
  follow: 'フォロー機能を実行',
  'like-url': '指定URLの記事にいいね',
  'create-draft': '記事の自動生成と下書き保存',
};

function showHelp() {
  console.log('note-auto-core CLI');
  console.log('');
  console.log('使用方法:');
  console.log('  npx note-core <command> [options]');
  console.log('');
  console.log('コマンド:');
  for (const [cmd, desc] of Object.entries(commands)) {
    console.log(`  ${cmd.padEnd(15)} ${desc}`);
  }
  console.log('');
  console.log('オプション:');
  console.log('  --bg              バックグラウンド実行（headlessモード）');
  console.log(
    '  --config <path>   設定ファイルのパス（デフォルト: config/account.yaml）'
  );
  console.log('  --help            このヘルプを表示');
  console.log('');
  console.log('例:');
  console.log('  npx note-core like-unliked --bg');
  console.log('  npx note-core publish --bg');
  console.log('  npx note-core like-url --bg https://note.com/example');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    showHelp();
    return;
  }

  const command = args[0];
  const options = {
    background: args.includes('--bg'),
    configPath: 'config/account.yaml',
  };

  // 設定ファイルパスの取得
  const configIndex = args.indexOf('--config');
  if (configIndex !== -1 && args[configIndex + 1]) {
    options.configPath = args[configIndex + 1];
  }

  try {
    console.log(`note-auto-core CLI: ${command} を実行中...`);
    console.log('設定ファイル:', options.configPath);
    console.log('headlessモード:', options.background ? '有効' : '無効');

    // 共通ライブラリを初期化
    const core = new NoteAutomationCore(options.configPath);
    await core.initialize();

    // コマンド実行
    switch (command) {
    case 'like-unliked':
      await core.runLikeUnlikedNotes(options);
      break;
    case 'publish':
      await core.runAutoPublishNotes(options);
      break;
    case 'follow':
      await core.runFollowFromArticles(options);
      break;
    case 'like-url': {
      const url = args.find(arg => arg.startsWith('https://'));
      if (!url) {
        console.error('エラー: URLを指定してください');
        console.error(
          '例: npx note-core like-url --bg https://note.com/example'
        );
        process.exit(1);
      }
      await core.runLikeNotesByUrl(url, options);
      break;
    }
    case 'create-draft':
      await core.runAutoCreateAndDraftNote(options);
      break;
    default:
      console.error(`エラー: 不明なコマンド "${command}"`);
      console.error('利用可能なコマンド:', Object.keys(commands).join(', '));
      process.exit(1);
    }

    // クリーンアップ
    await core.cleanup();

    console.log(`${command} の実行が完了しました`);
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    process.exit(1);
  }
}

main();
