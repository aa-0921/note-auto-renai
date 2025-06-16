// autoCreateAndDraftNote.js
// 記事を自動で作成し、note.comの下書きに追加するスクリプト
// Puppeteerを利用
// 日本語コメントで説明

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { execSync } = require('child_process');
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

// 切り口リスト
const patterns = [
  '一歩踏み込んだ理解',
  '具体的な活用方法',
  '楽にする方法',
  'ランキング',
  'まつわるQ&Aまとめ',
  'やってはいけないNG行動',
  '初心者が最初の1週間でやることリスト',
  '専門家に聞いた極意',
  '続けるためのモチベーション維持法',
  'ありがちな勘違いと正しいやり方',
  '成功例・失敗例から学ぶ'
];

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

// 投稿一覧管理表.mdに新しい行を追加
function appendToSheet(id, fileName, title, date) {
  const row = `| ${id} | ${fileName} | ${title} | ${date} |  |  |  |  |\n`;
  let sheet = fs.readFileSync(SHEET_PATH, 'utf-8');

  // ファイル末尾が改行で終わっていなければ改行を追加
  if (!sheet.endsWith('\n')) {
    fs.appendFileSync(SHEET_PATH, '\n' + row, 'utf-8');
  } else {
    fs.appendFileSync(SHEET_PATH, row, 'utf-8');
  }

  console.log('投稿一覧管理表.mdに行を追加:', row.trim());
}

// AIで記事生成
async function generateArticle(topic, pattern) {
  const prompt = `あなたは日本語のnote記事編集者です。以下の題材と切り口でnote記事を1本作成してください。\n\n題材: ${topic}\n切り口: ${pattern}\n\n【条件】\n- タイトル、本文、ハッシュタグ（#から始まるもの）を含めてください。\n- タイトルは1行目に「# タイトル」として記載してください。\n- 本文は見出しや箇条書きも交えて1000文字程度で丁寧にまとめてください。\n- ハッシュタグは記事末尾に「#〇〇 #〇〇 ...」の形式でまとめてください。\n- すべて日本語で出力してください。\n- 切り口に沿った内容になるようにしてください。`;
  const messages = [
    { role: 'system', content: 'あなたは日本語のnote記事編集者です。' },
    { role: 'user', content: prompt }
  ];
  // AI記事生成APIリクエストを最大3回までリトライ
  let tryCount = 0;
  let lastError = null;
  while (tryCount < 3) {
    tryCount++;
    try {
      // APIリクエスト内容を詳細にログ出力
      console.log('AI記事生成APIリクエスト先:', API_URL);
      console.log('AI記事生成APIリクエストヘッダー:', {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      });
      console.log('AI記事生成APIリクエストモデル:', MODEL);
      // APIキーの一部だけ（セキュリティのため）
      if (API_KEY) {
        console.log('API_KEYの先頭6文字:', API_KEY.slice(0, 6), '...（省略）');
      } else {
        console.log('API_KEYが未設定です');
      }
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
      // レスポンスが正常かチェック
      if (!res || !res.data || !res.data.choices || !res.data.choices[0] || !res.data.choices[0].message || !res.data.choices[0].message.content) {
        console.error(`AI記事生成APIレスポンスが不正です（${tryCount}回目）:`, res && res.data);
        throw new Error('AI記事生成APIレスポンスが不正です');
      }
      return res.data.choices[0].message.content.trim();
    } catch (e) {
      lastError = e;
      console.error(`AI記事生成APIエラー（${tryCount}回目）:`, e.message);
      if (e.response) {
        console.error('APIレスポンスstatus:', e.response.status);
        console.error('APIレスポンスdata:', JSON.stringify(e.response.data));
        console.error('APIレスポンスheaders:', JSON.stringify(e.response.headers));
      } else if (e.request) {
        console.error('APIリクエスト自体が失敗:', e.request);
      } else {
        console.error('APIリクエスト前のエラー:', e);
      }
      if (tryCount < 3) {
        console.log('2秒待機してリトライします...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  // 3回失敗した場合はエラー終了
  throw new Error('AI記事生成APIリクエストが3回連続で失敗しました: ' + (lastError && lastError.message));
}

// ファイル名生成
function makeFileName(id, title) {
  const date = new Date().toISOString().slice(0, 10);
  // タイトルからファイル名用文字列を生成
  const safeTitle = title.replace(/[\s#\/:*?"<>|\\]/g, '').slice(0, 30);
  return `${id}__${date}-${safeTitle}.md`;
}

// note.com下書き保存用の関数をインポート
const {
  login,
  goToNewPost,
  dragAndDropToAddButton,
  fillArticle,
  saveDraft,
  closeDialogs
} = require('./noteAutoDraftAndSheetUpdate');

// メイン処理
(async () => {
  // 1. 題材ランダム選択
  const topic = topics[Math.floor(Math.random() * topics.length)];
  // 2. 切り口ランダム選択
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  console.log('選ばれた題材:', topic);
  console.log('選ばれた切り口:', pattern);

  // 3. AIで記事生成
  const article = await generateArticle(topic, pattern);
  console.log('AI生成記事全文:\n', article);
  if (!article || article.length < 30) {
    console.error('AI記事生成に失敗、または内容が不十分です。処理を中断します。');
    return;
  }

  // 4. タイトル抽出（# タイトル 形式を強化）
  let title = '無題';
  const titleMatch = article.match(/^#\s*(.+)$/m);
  if (titleMatch && titleMatch[1].trim().length > 0) {
    title = titleMatch[1].trim();
  } else {
    // 先頭行がタイトルでない場合、最初の10文字を仮タイトルに
    title = article.split('\n').find(line => line.trim().length > 0)?.slice(0, 10) || '無題';
  }

  // 5. ID採番
  const id = getNextId();

  // 6. ファイル名生成
  const fileName = makeFileName(id, title);
  const filePath = path.join(POSTS_DIR, fileName);

  // 7. 記事ファイル作成
  fs.writeFileSync(filePath, article, 'utf-8');
  console.log('記事ファイルを作成:', filePath);

  // 8. 記事リライト・チェック（autoRewriteAndCheck.jsを呼び出し）
  // ここで記事IDを使って、作成直後に自動でリライト・追記処理を行う
  try {
    console.log(`記事ID ${id} でautoRewriteAndCheck.jsを実行します...`);
    // execSyncで同期的に実行し、リライト処理が完了するまで待つ
    // stdio: 'inherit' でリライト処理中のログもそのまま表示
    execSync(`node autoRewriteAndCheck.js ${id}`, { stdio: 'inherit' });
    console.log('記事リライト・チェックが完了しました');
  } catch (e) {
    console.error('記事リライト・チェック中にエラー:', e);
  }

  // 9. 投稿一覧管理表.mdに行を追加
  const date = new Date().toISOString().slice(0, 10);
  appendToSheet(id, fileName, title, date);

  // 10. note.comに下書き保存（Puppeteerで自動化）
  // ここからnoteAutoDraftAndSheetUpdate.jsの関数を使って下書き保存まで自動実行
  try {
    console.log('note.comに下書き保存処理を開始します...');
    // CI環境（GitHub Actions等）ではheadless:'new'、ローカルではheadless:falseで切り替え
    const isCI = process.env.CI === 'true';
    const browser = await puppeteer.launch({
      headless: isCI ? 'new' : false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage'
      ]
    });
    const page = await browser.newPage();
    // noteにログイン
    await login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);
    // 新規投稿画面へ遷移
    await goToNewPost(page);
    // サムネイル画像アップロード
    await dragAndDropToAddButton(page);
    // 記事タイトル・本文を入力
    await fillArticle(page, title, article); // articleはAI生成・リライト済み本文
    // 下書き保存
    await saveDraft(page);
    // ダイアログを閉じる
    await closeDialogs(page);
    await browser.close();
    console.log('note.comへの下書き保存が完了しました');
  } catch (e) {
    console.error('note.com下書き保存処理中にエラー:', e);
    // エラー発生時はCIを即終了
    process.exit(1);
  }
})(); 
