/**
 * Menu 側欄選單資料相關
 */
import { menu as menuApi } from '@/api/admin';
// import menuExt from '~/pages/menu.json';
import type { ActionTree } from 'vuex';

const state = {
  menu: [], // user menu
  visited: [] as Array<string | number>, // 歷史紀錄
  favorite: [] as Array<string | number>, // 我的最愛
};
type MenuState = typeof state;

const getters = {
  menu: (st: MenuState) => st.menu,
  visited: (st: MenuState) => st.visited,
  favorite: (st: MenuState) => st.favorite,
};

const mutations = {
  // 設定我的最愛
  setFavorite(st: MenuState, data: []) {
    st.favorite = data;
  },
  // 設定功能巡覽列
  setMenu(st: MenuState, menu: []) {
    st.menu = menu;
  },
  // 設定歷史訪問紀錄
  setVisited(st: MenuState, data: []) {
    st.visited = data;
  },
};

const actions: ActionTree<MenuState, RootState> = {
  // 設定功能巡覽列
  setMenu({ commit }) {
    menuApi.getMenu().then(resp => {
      if (resp.data.data) {
        commit('setMenu', resp.data.data);
      }
    });
  },
  // 更新並取得我的最愛
  getFavorite({ commit }) {
    commit('setFavorite', []);
    menuApi.getFavorite().then(resp => {
      if (resp.data.result) {
        commit('setFavorite', resp.data.data);
      }
    });
  },
  // 設定我的最愛(或排序)
  setFavorite({ commit }, data) {
    return new Promise((resolve, reject) => {
      menuApi.setFavorite(data).then(resp => {
        if (resp.data.result) {
          commit('setFavorite', data);
          resolve(resp);
        } else {
          reject(resp);
        }
      });
    });
  },
  // 更新並取得歷史訪問
  getVisited({ commit }) {
    return new Promise((resolve, reject) => {
      menuApi.getLastVisit().then(resp => {
        if (resp.data.result) {
          commit('setVisited', resp.data.data);
          resolve(resp);
        } else {
          reject(resp);
        }
      });
    });
  },
  // 紀錄歷史訪問(push)
  setVisited({ commit }, menuId: number) {
    return new Promise((resolve, reject) => {
      menuApi.setLastVisit(menuId).then(resp => {
        if (resp.data.result) {
          const list = state.visited
            .filter(item => item !== menuId)
            .slice(0, 4);
          commit('setVisited', [menuId, ...list]);
          resolve(resp);
        } else {
          reject(resp);
        }
      });
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
