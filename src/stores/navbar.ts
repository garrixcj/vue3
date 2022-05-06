/**
 * Navbar 巡覽列相關
 */
import { acceptHMRUpdate, defineStore } from 'pinia';
import exportApi from '@/api/export';

export type NavbarState = {
  downloadCounter: number;
};

export const useNavbarStore = defineStore('navbar', {
  state: (): NavbarState => ({
    // 下載專區數量
    downloadCounter: 0,
  }),
  actions: {
    // // 更新下載專區數量
    // updateDownloadCounter() {
    //   exportApi.getDownloadable().then(response => {
    //     if (response.data.result) {
    //       this.downloadCounter = response.data.data;
    //     }
    //   });
    // },
  },
});

// Pinia HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNavbarStore, import.meta.hot));
}
