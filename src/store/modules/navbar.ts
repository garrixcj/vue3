/**
 * Navbar 巡覽列相關
 */
import exportApi from '@/api/export';
import { ActionTree } from 'vuex';
const state = {
  // 下載專區數量
  downloadCounter: 0,
};
type NavbarState = typeof state;

const getters = {
  downloadCounter: (st: NavbarState) => st.downloadCounter,
};

const mutations = {
  // 更新下載專區數量
  setDownloadCounter(st: NavbarState, count: number) {
    st.downloadCounter = count;
  },
};

const actions: ActionTree<NavbarState, RootState> = {
  // 更新下載專區數量
  updateDownloadCounter({ commit }) {
    exportApi.getDownloadable().then(response => {
      if (response.data.result) {
        commit('setDownloadCounter', response.data.data);
      }
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
