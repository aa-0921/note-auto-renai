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
  async generateArticle(topic, pattern, overrides = {}) {
    if (
      !Array.isArray(overrides.articleConditionsLines) ||
      overrides.articleConditionsLines.length === 0
    ) {
      throw new Error(
        'articleConditionsLines が未設定です。各リポジトリ側で記事生成の条件を配列で指定してください。'
      );
    }
    const promptLines = [
      ...overrides.articleConditionsLines,
      '',
      `題材: ${topic}`,
      `切り口: ${pattern}`,
    ];
    const prompt = promptLines.join('\n');

    if (
      typeof overrides.systemMessage !== 'string' ||
      overrides.systemMessage.trim().length === 0
    ) {
      throw new Error(
        'systemMessage が未設定です。各リポジトリ側で system の指示文を指定してください。'
      );
    }
    const messages = [
      { role: 'system', content: overrides.systemMessage },
      { role: 'user', content: prompt },
    ];

    return await this.callAI(messages, this.maxTokens);
  }

  // セクションリライト
  async rewriteSection(heading, body, overrides = {}) {
    if (
      !Array.isArray(overrides.rewriteConditionsLines) ||
      overrides.rewriteConditionsLines.length === 0
    ) {
      throw new Error(
        'rewriteConditionsLines が未設定です。各リポジトリ側でリライト条件を配列で指定してください。'
      );
    }
    const prompt = [
      ...overrides.rewriteConditionsLines,
      '',
      `見出し: ${heading}`,
      `元の本文: ${body}`,
    ].join('\n');

    if (
      typeof overrides.systemMessage !== 'string' ||
      overrides.systemMessage.trim().length === 0
    ) {
      throw new Error(
        'systemMessage が未設定です。各リポジトリ側で system の指示文を指定してください。'
      );
    }
    const messages = [
      { role: 'system', content: overrides.systemMessage },
      { role: 'user', content: prompt },
    ];

    return await this.callAI(messages, 600);
  }

  // タグ生成
  async generateTags(content, overrides = {}) {
    if (
      typeof overrides.tagsInstruction !== 'string' ||
      overrides.tagsInstruction.trim().length === 0
    ) {
      throw new Error(
        'tagsInstruction が未設定です。各リポジトリ側でタグ生成の指示文を指定してください。'
      );
    }
    const prompt = `${overrides.tagsInstruction}\n\n記事内容:\n${content}`;

    if (
      typeof overrides.systemMessage !== 'string' ||
      overrides.systemMessage.trim().length === 0
    ) {
      throw new Error(
        'systemMessage が未設定です。各リポジトリ側で system の指示文を指定してください。'
      );
    }
    const messages = [
      { role: 'system', content: overrides.systemMessage },
      { role: 'user', content: prompt },
    ];

    return await this.callAI(messages, 100, 0.5);
  }

  // AI API呼び出し（共通メソッド）
  async callAI(
    messages,
    maxTokens = this.maxTokens,
    temperature = this.temperature
  ) {
    let tryCount = 0;
    let lastError = null;

    while (tryCount < 3) {
      tryCount++;

      try {
        this.logger.info(`AI API呼び出し（${tryCount}回目）`);

        const response = await axios.post(
          this.apiUrl,
          {
            model: this.model,
            messages,
            max_tokens: maxTokens,
            temperature: temperature,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response?.data?.choices?.[0]?.message?.content) {
          throw new Error('AI APIレスポンスが不正です');
        }

        return response.data.choices[0].message.content.trim();
      } catch (error) {
        lastError = error;
        this.logger.error(
          `AI API呼び出しエラー（${tryCount}回目）:`,
          error.message
        );

        if (tryCount < 3) {
          const backoffMs = 1000 * tryCount;
          this.logger.info(`${backoffMs}ms 待機してリトライします...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }

    throw new Error(
      `AI API呼び出しが3回連続で失敗しました: ${lastError?.message}`
    );
  }

  // タイトルにランダム絵文字を追加する関数
  addRandomEmojiToTitle(title, overrides = {}) {
    if (
      !Array.isArray(overrides.titleEmojis) ||
      overrides.titleEmojis.length === 0
    ) {
      throw new Error(
        'titleEmojis が未設定です。各リポジトリ側でタイトル用絵文字の配列を指定してください。'
      );
    }
    const randomEmoji =
      overrides.titleEmojis[
        Math.floor(Math.random() * overrides.titleEmojis.length)
      ];
    return `${randomEmoji} ${title}`;
  }

  // アフィリエイトリンクを生成する関数
  generateAffiliateLink(overrides = {}) {
    if (
      typeof overrides.affiliateLink !== 'string' ||
      overrides.affiliateLink.length === 0
    ) {
      throw new Error(
        'affiliateLink が未設定です。各リポジトリ側でアフィリエイト文言を指定してください。'
      );
    }
    return overrides.affiliateLink;
  }

  // 記事の最初、中間、最後にアフィリエイトリンクを挿入する関数
  insertAffiliateLinks(content, overrides = {}) {
    const affiliateLink = this.generateAffiliateLink(overrides);

    // 記事を段落に分割
    const paragraphs = content.split('\n\n');

    if (paragraphs.length < 3) {
      // 段落が少ない場合は、最初と最後に挿入
      return (
        paragraphs[0] +
        '\n\n' +
        affiliateLink +
        '\n\n' +
        paragraphs.slice(1).join('\n\n') +
        '\n\n' +
        affiliateLink
      );
    }

    // 最初の段落の後にアフィリエイトリンクを挿入
    const firstPart = paragraphs[0] + '\n\n' + affiliateLink;

    // 中間の段落を特定（全体の1/3から2/3の位置）
    const middleIndex = Math.floor(paragraphs.length * 0.4);
    const middlePart =
      paragraphs.slice(1, middleIndex).join('\n\n') +
      '\n\n' +
      affiliateLink +
      '\n\n' +
      paragraphs.slice(middleIndex, -1).join('\n\n');

    // 最後の段落の後にアフィリエイトリンクを挿入
    const lastPart = paragraphs[paragraphs.length - 1] + '\n\n' + affiliateLink;

    return [firstPart, middlePart, lastPart].join('\n\n');
  }

  // マガジン誘導セクションを生成する関数
  generateMagazinePromotion(overrides = {}) {
    if (
      typeof overrides.magazinePromotion !== 'string' ||
      overrides.magazinePromotion.length === 0
    ) {
      throw new Error(
        'magazinePromotion が未設定です。各リポジトリ側でマガジン誘導文を指定してください。'
      );
    }
    return overrides.magazinePromotion;
  }

  // セクションごとに分割
  splitSections(raw) {
    const parts = raw.split(/^##+ /m); // 2個以上の#で分割
    const firstPart = parts[0];
    const sections = parts.slice(1).map(section => {
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
  async processArticle(raw, overrides = {}) {
    let { firstPart, sections } = this.splitSections(raw);
    let updated = false;

    // 200字未満のセクションをリライト
    for (let i = 0; i < sections.length; i++) {
      const { heading, body, raw: sectionRaw } = sections[i];
      if (body.length < 200) {
        this.logger.info(
          `「${heading}」の本文が${body.length}文字と少なめです。AIでリライトします...`
        );
        try {
          const newBody = await this.rewriteSection(heading, body, overrides);
          const newBodyWithExtraLine = newBody + '\n';
          const lines = sectionRaw.split('\n');
          lines.splice(1, lines.length - 1, newBodyWithExtraLine);
          sections[i].raw = lines.join('\n');
          updated = true;
          this.logger.info(`「${heading}」のリライトが完了しました`);
        } catch (e) {
          this.logger.error(
            `「${heading}」のリライトに失敗しました:`,
            e.message
          );
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
    const safeFirstPart = firstPart.endsWith('\n')
      ? firstPart
      : firstPart + '\n';

    // セクションを結合して記事全体を作成
    let articleContent =
      safeFirstPart + '\n\n' + sections.map(s => '## ' + s.raw).join('\n');

    // アフィリエイトリンクを3箇所に挿入
    articleContent = this.insertAffiliateLinks(articleContent, overrides);

    this.logger.info('アフィリエイトリンク挿入完了');
    this.logger.info('articleContentの長さ:', articleContent.length);

    // マガジンへの誘導セクション（リライト処理の成功・失敗に関係なく必ず挿入）
    this.logger.info('マガジン誘導セクションを挿入します...');

    const magazinePromotion = this.generateMagazinePromotion(overrides);

    // 既存タグ行があれば除去
    articleContent = articleContent.replace(/\n# .+$/gm, '');

    // タグ生成（各リポジトリ必須。失敗時はエラー）
    this.logger.info('タグ生成を開始します...');
    const tags = await this.generateTags(articleContent, overrides);
    this.logger.info('タグ生成が完了しました:', tags);

    // タグの直前に案内文を追加（日本語コメント付き）
    const infoText = [
      '最後までお読みいただきありがとうございます！💬',
      '継続して、お得な情報を発信していきますので、フォローお願いします！',
    ].join('\n');

    // Amazonアソシエイトの適格販売に関する文言（各リポジトリ必須）
    if (
      typeof overrides.amazonAssociateText !== 'string' ||
      overrides.amazonAssociateText.trim().length === 0
    ) {
      throw new Error(
        'amazonAssociateText が未設定です。各リポジトリ側で文言を指定してください。'
      );
    }
    const amazonAssociateText = overrides.amazonAssociateText;

    const finalContent =
      articleContent.trim() +
      '\n\n' +
      magazinePromotion +
      '\n\n' +
      infoText +
      '\n\n' +
      amazonAssociateText +
      '\n\n' +
      tags +
      '\n';
    this.logger.info(
      '記事の加工が完了しました。アフィリエイトリンク、マガジン誘導、タグが含まれています。'
    );
    return finalContent;
  }
}
