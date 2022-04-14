/**
 * UBAuth 二次驗證相關
 */
import { acceptHMRUpdate, defineStore } from 'pinia';

type UbAuthState = {
  ubauthForm: UbAuthForm;
};

type UbAuthForm = {
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
if (module.hot) {
  module.hot.accept(acceptHMRUpdate(useUbAuthStore, module.hot));
}
