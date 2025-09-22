// src/core/NoteAutomationCore.js
// メインの自動化コアクラス

import dotenv from 'dotenv';
import ConfigManager from '../utils/ConfigManager.js';
import Logger from '../utils/Logger.js';
import PuppeteerManager from './PuppeteerManager.js';
import AIContentGenerator from './AIContentGenerator.js';
import NotePublisher from './NotePublisher.js';

// 環境変数を読み込み
dotenv.config();

export default class NoteAutomationCore {
  constructor(configPath = 'config/account.yaml') {
    this.configManager = new ConfigManager(configPath);
    this.logger = new Logger();
    this.puppeteerManager = null;
    this.aiGenerator = null;
    this.notePublisher = null;
  }

  async initialize() {
    try {
      // 設定を読み込み
      await this.configManager.loadConfig();
      this.logger.info('設定を読み込みました');

      // Puppeteerマネージャーを初期化
      this.puppeteerManager = new PuppeteerManager(this.configManager.config);
      await this.puppeteerManager.initialize();
      this.logger.info('Puppeteerマネージャーを初期化しました');

      // AIコンテンツジェネレーターを初期化
      this.aiGenerator = new AIContentGenerator(this.configManager.config);
      this.logger.info('AIコンテンツジェネレーターを初期化しました');

      // Noteパブリッシャーを初期化
      this.notePublisher = new NotePublisher(
        this.configManager.config,
        this.puppeteerManager
      );
      this.logger.info('Noteパブリッシャーを初期化しました');

      return true;
    } catch (error) {
      this.logger.error('初期化に失敗しました:', error);
      throw error;
    }
  }

  async cleanup() {
    if (this.puppeteerManager) {
      await this.puppeteerManager.cleanup();
    }
  }

  // 既存スクリプトとの互換性のためのメソッド
  async runLikeUnlikedNotes(options = {}) {
    return await this.notePublisher.likeUnlikedNotes(options);
  }

  async runAutoPublishNotes(options = {}) {
    return await this.notePublisher.autoPublishNotes(options);
  }

  async runFollowFromArticles(options = {}) {
    return await this.notePublisher.followFromArticles(options);
  }

  async runLikeNotesByUrl(url, options = {}) {
    return await this.notePublisher.likeNotesByUrl(url, options);
  }

  async runAutoCreateAndDraftNote(options = {}) {
    try {
      this.logger.info('記事の自動生成と下書き保存を開始します');
      
      // 題材と切り口をランダム選択
      const topics = this.aiGenerator.getTopics();
      const patterns = this.aiGenerator.getPatterns();
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      
      this.logger.info('選ばれた題材:', topic);
      this.logger.info('選ばれた切り口:', pattern);
      
      // AIで記事生成
      const article = await this.aiGenerator.generateArticle(topic, pattern);
      this.logger.info('AI生成記事全文:', article);
      
      if (!article || article.length < 30) {
        throw new Error('AI記事生成に失敗、または内容が不十分です');
      }
      
      // タイトル抽出
      let originalTitle = '無題';
      const titleMatch = article.match(/^#\s*(.+)$/m);
      if (titleMatch && titleMatch[1].trim().length > 0) {
        originalTitle = titleMatch[1].trim();
      } else {
        // 先頭行がタイトルでない場合、最初の10文字を仮タイトルに
        originalTitle = article.split('\n').find(line => line.trim().length > 0)?.slice(0, 10) || '無題';
      }
      
      // 本文から元のタイトル行（# タイトル）を除去する
      const originalH1TitleLine = `# ${originalTitle}`;
      const articleLines = article.split('\n');
      this.logger.info('元のタイトル:', originalTitle);
      this.logger.info('除去対象h1行:', JSON.stringify(originalH1TitleLine));
      
      const filteredArticleLines = articleLines.filter(line => line.trim() !== originalH1TitleLine);
      const filteredArticle = filteredArticleLines.join('\n');
      
      // タイトルにランダム絵文字を追加
      const title = this.aiGenerator.addRandomEmojiToTitle(originalTitle);
      this.logger.info('最終タイトル:', title);
      
      // 記事の加工・統合（リライト、アフィリエイトリンク、マガジン誘導、タグ付与）
      const processedArticle = await this.aiGenerator.processArticle(filteredArticle);
      this.logger.info('記事の加工が完了しました');
      
      // note.comに下書き保存
      const page = await this.puppeteerManager.createPage();
      
      // ログイン
      await this.notePublisher.login(page, process.env.NOTE_EMAIL, process.env.NOTE_PASSWORD);
      
      // 新規投稿画面へ遷移
      await this.notePublisher.goToNewPost(page);
      
      // 記事タイトル・本文を入力
      await this.notePublisher.fillArticle(page, title, processedArticle);
      
      // 下書き保存
      await this.notePublisher.saveDraft(page);
      
      // ダイアログを閉じる
      await this.notePublisher.closeDialogs(page);
      
      this.logger.info('note.comへの下書き保存が完了しました');
      this.logger.info('下書き保存した記事タイトル:', title);
      
    } catch (error) {
      this.logger.error('記事の自動生成と下書き保存でエラーが発生しました:', error);
      throw error;
    }
  }
}
