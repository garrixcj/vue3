import { pick } from 'lodash';
import http from '@/http/http';
import multiHttp from '@/http/multi';
// 靜態等偽裝api回傳資料 等待api功能
// import routeJson from './route.json';
// import menuJson from './menu.json';
// import { addProxyRoute, addProxyMenu } from './route-proxy';

// const routes = { data: { data: addProxyRoute(routeJson), result: true } };
// const menus = { data: { data: addProxyMenu(menuJson), result: true } };

/**
 * 控端專用 API
 */

/**
 * 選單相關
 */
export const menu = {
  http,
  // /**
  //  * 取得控端route
  //  * @method get
  //  * @return {Array}
  //  */
  // getRoute: () =>
  //   new Promise<typeof routes>(resolve => {
  //     resolve(routes);
  //   }),
  // /**
  //  * 取得控端menu
  //  * @method get
  //  * @return {Array}
  //  */
  // getMenu: () =>
  //   new Promise<typeof menus>(resolve => {
  //     resolve(menus);
  //   }),
  // /**
  //  * 取得我的最愛
  //  * @method get
  //  * @return {Array}
  //  */
  // getFavorite() {
  //   return this.http.get('/admin/my/favorite');
  // },
  // /**
  //  * 設定我的最愛
  //  * @param {Array} favorite_menu 排序我的最愛 ?
  //  */
  // setFavorite(favorite_menu: []) {
  //   return this.http.put('/admin/my/favorite', {
  //     favorite_menu,
  //   });
  // },
  // /**
  //  * 取得歷史紀錄
  //  */
  // getLastVisit() {
  //   return this.http.get('/admin/my/visited');
  // },
  // /**
  //  * 設定歷史紀錄
  //  * @param {number} perm_id
  //  */
  // setLastVisit(perm_id: number) {
  //   return this.http.put('/admin/my/visited', { perm_id });
  // },
};

/**
 * 控端環境相關、自身操作資料(operator)
 */
export const operate = {
  http,
  /**
   * 取得線上會員人數
   */
  getOnlineMember() {
    return this.http.get('/admin/onlineMember');
  },
  // /**
  //  * 取得Host env
  //  */
  // getHost() {
  //   return this.http.get('/admin/host');
  // },
  // /**
  //  * 更改密碼
  //  * @param {string} gm_password 密碼
  //  * @param {string} gm_new_password 新密碼
  //  * @param {string} gm_confirm_password 確認密碼
  //  */
  // changePassword(
  //   gm_password: string,
  //   gm_new_password: string,
  //   gm_confirm_password: string,
  // ) {
  //   return this.http.put('/admin/my/password', {
  //     gm_password,
  //     gm_new_password,
  //     gm_confirm_password,
  //   });
  // },
  // /**
  //  * 取得自訂欄位
  //  */
  // getCustomFields() {
  //   return this.http.get("/admin/customfield");
  // },
  // /**
  //  * 取得顯示欄位
  //  * @param  {string} operation 功能key
  //  */
  // getCustomColumns(operation: string) {
  //   return this.http.get(`/admin/custom_columns`, {
  //     params: {
  //       operation,
  //     },
  //   });
  // },
  // /**
  //  * 新增自訂欄位資料
  //  * @param  {string} operation 功能key
  //  * @param  {string|number} group_id 自訂欄位群組id(自訂欄位群組第幾個)
  //  * @param  {string} group_name 群組名稱
  //  * @param  {array} columns 欄位
  //  */
  // postCustomColumns(
  //   operation: string,
  //   group_id: string | number,
  //   group_name: string,
  //   columns: string[],
  // ) {
  //   return this.http.post(`/admin/custom_columns`, {
  //     group_id,
  //     group_name,
  //     columns,
  //     operation,
  //   });
  // },
  // /**
  //  * 修改自訂欄位資料
  //  * @param  {string|number} column_id 欄位id
  //  * @param  {string} group_name 群組名稱
  //  * @param  {array} columns 欄位
  //  */
  // putCustomColumns(
  //   column_id: string | number,
  //   group_name: string,
  //   columns: string[],
  // ) {
  //   return this.http.put(`/admin/${column_id}/custom_columns`, {
  //     group_name,
  //     columns,
  //   });
  // },
  // /**
  //  * 套用已存在的自訂欄位
  //  */
  // putCustomFieldsGroup(group_id: string) {
  //   return this.http.put("/admin/customfield/group", { group_id });
  // },
  // /**
  //  * 設定自訂欄位
  //  */
  // putCustomFields(group_id: string, group_name: string, field: []) {
  //   return this.http.post("/admin/customfield", {
  //     group_id,
  //     group_name,
  //     field
  //   });
  // },
  // /**
  //  * 套用自訂欄位預設群組
  //  * @param  {string} operation 功能key
  //  * @param  {string|number} group_id 群組id
  //  */
  // putCustomColumnsApply(operation: string, group_id: string | number) {
  //   return this.http.put(`/admin/custom_columns/apply`, {
  //     group_id,
  //     operation,
  //   });
  // },
  /**
   * 取得狀態列資訊
   */
  getAdminProfile() {
    return this.http.get('/admin/profile');
  },
  /**
   * 修改狀態列資訊
   * @param  {object} options.profile_icon_collapse 圖示開關
   * @param  {object} options.profile_infos 預設 nav bar功能
   * @param  {object} options.profile_icons 功能(icon)
   */
  putAdminProfile(options = {}) {
    // 可設定的參數
    const paramOptions = [
      'profile_icon_collapse',
      'profile_infos',
      'profile_icons',
    ];
    return this.http.put('/admin/profile', pick(options, paramOptions));
  },
};

/**
 * 控端使用者(管理者)相關
 */
export const user = {
  http,
  // /**
  //  * 取得控端使用者清單
  //  */
  // getUserList() {
  //   return this.http.get("admin/user");
  // },
  // /**
  //  * 取得部分管理公司
  //  * @param  {string|number} id 帳號id
  //  */
  // getUserHall(id: string | number) {
  //   return this.http.get(`/admin/permission/${id}/hall/privilege`);
  // },
  // /**
  //  * 設定部分管理公司
  //  * @param {string|number} id 帳號id
  //  * @param {number[]} hallid 公司設定
  //  */
  // putUserHall(id: string | number, hallid = []) {
  //   return this.http.put(`/admin/permission/${id}/hall/privilege`, { hallid });
  // },
  // /**
  //  * 取得單一帳號資料
  //  * @param  {string|number} id 帳號id
  //  */
  // getUser(id: string | number) {
  //   return this.http.get(`admin/${id}`);
  // },
  // /**
  //  * 取得帳號列表資料
  //  * @param params
  //  * @param {0 | 1} params.enable - 狀態
  //  * @param {string} params.fuzzy_username - 帳號關鍵字
  //  * @param {string} params.alias - 名稱關鍵字
  //  * @param {number} params.department_id - 單位id
  //  * @param {number} params.position_id - 職務id
  //  * @param {number} params.limit - 單頁上限量
  //  * @param {number} params.page - 頁數
  //  * @param {number} params.period - 未上線人數區間
  //  * @param {0 | 1} params.fuzzy - 模糊搜尋
  //  * @param {string} params.sort - 排序依據類型
  //  * @param {"asc"|"desc"} params.order - 排列方式
  //  */
  // getUsers(options = {}) {
  //   const paramOptions = [
  //     'enable',
  //     'fuzzy_username',
  //     'alias',
  //     'department_id',
  //     'position_id',
  //     'limit',
  //     'page',
  //     'period',
  //     'fuzzy',
  //     'sort',
  //     'order',
  //   ];

  //   return this.http.get('admin/users', {
  //     params: pick(options, paramOptions),
  //   });
  // },
};

/**
 * 控端使用者(管理者)相關 - 單位職務
 */
export const group = {
  http,
  // /**
  //  * 取得單位清單
  //  * @param options 可選參數
  //  * @param {string} [options.order] 遞增/遞減
  //  * @param {string} [options.sort] 排序方式
  //  * @param {string | number} [options.page] 頁數
  //  * @param {string | number} [options.limit] 筆數
  //  * @param {string} [options.department] 單位
  //  */
  // getDepartment(options = {}) {
  //   const paramOptions = ['order', 'sort', 'page', 'limit', 'department'];
  //   return this.http.get('admin/department', {
  //     params: pick(options, paramOptions),
  //   });
  // },
  // /**
  //  * 新增單位
  //  * @param  {string} department 單位
  //  * @param  {string} note 備註
  //  */
  // addDepartment(department: string, note = '') {
  //   return this.http.post('admin/department', { department, note });
  // },
  // /**
  //  * 修改單位
  //  * @param  {string | number} id 單位id
  //  * @param  {string} department 單位名
  //  * @param  {string} note 備註
  //  */
  // putDepartment(id: string | number, department: string, note = '') {
  //   return this.http.put(`admin/department/${id}`, { department, note });
  // },
  // /**
  //  * 移除單位
  //  * @param {string | number} id 單位id
  //  */
  // removeDepartment(id: string | number) {
  //   return this.http.delete(`admin/department/${id}`);
  // },
  // /**
  //  * 取得職務清單
  //  * @param options 可選參數
  //  * @param {string} [options.order] 遞增/遞減
  //  * @param {string} [options.sort] 排序方式
  //  * @param {string | number} [options.page] 頁數
  //  * @param {string | number} [options.limit] 筆數
  //  * @param {string} [options.position] 職務
  //  */
  // getPosition(options = {}) {
  //   const paramOptions = ['order', 'sort', 'page', 'limit', 'position'];
  //   return this.http.get('admin/position', {
  //     params: pick(options, paramOptions),
  //   });
  // },
  // /**
  //  * 取得單一職務資訊與權限
  //  * @param  {string|number} id 職務id
  //  */
  // getPositionByID(id: string | number) {
  //   return this.http.get(`admin/position/${id}`);
  // },
  // /**
  //  * 新增職務
  //  * @param  {string} position 職務名稱
  //  * @param  {Record<string, []>} permissions 權限
  //  * @param  {array} privilege 管理部分公司權限
  //  * @param  {string} note 備註
  //  */
  // addPosition(
  //   position: string,
  //   permissions: Record<string, []>,
  //   privilege: never[],
  //   note: string | null = null,
  // ) {
  //   return this.http.post('admin/position', {
  //     position,
  //     permissions,
  //     privilege,
  //     note,
  //   });
  // },
  // /**
  //  * 修改職務
  //  * @param  {string|number} id 職務id
  //  * @param  {string} position 職務名稱
  //  * @param  {Record<string, []>} permissions 權限
  //  * @param  {number[]} privilege 管理部分公司權限
  //  * @param  {string} note 備註
  //  * @param  {string[]|0} option 同步權限選項
  //  */
  // putPosition(
  //   id: string | number,
  //   position: string,
  //   permissions: Record<string, []>,
  //   privilege: number[],
  //   note: string | null = null,
  //   option: string[] | 0 = 0,
  // ) {
  //   return this.http.put(`admin/position/${id}`, {
  //     position,
  //     permissions,
  //     privilege,
  //     note,
  //     option,
  //   });
  // },
  // /**
  //  * 刪除職務
  //  * @param  {string|number} id 職務id
  //  */
  // removePosition(id: string | number) {
  //   return this.http.delete(`admin/position/${id}`);
  // },
  // /**
  //  * 修改單一帳號的單位與職務
  //  * @param  {string|number} id 帳號id
  //  * @param  {string|number} department 單位id
  //  * @param  {string|number} position 職務id
  //  */
  // putUserDepartment(
  //   id: string | number,
  //   department_id: string | number,
  //   position_id: string | number,
  // ) {
  //   return this.http.put(`admin/${id}/department`, {
  //     department_id,
  //     position_id,
  //   });
  // },
  // /**
  //  * 修改多個使用者職務與單位
  //  * @param  {(number | string)[]} users 多個使用者
  //  * @param  {{ id: string | number; view: boolean | 0 | 1; modify: boolean | 0 | 1; }[]} permissions 設定權限
  //  * @param  options 可選設定的單位職務
  //  * @param  {number | string} [options.department_id] 單位
  //  * @param  {number | string} [options.position_id] 職務
  //  */
  // putUsersDepartment(
  //   users: (number | string)[],
  //   permissions: {
  //     id: string | number;
  //     view: boolean | 0 | 1;
  //     modify: boolean | 0 | 1;
  //   }[],
  //   options = {},
  // ) {
  //   const paramOptions = ['department_id', 'position_id'];
  //   const params = {
  //     users,
  //     permissions,
  //     ...pick(options, paramOptions),
  //   };
  //   return this.http.put('/admin/users/department', params);
  // },
};

/**
 * 控端權限相關
 */
export const permission = {
  http,
  // /**
  //  * 取得自身權限清單(self)
  //  */
  // getPermissionList() {
  //   return this.http.get("admin/permission");
  // },
  // /**
  //  * 取得擁有權限的使用者
  //  * @param {string} name 權限名稱
  //  */
  // getPermissionUser(name: string) {
  //   return this.http.get(`/admin/permission/${name}/user`);
  // },
  // /**
  //  * 設定多個使用者的單一權限
  //  * @param  {string} name 權限名稱
  //  * @param  {array} users 多個使用者
  //  */
  // setPermissionUser(name: string, users: []) {
  //   return this.http.put(`/admin/permission/${name}/user`, { users });
  // },
  // /**
  //  * 取得權限列表(all)
  //  */
  // getPermission() {
  //   return this.http.get('admin/permission/enabled');
  // },
  // /**
  //  * 取得單一帳號的權限
  //  * @param  {string|number} id 帳號id
  //  */
  // getUserPermissionModifiable(id: string | number) {
  //   return this.http.get(`admin/${id}/permission/modifiable`);
  // },
  // /**
  //  * 修改單一帳號的權限設定
  //  * @param  {string|number} id 帳號id
  //  * @param  {Record<string, []>} permissions 權限 { menu: [], ... }
  //  */
  // putUserPermission(id: string | number, permissions: Record<string, []>) {
  //   return this.http.put(`admin/${id}/permission`, { permissions });
  // },
  // /**
  //  * 取得單一權限的所有帳號
  //  * @param  {string} name 權限名
  //  */
  // getPermissionUsers(name: string) {
  //   return this.http.get(`admin/permission/${name}/user`);
  // },
  // /**
  //  * 設定單一權限的所有帳號
  //  * @param  {string} name 權限名
  //  * @param  {{ id: number; modify: boolean }[]} users 帳號
  //  */
  // putPermissionUsers(name: string, users: { id: number; modify: boolean }[]) {
  //   return this.http.put(`admin/permission/${name}/user`, { users });
  // },
  // /**
  //  * 取得權限影響功能清單
  //  */
  // getAffectList() {
  //   return this.http.get('/admin/perm_affect/list');
  // },
};

const admin = { ...menu, ...operate, ...user, ...group, ...permission };
export default admin;
export const multi = { ...admin, http: multiHttp };
