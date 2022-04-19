/**
 * Url 網域相關
 */
import { acceptHMRUpdate, defineStore } from 'pinia';
import { operate as operateApi } from '@/api/admin';

type UrlState = {
  hosts: Hosts;
};

type Hosts = {
  [key: string]: string;
};

export const useUrlStore = defineStore('url', {
  state: (): UrlState => ({
    hosts: {},
  }),
  actions: {
    // 定義環境Host
    defineHost() {
      return new Promise((resolve, reject) => {
        operateApi
          .getHost()
          .then(response => {
            if (response.data.result) {
              this.hosts = response.data.data;
            }
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
});

// Pinia HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUrlStore, import.meta.hot));
}
