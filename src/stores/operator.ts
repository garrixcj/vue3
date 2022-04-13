/**
 * Operator 登入使用者相關
 */
import { acceptHMRUpdate, defineStore } from 'pinia';
import sessionApi from '@/api/session';
import { useCookieStore } from './cookie';
import { usePermissionStore } from './permission';
import { useUbAuthStore } from './ubauth';

type OperatorState = {
  operator: Operator;
  sidBak: string | null;
};

type Operator = {
  readonly id: number | string;
  readonly username: string;
  readonly alias: string;
  [key: string]: unknown;
};

export const useOperatorStore = defineStore('operator', {
  state: (): OperatorState => ({
    // user origin object
    operator: {} as Operator,
    // Sid備份
    sidBak: '',
  }),
  actions: {
    // // 登入
    // login(formData) {
    //   return new Promise((resolve, reject) => {
    //     const cookieStore = useCookieStore();
    //     const ubAuthStore = useUbAuthStore();
    //     sessionApi
    //       .login(formData)
    //       .then(response => {
    //         if (
    //           response.data.result &&
    //           response.data.data.login_result === '27' &&
    //           typeof response.data.data.qrcode === 'undefined'
    //         ) {
    //           // 二次驗證
    //           ubAuthStore.ubauthForm = formData;
    //         } else if (
    //           response.data.result &&
    //           response.data.data.login_result !== '27'
    //         ) {
    //           // 一般登入
    //           cookieStore.updateSid(response.data.data.sid);
    //         }
    //         resolve(response);
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // },
    // // 登出
    // logout() {
    //   return new Promise((resolve, reject) => {
    //     const cookieStore = useCookieStore();
    //     sessionApi
    //       .logout()
    //       .then(response => {
    //         cookieStore.updateSid(null);
    //         this.operator = {} as Operator;
    //         resolve(response);
    //       })
    //       .catch(error => {
    //         cookieStore.updateSid(null);
    //         this.operator = {} as Operator;
    //         reject(error);
    //       });
    //   });
    // },
    // // 確認登入狀態
    // checkSession() {
    //   return new Promise((resolve, reject) => {
    //     const permissionStore = usePermissionStore();
    //     sessionApi
    //       .getSession()
    //       .then(response => {
    //         if (response.data.result) {
    //           this.operator = response.data.data.user;
    //           permissionStore.permissions = response.data.data.permissions;
    //         } else {
    //           this.operator = {} as Operator;
    //           permissionStore.permissions = {};
    //         }
    //         resolve(response);
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // },
    // 備份 sid
    backupSid() {
      const cookieStore = useCookieStore();
      const sid = cookieStore.sid;
      this.sidBak = sid;
      cookieStore.sid = '';
    },
    // 回填備份的 sid
    fillBackupSid() {
      const cookieStore = useCookieStore();
      cookieStore.sid = this.sidBak;
    },
  },
});

// Pinia HMR
if (module.hot) {
  module.hot.accept(acceptHMRUpdate(useOperatorStore, module.hot));
}
