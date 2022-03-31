/**
 * Cookie cookie相關
 */
import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { useI18n } from 'vue-i18n';

// cookie domain
const domain = window.location.hostname.split('.').splice(-2).join('.');

// to Lang Code Standard
const switchLang = (lang: string | null) => {
  const op = lang ? lang.toLowerCase() : '';
  switch (op) {
    // 英文
    case 'en':
    case 'en-us':
    case 'us':
      return 'en';
    // 繁中
    case 'zh-tw':
    case 'tw':
    case 'big5':
      return 'zh-tw';
    // 簡中
    case 'zh-cn':
    case 'cn':
    case 'gb':
      return 'zh-cn';
    // 泰文
    case 'th':
      return 'th';
    // 日文
    case 'ja':
    case 'jp':
    case 'euc-jp':
      return 'ja';
    // 韓文
    case 'ko':
    case 'kr':
    case 'euc-kr':
      return 'ko';
    // 越南文
    case 'vi':
    case 'vn':
      return 'vi';
    default:
      return 'zh-cn';
  }
};

type CookieState = {
  sid: string | null;
  connectSid: string | null;
  langx: string | null;
  langcode: string | null;
};

export const useCookieStore = defineStore('cookie', {
  state: (): CookieState => ({
    // session id
    // 管端專用 & 其他單位畫面用 for same hostname
    sid: Cookies.get('sid') || null,
    // 控端
    connectSid: Cookies.get('connect.sid') || null,
    // locale
    langx: Cookies.get('langx') || null,
    langcode: Cookies.get('langcode') || null,
  }),
  getters: {
    lang: (state: CookieState) =>
      state.langcode ? switchLang(state.langcode) : switchLang(state.langx),
  },
  actions: {
    // 存取 session，更新 cookie
    updateSid(value: string | null) {
      if (value) {
        this.sid = value;
        this.connectSid = value;
        Cookies.set('sid', value, { domain });
        Cookies.set('connect.sid', value, { domain });
      } else {
        this.sid = null;
        this.connectSid = null;
        Cookies.remove('sid', { domain });
        Cookies.remove('connect.sid', { domain });
      }
    },
    // 存取語系，更新 cookie 及 i18n 當前語系
    updateLang(value: string) {
      if (value) {
        const lang = switchLang(value);
        this.langx = lang;
        this.langcode = lang;
        Cookies.set('langx', lang, { domain });
        Cookies.set('langcode', lang, { domain });

        const { locale } = useI18n({ useScope: 'global' });
        locale.value = lang;
      } else {
        this.langx = null;
        this.langcode = null;
        Cookies.remove('langx', { domain });
        Cookies.remove('langcode', { domain });
      }
    },
  },
});
