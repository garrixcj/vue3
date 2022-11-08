import { mapKeys } from 'lodash';

export type PriceListType = {
  category: 'domainName' | 'ssl' | 'ip';
  item: 'buy' | 'management' | 'oneToOne' | 'oneToMany' | null;
  option: 'bbin' | 'domain' | null;
  pay: number;
  time: 'year' | 'month';
};

// 價格列表(不用錢的不會列出。ex: item => buy的 option => domain)
export const priceList: PriceListType[] = [
  // 域名
  {
    category: 'domainName',
    // 購買方式
    item: 'buy',
    option: 'bbin',
    pay: 500,
    time: 'year',
  },
  {
    category: 'domainName',
    // 管理權限
    item: 'management',
    option: 'bbin',
    pay: 500,
    time: 'year',
  },
  {
    category: 'domainName',
    // 管理權限
    item: 'management',
    option: 'domain',
    pay: 300,
    time: 'year',
  },
  // SSL憑證
  {
    category: 'ssl',
    item: null,
    option: null,
    pay: 500,
    time: 'year',
  },
  // IP
  {
    category: 'ip',
    // 一對一
    item: 'oneToOne',
    option: 'bbin',
    pay: 2000,
    time: 'month',
  },
  {
    category: 'ip',
    // 一對一
    item: 'oneToOne',
    option: 'domain',
    pay: 2000,
    time: 'month',
  },
  {
    category: 'ip',
    // 一對多
    item: 'oneToMany',
    option: 'bbin',
    pay: 10000,
    time: 'month',
  },
];

// 將資料轉換為由category、item、option組成為key的價錢列表(當為空時不組該值)
export const priceListByMethod = mapKeys(
  priceList,
  ({ category, item, option }) => {
    return [category, item, option].filter(value => value).join('-');
  },
);

// 價格類型字典對照
export const priceListDict = {
  domainName: 'domain_name',
  ssl: 'ssl_certificate',
  ip: 'IP',
  buy: 'ways_to_purchase',
  management: 'management_permission',
  oneToOne: 'one_to_one',
  oneToMany: 'one_to_many',
  bbin: 'BBIN',
  domain: 'domain',
  month: 'month',
  year: 'year',
};
