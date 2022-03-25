/**
 * Url 網域相關
 */
import { operate as operateApi } from '@/api/admin';
import type { ActionTree } from 'vuex';

const state = {
  // 網域
  hosts: {},
};
type UrlState = typeof state;

const getters = {
  hosts: (st: UrlState) => st.hosts,
};

const mutations = {
  // 設定網域
  setHosts(st: UrlState, hosts: object) {
    st.hosts = hosts;
  },
};

const actions: ActionTree<UrlState, RootState> = {
  // 定義環境Host
  defineHost({ commit }) {
    return new Promise((resolve, reject) => {
      operateApi
        .getHost()
        .then(resp => {
          if (resp.data.result) {
            commit('setHosts', resp.data.data);
          }
          resolve(resp);
        })
        .catch(err => {
          reject(err);
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
