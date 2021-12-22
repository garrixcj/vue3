/**
 * Permission 登入使用者相關
 */

type PermissionType = {
  [key: string]: { [key: string]: unknown };
};

const state = {
  // user permissions
  permissions: {} as PermissionType,
};
type PermissionState = typeof state;

const getters = {
  permissions: (st: PermissionState) => st.permissions,
  // 檢查權限
  checkPerm: (st: PermissionState) => (name: string) => !!st.permissions[name],
  // 檢查修改權限
  checkModifyPerm: (st: PermissionState) => (name: string) => {
    const perm = st.permissions[name];
    return !!perm?.modify;
  },
  // 取得權限ID陣列
  permissionIds: (st: PermissionState) =>
    Object.keys(st.permissions).map((item) => st.permissions[item].id),
};

const mutations = {
  // 設定權限
  setPermissions(st: PermissionState, perms: {}) {
    st.permissions = perms;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
