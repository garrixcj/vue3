/**
 * Menu 側欄選單資料相關
 */
import { acceptHMRUpdate, defineStore } from 'pinia';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { menu as menuApi } from '@/api/admin';

export type MenuState = {
  menu: Menu[];
  visited: number[];
  favorite: number[];
};

export type Menu = {
  readonly id: number;
  children?: Menu[];
  [key: string]: unknown;
};

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    // user menu
    menu: [],
    // 歷史紀錄
    visited: [],
    // 我的最愛
    favorite: [],
  }),
  actions: {
    // // 設定功能巡覽列
    // setMenu() {
    //   menuApi.getMenu().then(response => {
    //     if (response.data.data) {
    //       this.menu = response.data.data;
    //     }
    //   });
    // },
    // // 更新並取得我的最愛
    // getFavorite() {
    //   this.favorite = [];
    //   menuApi.getFavorite().then(response => {
    //     if (response.data.result) {
    //       this.favorite = response.data.data;
    //     }
    //   });
    // },
    // // 設定我的最愛(或排序)
    // setFavorite(data) {
    //   return new Promise((resolve, reject) => {
    //     menuApi.setFavorite(data).then(response => {
    //       if (response.data.result) {
    //         this.favorite = data;
    //         resolve(response);
    //       } else {
    //         reject(response);
    //       }
    //     });
    //   });
    // },
    // // 更新並取得歷史訪問
    // getVisited() {
    //   return new Promise((resolve, reject) => {
    //     menuApi.getLastVisit().then(response => {
    //       if (response.data.result) {
    //         this.visited = response.data.data;
    //         resolve(response);
    //       } else {
    //         reject(response);
    //       }
    //     });
    //   });
    // },
    // // 紀錄歷史訪問(push)
    // setVisited(menuId: number) {
    //   return new Promise((resolve, reject) => {
    //     menuApi.setLastVisit(menuId).then(response => {
    //       if (response.data.result) {
    //         const list = this.visited
    //           .filter(item => item !== menuId)
    //           .slice(0, 4);
    //         this.visited = [menuId, ...list];
    //         resolve(response);
    //       } else {
    //         reject(response);
    //       }
    //     });
    //   });
    // },
  },
});

// Pinia HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot));
}
