// import pick from 'lodash/pick';
import http from '@/http/http';
import multiHttp from '@/http/multi';
import inf from '@/http/inf';

/**
 * 預設參數
 */
export const defaultParameter = {
  http,
  // /**
  //  * 取得預設參數列表
  //  */
  // getDefaultParameters() {
  //   return this.http.get("/domain/default/parameters");
  // }
  // /**
  //  * 刪除單一預設參數資料
  //  * @param  {string|number} default_id 預設參數id
  //  */
  // deleteDefaultParameter(default_id: string | number) {
  //   return this.http.delete(`/domain/default/${default_id}/parameter`);
  // },
  // /**
  //  * 取得預設參數相關資料
  //  * @param  {string|number} default_id 預設參數id
  //  */
  // getUserDefaultParameter(default_id: string | number) {
  //   return this.http.get(`/domain/default/${default_id}/parameter/`);
  // },
  // /**
  //  * 新增預設參數相關資料
  //  * @param  {string} name 預設參數名稱
  //  * @param  {string} note 備註
  //  * @param  {string} default_currency 預設幣別
  //  * @param  {array} currencies 可用幣別
  //  * @param  {array} banks 銀行
  //  * @param  {array} permissions 權限
  //  * @param  {array} account_setting 帳號設定
  //  * @param  {array} lobbys 遊戲設定
  //  */
  // addDefaultParameter(
  //   name: string,
  //   note: string,
  //   default_currency: string,
  //   currencies: [],
  //   banks: [],
  //   permissions: [],
  //   account_setting: [],
  //   lobbys: []
  // ) {
  //   return this.http.post("/domain/default/parameter", {
  //     name,
  //     note,
  //     default_currency,
  //     currencies,
  //     banks,
  //     permissions,
  //     account_setting,
  //     lobbys
  //   });
  // },
  // /**
  //  * 修改預設參數 - 參數名稱和備註
  //  * @param  {string} default_id 預設參數id
  //  * @param  {string} name 預設參數名稱
  //  * @param  {string} note 備註
  //  */
  // setDefaultParameter(default_id: string, name: string, note: string) {
  //   return this.http.put(`/domain/default/${default_id}/parameter`, {
  //     name,
  //     note
  //   });
  // },
  // /**
  //  * 修改預設參數 - 選單權限資料
  //  * @param  {string} default_id 預設參數id
  //  * @param  {array} permissions 權限
  //  * @param  {array} roles 體系權限
  //  */
  // setDefaultPermissions(default_id: string, permissions: [], roles: []) {
  //   return this.http.put(`/domain/default/${default_id}/permissions`, {
  //     permissions,
  //     roles
  //   });
  // },
  // /**
  //  * 修改預設參數 - 幣別設定資料
  //  * @param  {string} default_id 預設參數id
  //  * @param  {string} default_currency 預設幣別
  //  * @param  {array} currencies 可用幣別
  //  */
  // setDefaultCurrencies(
  //   default_id: string,
  //   default_currency: string,
  //   currencies: []
  // ) {
  //   return this.http.put(`/domain/default/${default_id}/currencies`, {
  //     default_currency,
  //     currencies
  //   });
  // },
  // /**
  //  * 修改預設參數 - 出款銀行設定資料
  //  * @param  {string} default_id 預設參數id
  //  * @param  {array} banks 銀行
  //  */
  // setDefaultBanks(default_id: string, banks: []) {
  //   return this.http.put(`/domain/default/${default_id}/banks`, {
  //     banks
  //   });
  // },
  // /**
  //  * 修改預設參數 - 基本設定-帳號
  //  * @param  {string} default_id 預設參數id
  //  * @param  {array} account_setting 帳號設定
  //  */
  // setDefaultAccountSettings(default_id: string, account_setting: []) {
  //   return this.http.put(`/domain/default/${default_id}/account_settings`, {
  //     account_setting
  //   });
  // },
  // /**
  //  * 修改預設參數 - 基本設定-遊戲
  //  * @param  {string} default_id 預設參數id
  //  * @param  {array} lobbys 遊戲設定
  //  */
  // setDefaultLobbies(default_id: string, lobbys: []) {
  //   return this.http.put(`/domain/default/${default_id}/lobbies`, {
  //     lobbys
  //   });
  // }
};

/**
 * 簽名
 */
export const signature = {
  // http,
  // /**
  //  * 取App簽名管理ios列表
  //  * @param  {object} options.domain
  //  * @param  {object} options.signature_method
  //  * @param  {object} options.domain_help
  //  * @param  {object} options.is_update
  //  * @param  {object} options.signature_url
  //  * @param  {object} options.sort
  //  * @param  {object} options.order
  //  * @param  {object} options.page
  //  * @param  {object} options.limit
  //  */
  // getDomainSignatureIosList(options: object) {
  //   const paramOptions = [
  //     "domain",
  //     "signature_method",
  //     "domain_help",
  //     "is_update",
  //     "signature_url",
  //     "sort",
  //     "order",
  //     "page",
  //     "limit"
  //   ];
  //   const optionalParams = pick(options, paramOptions);
  //   const params = { ...optionalParams };
  //   return this.http.get("/domain/signature/list", { params });
  // },
  // /**
  //  * 取App簽名管理操作記錄
  //  * @param  {object} options.start_date
  //  * @param  {object} options.end_date
  //  * @param  {object} options.domain
  //  * @param  {object} options.operation_item
  //  * @param  {object} options.operator
  //  * @param  {object} options.ip
  //  * @param  {object} options.page
  //  * @param  {object} options.limit
  //  * @param  {object} options.sort
  //  * @param  {object} options.order
  //  */
  // getDomainSignatureRecord(options: object) {
  //   const paramOptions = [
  //     "start_date",
  //     "end_date",
  //     "domain",
  //     "operation_item",
  //     "operator",
  //     "ip",
  //     "page",
  //     "limit",
  //     "sort",
  //     "order"
  //   ];
  //   const optionalParams = pick(options, paramOptions);
  //   const params = { ...optionalParams };
  //   return this.http.get("/domain/signature/record", { params });
  // },
  // /**
  //  * 修改廳主簽名相關資訊
  //  * @param  {string} domain
  //  * @param  {object} options.domain_help
  //  * @param  {object} options.note
  //  * @param  {object} options.signature_url
  //  * @param  {object} options.signature_account
  //  * @param  {object} options.signature_password
  //  * @param  {object} options.member_download_link
  //  */
  // putDomainSignatureInfo(domain: string, options: object) {
  //   const paramOptions = [
  //     "domain_help",
  //     "note",
  //     "signature_url",
  //     "signature_account",
  //     "signature_password",
  //     "member_download_link"
  //   ];
  //   const optionalParams = pick(options, paramOptions);
  //   const params = { ...optionalParams };
  //   return this.http.put(`/domain/${domain}/signature`, params);
  // },
  // /**
  //  * 批次修改廳主簽名相關資訊
  //  * @param  {object} options.domains
  //  * @param  {object} options.domain_help
  //  * @param  {object} options.note
  //  */
  // putDomainSignatureInfoBatch(options: object) {
  //   const paramOptions = ["domains", "domain_help", "note"];
  //   const optionalParams = pick(options, paramOptions);
  //   const params = { ...optionalParams };
  //   return this.http.put("/domain/signature/batch", params);
  // },
  // /**
  //  * 取得單一廳主簽名詳細資訊
  //  * @param  {string} domain
  //  */
  // getDomainSignatureDetail(domain: string) {
  //   return this.http.get(`/domain/${domain}/signature`);
  // }
};

/**
 * 取得廳主列表
 */
export const list = {
  http,
  // /**
  //  * @param  {0|1} enable 停啟用
  //  */
  // getDomainList(enable: 0 | 1) {
  //   return this.http.get("/domain", {
  //     params: { enable }
  //   });
  // },
  // /**
  //  * 依照廳主類型(真現金、假現金)取得廳主清單
  //  * @param  {string} caseTypes
  //  */
  // getDomainListByCashType(caseTypes: string) {
  //   return this.http.get("/domain/cash_type/multi_types", {
  //     params: {
  //       cash_type: caseTypes
  //     }
  //   });
  // },
  // /**
  //  * 取有開API廳主列表
  //  */
  // getOpenApiDomainList() {
  //   return this.http.get("/domain/api_domain/list");
  // },
  // /**
  //  * 取得廳主列表資料
  //  * @param  {string | number} options.id
  //  * @param  {string | number} options.page
  //  * @param  {string | number} options.limit
  //  * @param  {0|1} options.enable
  //  * @param  {0|1} options.block
  //  */
  // getDomainListData(options = {}) {
  //   const paramOptions = [
  //     "domain",
  //     "enable",
  //     "block",
  //     "page",
  //     "limit",
  //     "api_switch"
  //   ];
  //   return this.http.get("/domain/list", {
  //     params: {
  //       ...pick(options, paramOptions)
  //     }
  //   });
  // }
};

/**
 * 取得廳主資料
 */
export const profile = {
  http,
  // /**
  //  * 取得廳主自動解鎖狀態
  //  * @param  {string} domain
  //  */
  // getAutoUnlock(domain: string) {
  //   return this.http.get(`/domain/${domain}/auto_unlock`);
  // },
  // /**
  //  * 設定廳主自動解鎖狀態
  //  * @param  {string} domain
  //  * @param  {string} hour
  //  */
  // setAutoUnlock(domain: string, hour: string) {
  //   return this.http.put(`/domain/${domain}/auto_unlock`, { hour });
  // },
  // /**
  //  * 取得層級
  //  * @param  {string} domain
  //  * @param  {number} page
  //  * @param  {number} limit
  //  * @param  {string} alias
  //  * @param  {array} sort_columns
  //  * @param  {array} order_method
  //  * @param  {number} sub_ret
  //  */
  // getLevels(
  //   domain: string,
  //   page = null,
  //   limit = null,
  //   alias = "",
  //   sort_columns = [],
  //   order_method = [],
  //   sub_ret = 0
  // ) {
  //   return this.http.get(`/domain/${domain}/level/detail`, {
  //     params: {
  //       page,
  //       limit,
  //       alias,
  //       sort_columns,
  //       order_method,
  //       sub_ret
  //     }
  //   });
  // },
  // /**
  //  * 取得廳主語系
  //  * @param  {string} domain
  //  */
  // getLangage(domain: string) {
  //   return this.http.get(`/domain/${domain}/language`);
  // },
  // /**
  //  * 取得廳主線上會員人次
  //  * @param  {string} domain
  //  * @param  {string|number} interval
  //  * @param  {string} start_at
  //  * @param  {string} end_at
  //  */
  // getOnlineMember(
  //   domain: string,
  //   interval: string | number,
  //   start_at: string,
  //   end_at: string
  // ) {
  //   return this.http.get("/domain/online_member", {
  //     params: {
  //       domain,
  //       interval,
  //       start_at,
  //       end_at
  //     }
  //   });
  // },
  // /**
  //  * 輸出廳主線上會員人次檔案
  //  * @param  {string} domain
  //  * @param  {string|number} interval
  //  * @param  {string} update_date_time
  //  * @param  {object} options.start_at
  //  * @param  {object} options.end_at
  //  * @param  {object} options.export_remark
  //  */
  // exportOnlineMember(
  //   domain: string,
  //   interval: string | number,
  //   update_date_time: string,
  //   options: object
  // ) {
  //   const paramOptions = ["start_at", "end_at", "export_remark"];
  //   const optionParams = pick(options, paramOptions);
  //   const params = {
  //     domain,
  //     interval,
  //     update_date_time,
  //     ...optionParams
  //   };
  //   return this.http.post("/domain/online_member/export", params);
  // },
  // /**
  //  * 取有開API廳主資訊
  //  * @param  {number} domain
  //  */
  // getApiDomainInfo(domain: number) {
  //   return this.http.get(`/domain/${domain}/api/information`);
  // },
  // /**
  //  * 取得廳主選單
  //  */
  // getDomainMenu() {
  //   return this.http.get("/domain/menu");
  // },
  // /**
  //  * 修改廳主OTP狀態
  //  * @param  {string} domain
  //  * @param  {0|1} otp_switch
  //  */
  // putDomainOTP(domain: string, otp_switch: 0 | 1) {
  //   return this.http.put("/domain/otp", { domain, otp_switch });
  // },
  // /**
  //  * 廳主解凍結
  //  * @param  {string} domain
  //  * @param  {0|1} block
  //  */
  // putDomainBlock(domain: string, block: 0 | 1) {
  //   return this.http.put("/domain/block", { domain, block });
  // },
  // /**
  //  * 廳主改密碼
  //  * @param  {number} domain
  //  * @param  {string} new_password
  //  * @param  {boolean} reset
  //  */
  // putDomainPassword(domain: number, new_password: string, reset: boolean) {
  //   return this.http.put("/domain/password", { domain, new_password, reset });
  // }
  // /**
  //  * 取廳主基本設定
  //  * @param  {string} domain
  //  */
  // getDomainProfile(domain: string) {
  //   return this.http.get(`/domain/${domain}/profile`);
  // },
  // /**
  //  * 取大股東面板
  //  * @param  {string} domain
  //  */
  // getSCSetting(domain: string) {
  //   return this.http.get(`/domain/${domain}/agent/setting`);
  // },
  // /**
  //  * 更改大股東面板
  //  * @param  {string} domain
  //  * @param  {array} default_agents
  //  */
  // putSCSetting(domain: string, default_agents: []) {
  //   return this.http.put(`/domain/${domain}/agent/setting`, default_agents);
  // },
  // /**
  //  * 取得所有廳主個人資料
  //  * @param  {string} options.domain
  //  * @param  {object} options.api_switch
  //  * @param  {object} options.domain_type
  //  * @param  {object} options.cash_type
  //  * @param  {object} options.switch
  //  */
  // getDomainsProfile(options: object) {
  //   const paramOptions = [
  //     "domain",
  //     "api_switch",
  //     "domain_type",
  //     "cash_type",
  //     "switch"
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get("/domains/profile", { params });
  // },
  // /**
  //  * 更改廳主基本設定
  //  * @param  {string} domain
  //  * @param  {string} username
  //  * @param  {string} alias
  //  * @param  {string} domain_name
  //  * @param  {string} login_code
  //  * @param  {string} mail
  //  * @param  {string} sender
  //  */
  // putDomainProfile(
  //   domain: string,
  //   username: string,
  //   alias: string,
  //   domain_name: string,
  //   login_code: string,
  //   mail: string,
  //   sender: string
  // ) {
  //   return this.http.put(`/domain/${domain}/profile`, {
  //     username,
  //     alias,
  //     domain_name,
  //     login_code,
  //     mail,
  //     sender
  //   });
  // },
  // /**
  //  * 檢查廳主後置碼
  //  * @param  {string} domain
  //  * @param  {string} login_code
  //  */
  // checkDomainSuffix(domain: string, login_code: string) {
  //   return this.http.get(`/domain/${domain}/suffix/check`, {
  //     params: {
  //       login_code
  //     }
  //   });
  // },
  // /**
  //  * 取得廳主會員等級
  //  * @param  {string} domain
  //  */
  // getDomainMemberVIP(domain: string) {
  //   return this.http.get(`/domain/${domain}/vip_info`);
  // },
  // /**
  //  * 取得廳主訊息
  //  * @param  {string} domain
  //  * @returns string
  //  */
  // getDomainMsgSwitch(domain: string) {
  //   return this.http.get("/negative_cash/domain_message", {
  //     params: {
  //       domain
  //     }
  //   });
  // },
  // /**
  //  * 設定廳主訊息
  //  * @param  {string} domain
  //  * @param  {0|1} enable
  //  */
  // setDomainMsgSwitch(domain: string, enable: 0 | 1) {
  //   return this.http.put("/negative_cash/domain_message", {
  //     domain,
  //     enable
  //   });
  // }
};

/**
 * 取得廳主API文件相關
 */
export const apiDoc = {
  http,
  // /**
  //  * 取廳主API列表
  //  * @param  {string} domain 廳主
  //  * @param  {number} pageInfo.page 頁碼
  //  * @param  {number} pageInfo.limit 筆數
  //  * @param  {string} pageInfo.name 關鍵字搜尋
  //  */
  // getDomainApiList(domain: number, pageInfo: object) {
  //   return this.http.get(`/domain/${domain}/api/list`, {
  //     params: pageInfo
  //   });
  // },
  // /**
  //  * 修改API文件密碼
  //  * @param  {number} domain
  //  * @param  {string} apiDocumentPassword
  //  */
  // updateDomainApiPassword(domain: number, password: string) {
  //   return this.http.put(`/domain/${domain}/api/password`, {
  //     password
  //   });
  // }
};

/**
 * 取得廳主幣別
 */
export const currency = {
  http,
  // /**
  //  * 取得廳主有開放的幣別
  //  * @param  {string} domain
  //  */
  // getCurrency(domain: string) {
  //   return this.http.get(`/domain/${domain}/currency`);
  // },
  // /**
  //  * 取得廳主 - 幣別設定資料
  //  * @param  {string} domain
  //  */
  // getCurrencySetting(domain: string) {
  //   return this.http.get(`/domain/${domain}/currencies`);
  // },
  // /**
  //  * 設定廳主 - 幣別設定資料
  //  * @param  {string} domain
  //  * @param  {string} default_currency
  //  * @param  {array} currencies
  //  * @param  {array} default_sas
  //  * @param  {array} default_ags
  //  */
  // setCurrencies(
  //   domain: string,
  //   default_currency: string,
  //   currencies: [],
  //   default_sas: [],
  //   default_ags: []
  // ) {
  //   return this.http.put(`/domain/${domain}/currencies`, {
  //     default_currency,
  //     currencies,
  //     default_sas,
  //     default_ags
  //   });
  // },
  // /**
  //  * 檢查多幣別預設總代or代理帳號 checkCurrencyDefualt
  //  * @param  {string} domain
  //  * @param  {string} username
  //  * @param  {string} type
  //  * @param  {string} currency
  //  */
  // checkCurrencyDefault(
  //   domain: string,
  //   username: string,
  //   type: string,
  //   currency: string
  // ) {
  //   return this.http.get(`/domain/${domain}/check/currency/default`, {
  //     params: {
  //       username,
  //       type,
  //       currency
  //     }
  //   });
  // }
};

/**
 * 取得廳主出入款相關(銀行、錢包)
 */
export const payment = {
  http,
  // /**
  //  * 取得廳主 - 出款銀行設定資料
  //  * @param  {string} domain
  //  */
  // getBankInfoSetting(domain: string) {
  //   return this.http.get(`/domain/${domain}/withdrawal/banks`);
  // },
  // /**
  //  * 設定廳主 - 出款銀行設定資料
  //  * @param  {string} domain
  //  * @param  {[]} banks
  //  */
  // setBanks(domain: string, banks: []) {
  //   return this.http.put(`/domain/${domain}/withdrawal/banks`, {
  //     banks
  //   });
  // },
  // /**
  //  * 取免轉錢包
  //  * @param  {string} domain
  //  */
  // getDomainWallet(domain: string) {
  //   return this.http.get(`/domain/${domain}/wallet`);
  // },
  // /**
  //  * 更改免轉錢包
  //  * @param  {string} domain
  //  * @param  {number} wallet_status
  //  * @param  {boolean} member_default_wallet
  //  */
  // putDomainWallet(
  //   domain: string,
  //   wallet_status: number,
  //   member_default_wallet: boolean
  // ) {
  //   return this.http.put(`/domain/${domain}/wallet`, {
  //     wallet_status,
  //     member_default_wallet
  //   });
  // }
};

/**
 * 取得廳主驗證相關
 */
export const auth = {
  http,
  // /**
  //  * 取得廳主雙重驗證開關及圖形驗證開關狀態、以及最後操作者資訊
  //  * @param  {string} domain
  //  */
  // getUbauthStatus(domain: string) {
  //   return this.http.get(`/domain/${domain}/ubauth`);
  // },
  // /**
  //  * 修改廳主雙重驗證開關及圖形驗證開關狀態，並回傳修改後資訊、以及最後操作者資訊
  //  * @param  {string} domain
  //  * @param  {boolean} ubauth_switch
  //  * @param  {boolean} captcha_switch
  //  */
  // setUbauthSwitch(
  //   domain: string,
  //   ubauth_switch: boolean,
  //   captcha_switch: boolean
  // ) {
  //   return this.http.put(`/domain/${domain}/ubauth`, {
  //     ubauth_switch,
  //     captcha_switch
  //   });
  // },
  // /**
  //  * 取得 登入驗證管理-驗證開關
  //  * @param  {string} domain
  //  */
  // getDomainVerifyEnable(domain: string) {
  //   return this.http.get(`/login_verify/domain/${domain}/enable`);
  // },
  // /**
  //  * 修改 登入驗證管理-驗證開關
  //  * @param  {string} domain
  //  * @param  {0|1} enable
  //  */
  // putDomainVerifyEnable(domain: string, enable: 0 | 1) {
  //   return this.http.put(`/login_verify/domain/${domain}/enable/${enable}`);
  // },
  // /**
  //  * 取得 登入驗證管理-全廳裝置綁定結果
  //  * @param  {string} domain
  //  * @returns string
  //  */
  // getDeviceBindingStatus(domain: string) {
  //   return this.http.get(`/login_verify/domain/${domain}/device/binding_status`);
  // },
  // /**
  //  * 停/啟用 該廳 管端雙重驗證
  //  * @param  {string} domain
  //  * @param  {0|1} enable
  //  */
  // putEnableDomainTwoStep(domain: string, enable: 0 | 1) {
  //   return this.http.put(`/login_verify/domain/${domain}/two_step/enable`, {
  //     enable
  //   });
  // },
  // /**
  //  * 修改 登入驗證管理-驗證開關(可調整otp)
  //  * @param  {string} domain
  //  * @param  {boolean} otp_switch
  //  * @param  {boolean} ubauth_switch
  //  */
  // putDomainVerifyEnableV2(
  //   domain: string,
  //   otp_switch: boolean,
  //   ubauth_switch: boolean
  // ) {
  //   return this.http.put(`/login_verify/domain/${domain}/switch`, {
  //     otp_switch,
  //     ubauth_switch
  //   });
  // }
};

/**
 * 廳主會員餘額相關
 */
export const userBalance = {
  http,
  // /**
  //  * 取得會員餘額統計資料(bbin、利息錢包)
  //  * @param  {string} domain
  //  * @param  {string} game_code
  //  * @param  {number} page
  //  * @param  {number} limit
  //  */
  // getUserBalance(
  //   domain: string,
  //   game_code: string,
  //   page: number,
  //   limit: number
  // ) {
  //   return this.http.get("/domain/user_balance", {
  //     params: {
  //       domain,
  //       game_code,
  //       page,
  //       limit
  //     }
  //   });
  // },
  // /**
  //  * 取得會員餘額統計資料(外接遊戲)
  //  * @param  {string} domain
  //  * @param  {string} game_code
  //  * @param  {number} page
  //  * @param  {number} limit
  //  */
  // getUserBalancEexternal(
  //   domain: string,
  //   game_code: string,
  //   page: number,
  //   limit: number
  // ) {
  //   return this.http.get(`/domain/user_balance/external/${game_code}`, {
  //     params: {
  //       domain,
  //       page,
  //       limit
  //     }
  //   });
  // },
  // /**
  //  * 取得會員餘額統計資料(外接遊戲)
  //  * @param  {string} domain
  //  * @param  {string} type
  //  * @param  {string} currency
  //  * @param  {string} date_time
  //  */
  // updateUserBalance(
  //   domain: string,
  //   type: string,
  //   currency: string,
  //   date_time: string
  // ) {
  //   return this.http.put("/domain/user_balance", {
  //     domain,
  //     type,
  //     currency,
  //     date_time
  //   });
  // },
  // /**
  //  * 取得會員餘額產品列表
  //  */
  // getUserBalanceProduct() {
  //   return this.http.get("/domain/user_balance/product/list");
  // }
};

/**
 * 廳主遊戲相關(大廳、遊戲)
 */
export const game = {
  http,
  // /**
  //  * 設定廳主遊戲大廳
  //  * @param  {string} domain
  //  * @param  {array} lobbys
  //  * @param  {array} open_all_lobbys
  //  */
  // putDomainLobby(domain: string, lobbys: [], open_all_lobbys: []) {
  //   return this.http.put("/domain/lobby", { domain, lobbys, open_all_lobbys });
  // },
  // /**
  //  * 取得該廳主有退水的lobby
  //  * @param  {string} domain
  //  */
  // getCommissionLobby(domain: string) {
  //   return this.http.get(`/domain/${domain}/commissionable_lobby`);
  // },
  // /**
  //  * 取得廳主遊戲詳細設定
  //  * @param  {string} domain
  //  */
  // getGameDatail(domain: string) {
  //   return this.http.get(`/domain/${domain}/game_detail`);
  // },
  // /**
  //  * 修改遊戲大廳
  //  * @param  {string} domain
  //  * @param  {array} lobbys
  //  * @param  {array} game_info
  //  */
  // putLobbyInfo(domain: string, lobbys: [], game_info: []) {
  //   return this.http.put(`/domain/${domain}/lobby_info`, { lobbys, game_info });
  // },
  // /**
  //  * 取得廳主遊戲開關
  //  * @param  {string} domain
  //  */
  // getLobby(domain: string) {
  //   return this.http.get(`/user/${domain}/lobby/domain`);
  // }
};

/**
 * 廳主權限相關
 */
export const permission = {
  http,
  // /**
  //  * 取得研一權限開關
  //  * @param  {string} domain
  //  * @param  {array} switchs
  //  */
  // getHadesSwitch(domain: string, switchs: []) {
  //   return this.http.get(`/domain/${domain}/hades/switch`, {
  //     params: { switchs }
  //   });
  // },
  // /**
  //  * 取得廳主可開放的權限列表
  //  * @param  {array} permission_category
  //  */
  // getDomainOpenablePermissions(permission_category: []) {
  //   return this.http.get("/domain/openable/permission", {
  //     params: {
  //       permission_category
  //     }
  //   });
  // },
  // /**
  //  * 取得單一權限所有廳主權限
  //  * @param  {string} perm_id
  //  * @param  {object} options.domain
  //  * @param  {object} options.api_switch
  //  * @param  {object} options.domain_type
  //  * @param  {object} options.cash_type
  //  * @param  {object} options.enable_filter
  //  * @param  {object} options.modify_filter
  //  */
  // getDomainsPerm(perm_id: string, options: object) {
  //   const paramOptions = [
  //     "domain",
  //     "api_switch",
  //     "domain_type",
  //     "cash_type",
  //     "enable_filter",
  //     "modify_filter"
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get(`/domains/permission/${perm_id}`, { params });
  // },
  // /**
  //  * 取得單一體系權限所有廳主權限
  //  * @param  {string} perm_id
  //  * @param  {object} options.domain
  //  * @param  {object} options.api_switch
  //  * @param  {object} options.domain_type
  //  * @param  {object} options.cash_type
  //  */
  // getDomainsRolePerm(perm_id: string, options: object) {
  //   const paramOptions = ["domain", "api_switch", "domain_type", "cash_type"];
  //   const params = pick(options, paramOptions);
  //   return this.http.get(`/domains/role/permission/${perm_id}`, { params });
  // }
};

/**
 * 廳主 ip清單 相關
 */
export const ipList = {
  http,
  // /**
  //  * 查詢 IP 是否已新增
  //  * @param  {string} domain
  //  * @param  {array} ip_list
  //  */
  // getIpWhiteCheck(domain: string, ip_list: []) {
  //   const params = { ip_list };
  //   return this.http.get(`/domain/${domain}/ip_white/check`, { params });
  // },
  // /**
  //  * 查詢 IP 設定
  //  * @param  {string} options.domain
  //  * @param  {number} options.limit
  //  * @param  {object} options.ip_list
  //  * @param  {object} options.entrances
  //  * @param  {object} options.start_date_time
  //  * @param  {object} options.end_date_time
  //  * @param  {object} options.fuzzy
  //  * @param  {object} options.page
  //  */
  // getIpWhite(options: object) {
  //   const paramOptions = [
  //     "domain",
  //     "limit",
  //     "ip_list",
  //     "entrances",
  //     "start_date_time",
  //     "end_date_time",
  //     "fuzzy",
  //     "page"
  //   ];
  //   return this.http.get("/domain/ip_white", {
  //     params: { ...pick(options, paramOptions) }
  //   });
  // },
  // /**
  //  * 查詢 IP 的國家資訊
  //  * @param  {array} ip_list
  //  */
  // getIpCountry(ip_list: []) {
  //   return this.http.get("/domain/ip_white/country", { params: { ip_list } });
  // },
  // /**
  //  * 取得廳主 IP 使用額度
  //  * @param  {string} domain
  //  */
  // getIpWhiteQuota(domain: string) {
  //   return this.http.get(`/domain/${domain}/ip_white/quota`);
  // },
  // /**
  //  * 新增 IP 設定
  //  * @param  {string} domain
  //  * @param  {array} ip_list
  //  */
  // postIpWhite(domain: string, ip_list: []) {
  //   return this.http.post(`/domain/${domain}/ip_white`, { ip_list });
  // },
  // /**
  //  * 修改 IP 設定
  //  * @param  {string} domain
  //  * @param  {array} ip_list
  //  */
  // putIpWhite(domain: string, ip_list: []) {
  //   return this.http.put(`/domain/${domain}/ip_white`, { ip_list });
  // },
  // /**
  //  * 移除 IP 設定
  //  * @param  {string} domain
  //  * @param  {array} ip_list
  //  */
  // removeIpWhite(domain: string, ip_list: []) {
  //   return this.http.delete(`/domain/${domain}/ip_white`, {
  //     data: { ip_list }
  //   });
  // },
  // /**
  //  * 查詢操作紀錄
  //  * @param  {string} domain
  //  * @param  {object} options.limit
  //  * @param  {object} options.start_date_time
  //  * @param  {object} options.end_date_time
  //  * @param  {object} options.ip_action
  //  * @param  {object} options.type
  //  * @param  {object} options.keyword
  //  * @param  {object} options.page
  //  * @param  {object} options.order
  //  */
  // getIpWhiteLog(domain: string, options: object) {
  //   const paramOptions = [
  //     "limit",
  //     "start_date_time",
  //     "end_date_time",
  //     "ip_action",
  //     "type",
  //     "keyword",
  //     "page",
  //     "order"
  //   ];
  //   return this.http.get(`/domain/${domain}/ip_white/record`, {
  //     params: pick(options, paramOptions)
  //   });
  // }
};

/**
 * Infinite Api
 */
export const infinite = {
  inf,
  // /**
  //  * 修改單一體系權限所有廳主權限
  //  * @param  {string} perm_id
  //  * @param  {array} domains_perm
  //  */
  // putDomainsRolePerm(perm_id: string, domains_perm: []) {
  //   return this.inf.put(`/domains/role/permission/${perm_id}`, {
  //     domains_perm
  //   });
  // },
  // /**
  //  * 批次套用多個廳主預設參數
  //  * @param  {number} id
  //  * @param  {number[]} domains
  //  * @param  {string[]} params
  //  */
  // putDomainsDefaultParameters(id: number, domains: number[], params: string[]) {
  //   return this.inf.put(`/domains/default/parameter/${id}`, {
  //     domains,
  //     params
  //   });
  // }
  // /**
  //  * 批次更改廳主基本設定
  //  * @param  {array} domains_profile
  //  */
  // putDomainsProfile(domains_profile: []) {
  //   return this.inf.put("/domains/profile", {
  //     domains_profile
  //   });
  // },
  // /**
  //  * 批次更改免轉錢包
  //  * @param  {array} domains_profile
  //  */
  // putDomainsWallet(domains_profile: []) {
  //   return this.inf.put("/domains/wallet", {
  //     domains_profile
  //   });
  // }
};

const domain = {
  // 預設參數
  ...defaultParameter,
  // 簽名
  ...signature,
  // 列表
  ...list,
  // 廳主資料
  ...profile,
  // API文件
  ...apiDoc,
  // 幣別
  ...currency,
  // 出入款
  ...payment,
  // 驗證
  ...auth,
  // 會員餘額
  ...userBalance,
  // 遊戲
  ...game,
  // 權限
  ...permission,
  // ip清單
  ...ipList,
  // Infinite Api
  ...infinite,
};
export default domain;
export const multi = { ...domain, http: multiHttp };
