// import pick from 'lodash/pick';
import http from '@/http/http';
import multiHttp from '@/http/multi';
// import inf from '@/http/inf';

/**
 * 平台遊戲開關設定 (遊戲商詳設特殊API)
 */
export const gameTypeSet = {
  http,
  // /**
  //  * 平台遊戲開關設定 - 取得支援 gametype 設定的遊戲列表
  //  */
  // getGameTypeLobby() {
  //   return this.http.get("/game/gametype/lobby");
  // },
  // /**
  //  * 平台遊戲開關設定 - 取得 gametype 詳細資料
  //  * @param  {string} lobby
  //  * @param  {object} options.gametypes
  //  * @param  {object} options.domain
  //  * @param  {object} options.sort
  //  * @param  {object} options.order
  //  * @param  {object} options.page
  //  * @param  {object} options.limit
  //  */
  // getGameTypeDetail(lobby: string, options: object) {
  //   const paramOptions = [
  //     "gametypes",
  //     "domain",
  //     "sort",
  //     "order",
  //     "page",
  //     "limit"
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get(`/game/lobby/${lobby}/gametype_detail`, { params });
  // },
  // /**
  //  * 平台遊戲開關設定 - 取得單一 gametype 廳主設定詳細資料
  //  * @param  {string} lobby
  //  * @param  {string} gametype
  //  * @param  {object} options.domain
  //  * @param  {object} options.game_switch
  //  * @param  {object} options.report_switch
  //  * @param  {object} options.api_switch
  //  * @param  {object} options.domain_type
  //  * @param  {object} options.cash_type
  //  */
  // getGameTypeDomainDetail(lobby: string, gametype: string, options: object) {
  //   const paramOptions = [
  //     "domain",
  //     "game_switch",
  //     "report_switch",
  //     "api_switch",
  //     "domain_type",
  //     "cash_type"
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get(`/game/lobby/${lobby}/gametype/${gametype}`, { params });
  // },
  // /**
  //  * 平台遊戲開關設定 - BB彩票 - 設定單一gametype的廳主遊戲開關
  //  * @param  {string} gametype
  //  * @param  {array} domain_switch_set
  //  */
  // putLotteryGameType(gametype: string, domain_switch_set: []) {
  //   return this.http.put(`/game/lottery/gametype/${gametype}`, {
  //     domain_switch_set
  //   });
  // },
  // /**
  //  * 平台遊戲開關設定 - 非BB彩票 - 設定單一gametype的廳主遊戲開關
  //  * @param  {string} lobby
  //  * @param  {string} gametype
  //  * @param  {array} domain_switchs
  //  */
  // putGameType(lobby: string, gametype: string, domain_switchs: []) {
  //   return this.http.put(`/game/lobby/${lobby}/gametype/${gametype}`, {
  //     domain_switchs
  //   });
  // },
  // /**
  //  * 平台遊戲開關設定 - 設定電腦版/手機版開關 (可批次)
  //  * @param  {string} lobby
  //  * @param  {object} options.gametypes
  //  * @param  {object} options.pc_enable
  //  * @param  {object} options.mobile_enable
  //  */
  // putGameTypeDetail(lobby: string, options: object) {
  //   const paramOptions = ["gametypes", "pc_enable", "mobile_enable"];
  //   const params = pick(options, paramOptions);
  //   return this.http.put(`/game/lobby/${lobby}/gametype_detail`, { ...params });
  // },
  // /**
  //  * 平台遊戲開關設定 - 設定遊戲開關 (可批次) (非BB彩票)
  //  * @param  {string} lobby
  //  * @param  {string} domain
  //  * @param  {object} options.gametypes
  //  * @param  {object} options.game_switch
  //  */
  // putGameTypeDomain(lobby: string, domain: string, options: object) {
  //   const paramOptions = ["gametypes", "game_switch"];
  //   const params = pick(options, paramOptions);
  //   return this.http.put(`/game/lobby/${lobby}/gametype/domain/${domain}`, {
  //     ...params
  //   });
  // },
  // /**
  //  * 平台遊戲開關設定 - 設定BB彩票遊戲/報表開關 (可批次) (非BB彩票)
  //  * @param  {string} domain
  //  * @param  {object} options.gametypes
  //  * @param  {object} options.game_switch
  //  * @param  {object} options.report_switch
  //  */
  // putLotteryGameTypeDomain(domain: string, options: object) {
  //   const paramOptions = ["gametypes", "game_switch", "report_switch"];
  //   const params = pick(options, paramOptions);
  //   return this.http.put(`/game/lottery/gametype/domain/${domain}`, { ...params });
  // },
  // /**
  //  * 平台遊戲開關設定 - 取得操作記錄
  //  * @param  {object} options.start_date
  //  * @param  {object} options.end_date
  //  * @param  {object} options.lobby
  //  * @param  {object} options.gametypes
  //  * @param  {object} options.domain
  //  * @param  {object} options.gametype_action
  //  * @param  {object} options.operator
  //  * @param  {object} options.sort
  //  * @param  {object} options.order
  //  * @param  {object} options.page
  //  * @param  {object} options.limit
  //  */
  // getGametypeRecord(options: object) {
  //   const paramOptions = [
  //     "start_date",
  //     "end_date",
  //     "lobby",
  //     "gametypes",
  //     "domain",
  //     "gametype_action",
  //     "operator",
  //     "sort",
  //     "order",
  //     "page",
  //     "limit"
  //   ];
  //   const params = pick(options, paramOptions);
  //   return this.http.get("/game/gametype/record", { params });
  // },
  // /**
  //  * 取得單一Lobby的GameTypeList(上架中的全部遊戲)
  //  * @param  {string} lobby
  //  * @param  {object} options.lang
  //  * @param  {object} options.domain
  //  */
  // getOnlineGameType(lobby: string, options: object) {
  //   const paramOptions = ["lang", "domain"];
  //   const params = pick(options, paramOptions);
  //   return this.http.get(`/game/lobby/${lobby}/online_gametype`, { params });
  // },
  // /**
  //  * 取得會同步廠商開關的遊戲大廳
  //  */
  // getSyncVendorLobby() {
  //   return this.http.get("/lobby/sync_vendor");
  // }
};

/**
 * 遊戲大廳
 */
export const lobby = {
  http,
  // /**
  //  * 取全部遊戲 Lobby (遊戲開關專用)
  //  * @param  {object} options
  //  */
  // getLobbyList(options = {}) {
  //   const paramOptions = [
  //     "jackpot_enable",
  //     "mobile_report",
  //     "charts_volume",
  //     "bet_enable",
  //     "report_enable",
  //     "commissionable_enable",
  //     "source_enable",
  //     "filter_enable",
  //     "bb_tip" // todo fix origin "bbTip"
  //   ];
  //   return this.http.get("/game/lobby", {
  //     params: pick(options, paramOptions)
  //   });
  // },
  // /**
  //  * 取全部遊戲 Lobby(有分類) (遊戲開關專用)
  //  */
  // getLobbyListClass() {
  //   return this.http.get("/game/lobbyclass");
  // },
  // /**
  //  * 取全部遊戲 Lobby(有分類) (報表專用)
  //  */
  // getCategoryLobbyListByReport() {
  //   return this.http.get("/game/report/category_lobby");
  // },
  // /**
  //  * 取全部遊戲 Lobby (報表專用)
  //  */
  // getLobbyListByReport() {
  //   return this.http.get("/game/report/lobby");
  // },
  // /**
  //  * 取所有廳主的單一遊戲開關
  //  * @param  {string} lobby
  //  */
  // getDomainLobby(lobby: string) {
  //   return this.http.get(`/user/${lobby}/domainlobby`);
  // },
  // /**
  //  * 可過濾管理部分公司、現金類別、廳主類別的廳主遊戲大廳狀態
  //  * @param  {string} lobby
  //  * @param  {object} options.domain
  //  * @param  {object} options.game_switch
  //  * @param  {object} options.api_switch
  //  * @param  {object} options.domain_type
  //  * @param  {object} options.cash_type
  //  */
  // getDomainLobbyForAdmin(lobby: string, options = {}) {
  //   const keys = [
  //     "domain",
  //     "game_switch",
  //     "api_switch",
  //     "domain_type",
  //     "cash_type"
  //   ];
  //   return this.http.get(`/domain/lobby/${lobby}`, { params: pick(options, keys) });
  // }
};

/**
 * 遊戲相關(常用)
 */
export const gametype = {
  http,
  // /**
  //  * 取得單一Lobby的GameTypeList(過濾關閉遊戲)
  //  * @param  {string} lobby
  //  * @param  {string} lang
  //  * @param  {boolean} only_enable
  //  */
  // getGameTypeList(lobby: string, lang: string, only_enable: boolean) {
  //   return this.http.get("/game/gametype", {
  //     params: {
  //       lobby,
  //       lang,
  //       only_enable
  //     }
  //   });
  // },
  // /**
  //  * 取得單一Lobby多語系的GameTypeList
  //  * @param  {string} lobby
  //  */
  // getGameTypeMultiLang(lobby: string) {
  //   return this.http.get("/game/multi_lang/gametype", {
  //     params: {
  //       lobby
  //     }
  //   });
  // },
  // /**
  //  * 取得gametype（部分遊戲會回傳(html)）
  //  * @param  {object} options.enable
  //  * @param  {object} options.lobby
  //  * @param  {object} options.lang
  //  */
  // getGameTypeListForAPI(options = {}) {
  //   const keys = ["enable", "lobby", "lang"];
  //   return this.http.get("/game/api_gametype", { params: pick(options, keys) });
  // }
};

/**
 * 廳主遊戲詳細設定
 */
export const gameInfo = {
  http,
  // /**
  //  * 取遊戲詳細設定項目
  //  */
  // getGameDetailClass() {
  //   return this.http.get("/game/detail/class");
  // },
  // /**
  //  * 取所有廳主的遊戲詳細設定
  //  * @param  {object} options.domain
  //  * @param  {object} options.game_switch
  //  * @param  {object} options.api_switch
  //  * @param  {object} options.domain_type
  //  * @param  {object} options.cash_type
  //  */
  // getDomainDetail(options: object) {
  //   const keys = [
  //     "domain",
  //     "game_switch",
  //     "api_switch",
  //     "domain_type",
  //     "cash_type"
  //   ];
  //   return this.http.get("/game/domain/detail", { params: pick(options, keys) });
  // },
};

/**
 * 返水相關
 */
export const commssion = {
  http,
  // /**
  //  * 取得全部遊戲返水群組
  //  */
  // getAllCommissionGroup() {
  //   return this.http.get("/game/commission/group");
  // }
};

/**
 * 維護相關
 */
export const maintain = {
  http,
  // /**
  //  * 遊戲維護中判斷是否可新增帳號
  //  * (1:BB體育,3:BB視訊,5:BB電子,12:BB彩票,31:NewBB體育)
  //  */
  // getGameMaintain() {
  //   return this.http.get("/game/maintain");
  // },
  // /**
  //  * 取所有遊戲維護資訊
  //  * @param  {number | string} domain
  //  */
  // getLobbyMaintainStatus(domain: number | string) {
  //   return this.http.get(`/game/${domain}/maintain_status`);
  // },
  // /**
  //  * 取得當前的遊戲維護數量
  //  */
  // getMaintainAmount() {
  //   return this.http.get('/game/maintain_amount');
  // },
};

/**
 * Infinite Api
 */
export const infinite = {
  // inf,
  // /**
  //  * 批次修改廳主遊戲大廳開關狀態
  //  * @param  {string} lobby
  //  * @param  {array} lobbys // todo 定義結構
  //  */
  // putLobbyBatch(lobby: string, lobbys: []) {
  //   return this.inf.put(`/game/lobby/${lobby}/batch`, { lobbys });
  // },
  // /**
  //  * 批次修改廳主遊戲詳細設定
  //  * @param  {string} lobby
  //  * @param  {object} game_info
  //  */
  // putGameDetailBatch(lobby: string, game_info: object) {
  //   return this.inf.put(`/game/lobby/${lobby}/detail/batch`, { game_info });
  // }
};

const game = {
  ...gameTypeSet,
  ...lobby,
  ...gametype,
  ...gameInfo,
  ...commssion,
  ...maintain,
  ...infinite,
};

export default game;

export const multi = { ...game, http: multiHttp };
