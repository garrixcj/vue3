import type { PriceListType } from '../common/estimate';

export as namespace UrlManagementDetail;

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

export type EstimateTableData = {
  item: string;
  option: string;
  cost: string;
  pay: number;
  count: number;
  amount: string;
};
