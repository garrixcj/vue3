// 異常狀態條件
export type AbnormalStateConditions = 'notOpen' | 'partiallyOpen' | 'open';
// 基本進階條件
export type AdvancedConditions =
  | 'service'
  | 'domainNameStatus'
  | 'sslStatus'
  | 'ipType'
  | 'purchaseMethod'
  | 'attackStatus'
  | 'growingPercent';
// 進階條件
export type AdvancedConditionsType =
  | AbnormalStateConditions
  | AdvancedConditions;

// 列表資料
export type ListData = {
  id: number;
  site: {
    group: string;
    name: string;
  };
  suffix: string;
  domainName: string;
  url?: string;
  manage: number;
  previousNode: number;
  urlStatus: {
    status: boolean;
    options: UrlStatusOption[];
  };
  abnormalState: number[];
  abnormalDate?: string;
  service: number[];
  domainNameStatus: number[];
  sslStatus: number;
  ip: string;
  automaticRenewalDate: string;
  systemDetection: string;
  applySSLEnable: boolean;
  remark: string;
};

// 列表API格式
export type ListForAPI = {
  abnormal_status: number[];
  abnormal_date?: string;
  domain_name: string;
  url?: string;
  domain_name_status: number[];
  ip: string;
  login_code: string;
  manage: number;
  note: string;
  permission: number;
  renew_date: string;
  service_items: number[];
  site_group: string;
  site_name: string;
  ssl_enable: boolean;
  ssl_status: number;
  system_note: string;
  url_status: UrlStatus;
  tip: number[];
};

// 列表資料 For API
export type ListDataForAPI = {
  list: ListForAPI[];
  all: number;
  normal: number;
  abnormal: number;
  total: number;
};

// 網址狀態
export type UrlStatus = {
  http: boolean;
  https: boolean;
  ub: boolean;
};
// 網址狀態選項
export type UrlStatusOption = {
  label: 'www' | 'https' | 'http' | 'UB';
  type: string;
  url: string;
  key: 'www' | 'https' | 'http' | 'ub';
};

// 批次模式
type BatchModule = {
  visible: boolean;
  selected: ListData[];
};

// IP服務 - 列表資料
export type IPServiceListData = {
  id: number;
  siteName: string;
  suffix: string;
  purchaseMethod: number;
  domainName: string[];
  ipType: number;
  ipv4: string[];
  ipv6: string[];
  attackStatus: number[];
};

// IP服務 - 列表API格式
export type IPServiceListForAPI = {
  domain_name: string[];
  ip_type: number;
  ipv4: string[];
  ipv6: string[];
  login_code: string;
  purchase_method: number;
  site_name: string;
  under_attack: number[];
};

// IP服務 - 列表資料 For API
export type IPServiceListDataForAPI = {
  list: IPServiceListForAPI[];
  all: number;
  one_to_many: number;
  one_to_one: number;
  total: number;
};

// 備註域名表單資料
export type RemarkDomainNameForm = {
  site: string;
  siteName: string;
  suffix: string;
  domainName: string;
  applySSLEnable: boolean;
  remark: string;
};

// 活躍域名 - 列表資料
export type ActiveDomainNameListData = {
  rank: number;
  name: string;
  domain: number;
  suffix: string;
  domainName: string;
  abnormalState: number[];
  failTag: boolean;
  ipTag: boolean;
  requestGrow: number;
  requestRatio: number;
  requestTotal: number;
  loginFailGrow: number;
  loginFailRatio: number;
  loginFailTotal: number;
  loginPassGrow: number;
  loginPassRatio: number;
  loginPassTotal: number;
};

// 活躍域名 - 列表API格式
export type ActiveDomainNameListForAPI = {
  rank: number;
  domain: string;
  name: string;
  login_code: string;
  domain_name: string;
  abnormal_status: number[];
  fail_tag: boolean;
  ip_tag: boolean;
  request_grow: string;
  request_ratio: string;
  request_total: string;
  login_fail_grow: string;
  login_fail_ratio: string;
  login_fail_total: string;
  login_pass_grow: string;
  login_pass_ratio: string;
  login_pass_total: string;
};

// 活躍域名 - 列表資料 For API
export type ActiveDomainNameListDataForAPI = {
  data: ActiveDomainNameListForAPI[];
  high_risk: number;
  normal: number;
  total: number;
};
