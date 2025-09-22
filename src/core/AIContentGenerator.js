// src/core/AIContentGenerator.js
// AIコンテンツ生成クラス

import axios from 'axios';
import Logger from '../utils/Logger.js';

export default class AIContentGenerator {
  constructor(config) {
    this.config = config;
    this.logger = new Logger();
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.model = this.config.ai?.model || 'deepseek/deepseek-chat-v3.1:free';
    this.temperature = this.config.ai?.temperature || 0.7;
    this.maxTokens = this.config.ai?.max_tokens || 1200;
  }

  // 記事生成
  async generateArticle(topic, pattern) {
    const promptLines = [
      'あなたは日本語のnote記事編集者です。以下の題材と切り口でnote記事を1本作成してください。',
      '',
      `題材: ${topic}`,
      `切り口: ${pattern}`,
      '',
      '【条件】',
      '- タイトル、本文、ハッシュタグ（#から始まるもの）を含めてください。',
      '- タイトルは1行目に「# [実際のタイトル]」として記載してください。',
      '- 「# タイトル」という文字列ではなく、実際の記事タイトルを入れてください。',
      '- 本文にはタイトルを含めないでください。',
      '- 本文は見出しや箇条書きも交えて1000文字程度で丁寧にまとめてください。',
      '- ハッシュタグは記事末尾に「#〇〇 #〇〇 ...」の形式でまとめてください。',
      '- あなたはプロのカウンセラーで、プロの編集者です。',
      '- 読みやすさを重視してください',
      '- もし題材・切り口を鑑みて可能であればランキング形式にしてください',
      '- 改行をなるべく多めに入れて、読みやすくしてください。',
      '- 文章作成時に多めに、たくさん絵文字を使用してください。各行に1つくらいは入れてください。',
      '- すべて日本語で出力してください。',
      '- 切り口に沿った内容になるようにしてください。',
      '- noteの正しいマークダウン記法のみを使ってください。',
      '- 箇条書きはマークダウンではなく、「・ 」で表現してください。',
      '- 見出しはh2（## 見出し）・h3（### 見出し）のみ。',
      '- 見出しに「**」等は使わないようにしてください。',
      '- 番号付きリストは使わないようにしてください。',
      '- h1（# タイトル）はタイトル行のみで本文中では使わないでください。',
      '- その他のマークダウンやHTMLタグは使わないでください。',
    ];
    const prompt = promptLines.join('\n');

    const messages = [
      { role: 'system', content: 'あなたは日本語のnote記事編集者です。' },
      { role: 'user', content: prompt }
    ];

    return await this.callAI(messages, this.maxTokens);
  }

  // セクションリライト
  async rewriteSection(heading, body) {
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
      '- あなたはプロのカウンセラーで、プロの編集者です。',
      '- 読みやすさを重視してください',
      '- 改行をなるべく多めに入れて、読みやすくしてください。',
      '- 文章作成時に多めに、たくさん絵文字を使用してください。各行に1つくらいは入れてください。',
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

    return await this.callAI(messages, 600);
  }

  // タグ生成
  async generateTags(content) {
    const prompt = `あなたは日本語のnote記事編集者です。以下の記事内容を読み、記事の内容に最も関連するハッシュタグを3～5個、日本語で生成してください。必ず「#引き寄せ #引き寄せの法則 #裏技 #PR」を含め、他にも内容に合うタグがあれば追加してください。タグは半角スペース区切りで、本文や説明は一切不要です。\n\n記事内容:\n${content}`;
    
    const messages = [
      { role: 'system', content: 'あなたは日本語のnote記事編集者です。' },
      { role: 'user', content: prompt }
    ];

    return await this.callAI(messages, 100, 0.5);
  }

  // AI API呼び出し（共通メソッド）
  async callAI(messages, maxTokens = this.maxTokens, temperature = this.temperature) {
    let tryCount = 0;
    let lastError = null;
    
    while (tryCount < 3) {
      tryCount++;
      
      try {
        this.logger.info(`AI API呼び出し（${tryCount}回目）`);
        
        const response = await axios.post(this.apiUrl, {
          model: this.model,
          messages,
          max_tokens: maxTokens,
          temperature: temperature
        }, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response?.data?.choices?.[0]?.message?.content) {
          throw new Error('AI APIレスポンスが不正です');
        }
        
        return response.data.choices[0].message.content.trim();
      } catch (error) {
        lastError = error;
        this.logger.error(`AI API呼び出しエラー（${tryCount}回目）:`, error.message);
        
        if (tryCount < 3) {
          const backoffMs = 1000 * tryCount;
          this.logger.info(`${backoffMs}ms 待機してリトライします...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }
    
    throw new Error(`AI API呼び出しが3回連続で失敗しました: ${lastError?.message}`);
  }

  // 題材リスト
  getTopics() {
    return [
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
  }

  // 切り口リスト
  getPatterns() {
    return [
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
  }

  // タイトル用絵文字リスト
  getTitleEmojis() {
    return [
      '❤️', '🌸', '🛑', '㊙︎', '🟥', '🈲', '🉐', '⭕', '‼️', '🎉'
    ];
  }

  // タイトルにランダム絵文字を追加する関数
  addRandomEmojiToTitle(title) {
    const randomEmoji = this.getTitleEmojis()[Math.floor(Math.random() * this.getTitleEmojis().length)];
    return `${randomEmoji} ${title}`;
  }

  // アフィリエイトリンクを生成する関数
  generateAffiliateLink() {
    return [
      '',
      '💰　💎　💰　💎　💰　💎　💰　💎　💰　💎　💰　💎　💰　💎　💰',
      'https://amzn.to/4goaSUk',
      '👆引き寄せの法則がわかるおすすめの本です😊コスパ最強です👍',
      '💰　💎　💰　💎　💰　💎　💰　💎　💰　💎　💰　💎　💰　💎　💰',
      '',
    ].join('\n');
  }

  // 記事の最初、中間、最後にアフィリエイトリンクを挿入する関数
  insertAffiliateLinks(content) {
    const affiliateLink = this.generateAffiliateLink();
    
    // 記事を段落に分割
    const paragraphs = content.split('\n\n');
    
    if (paragraphs.length < 3) {
      // 段落が少ない場合は、最初と最後に挿入
      return paragraphs[0] + '\n\n' + affiliateLink + '\n\n' + paragraphs.slice(1).join('\n\n') + '\n\n' + affiliateLink;
    }
    
    // 最初の段落の後にアフィリエイトリンクを挿入
    const firstPart = paragraphs[0] + '\n\n' + affiliateLink;
    
    // 中間の段落を特定（全体の1/3から2/3の位置）
    const middleIndex = Math.floor(paragraphs.length * 0.4);
    const middlePart = paragraphs.slice(1, middleIndex).join('\n\n') + '\n\n' + affiliateLink + '\n\n' + paragraphs.slice(middleIndex, -1).join('\n\n');
    
    // 最後の段落の後にアフィリエイトリンクを挿入
    const lastPart = paragraphs[paragraphs.length - 1] + '\n\n' + affiliateLink;
    
    return [firstPart, middlePart, lastPart].join('\n\n');
  }

  // マガジン誘導セクションを生成する関数
  generateMagazinePromotion() {
    return [
      '🐈　🐾　🐈‍⬛　🐾　🐈　🐾　🐈‍⬛　🐾　🐈　🐾　🐈‍⬛　🐾　🐈　🐾　🐈‍⬛　',
      '',
      '✅「物理的に幸せになるおすすめグッズ達」',
      '',
      '私が皆さんにおすすめしているコスパ抜群のグッズをご紹介しています！',
      '効果テキメンなので皆さん試してみていただけると幸いです😊',
      '',
      '【コスパ抜群の幸せグッズ】',
      '✔ 効果テキメンのアイテム',
      '✔ 実際に使って良かったもの',
      'そんなグッズを厳選してご紹介。',
      '',
      'ぜひ試してみてください！',
      '',
      'https://note.com/counselor_risa/m/m72a580a7e712',
      '',
      '🐈　🐾　🐈‍⬛　🐾　🐈　🐾　🐈‍⬛　🐾　🐈　🐾　🐈‍⬛　🐾　🐈　🐾　🐈‍⬛　',
      ''
    ].join('\n');
  }

  // セクションごとに分割
  splitSections(raw) {
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

  // 記事の加工・統合機能（リライト、アフィリエイトリンク、マガジン誘導、タグ付与）
  async processArticle(raw) {
    let { firstPart, sections } = this.splitSections(raw);
    let updated = false;
    
    // 200字未満のセクションをリライト
    for (let i = 0; i < sections.length; i++) {
      const { heading, body, raw: sectionRaw } = sections[i];
      if (body.length < 200) {
        this.logger.info(`「${heading}」の本文が${body.length}文字と少なめです。AIでリライトします...`);
        try {
          const newBody = await this.rewriteSection(heading, body);
          const newBodyWithExtraLine = newBody + '\n';
          const lines = sectionRaw.split('\n');
          lines.splice(1, lines.length - 1, newBodyWithExtraLine);
          sections[i].raw = lines.join('\n');
          updated = true;
          this.logger.info(`「${heading}」のリライトが完了しました`);
        } catch (e) {
          this.logger.error(`「${heading}」のリライトに失敗しました:`, e.message);
          this.logger.info(`「${heading}」は元の内容のまま処理を継続します`);
          // リライト失敗時は元の内容を保持
        }
        
        // APIリクエストの間に適切な待機時間を設定（レート制限回避）
        if (i < sections.length - 1) {
          this.logger.info('次のセクション処理前に2秒待機します...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    // 記事の最初、中間、最後にアフィリエイトリンクを挿入
    this.logger.info('アフィリエイトリンクを3箇所に挿入します...');
    
    // firstPartの末尾に必ず改行を追加
    const safeFirstPart = firstPart.endsWith('\n') ? firstPart : firstPart + '\n';
    
    // セクションを結合して記事全体を作成
    let articleContent = safeFirstPart + '\n\n' + sections.map(s => '## ' + s.raw).join('\n');
    
    // アフィリエイトリンクを3箇所に挿入
    articleContent = this.insertAffiliateLinks(articleContent);
    
    this.logger.info('アフィリエイトリンク挿入完了');
    this.logger.info('articleContentの長さ:', articleContent.length);
    
    // マガジンへの誘導セクション（リライト処理の成功・失敗に関係なく必ず挿入）
    this.logger.info('マガジン誘導セクションを挿入します...');
    
    const magazinePromotion = this.generateMagazinePromotion();
    
    // 既存タグ行があれば除去
    articleContent = articleContent.replace(/\n# .+$/gm, '');
    
    // タグ生成（失敗時のフォールバック付き）
    let tags = '';
    try {
      this.logger.info('タグ生成を開始します...');
      tags = await this.generateTags(articleContent);
      this.logger.info('タグ生成が完了しました:', tags);
    } catch (e) {
      this.logger.error('タグ生成に失敗しました。フォールバックの固定タグを使用します。理由:', e.message);
      tags = '#人間関係 #メンタル #自己肯定感 #引き寄せ #引き寄せの法則 #裏技 #PR';
    }

    // タグの直前に案内文を追加（日本語コメント付き）
    const infoText = [
      '最後までお読みいただきありがとうございます！💬',
      '継続して、お得な情報を発信していきますので、フォローお願いします！',
    ].join('\n');
    
    // Amazonアソシエイトの適格販売に関する文言を追加
    const amazonAssociateText = 'Amazon のアソシエイトとして、「恋愛・人間関係カウンセラーRisa」は適格販売により収入を得ています。';
    
    const finalContent = articleContent.trim() + '\n\n' + magazinePromotion + '\n\n' + infoText + '\n\n' + amazonAssociateText + '\n\n' + tags + '\n';
    this.logger.info('記事の加工が完了しました。アフィリエイトリンク、マガジン誘導、タグが含まれています。');
    return finalContent;
  }
}
