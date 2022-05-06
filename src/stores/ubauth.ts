/**
 * UBAuth 二次驗證相關
 */
import { acceptHMRUpdate, defineStore } from 'pinia';

export type UbAuthState = {
  ubauthForm: UbAuthForm;
};

export type UbAuthForm = {
  gm_username: string;
  gm_password: string;
};

export const useUbAuthStore = defineStore('ubauth', {
  state: (): UbAuthState => ({
    // ubauth暫存登入表單資料
    ubauthForm: {} as UbAuthForm,
  }),
});

// Pinia HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUbAuthStore, import.meta.hot));
}
