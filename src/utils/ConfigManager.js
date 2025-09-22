// src/utils/ConfigManager.js
// 設定管理クラス

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class ConfigManager {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = null;
    this.defaultConfigPath = path.join(__dirname, '../../configs/defaults');
  }

  async loadConfig() {
    try {
      // デフォルト設定を読み込み
      const defaultConfig = await this.loadDefaultConfig();
      
      // アカウント固有設定を読み込み
      const accountConfig = await this.loadAccountConfig();
      
      // 設定をマージ（アカウント設定が優先）
      this.config = this.mergeConfigs(defaultConfig, accountConfig);
      
      return this.config;
    } catch (error) {
      throw new Error(`設定の読み込みに失敗しました: ${error.message}`);
    }
  }

  async loadDefaultConfig() {
    const accountYaml = path.join(this.defaultConfigPath, 'account.yaml');
    const scheduleYaml = path.join(this.defaultConfigPath, 'schedule.yaml');
    
    const accountConfig = yaml.load(fs.readFileSync(accountYaml, 'utf8'));
    const scheduleConfig = yaml.load(fs.readFileSync(scheduleYaml, 'utf8'));
    
    return {
      ...accountConfig,
      schedule: scheduleConfig
    };
  }

  async loadAccountConfig() {
    if (!fs.existsSync(this.configPath)) {
      console.warn(`設定ファイルが見つかりません: ${this.configPath}`);
      return {};
    }
    
    const content = fs.readFileSync(this.configPath, 'utf8');
    return yaml.load(content) || {};
  }

  mergeConfigs(defaultConfig, accountConfig) {
    // 深いマージを実行
    const merged = { ...defaultConfig };
    
    for (const key in accountConfig) {
      if (accountConfig[key] && typeof accountConfig[key] === 'object' && !Array.isArray(accountConfig[key])) {
        merged[key] = this.mergeConfigs(merged[key] || {}, accountConfig[key]);
      } else {
        merged[key] = accountConfig[key];
      }
    }
    
    return merged;
  }

  get(key, defaultValue = null) {
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  }
}
