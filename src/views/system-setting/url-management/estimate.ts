export type PriceListType = {
  category: 'domainName' | 'ssl' | 'ip';
  item: 'buy' | 'management' | 'oneToOne' | 'oneToMany' | null;
  option: 'bbin' | 'domain' | null;
  pay: number;
  time: 'year' | 'month';
};

// 價格列表
export const priceList: PriceListType[] = [
  {
    // 域名
    category: 'domainName',
    // 購買方式
    item: 'buy',
    option: 'bbin',
    pay: 500,
    time: 'year',
  },
  {
    // 域名
    category: 'domainName',
    // 管理權限
    item: 'management',
    option: 'bbin',
    pay: 500,
    time: 'year',
  },
  {
    // 域名
    category: 'domainName',
    // 管理權限
    item: 'management',
    option: 'domain',
    pay: 300,
    time: 'year',
  },
  {
    // SSL憑證
    category: 'ssl',
    item: null,
    option: null,
    pay: 500,
    time: 'year',
  },
  {
    // IP
    category: 'ip',
    // 一對一
    item: 'oneToOne',
    option: 'bbin',
    pay: 2000,
    time: 'month',
  },
  {
    // IP
    category: 'ip',
    // 一對一
    item: 'oneToOne',
    option: 'domain',
    pay: 2000,
    time: 'month',
  },
  {
    // IP
    category: 'ip',
    // 一對多
    item: 'oneToMany',
    option: 'bbin',
    pay: 10000,
    time: 'month',
  },
];

// 費用
export const useEstimate = () => {
  // 根據指定方式取得該估價
  const getEstimateOfChoice = (
    category: PriceListType['category'],
    item: PriceListType['item'],
    option: PriceListType['option'],
  ) => {
    return (
      priceList.find(
        obj =>
          obj.category === category &&
          obj.item === item &&
          obj.option === option,
      ) || null
    );
  };

  // 價格類型字典對照
  const priceListDict = {
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

  // 根據帶入的類型取得該對應的字典
  const getDict = (key: keyof typeof priceListDict | null) => {
    return key === null ? '' : priceListDict[key];
  };

  return {
    getEstimateOfChoice,
    getDict,
  };
};
