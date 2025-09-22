// src/core/NoteAutomationCore.js
// メインの自動化コアクラス

import ConfigManager from '../utils/ConfigManager.js';
import Logger from '../utils/Logger.js';
import PuppeteerManager from './PuppeteerManager.js';
import AIContentGenerator from './AIContentGenerator.js';
import NotePublisher from './NotePublisher.js';

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
    return await this.notePublisher.autoCreateAndDraftNote(options);
  }
}
