// import { pick } from 'lodash';
import http from '@/http/http';
import multiHttp from '@/http/multi';

/**
 * 維護功能
 */
export const maintain = {
  http,
  // /**
  //  * 取得廳主維護清單
  //  * @param  {array} domains
  //  */
  // getMaintenanceList(options = {}) {
  //   const paramOptions = [
  //     'domains', // 廳主
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get('/system/domain_maintenance', {
  //     params,
  //   });
  // },
  // /**
  //  * 取得維護數量狀態
  //  */
  // getStatistics() {
  //   return this.http.get('/system/maintenance/statistics');
  // },
  // /**
  //  * 取得維護紀錄
  //  * @param  {array} domain
  //  * @param  {string} website
  //  * @param  {string} start_at
  //  * @param  {string} end_at
  //  * @param  {string} operator
  //  * @param  {number} page
  //  * @param  {number} limit
  //  */
  // getMaintenanceRecord(
  //   domain: [],
  //   website: string,
  //   start_at: string,
  //   end_at: string,
  //   operator: string,
  //   page: number,
  //   limit: number
  // ) {
  //   return this.http.get("/system/maintenance/record", {
  //     params: {
  //       domain,
  //       website,
  //       start_at,
  //       end_at,
  //       operator,
  //       page,
  //       limit
  //     }
  //   });
  // },
  // /**
  //  * 取得客端維護紀錄
  //  * @param  {string} domain
  //  * @param  {string} start_at
  //  * @param  {string} end_at
  //  * @param  {string} operator
  //  */
  // getMemberMaintenanceRecord(
  //   domain: string,
  //   start_at: string,
  //   end_at: string,
  //   operator: string
  // ) {
  //   return this.http.get("/system/maintenance/member_record", {
  //     params: {
  //       domain,
  //       start_at,
  //       end_at,
  //       operator
  //     }
  //   });
  // },
  // /**
  //  * 設定維護時間
  //  * @param  {string} id
  //  * @param  {string} website
  //  * @param  {boolean} send
  //  * @param  {string} start_at
  //  * @param  {string} end_at
  //  */
  // setMaintainTime(
  //   id: string,
  //   website: string,
  //   send: boolean,
  //   start_at: string,
  //   end_at: string
  // ) {
  //   return this.http.put(`/system/${id}/maintenance_time`, {
  //     website,
  //     start_at,
  //     send,
  //     end_at
  //   });
  // },
  // /**
  //  * 設定單廳快速維護
  //  * @param  {string} id
  //  * @param  {0|1} enable
  //  * @param  {string} website
  //  * @param  {boolean} send
  //  */
  // setDomainMaintain(id: string, enable: 0 | 1, website: string, send: boolean) {
  //   return this.http.put(`/system/${id}/maintenance/${enable}`, {
  //     website,
  //     send
  //   });
  // },
  // /**
  //  * 設定管端維護
  //  * @param  {string} id
  //  * @param  {0|1} enable
  //  * @param  {boolean} send
  //  */
  // setMemberMaintain(id: string, enable: 0 | 1, send: boolean) {
  //   return this.http.put(`/system/${id}/member_maintenance/${enable}`, {
  //     send
  //   });
  // },
  // /**
  //  * 設定維護備註
  //  * @param  {string} id
  //  * @param  {string} note
  //  */
  // setDomainMaintainNote(id: string, note: string) {
  //   return this.http.put(`/system/${id}/maintenance/note`, {
  //     site: 1,
  //     note
  //   });
  // },
  /**
   * 取得單一功能維護狀態
   * @param  {string} permission
   */
  getFeatureEntranceMaintenanceStatus(permission: string) {
    return this.http.get('/feature/entrance/maintenance/status', {
      params: {
        permission,
      },
    });
  },
  // /**
  //  * 取功能維護狀態清單
  //  * @param  {object} options.lang
  //  * @param  {object} options.permission
  //  */
  // getFeatureMaintenanceList(options: object) {
  //   const paramOptions = [
  //     "lang", // 語系
  //     "permission" // 權限名稱
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get("/feature/maintenance", params);
  // },
};

/**
 * 損益監控系統
 */
export const payoffMonitor = {
  http,
  // /**
  //  * 取得群組
  //  */
  // getGroupList() {
  //   return this.http.get("/system/payoff_monitor/group_list");
  // },
  // /**
  //  * 取得監控間距時間設定
  //  * @param  {string} domain
  //  */
  // getMonitorInterval(domain: string) {
  //   return this.http.get(`/system/payoff_monitor/interval/${domain}`);
  // },
  // /**
  //  * 修改監控間距時間設定
  //  * @param  {string} domain
  //  * @param  {string|number} live
  //  * @param  {string|number} prob
  //  * @param  {string|number} sport
  //  * @param  {string|number} lottery
  //  * @param  {string|number} card
  //  */
  // replaceMonitorInterval(
  //   domain: string,
  //   live: string | number,
  //   prob: string | number,
  //   sport: string | number,
  //   lottery: string | number,
  //   card: string | number
  // ) {
  //   return this.http.put(`/system/payoff_monitor/interval/${domain}`, {
  //     live,
  //     prob,
  //     sport,
  //     lottery,
  //     card
  //   });
  // },
  // /**
  //  * 取得監控設定清單
  //  * @param  {string} group_id
  //  * @param  {string} domain
  //  * @param  {string|number} lobby
  //  * @param  {string} category
  //  * @param  {string} username
  //  */
  // getMonitorList(
  //   group_id: string,
  //   domain: string,
  //   lobby: string | number,
  //   category: string,
  //   username: string
  // ) {
  //   return this.http.get("/system/payoff_monitor/list", {
  //     params: {
  //       group_id,
  //       domain,
  //       lobby,
  //       category,
  //       username
  //     }
  //   });
  // },
  // /**
  //  * 取得單一廳主監控設定清單
  //  * @param  {string} domain
  //  * @param  {string} lobby
  //  * @param  {string} category
  //  * @param  {string} username
  //  */
  // getDomainMonitorList(
  //   domain: string,
  //   lobby: string,
  //   category: string,
  //   username: string
  // ) {
  //   return this.http.get("/system/payoff_monitor/domain/list", {
  //     params: {
  //       domain,
  //       lobby,
  //       category,
  //       username
  //     }
  //   });
  // },
  // /**
  //  * 新增共用監控條件
  //  * @param  {[]} groups
  //  * @param  {[]} lobbys
  //  * @param  {number} total_win
  //  * @param  {number} total_lose
  //  * @param  {number} member_win
  //  * @param  {number} member_lose
  //  * @param  {number} bet_amount
  //  * @param  {number} day
  //  * @param  {number} percent
  //  */
  // createCommonMonitor(
  //   groups: [],
  //   lobbys: [],
  //   total_win: number,
  //   total_lose: number,
  //   member_win: number,
  //   member_lose: number,
  //   bet_amount: number,
  //   day: number,
  //   percent: number
  // ) {
  //   return this.http.post("/system/payoff_monitor/common", {
  //     groups,
  //     lobbys,
  //     total_win,
  //     total_lose,
  //     member_win,
  //     member_lose,
  //     bet_amount,
  //     day,
  //     percent
  //   });
  // },
  // /**
  //  * 新增單一監控條件
  //  * @param  {string} domain
  //  * @param  {[]} groups
  //  * @param  {[]} lobbys
  //  * @param  {number} total_win
  //  * @param  {number} total_lose
  //  * @param  {number} member_win
  //  * @param  {number} member_lose
  //  * @param  {number} bet_amount
  //  * @param  {number} day
  //  * @param  {number} percent
  //  */
  // createSingleMonitor(
  //   domain: string,
  //   groups: [],
  //   lobbys: [],
  //   total_win: number,
  //   total_lose: number,
  //   member_win: number,
  //   member_lose: number,
  //   bet_amount: number,
  //   day: number,
  //   percent: number
  // ) {
  //   return this.http.post(`/system/payoff_monitor/single/${domain}`, {
  //     groups,
  //     lobbys,
  //     total_win,
  //     total_lose,
  //     member_win,
  //     member_lose,
  //     bet_amount,
  //     day,
  //     percent
  //   });
  // },
  // /**
  //  * 新增特定會員監控條件
  //  * @param  {string} domain
  //  * @param  {[]} groups
  //  * @param  {[]} lobbys
  //  * @param  {number} member_win
  //  * @param  {number} member_lose
  //  * @param  {number} bet_amount
  //  * @param  {number} day
  //  * @param  {number} percent
  //  * @param  {string} username
  //  */
  // createMemberMonitor(
  //   domain: string,
  //   groups: [],
  //   lobbys: [],
  //   member_win: number,
  //   member_lose: number,
  //   bet_amount: number,
  //   day: number,
  //   percent: number,
  //   username: string
  // ) {
  //   return this.http.post(`/system/payoff_monitor/member/${domain}`, {
  //     groups,
  //     lobbys,
  //     member_win,
  //     member_lose,
  //     bet_amount,
  //     day,
  //     percent,
  //     username
  //   });
  // },
  // /**
  //  * 修改監控條件
  //  * @param  {string|number} id
  //  * @param  {[]} lobbys
  //  * @param  {number} total_win
  //  * @param  {number} total_lose
  //  * @param  {number} member_win
  //  * @param  {number} member_lose
  //  * @param  {number} bet_amount
  //  * @param  {number} day
  //  * @param  {number} percent
  //  * @param  {string} username
  //  */
  // updateMonitor(
  //   id: string | number,
  //   lobbys: [],
  //   total_win: number,
  //   total_lose: number,
  //   member_win: number,
  //   member_lose: number,
  //   bet_amount: number,
  //   day: number,
  //   percent: number,
  //   username: string
  // ) {
  //   return this.http.put(`/system/payoff_monitor/${id}`, {
  //     lobbys,
  //     total_win,
  //     total_lose,
  //     member_win,
  //     member_lose,
  //     bet_amount,
  //     day,
  //     percent,
  //     username
  //   });
  // },
  // /**
  //  * 刪除條件
  //  * @param  {string|number} id
  //  */
  // deleteMonitor(id: string | number) {
  //   return this.http.delete(`/system/payoff_monitor/${id}`);
  // },
  // /**
  //  * 刪除某監控條件之單一遊戲
  //  * @param  {string|number} id
  //  * @param  {string|number} lobby
  //  */
  // deleteMonitorLobby(id: string | number, lobby: string | number) {
  //   return this.http.delete(`/system/payoff_monitor/${id}/lobby`, {
  //     params: {
  //       lobby
  //     }
  //   });
  // },
  // /**
  //  * 取得損益監控操作記錄
  //  * @param  {string} start_date
  //  * @param  {string} end_date
  //  * @param  {string|number} group_id
  //  * @param  {string} act
  //  * @param  {string} category
  //  * @param  {string|number} domain
  //  * @param  {string} username
  //  * @param  {number} page
  //  * @param  {number} limit
  //  * @param  {string} order
  //  */
  // getRecord(
  //   start_date: string,
  //   end_date: string,
  //   group_id: string | number,
  //   act: string,
  //   category: string,
  //   domain: string | number,
  //   username: string,
  //   page: number,
  //   limit: number,
  //   order: string
  // ) {
  //   return this.http.get("/system/payoff_monitor/record", {
  //     params: {
  //       start_date,
  //       end_date,
  //       group_id,
  //       act,
  //       category,
  //       domain,
  //       username,
  //       page,
  //       limit,
  //       order
  //     }
  //   });
  // },
  // /**
  //  * 取得警告通知紀錄
  //  * @param  {string} start_date
  //  * @param  {string} end_date
  //  * @param  {string|number} group_id
  //  * @param  {string|number} domain
  //  * @param  {string|number} lobby
  //  * @param  {boolean} judge
  //  * @param  {string} category
  //  * @param  {string} type
  //  * @param  {string} username
  //  * @param  {number} page
  //  * @param  {number} limit
  //  * @param  {string} order
  //  * @param  {string} sort
  //  */
  // getAlert(
  //   start_date: string,
  //   end_date: string,
  //   group_id: string | number,
  //   domain: string | number,
  //   lobby: string | number,
  //   judge: boolean,
  //   category: string,
  //   type: string,
  //   username: string,
  //   page: number,
  //   limit: number,
  //   order: string,
  //   sort: string
  // ) {
  //   return this.http.get("/system/payoff_monitor/alert", {
  //     params: {
  //       start_date,
  //       end_date,
  //       group_id,
  //       domain,
  //       lobby,
  //       judge,
  //       category,
  //       type,
  //       username,
  //       page,
  //       limit,
  //       order,
  //       sort
  //     }
  //   });
  // },
  // /**
  //  * 取得監控條件遊戲細項設定
  //  * @param  {string} id
  //  */
  // getMonitorGameTypeDetail(id: string) {
  //   return this.http.get(`/system/payoff_monitor/${id}/game_type/detail`);
  // }
};

/**
 * Api 文件
 */
export const apiDoc = {
  http,
  // /**
  //  * 取得 Api 文件
  //  */
  // getApiDocument() {
  //   return this.http.get("/system/api_document");
  // },
  // /**
  //  * 匯出 external 的 API 文件
  //  * @param  {object} options.lang
  //  * @param  {object} options.routes_id
  //  * @param  {object} options.export_remark
  //  */
  // exportApiDocument(options: object) {
  //   const paramOptions = ["lang", "routes_id", "export_remark"];
  //   const params = pick(options, paramOptions);
  //   return this.http.post("/system/api_document/export", params);
  // }
};

/**
 * 系統環境
 */
export const config = {
  http,
  // /**
  //  * 取得關帳日設定
  //  */
  // getCloseAccountDate() {
  //   return this.http.get("/system/close_account_date");
  // }
};

export const system = {
  ...maintain,
  ...payoffMonitor,
  ...apiDoc,
  ...config,
};

export default system;
export const multi = { ...system, http: multiHttp };
