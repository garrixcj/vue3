import { type PriceListType } from '../estimate';

export type BasicSetting = {
  buy: PriceListType['option'];
  management: PriceListType['option'];
  domainType: 'normal' | 'simple';
  hightRisk: 'over' | 'binding';
  checkItem: 'txt' | 'nameserver' | '';
  websiteProviderPerm: boolean | null;
  websiteProvider: string;
  username: string;
  password: string;
  applyTime: string;
  finishTime: string;
};
