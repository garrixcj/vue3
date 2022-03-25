// import { pick } from 'lodash';
import http from '@/http/http';
import multiHttp from '@/http/multi';
// import inf from '@/http/inf';

/**
 * 管理者單位
 */
export const department = {
  http,
  // /**
  //  * 取得單位列表
  //  * @param  {string} domain
  //  * @param  {string} role
  //  * @param  {object} options.owner_id
  //  * @param  {object} options.order
  //  * @param  {object} options.sort
  //  * @param  {object} options.page
  //  * @param  {object} options.limit
  //  * @param  {object} options.department
  //  */
  // getDepartmentList(domain: string, role: string, options = {}) {
  //   const paramOptions = [
  //     "owner_id",
  //     "order",
  //     "sort",
  //     "page",
  //     "limit",
  //     "department"
  //   ];
  //   const optionalParams = pick(options, paramOptions);
  //   const params = { domain, role, ...optionalParams };
  //   return this.http.get("/user/department", { params });
  // },
  // /**
  //  * 新增單位
  //  * @param  {string} domain
  //  * @param  {string} role
  //  * @param  {number} owner_id
  //  * @param  {string} name
  //  * @param  {string} note
  //  */
  // addDepartment(
  //   domain: string,
  //   role: string,
  //   owner_id: number,
  //   name: string,
  //   note: string
  // ) {
  //   return this.http.post("/user/department", {
  //     domain,
  //     role,
  //     owner_id,
  //     name,
  //     note
  //   });
  // },
  // /**
  //  * 修改單位
  //  * @param  {string} id
  //  * @param  {string} name
  //  * @param  {string} note
  //  */
  // editDepartment(id: string, name: string, note: string) {
  //   return this.http.put(`/user/department/${id}`, {
  //     name,
  //     note
  //   });
  // },
  // /**
  //  * 移除單位
  //  * @param  {string|number} id
  //  */
  // removeDepartment(id: string | number) {
  //   return this.http.delete(`/user/department/${id}`);
  // }
};

/**
 * 管理者職務
 */
export const position = {
  http,
  // /**
  //  * 取得職務列表 // todo [Next-Feature] 增加 role 跟 owner_id
  //  * @param  {string} domain
  //  * @param  {object} options.order
  //  * @param  {object} options.sort
  //  * @param  {object} options.page
  //  * @param  {object} options.limit
  //  * @param  {object} options.position
  //  */
  // getPositionList(domain: string, options: object) {
  //   const paramOptions = ["order", "sort", "page", "limit", "position"];
  //   const optionalParams = pick(options, paramOptions);
  //   const params = { domain, ...optionalParams };
  //   return this.http.get("/user/position", { params });
  // },
  // /**
  //  * 取得單一職務
  //  * @param  {string|number} id
  //  */
  // getPosition(id: string | number) {
  //   return this.http.get(`/user/position/${id}`);
  // },
  // /**
  //  * 新增職務
  //  * @param  {string} domain
  //  * @param  {string} name
  //  * @param  {array} permissions
  //  * @param  {string} note
  //  */
  // addPosition(domain: string, name: string, permissions: [], note: string) {
  //   return this.http.post("/user/position", {
  //     domain,
  //     name,
  //     note,
  //     permissions
  //   });
  // },
  // /**
  //  * 修改職務
  //  * @param  {string} id
  //  * @param  {string} domain
  //  * @param  {string} name
  //  * @param  {array} permissions
  //  * @param  {string} note
  //  * @param  {0|1} apply
  //  */
  // editPosition(
  //   id: string,
  //   domain: string,
  //   name: string,
  //   permissions: [],
  //   note: string,
  //   apply: 0 | 1
  // ) {
  //   return this.http.put(`/user/position/${id}`, {
  //     domain,
  //     name,
  //     note,
  //     permissions,
  //     apply
  //   });
  // },
  // /**
  //  * 移除職務
  //  * @param  {string|number} id
  //  */
  // removePosition(id: string | number) {
  //   return this.http.delete(`/user/position/${id}`);
  // }
};

/**
 * 管理者帳號列表
 */
export const userlist = {
  http,
  // /**
  //  * 取得列表 - 一般條件
  //  * @param  {string} domain
  //  * @param  {string} role
  //  * @param  {object} options.department_id
  //  * @param  {object} options.position_id
  //  * @param  {object} options.ubauth_bind
  //  * @param  {object} options.block
  //  * @param  {object} options.user_type
  //  * @param  {object} options.username
  //  * @param  {object} options.fuzzy
  //  * @param  {object} options.last_login
  //  * @param  {object} options.sort
  //  * @param  {object} options.order
  //  * @param  {object} options.limit
  //  * @param  {object} options.page
  //  * @param  {object} options.top_sub_domain
  //  */
  // getUserList(domain: string, role: string, options: object) {
  //   const paramOptions = [
  //     "department_id",
  //     "position_id",
  //     "ubauth_bind",
  //     "block",
  //     "user_type",
  //     "username",
  //     "fuzzy",
  //     "last_login",
  //     "sort",
  //     "order",
  //     "limit",
  //     "page",
  //     "top_sub_domain"
  //   ];
  //   const optionalParams = pick(options, paramOptions);
  //   const params = { role, ...optionalParams };
  //   return this.http.get(`/user/${domain}/sub_account`, { params });
  // },
  // /**
  //  * 取得人數資訊
  //  * @param  {string} domain
  //  * @param  {string} role
  //  * @param  {object} options.user_type
  //  * @param  {object} options.username
  //  * @param  {object} options.block
  //  * @param  {object} options.fuzzy
  //  * @param  {object} options.top_sub_domain
  //  */
  // getInfo(domain: string, role: string, options: object) {
  //   const paramOptions = [
  //     "user_type",
  //     "username",
  //     "block",
  //     "fuzzy",
  //     "top_sub_domain"
  //   ];
  //   const optionalParams = pick(options, paramOptions);
  //   const params = { domain, role, ...optionalParams };
  //   return this.http.get("/user/sub_account/count", { params });
  // },
  // /**
  //  * 批次修改職務
  //  * @param  {array} users
  //  * @param  {object} options.department_id
  //  * @param  {object} options.position_id
  //  * @param  {object} options.permissions
  //  */
  // changeUsersGroupSet(users: [], options: object) {
  //   const paramOptions = ["department_id", "position_id", "permissions"];
  //   const optionalParams = pick(options, paramOptions);
  //   const params = { users, ...optionalParams };
  //   return this.http.put("/user/users/department", { ...params });
  // },
  // /**
  //  * 取廳主子帳號列表
  //  * @param  {string} owner_id
  //  */
  // getSubDomainList(owner_id: string) {
  //   return this.http.get("/user/list/department", { params: { owner_id } });
  // }
};

/**
 * 管理者帳號權限
 */
export const permission = {
  http,
  // /**
  //  * 取得管理者帳號可開啟的權限
  //  * @param  {string} owner
  //  * @param  {array} permission_category
  //  */
  // getPermissionSet(owner: string, permission_category: []) {
  //   return this.http.get(`/user/owner/${owner}/openable/permissions`, {
  //     params: { permission_category }
  //   });
  // },
  // /**
  //  * 取得管理者帳號的權限
  //  * @param  {string|number} id
  //  */
  // getUserPermission(id: string | number) {
  //   return this.http.get(`/user/${id}/permissions/with_modify`);
  // },
  // /**
  //  * 取單一權限廳主子帳號開關列表
  //  * @param  {string} owner_id
  //  * @param  {array} permissions
  //  */
  // getSubDomainPerm(owner_id: string, permissions: []) {
  //   return this.http.get("/user/permission/users", {
  //     params: { owner_id, permission: permissions }
  //   });
  // }
};

/**
 * 管理者帳號之帳號異動
 */
export const account = {
  http,
  // /**
  //  * 取得單一管理者帳號
  //  * @param  {string|number} id
  //  */
  // getUserInfo(id: string | number) {
  //   return this.http.get(`/user/${id}/info`);
  // },
  // /**
  //  * 新增帳號
  //  * @param  {string} parent_id
  //  * @param  {string} username
  //  * @param  {string} alias
  //  * @param  {string} sub_password
  //  * @param  {string} re_sub_password
  //  * @param  {string} department_id
  //  * @param  {string|number|null} position_id
  //  */
  // createAccount(
  //   parent_id: string,
  //   username: string,
  //   alias: string,
  //   sub_password: string,
  //   re_sub_password: string,
  //   department_id: string,
  //   position_id = null
  // ) {
  //   return this.http.post("/user/create/sub_account", {
  //     parent_id,
  //     username,
  //     alias,
  //     sub_password,
  //     re_sub_password,
  //     department_id,
  //     position_id
  //   });
  // },
  // /**
  //  * 修改帳號
  //  * @param  {string} id
  //  * @param  {string} username
  //  * @param  {string} alias
  //  * @param  {string} department_id
  //  * @param  {object} options.position_id
  //  * @param  {object} options.online_amount
  //  * @param  {object} options.deposit_amount
  //  */
  // editAccount(
  //   id: string,
  //   username: string,
  //   alias: string,
  //   department_id: string,
  //   options: object
  // ) {
  //   const paramOptions = ["position_id", "online_amount", "deposit_amount"];
  //   const optionalParams = pick(options, paramOptions);
  //   const params = {
  //     id,
  //     username,
  //     alias,
  //     department_id,
  //     ...optionalParams
  //   };
  //   return this.http.put(`/user/${id}/sub_account`, { ...params });
  // },
  // /**
  //  * 刪除帳號
  //  * @param  {string|number} id
  //  */
  // deleteUser(id: string | number) {
  //   return this.http.delete(`/user/${id}/sub_account`);
  // }
};

/**
 * Infinite Api
 */
export const infinite = {
  // inf,
  // /**
  //  * 廳主子帳號批次修改權限
  //  * @param  {string} perm_id
  //  * @param  {array} users
  //  */
  // putSubDomainDepartmentPerm(perm_id: string, users: []) {
  //   return this.inf.put(`/user/permission/${perm_id}/users`, { users });
  // }
};

export const manager = {
  ...userlist,
  ...department,
  ...position,
  ...permission,
  ...account,
  ...infinite,
};

export default manager;

export const multi = { ...manager, http: multiHttp };
