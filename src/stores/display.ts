/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Display 主畫面顯示相關
 */
import { nextTick } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useOperatorStore } from './operator';

export type DisplayState = {
  mainView: boolean;
  menuCollapse: boolean;
  menuMouseover: boolean;
  windowWidth: number;
  windowHeight: number;
  noScroll: boolean;
  browser: Record<string, boolean>;
};

export const useDisplayStore = defineStore('display', {
  state: (): DisplayState => ({
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
    // 後端回傳瀏覽器設定
    browser: {},
  }),
  getters: {
    // 判斷是否為寰宇瀏覽器
    isUBBrowser: (state: DisplayState) => state.browser.ub,
  },
  actions: {
    // 計算畫面寬高
    resizeWindow() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    },
    // 主畫面顯示重整
    async reloadMainView() {
      this.mainView = false;
      await nextTick();
      this.mainView = true;
    },
    // 主畫面顯示重整(更新權限)
    reloadMainViewWithPermission() {
      this.mainView = false;
      const operatorStore = useOperatorStore();
      operatorStore.checkSession().then(() => {
        this.mainView = true;
      });
    },
  },
});

// Pinia HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDisplayStore, import.meta.hot));
}
