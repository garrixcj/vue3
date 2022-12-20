import type { PriceListType } from '../common/estimate';

export as namespace UrlManagementApply;

export type Buy = NonNullable<PriceListType['option']>;
export type Management = NonNullable<PriceListType['option']>;
// 基本設定
export type BasicSetting = {
  buy: Buy;
  management: Management;
  domainType: 'normal' | 'simple';
  highRisk: 'over' | 'binding';
  checkItem: 'txt' | 'nameserver' | '';
  websiteProviderPerm: boolean;
  websiteProvider: string;
  username: string;
  password: string;
  applyTime: string;
  finishTime: string;
};

// 域名設定 - 申請域名
export type ApplyDomain = {
  key: number;
  domain: string;
  format: string;
  legal: boolean;
};

// 預估費用
export type EstimateTableData = {
  item: string;
  option: string;
  cost: string;
  pay: number;
  count: string;
  amount: string;
};

// 各購買方式的上限筆數 - api回傳
export type RestrictionNumApi = {
  id: number;
  restriction_type: string;
  restriction_limit: number;
};

// 域名設定 - 申請域名 - 送單的Response
type FailedType = 'verify_DNS' | 'verify_domain';
type FailedDetail = {
  domain: string;
  result: string;
};
export type PostApplyFailedResp = Record<FailedType, FailedDetail[]>;

// 域名設定 - 申請域名 - 送單過後的列表
export type CallbackUrlList = {
  domain: string;
  format: boolean;
  formatMsg: string;
  dns: boolean;
  dnsMsg: string;
  result: boolean;
};
