import type { PriceListType } from '../common/estimate';

export as namespace UrlManagementDetail;

// 基本設定
export type BasicSetting = {
  buy: NonNullable<PriceListType['option']>;
  management: NonNullable<PriceListType['option']>;
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
