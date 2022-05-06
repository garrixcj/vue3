/**
 * Permission 登入使用者相關
 */
import { acceptHMRUpdate, defineStore } from 'pinia';

export type PermissionState = {
  permissions: Permissions;
};

export type Permissions = {
  [key: string]: Permission;
};

export type Permission = {
  readonly id: number;
  modify: boolean;
  [key: string]: unknown;
};

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    // user permissions
    permissions: {},
  }),
  getters: {
    // 取得權限ID陣列
    permissionIds: (state: PermissionState) =>
      Object.values(state.permissions).map(item => item.id),
  },
  actions: {
    // 檢查權限
    checkPerm(name: string) {
      return !!(this.permissions as Permissions)[name];
    },
    // 檢查修改權限
    checkModifyPerm(name: string) {
      const perm = (this.permissions as Permissions)[name];
      return !!perm.modify;
    },
  },
});

// Pinia HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermissionStore, import.meta.hot));
}
