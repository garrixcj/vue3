/**
 * Loading 主畫面Loading模組
 */
import { defineStore } from 'pinia';

type LoadingState = {
  index: boolean;
  page: boolean;
  axios: boolean;
};

export const useLoadingStore = defineStore('loading', {
  state: (): LoadingState => ({
    // 主畫面造成的 Loading
    index: false,
    // #main 各頁造成的 Loading
    page: false,
    // API造成的 Loading
    axios: false,
  }),
  getters: {
    // 主頁實際使用的 Loading 為三種 Loading 造成
    mainLoading: (state: LoadingState) =>
      state.index || state.page || state.axios,
  },
});
