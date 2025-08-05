// autoCreateAndDraftNote.js
// 記事を自動で作成し、note.comの下書きに追加するスクリプト
// Puppeteerを利用
// 日本語コメントで説明

const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');
const axios = require('axios');
// const { execSync } = require('child_process');
require('dotenv').config();

// 必須環境変数のチェック
if (!process.env.OPENROUTER_API_KEY) {
  console.error('エラー: OPENROUTER_API_KEY の環境変数が設定されていません。');
  process.exit(1);
}

const API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// 2025/06/25 なぜか認証エラーで使えなくなった
// const MODEL = 'meta-llama/llama-4-maverick:free';

// ↓少し遅いがまあまあ文章作成能力も高そう
const MODEL = 'deepseek/deepseek-chat-v3-0324:free';


// const POSTS_DIR = 'posts';
// const SHEET_PATH = '投稿一覧管理表.md';

// 題材リスト
const topics = [
  '腸活',
  '人間関係',
  '職場の人間関係',
  '恋愛',
  'メンタル',
  '引き寄せの法則',
  '自己肯定感',
  '習慣化',
  'マインドフルネス',
  'HSP(繊細さん)',
  '依存体質の克服法',
  '感情コントロール',
  'SNS疲れ',
  '毒親との関係性',
  'イライラの原因と対処',
  '嫉妬心の乗り越え方',
  '自分軸と他人軸',
  '人に流されない方法',
  '一人の時間の過ごし方',
  'わかってほしい病',
  '無気力・無関心モードのとき',
  '承認欲求の扱い方',
  '怒りの手放し方',
  '感謝できない日の処方箋',
  '親密感への恐れ',
  '曖昧な関係に悩んでる人へ'
];

// 切り口リスト
const patterns = [
  '一歩踏み込んだ理解',
  '具体的な活用方法',
  '楽にする方法',
  'ランキング',
  'ランキング-トップ5',
  'ランキング-トップ5',
  'ランキング-トップ5',
  'まつわるQ&Aまとめ',
  'やってはいけないNG行動',
  '初心者が最初の1週間でやることリスト',
  '専門家に聞いた極意',
  '正しい理解',
  '続けるためのモチベーション維持法',
  'ありがちな勘違いと正しいやり方',
  '成功例・失敗例から学ぶ',
  '絶望ランキング',
  'メンタル崩壊ランキング',
  'やってよかったベスト3',
  '今すぐやめるべき3つの行動',
  '私がどん底から回復するまでにやった5つのこと',
  '読むだけでラクになる話',
  '一番ラクだった方法',
  '科学的に正しい○○の習慣',
  '○○タイプ別の対処法',
  '朝5分でできる○○',
  '「実は逆効果」な○○',
  '見落としがちな○○の落とし穴',
  '○○診断(自己診断チェックリスト)',
  'コミュニケーション苦手な人のための○○講座',
  '「知らなきゃ損!」な裏テク',
  'やって気づいた○○の本当の意味',
  '5年後に差がつく○○',
  'なぜかうまくいく人がやってる習慣',
  '「○○ができない」あなたへ',
  '意識低い系でもできる○○',
  '3日坊主でも続いた○○のコツ',
  '「向いてないかも」と思った時に読む話',
  'モヤモヤを言語化してみた',
  '初心者が陥りがちな○○の落とし穴',
  '親には聞けない○○の話',
  '○○をやめたら人生が軽くなった',
  '忙しくてもできる○○',
  'あなたのための「逃げ方」リスト',
  '○○をやる前に知っておきたい3つのこと'
];

// // 投稿一覧管理表.mdから最新IDを取得
// function getNextId() {
//   const text = fs.readFileSync(SHEET_PATH, 'utf-8');
//   const lines = text.split('\n');
//   let maxId = 0;
//   for (const line of lines) {
//     const m = line.match(/^\|\s*(\d+)\s*\|/);
//     if (m) {
//       const id = parseInt(m[1], 10);
//       if (id > maxId) maxId = id;
//     }
//   }
//   return maxId + 1;
// }

// // 投稿一覧管理表.mdに新しい行を追加
// function appendToSheet(id, fileName, title, date) {
//   const row = `| ${id} | ${fileName} | ${title} | ${date} |  |  |  |  |\n`;
//   let sheet = fs.readFileSync(SHEET_PATH, 'utf-8');

//   // ファイル末尾が改行で終わっていなければ改行を追加
//   if (!sheet.endsWith('\n')) {
//     fs.appendFileSync(SHEET_PATH, '\n' + row, 'utf-8');
//   } else {
//     fs.appendFileSync(SHEET_PATH, row, 'utf-8');
//   }

//   console.log('投稿一覧管理表.mdに行を追加:', row.trim());
// }

// AIで記事生成
async function generateArticle(topic, pattern) {
  const promptLines = [
    'あなたは日本語のnote記事編集者です。以下の題材と切り口でnote記事を1本作成してください。',
    '',
    `題材: ${topic}`,
    `切り口: ${pattern}`,
    '',
    '【条件】',
    '- タイトル、本文、ハッシュタグ（#から始まるもの）を含めてください。',
    '- タイトルは1行目に「# タイトル」として記載してください。',
    '- 本文にはタイトルを含めないでください。',
    '- 本文は見出しや箇条書きも交えて1000文字程度で丁寧にまとめてください。',
    '- ハッシュタグは記事末尾に「#〇〇 #〇〇 ...」の形式でまとめてください。',
    '- あなたはプロのカウンセラーで、プロの編集者です。', // 試しに追加
    '- 読みやすさを重視してください', // 試しに追加
    '- もし題材・切り口を鑑みて可能であればランキング形式にしてください', // 試しに追加
    '- 改行をなるべく多めに入れて、読みやすくしてください。', // 試しに追加
    '- 文章作成時に多めに、たくさん絵文字を使用してください。各行に1つくらいは入れてください。', // 試しに追加
    '- すべて日本語で出力してください。',
    '- 切り口に沿った内容になるようにしてください。',
    '- noteの正しいマークダウン記法のみを使ってください。',
    '- 箇条書きはマークダウンではなく、「・ 」で表現してください。',
    '- 見出しはh2（## 見出し）・h3（### 見出し）のみ。',
    '- 見出しに「**」等は使わないようにしてください。',
    '- 番号付きリストは使わないようにしてください。',
    // '- 箇条書きは「- 」、太字は「**」で囲む、引用は「> 」、コードは「```」で囲む形式のみ使用してください。',
    '- h1（# タイトル）はタイトル行のみで本文中では使わないでください。',
    '- その他のマークダウンやHTMLタグは使わないでください。',
  ];
  const prompt = promptLines.join('\n');

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
      // console.log('AI記事生成APIリクエスト先:', API_URL);
      // console.log('AI記事生成APIリクエストヘッダー:', {
      //   'Authorization': `Bearer ${API_KEY}`,
      //   'Content-Type': 'application/json'
      // });
      // console.log('AI記事生成APIリクエストモデル:', MODEL);
      // APIキーの一部だけ（セキュリティのため）
      if (API_KEY) {
        console.log('API_KEYの先頭6文字:', API_KEY.slice(0, 6), '...（省略）');
      } else {
        console.log('API_KEYが未設定です');
      }

      // 記事生成リクエスト
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

// セクションごとに分割
function splitSections(raw) {
  const parts = raw.split(/^##+ /m); // 2個以上の#で分割
  const firstPart = parts[0];
  const sections = parts.slice(1).map((section) => {
    const lines = section.split('\n');
    const heading = lines[0].trim();
    let body = '';
    for (let i = 1; i < lines.length; i++) {
      if (/^##+ /.test(lines[i]) || lines[i].startsWith('---')) break;
      body += lines[i].trim();
    }
    return { heading, body, raw: section };
  });
  return { firstPart, sections };
}

// 200字未満のセクションをリライト
async function rewriteSection(heading, body, API_URL, API_KEY, MODEL) {
  const prompt = [
    `あなたは女性の心理カウンセラーです。`,
    `以下のnote記事の「${heading}」という見出しの本文が${body.length}文字しかありません。`,
    `200文字以上になるように、実体験や具体例、アドバイスを交えて厚くリライト・追記してください。`,
    ``,
    `【注意】`,
    `- タイトルや見出しは出力せず、本文のみを返してください。`,
    `- 「追加した要素」や「文字数」などのメタ情報は一切出力しないでください。`,
    `- 「CRIPTION:」「】」などの記号や不要な文字列は一切出力しないでください。`,
    `- 文章は話し言葉やカジュアルな表現を避け、できるだけ丁寧な敬語でまとめてください。`,
    `- です。ます。で統一してください。`,
    '- あなたはプロのカウンセラーで、プロの編集者です。', // 試しに追加
    '- 読みやすさを重視してください', // 試しに追加
    '- 改行をなるべく多めに入れて、読みやすくしてください。', // 試しに追加
    '- 文章作成時に多めに、たくさん絵文字を使用してください。各行に1つくらいは入れてください。', // 試しに追加
    '- すべて日本語で出力してください。',
    '- 元々の文章に沿った内容になるようにしてください。',
    '- noteの正しいマークダウン記法のみを使ってください。',
    '- 箇条書きはマークダウンではなく、「・ 」で表現してください。',
    '- 番号付きリストは使わないようにしてください。',
    `- 文章のみを返してください。`,
    `- 文章は日本語で返してください。acency等の英語が混じらないようにしてください。`,
    ``,
    `元の本文: ${body}`
  ].join('\n');
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

// 記事末尾にタグを自動付与
async function generateTagsFromContent(content, API_URL, API_KEY, MODEL) {
  const prompt = `あなたは日本語のnote記事編集者です。以下の記事内容を読み、記事の内容に最も関連するハッシュタグを3～5個、日本語で生成してください。必ず「#引き寄せ #引き寄せの法則 #裏技」を含め、他にも内容に合うタグがあれば追加してください。タグは半角スペース区切りで、本文や説明は一切不要です。\n\n記事内容:\n${content}`;
  const messages = [
    { role: 'system', content: 'あなたは日本語のnote記事編集者です。' },
    { role: 'user', content: prompt }
  ];
  const res = await axios.post(API_URL, {
    model: MODEL,
    messages,
    max_tokens: 100,
    temperature: 0.5
  }, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return res.data.choices[0].message.content.trim();
}

// 200字未満のセクションをリライトし、タグを付与して返す
async function rewriteAndTagArticle(raw, API_URL, API_KEY, MODEL) {
  let { firstPart, sections } = splitSections(raw);
  let updated = false;
  // 200字未満のセクションをリライト
  for (let i = 0; i < sections.length; i++) {
    const { heading, body, raw: sectionRaw } = sections[i];
    if (body.length < 200) {
      console.log(`「${heading}」の本文が${body.length}文字と少なめです。AIでリライトします...`);
      const newBody = await rewriteSection(heading, body, API_URL, API_KEY, MODEL);
      const newBodyWithExtraLine = newBody + '\n';
      const lines = sectionRaw.split('\n');
      lines.splice(1, lines.length - 1, newBodyWithExtraLine);
      sections[i].raw = lines.join('\n');
      updated = true;

      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  // firstPartの末尾に必ず改行を追加
  const safeFirstPart = firstPart.endsWith('\n') ? firstPart : firstPart + '\n';
  let newRaw = safeFirstPart + sections.map(s => '## ' + s.raw).join('\n');
  // 既存タグ行があれば除去
  newRaw = newRaw.replace(/\n# .+$/gm, '');
  // タグ生成
  const tags = await generateTagsFromContent(newRaw, API_URL, API_KEY, MODEL);

  // タグの直前に案内文を追加（腸を温めることについての案内）
  const infoText = [
    '最後までお読みいただき、ありがとうございます！🙇‍♂️🙇‍♂️🙇‍♂️',
    'お仕事や学校での人間関係など、日々の中で心が疲れてしまうこともありますよね。😭',
    '悩みの種類が人それぞれであるように、その解決方法もまた人によって異なります。',
    'ただ、「腸を温めること」は、どんな方にも共通してプラスになる方法だと私は感じています。',
    '',
    '私自身、心が沈んだときに色々な方法を試してきましたが、腸を温めることで体がほぐれ、自然と心も軽くなることが何度もありました。',
    '実際に、腸を温めることは身体の健康だけでなく、メンタルの安定にも効果があると科学的にも証明されているんです。',
    '',
    'どんな方にとっても、まずは自分の「おなか」をいたわることが、健やかな毎日の第一歩になるかもしれません。',
    'リンクを貼っておきますので、「ちょっと試してみようかな」くらいの気持ちで、ぜひ実践してみてくださいね☺️',
    '',
    'https://amzn.to/44hKd5O',
    '',
    'https://amzn.to/40sJeP3',
    ''
  ].join('\n');
  newRaw = newRaw.trim() + '\n\n' + infoText + '\n\n' + tags + '\n';
  return newRaw;
}

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
  // 本文から「タイトルと同じh1行（# タイトル）」をすべて除去する
  const h1TitleLine = `# ${title}`;
  const articleLines = article.split('\n');
  // console.log('【h1タイトル除去デバッグ】');
  console.log('タイトル:', title);
  console.log('h1TitleLine:', JSON.stringify(h1TitleLine));
  // articleLines.forEach((line, idx) => {
  //   if (line.trim() === h1TitleLine) {
  //     console.log(`>> 除去対象: 行${idx + 1}:`, JSON.stringify(line));
  //   } else {
  //     console.log(`   残す: 行${idx + 1}:`, JSON.stringify(line));
  //   }
  // });
  const filteredArticleLines = articleLines.filter(line => line.trim() !== h1TitleLine);
  const filteredArticle = filteredArticleLines.join('\n');
  // console.log('【h1タイトル除去後の本文行リスト】');
  // filteredArticleLines.forEach((line, idx) => {
  //   console.log(`   ${idx + 1}:`, JSON.stringify(line));
  // });

  // 5. 記事リライト・チェック（直接関数で処理）
  let rewrittenArticle = await rewriteAndTagArticle(filteredArticle, API_URL, API_KEY, MODEL);
  console.log('記事リライト・チェックが完了しました');

  // 6. note.comに下書き保存（Puppeteerで自動化）
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
      ],
      defaultViewport: null
    });
    const page = await browser.newPage();
    // noteにログイン
    await login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);
    // 新規投稿画面へ遷移
    await goToNewPost(page);
    // サムネイル画像アップロード
    await dragAndDropToAddButton(page);
    // 記事タイトル・本文を入力
    await fillArticle(page, title, rewrittenArticle); // リライト・タグ付与済み本文
    // 下書き保存
    await saveDraft(page);
    // ダイアログを閉じる
    await closeDialogs(page);
    await browser.close();
    console.log('note.comへの下書き保存が完了しました');
    // 成功時に記事タイトルを表示
    console.log('下書き保存した記事タイトル:', title);
  } catch (e) {
    console.error('note.com下書き保存処理中にエラー:', e);
    // エラー発生時はCIを即終了
    process.exit(1);
  }
})(); 
