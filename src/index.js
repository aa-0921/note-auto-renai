// note-automation-core/src/index.js
// 共通のnote自動化ライブラリのメインエントリーポイント

// コア機能のエクスポート
export { default as NoteAutomationCore } from './core/NoteAutomationCore.js';
export { default as PuppeteerManager } from './core/PuppeteerManager.js';
export { default as AIContentGenerator } from './core/AIContentGenerator.js';
export { default as NotePublisher } from './core/NotePublisher.js';

// ユーティリティのエクスポート
export { default as ConfigManager } from './utils/ConfigManager.js';
export { default as Logger } from './utils/Logger.js';
export { default as UserAgentManager } from './utils/UserAgentManager.js';
export { default as runWithCore } from './utils/runWithCore.js';
export { runWithCore as bootstrapWithCore } from './utils/runWithCore.js';

// 設定のエクスポート
export { default as DefaultConfigs } from './config/DefaultConfigs.js';

// 個別機能のエクスポート（既存スクリプトとの互換性のため）
export {
  login,
  goToNewPost,
  fillArticle,
  saveDraft,
  closeDialogs
} from './core/NotePublisher.js';

export {
  getRandomUserAgent,
  getUserAgentByType
} from './utils/UserAgentManager.js';

// デフォルトエクスポート（メインクラス）
export { default } from './core/NoteAutomationCore.js';
