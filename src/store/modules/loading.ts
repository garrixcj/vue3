/**
 * Loading 主畫面Loading模組
 */
const state = {
  // 主畫面造成的 Loading
  index: false,
  // #main 各頁造成的 Loading
  page: false,
  // API造成的 Loading
  axios: false,
};
type LoadingState = typeof state;

const getters = {
  // 主頁實際使用的 Loading 為三種 Loading 造成
  mainLoading: (st: LoadingState) => st.index || st.page || st.axios,
};

const mutations = {
  // #main router切換 設定自身 loading
  setIndexLoading: (st: LoadingState, loading: boolean) => {
    st.index = loading;
  },
  // 路由各頁設定自身 loading
  setPageLoading: (st: LoadingState, loading: boolean) => (st.page = loading),
  // API 設定 loading
  setAxiosLoading: (st: LoadingState, loading: boolean) => (st.axios = loading),
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
