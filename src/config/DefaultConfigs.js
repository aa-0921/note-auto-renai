// src/config/DefaultConfigs.js
// デフォルト設定の管理

export default class DefaultConfigs {
  static getAccountConfig() {
    return {
      genre: "renai",
      locale: "ja-JP",
      posting: {
        time_window: ["09:00", "11:00"],
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"]
      },
      ai: {
        provider: "openrouter",
        model: "deepseek/deepseek-chat-v3.1:free",
        temperature: 0.7,
        max_tokens: 1200
      },
      note: {
        login_method: "email_password",
        cookie_secret_name: "NOTE_COOKIE"
      },
      // 検索ワードはアカウント側スクリプトから options.searchWords で注入
      sheets: {
        enabled: true,
        doc_id: "",
        worksheet: "posts"
      },
      overrides: {
        seasonal_topic: "恋愛・人間関係",
        tags: ["#人間関係", "#メンタル", "#自己肯定感", "#引き寄せ", "#引き寄せの法則", "#裏技", "#PR"]
      }
    };
  }

  static getScheduleConfig() {
    return {
      scripts: {
        likeUnlikedNotes: {
          frequency: "daily",
          time_offset: 0,
          max_likes: 24
        },
        autoPublishNotes: {
          frequency: "weekdays",
          time_offset: 5,
          post_limit: 1
        },
        followFromArticles: {
          frequency: "weekly",
          time_offset: 10,
          max_follows: 15
        },
        likeNotesByUrl: {
          frequency: "daily",
          time_offset: 15,
          max_likes: 50,
          urls: [
            "https://note.com/counselor_risa",
            "https://note.com/investment_happy",
            "https://note.com/enginner_skill"
          ]
        }
      }
    };
  }
}
