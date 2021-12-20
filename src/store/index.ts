import { createStore, ActionTree } from 'vuex';
import cookie from './modules/cookie';
// TODO Next-Feature 主畫面控制板
// import display from "./modules/display";
import loading from './modules/loading';
// TODO Next-Feature Menu功能
// import menu from "./modules/menu";
// TODO Next-Feature NavBar功能
// import navbar from "./modules/navbar";
// TODO Next-Feature 登入
// import operator from "./modules/operator";
import permission from './modules/permission';
// TODO Next-Feature UBAUTH登入
// import ubauth from "./modules/ubauth";
// TODO Next-Feature host
// import url from "./modules/url";
import websocket from './modules/websocket';

const state = {
  ENV: null,
  ios: () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
  firebaseAnalytics: {},
};

const getters = {
  ENV: (st: RootState) => st.ENV,
  // todo ios 確定用途後放置對應的 module
  ios: () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
  firebaseAnalytics: (st: RootState) => st.firebaseAnalytics,
};

const mutations = {
  setENV(st: RootState, env: object) {
    st.ENV = env;
  },
  // todo firebase 盤點完拆 module
  setFirebaseAnalytics(st: RootState, sample: object) {
    st.firebaseAnalytics = sample;
  },
};

// 快捷動作
const actions: ActionTree<RootState, RootState> = {
  // backupSid({ dispatch }) {
  //   return dispatch("operator/backupSid");
  // },
  // checkSession({ dispatch }) {
  //   return dispatch("operator/checkSession");
  // }
};

export default createStore({
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  mutations,
  actions,
  modules: {
    cookie,
    // display,
    loading,
    // menu,
    // navbar,
    // operator,
    permission,
    // ubauth,
    // url,
    websocket,
  },
});
