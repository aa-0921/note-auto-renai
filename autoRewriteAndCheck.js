require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { execSync } = require('child_process');

const API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'; // OpenAI互換
// const MODEL = 'google/gemini-pro'; // 必要に応じて変更
// const MODEL = 'google/gemini-2.5-pro-exp-03-25';
// const MODEL = 'deepseek/deepseek-chat-v3-0324:free';
// const MODEL = 'google/gemini-2.0-flash-exp:free';
// ↓早いし、内容も問題なさそう
const MODEL = 'meta-llama/llama-4-maverick:free';

const POSTS_DIR = 'posts';
const CHECK_SCRIPT = 'checkSectionLengths.js';

// 引数パース: 例) 1,5,6 または 2-5
function parseIds(arg) {
  if (!arg) return [];
  if (arg.includes('-')) {
    const [start, end] = arg.split('-').map(Number);
    if (isNaN(start) || isNaN(end) || start > end) return [];
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  } else {
    return arg.split(',').map(Number).filter(n => !isNaN(n));
  }
}

// 指定IDに該当するファイルをpostsディレクトリから探す
function findFileById(id) {
  const files = fs.readdirSync(POSTS_DIR);
  const regex = new RegExp(`^${id}__.*\\.md$`);
  return files.find(f => regex.test(f));
}

// セクションごとに分割
function splitSections(raw) {
  const sections = raw.split(/^## /m).slice(1);
  return sections.map(section => {
    const lines = section.split('\n');
    const heading = lines[0].trim();
    let body = '';
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].startsWith('##') || lines[i].startsWith('---')) break;
      body += lines[i].trim();
    }
    return { heading, body, raw: section };
  });
}

// checkSectionLengths.jsを呼び出してNGセクション名を抽出
function getShortSections(mdPath) {
  let result;
  try {
    // result = execSync(`node ${CHECK_SCRIPT} ${mdPath}`).toString();
    result = execSync(`node ${CHECK_SCRIPT} ${mdPath}`).toString();
    console.log(result); // ← これを追加
  } catch (e) {
    console.error('分量チェックでエラー:', e.message);
    return [];
  }
  // 「「○○」の本文がxxx文字と少なめです」だけ抽出
  const lines = result.split('\n');
  const ngSections = [];
  for (const line of lines) {
    const m = line.match(/^「(.+)」の本文が(\d+)文字と少なめです/);
    if (m) ngSections.push(m[1]);
  }
  return ngSections;
}

// 200字未満のセクションをリライト
async function rewriteSection(heading, body) {
  const prompt = `
あなたは女性の心理カウンセラーです。以下のnote記事の「${heading}」という見出しの本文が${body.length}文字しかありません。200文字以上になるように、実体験や具体例、アドバイスを交えて厚くリライト・追記してください。

【注意】
- タイトルや見出しは出力せず、本文のみを返してください。
- 「追加した要素」や「文字数」などのメタ情報は一切出力しないでください。
- 「CRIPTION:」「】」などの記号や不要な文字列は一切出力しないでください。
- 文章は話し言葉やカジュアルな表現を避け、できるだけ丁寧な敬語でまとめてください。
- です。ます。で統一してください。
- 文章のみを返してください。
- 文章は日本語で返してください。acency等の英語が混じらないようにしてください。

元の本文: ${body}
  `.trim();

  const messages = [
    { role: 'system', content: 'あなたは日本語のnote記事編集者です。' },
    { role: 'user', content: prompt }
  ];
  const res = await axios.post(API_URL, {
    model: MODEL,
    messages,
    max_tokens: 600,
    temperature: 0.7
  }, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return res.data.choices[0].message.content.trim();
}

async function processFile(mdPath) {
  let loop = 0;
  while (true) {
    loop++;
    // 
    const ngSections = getShortSections(mdPath);
    if (ngSections.length === 0) {
      console.log(`すべてのセクションが200文字以上です: ${mdPath}`);
      break;
    }
    console.log(`NGセクション: ${ngSections.join(', ')}（${mdPath}）`);
    let raw = fs.readFileSync(mdPath, 'utf-8');
    let sections = splitSections(raw);
    let updated = false;
    for (let i = 0; i < sections.length; i++) {
      const { heading, body, raw: sectionRaw } = sections[i];
      if (ngSections.includes(heading)) {
        console.log(`「${heading}」の本文が${body.length}文字と少なめです。AIでリライトします...`);
        const newBody = await rewriteSection(heading, body);
        // 末尾に余分な改行を追加
        const newBodyWithExtraLine = newBody + '\n';
        const lines = sectionRaw.split('\n');
        lines.splice(1, lines.length - 1, newBodyWithExtraLine);
        sections[i].raw = lines.join('\n');
        updated = true;
      }
    }
    if (updated) {
      const firstPart = raw.split(/^## /m)[0];
      const newRaw = firstPart + sections.map(s => '## ' + s.raw).join('\n');
      fs.writeFileSync(mdPath, newRaw, 'utf-8');
      console.log(`リライト・追記が完了しました: ${mdPath}（${loop}回目）`);
    } else {
      break;
    }
  }
}

// メイン処理
(async () => {
  const arg = process.argv[2];
  if (!arg) {
    console.error('記事ID（例: 1,5,6 または 2-5）を指定してください');
    process.exit(1);
  }
  const ids = parseIds(arg);
  if (ids.length === 0) {
    console.error('有効な記事IDが指定されていません');
    process.exit(1);
  }
  for (const id of ids) {
    const file = findFileById(id);
    if (!file) {
      console.warn(`ID ${id} に該当する記事ファイルが見つかりません`);
      continue;
    }
    const mdPath = path.join(POSTS_DIR, file);
    console.log(`\n=== 記事ID: ${id} (${file}) の処理を開始 ===`);
    await processFile(mdPath);
  }
})(); 
