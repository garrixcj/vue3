/**
 * UBAuth 二次驗證相關
 */
import { ActionTree } from 'vuex';

const state = {
  // ubauth暫存登入表單資料
  ubauthForm: {},
};
type UBAuthState = typeof state;

const getters = {
  ubauthForm: (st: UBAuthState) => st.ubauthForm,
};

const mutations = {
  // 備份表單
  backupForm(st: UBAuthState, ubauthForm: object) {
    st.ubauthForm = ubauthForm;
  },
};

const actions: ActionTree<UBAuthState, RootState> = {
  // 備份登入資料
  backLogin({ commit }, formdata: object) {
    commit('backupForm', formdata);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
