import pick from 'lodash/pick';
import http from '@/http/http';

// 站別系列
export const site = {
  http,
  // 取得所有廳主的站別列表
  getSiteList() {
    return http.get('/domain/site');
  },
  /**
   * 取得廳主的單一站別資訊
   * @param  {string} site_group
   */
  getSingleSiteInfo(site_group: string) {
    return this.http.get('/domain/site/info', { params: { site_group } });
  },
  /**
   * 取得單一站別的設定範例模板資訊
   * @param  {string} site_group
   */
  getSingleSettingExampleTemplate(site_group: string) {
    return this.http.get(
      `/domain/domain_name/request_template/site_group/${site_group}`,
    );
  },
};
// 列表系列
export const list = {
  http,
  /**
   * 取得異常地區列表
   */
  getAbnormalAreas() {
    return this.http.get('/domain/domain_name/abnormal_areas');
  },
  /**
   * 取得域名狀態選項過濾器資料
   */
  getDomainNameFilterOption() {
    return this.http.get('/domain_name/filter/option');
  },
  /**
   * 取得客端域名資料 (以站別搜尋)
   * @param  {string} site_group 站別
   * @param  {object} options    其他選項
   */
  getCustomerDomainBySite(
    site_group: string,
    options: { domain_name?: string; ip?: string; abnormal_area?: string },
  ) {
    const paramOptions = ['domain_name', 'ip', 'abnormal_area'];
    const optionParams = pick(options, paramOptions);
    const params = {
      site_group,
      ...optionParams,
    };
    return this.http.get('/domain/customer/domain_name/by_site', { params });
  },
  /**
   * 取得客端域名資料 (以域名搜尋)
   * @param  {number} domain       廳主id
   * @param  {array}  domain_names 域名資料
   * @param  {object} options      其他選項
   */
  getCustomerDomainByDomainName(
    domain: number,
    domain_names: string[],
    options: { abnormal_area?: string },
  ) {
    const paramOptions = ['abnormal_area'];
    const optionParams = pick(options, paramOptions);
    const params = {
      domain,
      domain_names,
      ...optionParams,
    };
    return this.http.get('/domain/customer/domain_name/by_domain_name', {
      params,
    });
  },
  /**
   * 取得客端域名資料 (以單一廳主搜尋)
   * @param  {number} domain  廳主id
   * @param  {object} options 其他選項
   */
  // 取得客端域名資料 (以廳主搜尋)
  getCustomerDomainByDomain(
    domain: number,
    options: { abnormal_area?: string },
  ) {
    const paramOptions = ['abnormal_area'];
    const optionParams = pick(options, paramOptions);
    const params = {
      ...optionParams,
    };
    return this.http.get(`/domain/${domain}/customer/domain_name`, { params });
  },
  /**
   * 取得客端域名資料 (以IP搜尋)
   * @param  {string} ip      ip
   * @param  {object} options 其他選項
   */
  getCustomerDomainByIP(ip: string, options: { abnormal_area?: string }) {
    const paramOptions = ['abnormal_area'];
    const optionParams = pick(options, paramOptions);
    const params = {
      ip,
      ...optionParams,
    };
    return this.http.get('/domain/customer/domain_name/by_ip', { params });
  },
  /**
   * 取得管端域名資料 (以域名搜尋)
   * @param {string} domain_name 域名
   * @param {number} entrance    端口(1: 廳主端, 2: 管端)
   */
  getAgentDomainName(domain_name: string, entrance: number) {
    const params = {
      domain_name,
      entrance,
    };
    return this.http.get('/domain/agent/domain_name/by_domain_name', {
      params,
    });
  },
  /**
   * 取得管端域名資料 (以站別搜尋)
   * @param {string} site_group 站別
   * @param {number} entrance   端口(1: 廳主端, 2: 管端)
   * @param {object} options    其他選項
   */
  getAgentDomainNameBySite(
    site_group: string,
    entrance: number,
    options: { domain_name?: string },
  ) {
    const paramOptions = ['domain_name'];
    const optionParams = pick(options, paramOptions);
    const params = {
      site_group,
      entrance,
      ...optionParams,
    };
    return this.http.get('domain/agent/domain_name/by_site', { params });
  },
  /**
   * 取得IP服務資料 (以站別搜尋)
   * @param {string} site_group 站別
   * @param {object} options    其他選項
   */
  getIPServiceBySite(site_group: string, options: { ip?: string }) {
    const paramOptions = ['ip'];
    const optionParams = pick(options, paramOptions);
    const params = {
      site_group,
      ...optionParams,
    };
    return http.get('/domain/ip_service/by_site', { params });
  },
  /**
   * 取得IP服務資料 (以IP搜尋)
   * @param {string} ip IP
   */
  getIPServiceByIP(ip: string) {
    const params = {
      ip,
    };
    return http.get('/domain/ip_service/by_ip', { params });
  },
  /**
   * 取得活躍域名
   * @param {string} start_date 開始日期
   * @param {string} end_date   結束日期
   * @param {object} options    其他選項
   */
  getActiveDomainName(
    start_date: string,
    end_date: string,
    options: {
      domain?: number;
      keyword?: string;
    },
  ) {
    const paramOptions = ['keyword', 'domain'];
    const optionParams = pick(options, paramOptions);
    const params = {
      start_date,
      end_date,
      ...optionParams,
    };
    return this.http.get('/domain/active/domain_name', { params });
  },
  /**
   * 操作記錄
   * @param {object} options 選填 - 操作時間、站別、操作項目、域名、單號、操作者、IP
   */
  getRecord(options = {}) {
    const paramOptions = [
      'start_date',
      'end_date',
      'site_group',
      'operator_type',
      'domain_name',
      'ticket_id',
      'operator',
      'ip',
      'page',
      'limit',
      'sort',
      'order',
    ];
    const params = pick(options, paramOptions);

    return this.http.get('/domain/domain_name/operator_record', { params });
  },
};
// 工單系列
export const ticket = {
  http,
  /**
   * 新增公司買工單
   * @param  {string} site_group 站別
   * @param  {string} web_layout 網域類型 (normal:一般型、simple:簡易型)
   * @param  {boolean} force_binding 是否為高風險域名綁定
   * @param  {string[]} domain_names 新增的網域列表 array
   */
  postCompanyTicket(
    site_group: string,
    web_layout: string,
    force_binding: boolean,
    domain_names: string[],
  ) {
    return this.http.post('/domain/domain_name/company_ticket', {
      site_group,
      web_layout,
      force_binding,
      domain_names,
    });
  },
  /**
   * 新增廳主買工單
   * @param  {string} site_group 站別
   * @param  {boolean} company_maintenance 是否為公司管
   * @param  {string} web_layout 網域類型 (normal:一般型、simple:簡易型)
   * @param  {boolean} force_binding 是否為高風險域名綁定
   * @param  {boolean} provider_permission 是否有網址商權限
   * @param  {string[]} domain_names 新增的網域列表 array
   * @param  {object} options 選填 - 網址商、帳號、密碼、驗證類型(TXT、name server)
   */
  postCustomerTicket(
    site_group: string,
    company_maintenance: boolean,
    web_layout: string,
    force_binding: boolean,
    provider_permission: boolean,
    domain_names: string[],
    options: {
      domain_provider?: boolean;
      provider_account?: string;
      provider_password?: string;
      verify_mode?: string;
    } = {},
  ) {
    return this.http.post('/domain/domain_name/customer_ticket', {
      site_group,
      company_maintenance,
      web_layout,
      force_binding,
      domain_names,
      provider_permission,
      ...options,
    });
  },
  /**
   * 取得單一工單內容
   * @param  {number} id 工單id
   */
  getTicket(id: number) {
    return this.http.get(`/domain/domain_name/ticket/${id}`);
  },
  /**
   * 作廢工單
   * @param  {number[]} id 工單id
   */
  abolishTicket(ids: number[]) {
    return this.http.put(`/domain/domain_name/tickets/cancel`, { ids });
  },
  /**
   * 取得工單列表
   * @param options.domain 廳主
   * @param options.site_group 站別
   * @param options.domain_name 域名
   * @param options.fuzzy 網域名稱是否模糊搜尋
   * @param options.ticket_id 單號
   * @param options.tickets_status 單據狀態
   * @param options.progress_rates 域名狀態
   * @param options.purchase_method 購買方式
   * @param options.maintenance_method 管理方式
   * @param options.start_date_time 申請起始日期時間
   * @param options.end_date_time 申請結束日期時間
   * @param options.finish_start_date_time 完成起始日期時間
   * @param options.finish_end_date_time 完成結束日期時間
   * @param options.page 頁碼
   * @param options.limit 一頁幾筆
   * @param options.sort 排序條件
   * @param options.order 排序方法
   */
  getTicketList(
    options: {
      domain?: number;
      site_group?: string;
      domain_name?: string;
      fuzzy?: 0 | 1;
      ticket_id?: string;
      tickets_status?: number[];
      progress_rates?: number[];
      purchase_method?: number[];
      maintenance_method?: number[];
      start_date_time?: string;
      end_date_time?: string;
      finish_start_date_time?: string;
      finish_end_date_time?: string;
      page?: number;
      limit?: number;
      sort?: string;
      order?: string;
    } = {},
  ) {
    return this.http.get('/domain/domain_name/tickets', {
      params: { ...options },
    });
  },
};
// ssl系列
export const ssl = {
  http,
  /**
   * 申請SSL憑證
   * @param  {array}   urls       域名
   * @param  {boolean} auto_renew 自動展延
   * @param  {string}  hash_token Token
   * @param  {object}  options    其他選項
   */
  applySSL(
    urls: string[],
    auto_renew: boolean,
    hash_token: string,
    options: { remark?: string },
  ) {
    const paramOptions = ['remark'];
    const optionParams = pick(options, paramOptions);
    const params = {
      urls,
      auto_renew,
      hash_token,
      ...optionParams,
    };
    return this.http.post('/ssl/apply', params);
  },
  /**
   * 更新DNS資訊
   */
  updateDNS(site_group: string) {
    return this.http.put('/domain/dns', { site_group });
  },
};
// 匯出系列
export const download = {
  http,
  /**
   * 匯出工單列表
   * @param options.export_remark 備註
   * @param options.domain 廳主
   * @param options.site_group 站別
   * @param options.domain_name 域名
   * @param options.fuzzy 網域名稱是否模糊搜尋
   * @param options.ticket_id 單號
   * @param options.tickets_status 單據狀態
   * @param options.progress_rates 域名狀態
   * @param options.purchase_method 購買方式
   * @param options.maintenance_method 管理方式
   * @param options.start_date_time 申請起始日期時間
   * @param options.end_date_time 申請結束日期時間
   * @param options.finish_start_date_time 完成起始日期時間
   * @param options.finish_end_date_time 完成結束日期時間
   */
  exportTicketList(options: {
    export_remark?: string;
    domain?: number;
    site_group?: string;
    domain_name?: string;
    fuzzy?: 0 | 1;
    ticket_id?: string;
    tickets_status?: number[];
    progress_rates?: number[];
    purchase_method?: number[];
    maintenance_method?: number[];
    start_date_time?: string;
    end_date_time?: string;
    finish_start_date_time?: string;
    finish_end_date_time?: string;
  }) {
    return this.http.post('/domain/domain_name/tickets/export', options);
  },
  /**
   * 匯出客端域名資料 (以站別搜尋)
   * @param  {string} site_group 站別
   * @param  {string} lang       語系
   * @param  {object} options    其他選項
   */
  exportCustomerDomainBySite(
    site_group: string,
    lang: string,
    options: {
      domain_name?: string;
      ip?: string;
      abnormal_area?: string;
      service_item?: number[];
      domain_name_status?: number[];
      certificate_status?: number[];
      service_error?: number[];
      table_filter?: number;
      sort?: string;
      order?: string;
      export_remark?: string;
    },
  ) {
    const paramOptions = [
      'domain_name',
      'ip',
      'abnormal_area',
      'service_item',
      'domain_name_status',
      'certificate_status',
      'service_error',
      'table_filter',
      'sort',
      'order',
      'export_remark',
    ];
    const optionParams = pick(options, paramOptions);
    const params = {
      site_group,
      lang,
      ...optionParams,
    };
    return this.http.post(
      '/domain/customer/domain_name/by_site/export',
      params,
    );
  },
  /**
   * 匯出客端域名資料 (以單一域名搜尋)
   * @param  {string} domain_name 域名
   * @param  {string} lang        語系
   * @param  {object} options     其他選項
   */
  exportCustomerDomainByDomainName(
    domain_name: string,
    lang: string,
    options: {
      domain_name?: string;
      ip?: string;
      abnormal_area?: string;
      service_item?: number[];
      domain_name_status?: number[];
      certificate_status?: number[];
      service_error?: number[];
      table_filter?: number;
      sort?: string;
      order?: string;
      export_remark?: string;
    },
  ) {
    const paramOptions = [
      'abnormal_area',
      'service_item',
      'domain_name_status',
      'certificate_status',
      'service_error',
      'table_filter',
      'sort',
      'order',
      'export_remark',
    ];
    const optionParams = pick(options, paramOptions);
    const params = {
      domain_name,
      lang,
      ...optionParams,
    };
    return this.http.post(
      '/domain/customer/domain_name/by_domain_name/export',
      params,
    );
  },
  /**
   * 匯出客端域名資料 (以IP搜尋)
   * @param  {string} ip      IP
   * @param  {string} lang    語系
   * @param  {object} options 其他選項
   */
  exportCustomerDomainByIP(
    ip: string,
    lang: string,
    options: {
      domain_name?: string;
      ip?: string;
      abnormal_area?: string;
      service_item?: number[];
      domain_name_status?: number[];
      certificate_status?: number[];
      service_error?: number[];
      table_filter?: number;
      sort?: string;
      order?: string;
      export_remark?: string;
    },
  ) {
    const paramOptions = [
      'abnormal_area',
      'service_item',
      'domain_name_status',
      'certificate_status',
      'service_error',
      'table_filter',
      'sort',
      'order',
      'export_remark',
    ];
    const optionParams = pick(options, paramOptions);
    const params = {
      ip,
      lang,
      ...optionParams,
    };
    return this.http.post('/domain/customer/domain_name/by_ip/export', params);
  },
  /**
   * 匯出客端域名資料 - 多域名
   * @param  {number} domain     廳主
   * @param  {array}  hash_token token
   * @param  {string} lang       語系
   * @param  {object} options    其他選項
   */
  exportCustomerDomainByMultipleDomain(
    domain: number,
    hash_token: string,
    lang: string,
    options: { export_remark?: string },
  ) {
    const paramOptions = ['export_remark'];
    const optionParams = pick(options, paramOptions);
    const params = {
      domain,
      hash_token,
      lang,
      ...optionParams,
    };
    return this.http.post(
      '/domain/customer/domain_name/by_batch/export',
      params,
    );
  },
  /**
   * 匯出客端域名資料 - 查無域名
   * @param  {array}  domain_names 域名
   * @param  {string} lang         語系
   * @param  {object} options      其他選項
   */
  exportCustomerDomainByNoDomain(
    domain_names: string[],
    lang: string,
    options: { export_remark?: string },
  ) {
    const paramOptions = ['export_remark'];
    const optionParams = pick(options, paramOptions);
    const params = {
      domain_names,
      lang,
      ...optionParams,
    };
    return this.http.post(
      '/domain/customer/domain_name/no_result/export',
      params,
    );
  },
  /**
   * 匯出前需設定多域名資料
   * @param {array}  domain_names 多域名
   * @param {string} hash_token   token
   */
  setDomainNamesBeforeExport(domain_names: string[], hash_token: string) {
    const params = {
      domain_names,
      hash_token,
    };
    return this.http.post('/url/domain_names/export_param', params);
  },
  /**
   * 匯出管端域名資料 (以域名搜尋)
   * @param {string} domain_name 域名
   * @param {number} entrance    端口(1: 廳主端, 2: 管端)
   * @param {string} lang        語系
   * @param {object} options     其他選項
   */
  exportAgentDomainName(
    domain_name: string,
    entrance: number,
    lang: string,
    options: {
      domain_name?: string;
      service_error?: number[];
      export_remark?: string;
    },
  ) {
    const paramOptions = ['service_error', 'export_remark'];
    const optionParams = pick(options, paramOptions);
    const params = {
      domain_name,
      entrance,
      lang,
      ...optionParams,
    };
    return this.http.post(
      '/domain/agent/domain_name/by_domain_name/export',
      params,
    );
  },
  /**
   * 匯出管端域名資料 (以站別搜尋)
   * @param {string} site_group 站別
   * @param {number} entrance   端口(1: 廳主端, 2: 管端)
   * @param {string} lang       語系
   * @param {object} options    其他選項
   */
  exportAgentDomainNameBySite(
    site_group: string,
    entrance: number,
    lang: string,
    options: {
      domain_name?: string;
      service_error?: number[];
      export_remark?: string;
    },
  ) {
    const paramOptions = ['domain_name', 'service_error', 'export_remark'];
    const optionParams = pick(options, paramOptions);
    const params = {
      site_group,
      entrance,
      lang,
      ...optionParams,
    };
    return this.http.post('/domain/agent/domain_name/by_site/export', params);
  },
  /**
   * 匯出IP服務資料 (以IP搜尋)
   * @param {string} ip      IP
   * @param {string} lang    語系
   * @param {object} options 其他選項
   */
  exportIPService(
    ip: string,
    lang: string,
    options: {
      ip?: string;
      ip_type?: number[];
      purchase_method?: number[];
      attack_status?: number[];
      table_filter?: number;
      export_remark?: string;
    },
  ) {
    const paramOptions = [
      'ip_type',
      'purchase_method',
      'attack_status',
      'table_filter',
      'export_remark',
    ];
    const optionParams = pick(options, paramOptions);
    const params = {
      ip,
      lang,
      ...optionParams,
    };
    return this.http.post('/domain/ip_service/by_ip/export', params);
  },
  /**
   * 匯出IP服務資料 (以站別搜尋)
   * @param {string} site_group 站別
   * @param {string} lang       語系
   * @param {object} options    其他選項
   */
  exportIPServiceBySite(
    site_group: string,
    lang: string,
    options: {
      ip?: string;
      ip_type?: number[];
      purchase_method?: number[];
      attack_status?: number[];
      table_filter?: number;
      export_remark?: string;
    },
  ) {
    const paramOptions = [
      'ip',
      'ip_type',
      'purchase_method',
      'attack_status',
      'table_filter',
      'export_remark',
    ];
    const optionParams = pick(options, paramOptions);
    const params = {
      site_group,
      lang,
      ...optionParams,
    };
    return this.http.post('/domain/ip_service/by_site/export', params);
  },
  /**
   * 匯出活躍域名
   * @param {string} start_date 開始日期
   * @param {string} end_date   結束日期
   * @param {object} options    其他選項
   */
  exportActiveDomainName(
    start_date: string,
    end_date: string,
    options: {
      domain?: number;
      keyword?: string;
      growing_percent?: number[];
      service_error?: number[];
      export_remark?: string;
      lang?: string;
      sort?: string;
      order?: string;
      table_filter?: number;
    },
  ) {
    const paramOptions = [
      'keyword',
      'domain',
      'service_error',
      'growing_percent',
      'export_remark',
      'lang',
      'sort',
      'order',
      'table_filter',
    ];
    const optionParams = pick(options, paramOptions);
    const params = {
      start_date,
      end_date,
      ...optionParams,
    };
    return this.http.post('/domain/active/domain_name/export', params);
  },
};
// 設定類
export const setting = {
  http,
  /**
   * 取得工單申請限制設定
   */
  getTicketsRestriction() {
    return this.http.get('/domain/domain_name/tickets/restriction');
  },
  /**
   * 修改工單申請限制數量
   * @param  {number} company_verify 公司限制數量
   * @param  {number} customer_verify 廳主限制數量
   */
  putTicketRestriction(company_verify: number, customer_verify: number) {
    return this.http.put('/domain/domain_name/tickets/restriction', {
      company_verify,
      customer_verify,
    });
  },
  /*
   * 取單一站別當天已申請網域數量
   * @param  {string} site_group 站別
   * @param  {0|1} company_purchase 是否為公司買
   */
  getSingleRequestionNum(site_group: string, company_purchase: 0 | 1) {
    return this.http.get(
      `/domain/domain_name/site_group/${site_group}/requestion_num`,
      { params: { company_purchase } },
    );
  },
  /**
   * 修改 客/管端域名 備註
   * @param  {array} site_domains 站別
   * @param  {number} entrance    端口(1: 客端, 2: 管端)
   * @param  {string} remark      備註
   */
  updateDomainNameRemark(
    site_domains: { site_group: string; domain_name: string }[],
    entrance: number,
    remark: string,
  ) {
    return this.http.put('/domain_name/remark', {
      site_domains,
      entrance,
      remark,
    });
  },
};

// 網址相關
const url = {
  ...site,
  ...list,
  ...ticket,
  ...ssl,
  ...download,
  ...setting,
};
export default url;
