// autoCreateAndDraftNote.js
// 記事を自動で作成し、note.comの下書きに追加するスクリプト
// Puppeteerを利用
// 日本語コメントで説明

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-4-maverick:free';
const POSTS_DIR = 'posts';
const SHEET_PATH = '投稿一覧管理表.md';

// 題材リスト
const topics = [
  '腸活',
  '人間関係',
  '職場の人間関係',
  '恋愛',
  'メンタル',
  '引き寄せの法則'
];

// 記事データの読み込み（例：JSONファイルから）
function loadArticleData(filePath) {
  // TODO: 実際のデータ形式に合わせて実装
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// 投稿一覧管理表.mdから最新IDを取得
function getNextId() {
  const text = fs.readFileSync(SHEET_PATH, 'utf-8');
  const lines = text.split('\n');
  let maxId = 0;
  for (const line of lines) {
    const m = line.match(/^\|\s*(\d+)\s*\|/);
    if (m) {
      const id = parseInt(m[1], 10);
      if (id > maxId) maxId = id;
    }
  }
  return maxId + 1;
}

// AIで記事生成
async function generateArticle(topic) {
  const prompt = `あなたは日本語のnote記事編集者です。以下の題材でnote記事を1本作成してください。\n\n題材: ${topic}\n\n【条件】\n- タイトル、本文、ハッシュタグ（#から始まるもの）を含めてください。\n- タイトルは1行目に「# タイトル」として記載してください。\n- 本文は見出しや箇条書きも交えて1000文字程度で丁寧にまとめてください。\n- ハッシュタグは記事末尾に「#〇〇 #〇〇 ...」の形式でまとめてください。\n- すべて日本語で出力してください。`;
  const messages = [
    { role: 'system', content: 'あなたは日本語のnote記事編集者です。' },
    { role: 'user', content: prompt }
  ];
  const res = await axios.post(API_URL, {
    model: MODEL,
    messages,
    max_tokens: 1200,
    temperature: 0.7
  }, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return res.data.choices[0].message.content.trim();
}

// ファイル名生成
function makeFileName(id, title) {
  const date = new Date().toISOString().slice(0, 10);
  // タイトルからファイル名用文字列を生成
  const safeTitle = title.replace(/[\s#\/:*?"<>|\\]/g, '').slice(0, 30);
  return `${id}__${date}-${safeTitle}.md`;
}

// メイン処理
(async () => {
  // 1. 題材ランダム選択
  const topic = topics[Math.floor(Math.random() * topics.length)];
  console.log('選ばれた題材:', topic);

  // 2. AIで記事生成
  const article = await generateArticle(topic);
  console.log('AI生成記事サンプル:\n', article.slice(0, 200), '...');

  // 3. タイトル抽出
  const titleMatch = article.match(/^#\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : '無題';

  // 4. ID採番
  const id = getNextId();

  // 5. ファイル名生成
  const fileName = makeFileName(id, title);
  const filePath = path.join(POSTS_DIR, fileName);

  // 6. 記事ファイル作成
  fs.writeFileSync(filePath, article, 'utf-8');
  console.log('記事ファイルを作成:', filePath);

  // --- ここから下はアップロードやnote.com下書き保存のための処理例 ---
  // Puppeteerの起動やnote.comへの自動入力などは今はコメントアウト
  // const browser = await puppeteer.launch({ headless: false });
  // const page = await browser.newPage();
  // ...
  // await browser.close();
})(); 
