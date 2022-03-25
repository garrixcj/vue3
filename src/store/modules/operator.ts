/**
 * Operator 登入使用者相關
 */
import sessionApi from '@/api/session';
import type { ActionTree } from 'vuex';

const state = {
  // user origin object
  operator: {},
  // Sid備份
  backupSid: '',
};
type OperatorState = typeof state;

const getters = {
  operator: (st: OperatorState) => st.operator,
  backupSid: (st: OperatorState) => st.backupSid,
};

const mutations = {
  // 設定操作者資訊
  setUser(st: OperatorState, user: object) {
    st.operator = user;
  },
  // 設定備份sid (驗證暫存)
  setBackupSid(st: OperatorState, data: string) {
    st.backupSid = data;
  },
};

const actions: ActionTree<OperatorState, RootState> = {
  // 登入
  login({ commit, dispatch }, formdata) {
    return new Promise((resolve, reject) => {
      sessionApi
        .login(formdata)
        .then(response => {
          if (
            response.data.result &&
            response.data.data.login_result === '27' &&
            typeof response.data.data.qrcode === 'undefined'
          ) {
            // 二次驗證
            dispatch('ubauth/backLogin', formdata, { root: true });
          } else if (
            response.data.result &&
            response.data.data.login_result !== '27'
          ) {
            // 一般登入
            commit('cookie/updateSid', response.data.data.sid, { root: true });
          }
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  // 登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      sessionApi
        .logout()
        .then(response => {
          commit('cookie/updateSid', null, { root: true });
          commit('setUser', null);
          resolve(response);
        })
        .catch(error => {
          commit('cookie/updateSid', null, { root: true });
          commit('setUser', null);
          reject(error);
        });
    });
  },
  // 確認登入狀態
  checkSession({ commit }) {
    return new Promise((resolve, reject) => {
      sessionApi
        .getSession()
        .then(response => {
          if (response.data.result) {
            commit('setUser', response.data.data.user);
            commit(
              'permission/setPermissions',
              response.data.data.permissions,
              { root: true },
            );
          } else {
            commit('setUser', null);
            commit('permission/setPermissions', null, { root: true });
          }
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  // 備份 sid
  backupSid({ commit, rootGetters }) {
    const sid = rootGetters['cookie/sid'];
    commit('setBackupSid', sid);
    commit('cookie/updateSid', '', { root: true });
  },
  // 回填備份的 sid
  fillBackupSid({ commit, getters }) {
    commit('cookie/updateSid', getters.backupSid, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
