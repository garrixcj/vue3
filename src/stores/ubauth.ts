/**
 * UBAuth 二次驗證相關
 */
import { defineStore } from 'pinia';

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
