/**
 * Cookie cookie相關
 */
import Cookies from 'js-cookie';

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
    // 印尼
    case 'id':
      return 'id';
    // 西班牙
    case 'es':
      return 'es';
    default:
      return 'zh-cn';
  }
};

const state = {
  // session id
  // 管端專用 & 其他單位畫面用 for same hostname
  sid: Cookies.get('sid') || null,
  // 控端
  connectSid: Cookies.get('connect.sid') || null,
  // locale
  langx: Cookies.get('langx') || null,
  langcode: Cookies.get('langcode') || null,
};
type CookieState = typeof state;

const getters = {
  sid: (st: CookieState) => st.sid,
  lang: (st: CookieState) =>
    st.langcode ? switchLang(st.langcode) : switchLang(st.langx),
};

const mutations = {
  // 存取 session，更新cookie
  updateSid(st: CookieState, value: string) {
    if (value) {
      st.sid = value;
      st.connectSid = value;
      Cookies.set('sid', value, { domain });
      Cookies.set('connect.sid', value, { domain });
    } else {
      st.sid = null;
      st.connectSid = null;
      Cookies.remove('sid', { domain });
      Cookies.remove('connect.sid', { domain });
    }
  },
  // 存取語系，更新cookie
  updateLang(st: CookieState, value: string) {
    if (value) {
      const lang = switchLang(value);
      st.langx = lang;
      st.langcode = lang;
      Cookies.set('langx', lang, { domain });
      Cookies.set('langcode', lang, { domain });
    } else {
      st.langx = null;
      st.langcode = null;
      Cookies.remove('langx', { domain });
      Cookies.remove('langcode', { domain });
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
