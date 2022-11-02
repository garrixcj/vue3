export as namespace UrlManagementDetail;

import { type PriceListType } from '../common/estimate';

export type BasicSetting = {
  buy: PriceListType['option'];
  management: PriceListType['option'];
  domainType: 'normal' | 'simple';
  highRisk: 'over' | 'binding';
  checkItem: 'txt' | 'nameserver' | '';
  websiteProviderPerm: boolean | null;
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
