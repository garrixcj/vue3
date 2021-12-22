/**
 * Display 主畫面顯示相關
 */
import { nextTick } from 'vue';
import { ActionTree } from 'vuex';

const state = {
  // 主畫面顯示
  mainView: true,
  // Menu 側欄縮合
  menuCollapse: false,
  // Menu 側欄滑鼠滑入
  menuMouseover: false,
  // 畫面最大 width
  windowWidth: 0,
  // 畫面最大 height
  windowHeight: 0,
  // main page 不使用scrollbar
  noScroll: false,
};
type DisplayState = typeof state;

const getters = {
  mainView: (st: DisplayState) => st.mainView,
  menuCollapse: (st: DisplayState) => st.menuCollapse,
  menuMouseover: (st: DisplayState) => st.menuMouseover,
  windowWidth: (st: DisplayState) => st.windowWidth,
  windowHeight: (st: DisplayState) => st.windowHeight,
  noScroll: (st: DisplayState) => st.noScroll,
};

const mutations = {
  // 設定主畫面顯示
  setMainView(st: DisplayState, show: boolean) {
    st.mainView = show;
  },
  // 縮合左側巡覽列
  collapseMenu(st: DisplayState, collapse: boolean) {
    st.menuCollapse = collapse;
  },
  // 滑鼠滑入左側巡覽列
  mouseoverMenu(st: DisplayState, mouseover: boolean) {
    st.menuMouseover = mouseover;
  },
  // 設定畫面最大寬度
  setWindowWidth(st: DisplayState, width: number) {
    st.windowWidth = width;
  },
  // 設定畫面最大高度
  setWindowHeight(st: DisplayState, height: number) {
    st.windowHeight = height;
  },
  // 設定不滑動
  setNoScroll(st: DisplayState, noScroll: boolean) {
    st.noScroll = noScroll;
  },
};

const actions: ActionTree<DisplayState, RootState> = {
  // 計算畫面寬高
  resizeWindow({ commit }) {
    commit('setWindowWidth', window.innerWidth);
    commit('setWindowHeight', window.innerHeight);
  },
  // 主畫面顯示重整
  async reloadMainView({ commit }) {
    commit('setMainView', false);
    await nextTick();
    commit('setMainView', true);
  },
  // 主畫面顯示重整(更新權限)
  reloadMainViewWithPermission({ commit, dispatch }) {
    commit('setMainView', false);
    dispatch('checkSession', null, { root: true }).then(() => {
      commit('setMainView', true);
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
