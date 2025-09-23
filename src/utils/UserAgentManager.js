// src/utils/UserAgentManager.js
// ランダムなUser-Agentを生成するモジュール

const userAgents = [
  // Windows Chrome
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',

  // Windows Firefox
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0',

  // Windows Edge
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',

  // macOS Chrome
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',

  // macOS Safari
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',

  // macOS Firefox
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',

  // Linux Chrome
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',

  // Linux Firefox
  'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',

  // Mobile Chrome (Android)
  'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',

  // Mobile Safari (iOS)
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
];

export default class UserAgentManager {
  /**
   * ランダムなUser-Agentを取得する
   * @returns {string} ランダムなUser-Agent文字列
   */
  static getRandomUserAgent() {
    const randomIndex = Math.floor(Math.random() * userAgents.length);
    return userAgents[randomIndex];
  }

  /**
   * 特定のOS/ブラウザのUser-Agentを取得する
   * @param {string} type - 'chrome', 'firefox', 'safari', 'mobile' など
   * @returns {string} 指定されたタイプのUser-Agent文字列
   */
  static getUserAgentByType(type) {
    const filteredAgents = userAgents.filter(agent => {
      switch (type.toLowerCase()) {
      case 'chrome':
        return agent.includes('Chrome') && !agent.includes('Edg');
      case 'firefox':
        return agent.includes('Firefox');
      case 'safari':
        return agent.includes('Safari') && !agent.includes('Chrome');
      case 'edge':
        return agent.includes('Edg');
      case 'mobile':
        return (
          agent.includes('Mobile') ||
            agent.includes('iPhone') ||
            agent.includes('iPad')
        );
      case 'windows':
        return agent.includes('Windows');
      case 'macos':
        return agent.includes('Macintosh');
      case 'linux':
        return agent.includes('Linux') && !agent.includes('Android');
      default:
        return true;
      }
    });

    if (filteredAgents.length === 0) {
      return this.getRandomUserAgent();
    }

    const randomIndex = Math.floor(Math.random() * filteredAgents.length);
    return filteredAgents[randomIndex];
  }
}

// 既存コードとの互換性のための関数エクスポート
export const getRandomUserAgent = UserAgentManager.getRandomUserAgent;
export const getUserAgentByType = UserAgentManager.getUserAgentByType;
export { userAgents };
