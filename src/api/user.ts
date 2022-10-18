import { pick } from 'lodash';
import http from '@/http/http';
import multiHttp from '@/http/multi';

// todo add jsdoc
/**
 * 帳號清單
 */
export const users = {
  http,
  // getUserByName(domain, username) {
  //   return this.http.get("/user", {
  //     params: {
  //       domain,
  //       username
  //     }
  //   });
  // },
  // getUser(params) {
  //   return this.http.get("/user", { params });
  // },
  // getUserListClassify(domain) {
  //   return this.http.get(`/user/classify/${domain}`);
  // },
  // getUserNotLogin(domain) {
  //   return this.http.get(`/user/notlogin_member/${domain}`);
  // },
  // getOnlineMember(domain) {
  //   return this.http.get(`/user/online_member/${domain}`);
  // },
  // // 取得某層級所有帳號
  // getRoleUser(domain, role, sub = 0, username = "") {
  //   return this.http.get(`/user/${domain}/username`, {
  //     params: { role, sub, username }
  //   });
  // }
};

/**
 * 測試體系
 */
export const testHierarchy = {
  http,
  // getTestHierarchy({
  //   domain,
  //   test = "all",
  //   username = "",
  //   page = 1,
  //   limit = 10
  // }) {
  //   return this.http.get("/user/hierarchy/test", {
  //     params: {
  //       domain,
  //       test,
  //       username,
  //       page,
  //       limit
  //     }
  //   });
  // },
  // setTestHierarchy(id, test, hidden_test) {
  //   return this.http.put("/user/hierarchy/test", {
  //     id,
  //     test,
  //     hidden_test
  //   });
  // }
};

/**
 * 登入紀錄
 */
export const loginInfo = {
  http,
  // getLoginRecord(params) {
  //   return this.http.get("/user/login_record", { params });
  // },
  // getAdminSameIPLoginList(params) {
  //   return this.http.get("/user/login_record/same_ip", { params });
  // },
  // // 取得未登入天數、未存款天數
  // getLoginDate(id, logintime) {
  //   return this.http.get(`/user/${id}/logindate`, { params: { logintime } });
  // },
  // // 最後登入記錄
  // getLastLogin(username, options) {
  //   const paramOptions = ["domain"];
  //   const params = {
  //     username,
  //     ...pick(options, paramOptions)
  //   };
  //   return this.http.get("/user/login_record/last", { params });
  // }
  getMembersLastLoginGroup(domain: string | number, options = {}) {
    const paramOptions = ['day_group'];
    const params = pick(options, paramOptions);
    return this.http.get(
      `/domain/${domain}/members/login_structure/total_number`,
      { params },
    );
  },
  getMembersLastLoginGroupDetail(domain: string | number, options = {}) {
    const paramOptions = [
      'day_group',
      'type',
      'page',
      'limit',
      'sort',
      'order',
    ];
    const params = pick(options, paramOptions);
    return this.http.get(`/domain/${domain}/members/login_structure`, {
      params,
    });
  },
  /**
   * 匯出未登入會員名單分群
   * @param domain
   * @param options
   * @returns
   */
  exportMembersLastLoginGroup(domain: string | number, options: {}) {
    const paramOptions = ['day_group', 'export_remark', 'lang'];
    const params = pick(options, paramOptions);

    return this.http.post(
      `/domain/${domain}/members/login_structure/export`,
      params,
    );
  },
};

/**
 * 帳號操作
 */
export const operate = {
  http,
  // // 停啟用user
  // putEnable(id, enable) {
  //   return this.http.put(`/user/${id}/enable`, { enable });
  // },
  // // 凍結、解凍user
  // putBlock(id, block) {
  //   return this.http.put(`/user/${id}/block`, { block });
  // },
  // // 停權、解除停權user old 拼錯 putBankrup
  // putBankrupt(id, enable) {
  //   return this.http.put(`/user/${id}/bankrupt/enable/${enable}`);
  // },
  // // 批次停權
  // putBankruptBatch(users, enable) {
  //   return this.http.put(`/user/bankrupt_batch/enable/${enable}`, {
  //     users
  //   });
  // },
  // deleteUser(id) {
  //   return this.http.delete(`/user/${id}`);
  // },
  // // 登出user
  // deleteUserSession(id) {
  //   return this.http.put(`/user/${id}/logout`);
  // },
  // // 停止、開放個資
  // putPersonalEdit(id, enable) {
  //   return this.http.put(`/user/${id}/personal_edit/enable/${enable}`);
  // },
  // // 批次停止、開放個資
  // putPersonalEditBatch(users, enable) {
  //   return this.http.put(`/user/personal_edit_batch/enable/${enable}`, {
  //     users
  //   });
  // },
  // // 批次凍結、解凍
  // putbatchFreeze(users, block) {
  //   return this.http.put("/user/batch/block", {
  //     users,
  //     block
  //   });
  // }
};

/**
 * 遊戲大廳開關
 */
export const lobby = {
  http,
  // // 取得使用者遊戲開關
  // getUserLobby(id) {
  //   return this.http.get(`/user/${id}/lobby`);
  // },
  // // 設定使用者遊戲開關
  // setUserLobby(id, lobbyset) {
  //   return this.http.put(`/user/${id}/setlobby`, { lobbyset });
  // },
  // // 取得使用者可設定遊戲開關
  // getUserLobbySwitch(id, params) {
  //   return this.http.get(`/user/${id}/lobbyswitch`, { params });
  // },
  // getUserLobbyData(id, params) {
  //   return this.http.get(`/user/${id}/lobbydata`, { params });
  // },
  // putlobby(id, role, sub, parent_id, lobbyset) {
  //   return this.http.put(`/user/${id}/putlobby`, {
  //     role,
  //     sub,
  //     parent_id,
  //     lobbyset
  //   });
  // },
  // // 取得最後下注遊戲
  // getLastLobby(id) {
  //   return this.http.get(`/user/${id}/last/lobby`);
  // }
};

/**
 * 帳號資料設定
 */
export const profile = {
  http,
  // // 取得一次密碼
  // getTemporaryPassword(id) {
  //   return this.http.put(`/user/${id}/password/once`);
  // },
  // // 修改管端使用者密碼 old putPassword
  // putUserPassword(id, new_password, password_reset) {
  //   return this.http.put(`/user/${id}/password`, {
  //     new_password,
  //     password_reset
  //   });
  // },
  // // 修改會員密碼
  // putMemberPassword(id, new_member_password, password_reset) {
  //   return this.http.put(`/user/${id}/password/member`, {
  //     new_member_password,
  //     password_reset
  //   });
  // }
  // // 取得盤口類別資料
  // getUserHandicap(id) {
  //   return this.http.get(`/user/${id}/handicap`);
  // },
  // // 設定盤口類別資料
  // putUserHandicap(id, open_handicap, enable_handicap) {
  //   return this.http.put(`/user/${id}/handicap`, {
  //     open_handicap,
  //     enable_handicap
  //   });
  // },
  // // 取得單一帳號資訊 (百寶箱用特殊資訊)
  // getUserByIdWithSession(id) {
  //   return this.http.get(`/user/${id}/session`);
  // },
  // // 取得帳號資訊 (一般帳號資訊)
  // getUserAccount(id) {
  //   return this.http.get(`/user/${id}/account`);
  // },
  // // 設定使用者名稱
  // setUsername(id, username) {
  //   return this.http.put(`/user/${id}/name`, { username });
  // },
  // // 新增推廣代碼
  // setIntrCode(id) {
  //   return this.http.post(`/user/${id}/intrcode`);
  // },
  // // 編輯user詳細資料
  // putDetailInfo(id, info) {
  //   return this.http.put(`/user/${id}/detail`, {
  //     info
  //   });
  // },
  getUserByID(id: number | string) {
    return this.http.get(`/user/${id}`);
  },
  // getNickname(id) {
  //   return this.http.get(`/user/${id}/nickname`);
  // },
  // // 取得會員退水(控端)
  // getMemberCommission(domain, lobbys, username, start_date, end_date) {
  //   return this.http.get(`/user/${domain}/commissionable/${username}`, {
  //     params: {
  //       lobbys,
  //       start_date,
  //       end_date
  //     }
  //   });
  // },
  // // 取得會員詳細資料
  // getDetailInfo(id) {
  //   return this.http.get(`/user/${id}/detail`);
  // },
  // // 取得會員群組相關資料
  // getGroupsInfo(id) {
  //   return this.http.get(`/user/${id}/group`);
  // },
  // // 取得推廣好友資訊與連結
  // getPromote(id) {
  //   return this.http.get(`/user/${id}/promote/info`);
  // },
  // // 取得使用者額度資料
  // getUserBalance(id) {
  //   return this.http.get(`/user/${id}/balance`);
  // },
  // // 一鍵轉回外接額度
  // putRecycleBalance(id) {
  //   return this.http.put(`/user/${id}/external/recycle/balance`);
  // }
};

/**
 * 佔成設定
 */
export const sharelimit = {
  http,
  // // 取得佔成設定
  // getShareLimit(id) {
  //   return this.http.get(`/user/${id}/sharelimit`);
  // },
  // // 檢查佔成
  // checkUserShareLimit(
  //   id,
  //   lobby,
  //   next,
  //   { lower, upper, parent_lower, parent_upper }
  // ) {
  //   let next2int = 0;
  //   if (next) {
  //     next2int = 1;
  //   }
  //   return this.http.get(`/user/${id}/sharelimit/validate`, {
  //     params: {
  //       next: next2int,
  //       lobby,
  //       lower,
  //       upper,
  //       parent_lower,
  //       parent_upper
  //     }
  //   });
  // },
  // // 設定佔成
  // setShareLimit(id, sharelimit) {
  //   return this.http.put(`/user/${id}/sharelimit`, { sharelimit });
  // }
};

/**
 * 出入款相關
 */
export const payment = {
  http,
  // // 取得會員錢包狀態
  // getWalletInfo(id) {
  //   return this.http.get(`/user/${id}/wallet/info`);
  // },
  // // 取得用戶錢包設定
  // getUserWalletInfo(domain) {
  //   return this.http.get("/user/domain/config_by_domain", { params: { domain } });
  // },
  // // 取得假現金相關額度
  // getCashFakeBalance(id, role, cash_fake) {
  //   return this.http.get(`/user/${id}/cash_fake/related_balance`, {
  //     params: {
  //       role,
  //       cash_fake
  //     }
  //   });
  // },
  // // 設定假現金相關額度
  // setCashFakeBalance(id, amount) {
  //   return this.http.put(`/user/${id}/cash_fake/balance`, { amount });
  // },
  // getBank(id) {
  //   return this.http.get(`/user/${id}/bank`);
  // },
  // addBank(id, data) {
  //   return this.http.post(`/user/${id}/bank`, data);
  // },
  // editBank(id, data) {
  //   return this.http.put(`/user/${id}/bank`, data);
  // },
  // removeBank(id, data) {
  //   return this.http.delete(`/user/${id}/bank`, { data });
  // },
  // // 設定取款密碼
  // setWithdrawPwd(id, withdraw_password) {
  //   return this.http.put(`/user/${id}/withdraw/password`, {
  //     withdraw_password
  //   });
  // },
  // // 檢查使用者自身或下層是否屬於多幣別預設總代、代理
  // checkDefaultCurrency(id) {
  //   return this.http.get(`/user/${id}/check/default_currency`);
  // },
  // // 取得存提款資訊
  // getDepositAndWithdrawInfo(id) {
  //   return this.http.get(`/user/${id}/deposit_and_withdraw/info`);
  // },
  // // 檢查取款密碼是否正確
  // checkWithdrawPwd(id, withdraw_password) {
  //   return this.http.put(`/user/${id}/check/withdraw/password`, {
  //     withdraw_password
  //   });
  // },
  // // 取得使用者帳戶資訊
  // getUsersBankAccount(users) {
  //   return this.http.get("/users/bank_account", { params: { users } });
  // }
};

/**
 * 權限相關
 */
export const permission = {
  http,
  // // 取得使用者開放的權限列表資料
  // getUserOpenablePermissions(id, permission_category) {
  //   return this.http.get(`user/${id}/openable/permissions`, {
  //     params: { permission_category }
  //   });
  // },
  // // 取得使用者開放的體系權限
  // getUserOpenablehierarchyPerm(id) {
  //   return this.http.get(`user/${id}/openable/hierarchy_perm`);
  // },
  // // 取得使用者勾選的權限資料
  // getUserPermissions(id) {
  //   return this.http.get(`user/${id}/permissions`);
  // },
  // // 取得使用者勾選的權限資料(By舊的其他設定權限，需等全部轉移到體系權限後移除)
  // getUserPermissionsByOtherSet(id) {
  //   return this.http.get(`user/${id}/other_set/permission`);
  // },
  // // 設定單一使用者勾選的權限資料
  // setUserPermissions(id, user_permissions) {
  //   return this.http.put(`/user/${id}/permissions/v2`, {
  //     user_permissions
  //   });
  // },
  // // 取得單一使用者的層級權限
  // getUserRolePermByUser(id, roles) {
  //   return this.http.get(`user/${id}/permission/role`, { params: { roles } });
  // },
  // // 設定單一使用者的層級權限
  // setUserRolePermByUser(id, user_permissions) {
  //   return this.http.put(`/user/${id}/permission/role`, {
  //     user_permissions
  //   });
  // },
  // // 使用權限的name取user權限
  // getUserPermissionsByName(id, options) {
  //   const paramOptions = ["user_permissions_name"];
  //   return this.http.get(`/user/${id}/permissions_name/with_modify`, {
  //     params: pick(options, paramOptions)
  //   });
  // }
};

/**
 * 鎖定監控
 */
export const lockMonitor = {
  http,
  // // 取得被鎖定會員資料
  // getLocked(domain, start_date, end_date, options) {
  //   const paramOptions = [
  //     "page",
  //     "limit",
  //     "sort",
  //     "order",
  //     "user_type",
  //     "username",
  //     "ip",
  //     "lock_reason"
  //   ];
  //   return this.http.get(`/domain/${domain}/users/locked`, {
  //     params: {
  //       start_date,
  //       end_date,
  //       ...pick(options, paramOptions)
  //     }
  //   });
  // },
  // // 取得已解鎖會員資料
  // getUnLock(domain, date_kind, start_date, end_date, options) {
  //   const paramOptions = [
  //     "page",
  //     "limit",
  //     "sort",
  //     "order",
  //     "user_type",
  //     "username",
  //     "ip",
  //     "manual"
  //   ];
  //   return this.http.get(`/domain/${domain}/users/unlock`, {
  //     params: {
  //       date_kind,
  //       start_date,
  //       end_date,
  //       ...pick(options, paramOptions)
  //     }
  //   });
  // },
  // // 解鎖會員
  // setUnlock(users) {
  //   return this.http.put("user/unlock", {
  //     users
  //   });
  // },
  // // 取得會員目前鎖定狀態
  // getLockStatus(users) {
  //   return this.http.get("/user/lock/status", { params: { users } });
  // }
};

/**
 * 負數現金
 */
export const negativeCash = {
  http,
  // // 取得交易類別
  // getCategory() {
  //   return this.http.get("/negative_cash/category");
  // },
  // // 取得待處理資料
  // getProcessingList(type, options) {
  //   const paramOptions = [
  //     "domain",
  //     "start_date",
  //     "end_date",
  //     "op_class",
  //     "ref_id",
  //     "user_name",
  //     "sort",
  //     "order",
  //     "page",
  //     "limit"
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get(`/negative_cash/${type}/processing_list`, { params });
  // },
  // // 取得不存入、已存入資料
  // getProcessedList(type, options) {
  //   const paramOptions = [
  //     "domain",
  //     "op_class",
  //     "ref_id",
  //     "user_name",
  //     "start_date",
  //     "end_date",
  //     "operator_name",
  //     "only_positive",
  //     "sort",
  //     "order",
  //     "page",
  //     "limit"
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get(`/negative_cash/${type}/processed_list`, { params });
  // },
  // // 移至不存入、人工存入
  // transfer(type, transfer_list) {
  //   return this.http.post(`/negative_cash/${type}/transfer`, {
  //     transfer_list
  //   });
  // },
  // // 取得說明資料
  // getNotice() {
  //   return this.http.get("/negative_cash/notice");
  // },
  // // 設定說明資料
  // setNotice(descriptions) {
  //   return this.http.post("/negative_cash/notice", {
  //     descriptions
  //   });
  // },
  // // 取得操作記錄
  // getRecord(options) {
  //   const paramOptions = [
  //     "site",
  //     "domain",
  //     "start_date",
  //     "end_date",
  //     "action",
  //     "op_class",
  //     "ref_id",
  //     "user_name",
  //     "operator_name",
  //     "sort",
  //     "order",
  //     "page",
  //     "limit"
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get("/negative_cash/record", { params });
  // },
  // // 負數現金匯出
  // postNegativeExport(type, options) {
  //   const paramOptions = [
  //     "domain",
  //     "start_date",
  //     "end_date",
  //     "op_class",
  //     "ref_id",
  //     "user_name",
  //     "currency",
  //     "operator_name",
  //     "only_positive",
  //     "export_remark"
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.post(`/negative_cash/${type}/export`, params);
  // }
};

/**
 * 取得綁定驗證相關
 */
export const authList = {
  http,
  /**
   * 取得會員綁定現況列表
   * @param  {number} domain
   * @param  {object} options
   */
  getBindingList(domain: number, options = {}) {
    const paramOptions = [
      'users',
      'start_date_time',
      'end_date_time',
      'mem_2fa_way',
      'sort',
      'order',
      'page',
      'limit',
    ];
    const params = pick(options, paramOptions);

    return this.http.get(
      `/domain/${domain}/two_factor_authentication/binding_list`,
      { params },
    );
  },
  /**
   * 判斷會員是否綁定
   * @param  {number} domain
   * @param  {object} options
   */
  checkBinding(domain: number, options = {}) {
    const paramOptions = [
      'users',
      'start_date_time',
      'end_date_time',
      'mem_2fa_way',
    ];
    const params = pick(options, paramOptions);

    return this.http.get(`/domain/${domain}/two_factor_authentication/check`, {
      params,
    });
  },
  /**
   * 匯出會員綁定現況列表
   * @param  {number} domain
   * @param  {object} options
   */
  exportBindingList(domain: number, options = {}) {
    const paramOptions = [
      'users',
      'start_date_time',
      'end_date_time',
      'mem_2fa_way',
      'sort',
      'order',
      'export_remark',
    ];
    const params = pick(options, paramOptions);

    return this.http.post(
      `/domain/${domain}/two_factor_authentication/binding_list/export`,
      params,
    );
  },
};

export const user = {
  ...users,
  ...testHierarchy,
  ...loginInfo,
  ...operate,
  ...lobby,
  ...profile,
  ...sharelimit,
  ...payment,
  ...permission,
  ...lockMonitor,
  ...negativeCash,
  ...authList,
};

export default user;
export const multi = { ...user, http: multiHttp };
