// src/utils/Args.js
// 日本語コメント: CLI引数の共通パーサ（--bg, URL抽出 等）

export function parseBackgroundFlag(argv = process.argv.slice(2)) {
  return argv.includes('--bg');
}

export function extractNoteUrl(argv = process.argv.slice(2), defaultUrl) {
  const urlArgs = argv.filter(arg => arg !== '--bg');
  const targetUrl = urlArgs[0];
  const urlToUse = targetUrl || defaultUrl;

  if (!urlToUse || !urlToUse.startsWith('https://note.com/')) {
    throw new Error('有効なnote.comのURLを指定してください（例: https://note.com/enginner_skill）');
  }

  return { targetUrl, urlToUse };
}

export default {
  parseBackgroundFlag,
  extractNoteUrl
};


