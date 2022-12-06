import { pick } from 'lodash';
import http from '@/http/http';
import multiHttp from '@/http/multi';
// import inf from '@/http/inf';

/**
 * 月結對帳相關
 */
export const monthly = {
  http,
  // /**
  //  * 取得所有條件設定列表資料(包含設定)
  //  * @param  {string} id
  //  */
  // getConditionList(id: string) {
  //   return this.http.get("/report/monthly_reconciliation/condition", {
  //     params: {
  //       id
  //     }
  //   });
  // },
  // /**
  //  * 刪除單一條件資料
  //  * @param  {string} condition_id
  //  */
  // deleteCondition(condition_id: string) {
  //   return this.http.delete(
  //     `/report/monthly_reconciliation/condition/${condition_id}`
  //   );
  // },
  // /**
  //  * 取得所有條件設定(只有條件名稱和ID)
  //  */
  // getConditions() {
  //   return this.http.get("/report/monthly_reconciliation/condition_list");
  // },
  // /**
  //  * 取得條件設定可設定的遊戲大廳(包含特殊分類)
  //  */
  // getConditionLobbies() {
  //   return this.http.get("/report/monthly_reconciliation/lobby_list");
  // },
  // /**
  //  * 取得BB產品遊戲
  //  */
  // getBBProduct() {
  //   return this.http.get("/report/monthly_reconciliation/bb_product");
  // },
  // /**
  //  * 新增單一條件資料
  //  * @param  {string} condition_name
  //  * @param  {string} guaranteed_amount
  //  * @param  {string} mod_type
  //  * @param  {string} payoff_detail
  //  */
  // addCondition(
  //   condition_name: string,
  //   guaranteed_amount: string,
  //   mod_type: string,
  //   payoff_detail: string
  // ) {
  //   return this.http.post("/report/monthly_reconciliation/condition", {
  //     condition_name,
  //     guaranteed_amount,
  //     mod_type,
  //     payoff_detail
  //   });
  // },
  // /**
  //  * 編輯單一條件資料
  //  * @param  {string} condition_id
  //  * @param  {string} condition_name
  //  * @param  {string} guaranteed_amount
  //  * @param  {string} mod_type
  //  * @param  {string} payoff_detail
  //  */
  // putCondition(
  //   condition_id: string,
  //   condition_name: string,
  //   guaranteed_amount: string,
  //   mod_type: string,
  //   payoff_detail: string
  // ) {
  //   return this.http.put(
  //     `/report/monthly_reconciliation/condition/${condition_id}`,
  //     {
  //       condition_name,
  //       guaranteed_amount,
  //       mod_type,
  //       payoff_detail
  //     }
  //   );
  // },
  // /**
  //  * 取得廳主條件設定列表資料(包含設定)
  //  * @param  {object} options.domain
  //  * @param  {object} options.id
  //  */
  // getDomainsCondition(options: object) {
  //   const paramOptions = ["domain", "id"];
  //   const params = pick(options, paramOptions);
  //   return this.http.get("/report/monthly_reconciliation/domain/condition", {
  //     params
  //   });
  // },
  // /**
  //  * 設定單ㄧ廳主的條件
  //  * @param  {string} domain
  //  * @param  {string} id
  //  */
  // setDomainCondition(domain: string, id: string) {
  //   return this.http.put(
  //     `report/monthly_reconciliation/domain/${domain}/condition`,
  //     { id }
  //   );
  // },
  // /**
  //  * 取得月結操作記錄
  //  * @param  {object} options.mr_tab
  //  * @param  {object} options.mr_action
  //  * @param  {object} options.domain
  //  * @param  {object} options.start_date_time
  //  * @param  {object} options.end_date_time
  //  * @param  {object} options.operator
  //  * @param  {object} options.sort
  //  * @param  {object} options.order
  //  * @param  {object} options.page
  //  * @param  {object} options.limit
  //  */
  // getMonthlyRecord(options: object) {
  //   const paramOptions = [
  //     "mr_tab",
  //     "mr_action",
  //     "domain",
  //     "start_date_time",
  //     "end_date_time",
  //     "operator",
  //     "sort",
  //     "order",
  //     "page",
  //     "limit"
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get("/report/monthly_reconciliation/record", { params });
  // },
  // /**
  //  * 取得期數管理列表
  //  * @param  {object} options.year
  //  * @param  {object} options.id
  //  */
  // getPeriodList(options: object) {
  //   const paramOptions = [
  //     "year", // 期數年份
  //     "id" // 期數id
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get("/report/monthly_reconciliation/period", { params });
  // },
  // /**
  //  * 新增期數管理列表
  //  * @param  {string} period_name
  //  * @param  {string} end_at
  //  * @param  {object} options.start_at
  //  */
  // postPeriodList(period_name: string, end_at: string, options: object) {
  //   const paramOptions = [
  //     "start_at" // 開始時間
  //   ];
  //   const optionParams = pick(options, paramOptions);
  //   const params = {
  //     period_name,
  //     end_at,
  //     ...optionParams
  //   };
  //   return this.http.post("/report/monthly_reconciliation/period", params);
  // },
  // /**
  //  * 修改期數管理列表
  //  * @param  {string} period_id
  //  * @param  {string} period_name
  //  * @param  {string} end_at
  //  * @param  {object} options.start_at
  //  */
  // putPeriodList(
  //   period_id: string,
  //   period_name: string,
  //   end_at: string,
  //   options: object
  // ) {
  //   const paramOptions = [
  //     "start_at" // 開始時間
  //   ];
  //   const optionParams = pick(options, paramOptions);
  //   const params = {
  //     period_name,
  //     end_at,
  //     ...optionParams
  //   };
  //   return this.http.put(
  //     `/report/monthly_reconciliation/period/${period_id}`,
  //     params
  //   );
  // },
  // /**
  //  * 刪除期數管理列表
  //  * @param  {string} period_id
  //  */
  // deletePeriodList(period_id: string) {
  //   return this.http.delete(`/report/monthly_reconciliation/period/${period_id}`);
  // },
  // /**
  //  * 修改密碼
  //  * @param  {string} domain
  //  * @param  {string} mr_new_password
  //  * @param  {0|1} reset
  //  */
  // putMonthlyPwd(domain: string, mr_new_password: string, reset: 0 | 1) {
  //   return this.http.put(
  //     `/report/monthly_reconciliation/domain/${domain}/password`,
  //     {
  //       mr_new_password,
  //       reset
  //     }
  //   );
  // },
  // /**
  //  * 帳務統計-單一存檔
  //  * @param  {string} period
  //  * @param  {string} domain
  //  */
  // saveMonthly(period: string, domain: string) {
  //   return this.http.put(
  //     `/report/monthly_reconciliation/domain/${domain}/period/${period}/save`
  //   );
  // },
  // /**
  //  * 帳務統計-批次存檔
  //  * @param  {string} period
  //  * @param  {array} domains
  //  */
  // saveBatchMonthly(period: string, domains: []) {
  //   return this.http.put(
  //     `/report/monthly_reconciliation/period/${period}/batch_save`,
  //     { domains }
  //   );
  // },
  // /**
  //  * 取帳務查詢列表
  //  * @param  {string} search_type
  //  * @param  {object} options.period
  //  * @param  {object} options.domain
  //  * @param  {object} options.start_amount
  //  * @param  {object} options.end_amount
  //  */
  // getMonthlyAccountsSearch(search_type: string, options: object) {
  //   const paramOptions = [
  //     "period", // 期數
  //     "domain", // 廳主id
  //     "start_amount", // 起始應交收金額
  //     "end_amount" // 結束應交收金額
  //   ];
  //   const optionParams = pick(options, paramOptions);
  //   const params = {
  //     search_type, // 1:期數, 2:應交收金額
  //     ...optionParams
  //   };
  //   return this.http.get("/report/monthly_reconciliation/search/account_list", {
  //     params
  //   });
  // },
  // /**
  //  * 取帳務統計-詳細資料
  //  * @param  {string} domain
  //  * @param  {string} period
  //  */
  // getMonthlyReconciliationDetail(domain: string, period: string) {
  //   return this.http.get(
  //     `/report/monthly_reconciliation/domain/${domain}/period/${period}/detail`
  //   );
  // },
  // /**
  //  * 取帳務查詢-詳細資料
  //  * @param  {string} domain
  //  * @param  {string} period
  //  */
  // getMonthlySearchDetail(domain: string, period: string) {
  //   return this.http.get(
  //     `/report/monthly_reconciliation/search/domain/${domain}/period/${period}/account_detail`
  //   );
  // },
  // /**
  //  * 帳務統計-匯出
  //  * @param  {string} period
  //  * @param  {object} options.domain
  //  * @param  {object} options.save
  //  * @param  {object} options.export_remark
  //  */
  // exportMonthlyReconciliation(period: string, options: object) {
  //   const paramOptions = [
  //     "domain", // 廳主id
  //     "save", // 存檔狀態 1:已存檔, 2:未存檔
  //     "export_remark" // 備註
  //   ];
  //   const optionParams = pick(options, paramOptions);
  //   const params = {
  //     period,
  //     ...optionParams
  //   };
  //   return this.http.post("/report/monthly_reconciliation/list/export", params);
  // },
  // /**
  //  * 帳務查詢-匯出
  //  * @param  {string} search_type
  //  * @param  {object} options.period
  //  * @param  {object} options.domain
  //  * @param  {object} options.start_amount
  //  * @param  {object} options.end_amount
  //  * @param  {object} options.export_remark
  //  */
  // exportMonthlyAccountsSearch(search_type: string, options: object) {
  //   const paramOptions = [
  //     "period", // 期數
  //     "domain", // 廳主id
  //     "start_amount", // 起始應交收金額
  //     "end_amount", // 結束應交收金額
  //     "export_remark" // 備註
  //   ];
  //   const optionParams = pick(options, paramOptions);
  //   const params = {
  //     search_type,
  //     ...optionParams
  //   };
  //   return this.http.post(
  //     "/report/monthly_reconciliation/search/account_list/export",
  //     params
  //   );
  // },
  // /**
  //  * 帳務統計-詳細內容-匯出
  //  * @param  {string} domain
  //  * @param  {string} period
  //  * @param  {object} options.export_remark
  //  */
  // exportMonthlyReconciliationDetail(
  //   domain: string,
  //   period: string,
  //   options: object
  // ) {
  //   const paramOptions = [
  //     "export_remark" // 備註
  //   ];
  //   const optionParams = pick(options, paramOptions);
  //   const params = {
  //     domain,
  //     period,
  //     ...optionParams
  //   };
  //   return this.http.post(
  //     `/report/monthly_reconciliation/domain/${domain}/period/${period}/export`,
  //     params
  //   );
  // },
  // /**
  //  * 帳務查詢-詳細內容-匯出
  //  * @param  {string} domain
  //  * @param  {string} period
  //  * @param  {object} options.export_remark
  //  */
  // exportMonthlySearchDetail(domain: string, period: string, options: object) {
  //   const paramOptions = [
  //     "export_remark" // 備註
  //   ];
  //   const optionParams = pick(options, paramOptions);
  //   const params = {
  //     domain,
  //     period,
  //     ...optionParams
  //   };
  //   return this.http.post(
  //     `/report/monthly_reconciliation/search/domain/${domain}/period/${period}/export`,
  //     params
  //   );
  // }
};

/**
 * 分析圖表類資料
 */
export const analysis = {
  http,
  // /**
  //  * 日期區間圖表
  //  */
  // getDateRange() {
  //   return this.http.get("/report/chart/date_range");
  // },
  // /**
  //  * 取得會員額度
  //  * @param  {string} start_date
  //  * @param  {string} end_date
  //  * @param  {string} user_id
  //  */
  // getAmount(start_date: string, end_date: string, user_id: string) {
  //   return this.http.get(`/report/chart/${user_id}/amount`, {
  //     params: {
  //       start_date,
  //       end_date
  //     }
  //   });
  // },
  // /**
  //  * 遊戲圖表資料
  //  * @param  {string} start_date
  //  * @param  {string} end_date
  //  * @param  {[]} domains
  //  */
  // getGameChart(start_date: string, end_date: string, domains: []) {
  //   return this.http.get("/report/analysis/lobbychart", {
  //     params: {
  //       start_date,
  //       end_date,
  //       domains
  //     }
  //   });
  // },
  // /**
  //  * 遊戲分析報表資料
  //  * @param  {string} start_date
  //  * @param  {string} end_date
  //  * @param  {[]} lobbys
  //  * @param  {[]} domains
  //  * @param  {number} page
  //  * @param  {number} limit
  //  * @param  {string} sort
  //  * @param  {string} order
  //  */
  // getGameReport(
  //   start_date: string,
  //   end_date: string,
  //   lobbys: [],
  //   domains: [],
  //   page: number,
  //   limit: number,
  //   sort: string,
  //   order: string
  // ) {
  //   return this.http.get("/report/analysis/gamereport", {
  //     params: {
  //       start_date,
  //       end_date,
  //       lobbys,
  //       domains,
  //       page,
  //       limit,
  //       sort, // 依照xxx做排序
  //       order // asc, desc
  //     }
  //   });
  // },
  // /**
  //  * 單一遊戲大廳分析報表
  //  * @param  {string} start_date
  //  * @param  {string} end_date
  //  * @param  {string} lobby
  //  * @param  {[]} domains
  //  */
  // getGameReportLobby(
  //   start_date: string,
  //   end_date: string,
  //   lobby: string,
  //   domains: []
  // ) {
  //   return this.http.get(`/report/analysis/gamereport/${lobby}`, {
  //     params: {
  //       start_date,
  //       end_date,
  //       domains
  //     }
  //   });
  // },
  // /**
  //  * 單一遊戲分析報表
  //  * @param  {string} start_date
  //  * @param  {string} end_date
  //  * @param  {string} lobby
  //  * @param  {string} gametype
  //  * @param  {[]} domains
  //  */
  // getGameReportDetail(
  //   start_date: string,
  //   end_date: string,
  //   lobby: string,
  //   gametype: string,
  //   domains: []
  // ) {
  //   return this.http.get(`/report/analysis/gamereport/${lobby}/${gametype}`, {
  //     params: {
  //       start_date,
  //       end_date,
  //       domains
  //     }
  //   });
  // },
  // /**
  //  * 遊戲圖表儀表板資料
  //  * @param  {[]} start_dates
  //  * @param  {[]} end_dates
  //  * @param  {[]} domains
  //  * @param  {string} time_detail
  //  * @param  {string} title_detail
  //  */
  // getDashBoard(
  //   start_dates: [],
  //   end_dates: [],
  //   domains: [],
  //   time_detail: string,
  //   title_detail: string
  // ) {
  //   return this.http.get("/report/analysis/dashboard", {
  //     params: {
  //       start_dates,
  //       end_dates,
  //       domains,
  //       time_detail,
  //       title_detail
  //     }
  //   });
  // },
  // /**
  //  * 遊戲分析報表匯出
  //  * @param  {string} active_card
  //  * @param  {[]} date
  //  * @param  {[]} gametypes
  //  * @param  {string} lobby
  //  * @param  {object} condition
  //  * @param  {number} min
  //  * @param  {number} max
  //  * @param  {string} domain
  //  * @param  {string} domain_type
  //  */
  // postGameAnalysisExport(
  //   active_card: string,
  //   date: [],
  //   gametypes: [],
  //   lobby: string,
  //   condition: object,
  //   min: number,
  //   max: number,
  //   domain: string,
  //   domain_type: string
  // ) {
  //   return this.http.post(`/report/game_analysis/export/${active_card}`, {
  //     date_interval: date,
  //     gametypes,
  //     lobby,
  //     condition,
  //     min,
  //     max,
  //     domain,
  //     domain_type
  //   });
  // },
  // /**
  //  * 新營運分析圖遊戲圖表匯出
  //  * @param  {string} start_date
  //  * @param  {string} end_date
  //  * @param  {object} options.domains
  //  * @param  {object} options.export_remark
  //  */
  // postAnalysisGameChartExport(
  //   start_date: string,
  //   end_date: string,
  //   options: object
  // ) {
  //   const paramOptions = ["domains", "export_remark"];
  //   const optionParams = pick(options, paramOptions);
  //   const params = {
  //     start_date,
  //     end_date,
  //     ...optionParams
  //   };
  //   return this.http.post("/report/analysis/lobby/export", params);
  // }
};

/**
 * Infinite Api
 */
export const infinite = {
  // inf,
  // /**
  //  * 帳務統計
  //  * @param  {string} period
  //  * @param  {object} options.domain
  //  * @param  {object} options.save
  //  */
  // getMonthlyReconciliation(period: string, options: object) {
  //   const paramOptions = [
  //     "domain", // 廳主id
  //     "save" // 存檔狀態 1:已存檔, 2:未存檔
  //   ];
  //   const optionParams = pick(options, paramOptions);
  //   const params = {
  //     period,
  //     ...optionParams
  //   };
  //   return this.inf.get("/report/monthly_reconciliation/list", { params });
  // },
  // /**
  //  * 遊戲分析資料
  //  * @param  {any} data
  //  * @param  {string} tabName
  //  * @param  {[]} gametypesData
  //  */
  // getGameAnalysisData(data: any, tabName: string, gametypesData: []) {
  //   return this.inf.get(`/report/game_analysis/${tabName}`, {
  //     params: {
  //       lobby: data.lobby,
  //       gametypes: gametypesData,
  //       date_interval: data.date_interval,
  //       condition: data.condition,
  //       max: data.max === "" ? null : data.max,
  //       min: data.min === "" ? null : data.min,
  //       domain: data.domain === 0 ? null : data.domain,
  //       domain_type: data.domain_type === "all" ? null : data.domain_type,
  //       sort: data.sort,
  //       sort_date: data.sort_date,
  //       order: data.order,
  //       page: data.page,
  //       limit: data.limit
  //     }
  //   });
  // }
};

export const audit = {
  http,

  /**
   * 取得核帳查詢資料
   * @param  {number} lobby
   * @param  {string} start_date
   * @param  {string} end_date
   * @param  {object} options
   */
  getAuditData(
    lobby: number,
    start_date: string,
    end_date: string,
    options: object,
  ) {
    const paramOptions = [
      'domain', // 廳主id
      'exchange', // 是否要轉換幣別(RMB)
    ];
    const optionParams = pick(options, paramOptions);
    const params = {
      start_date,
      end_date,
      ...optionParams,
    };
    return this.http.get(`/lobby/${lobby}/audit`, { params });
  },
};

export const report = {
  // 月結對帳相關
  ...monthly,
  ...analysis,
  ...infinite,
  ...audit,
};

export default report;

export const multi = { ...report, http: multiHttp };
