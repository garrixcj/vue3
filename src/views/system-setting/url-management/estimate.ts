import { useI18n } from 'vue-i18n';

// 費用
export const estimate = () => {
  const { t } = useI18n({ useScope: 'local' });
  // 價格列表
  const priceList = [
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
      item: '',
      option: '',
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

  // 價格類型字典對照
  const priceListDict = [
    {
      type: 'category',
      item: [
        { key: 'domainName', dict: t('domain_name') },
        { key: 'ssl', dict: t('ssl_certificate') },
        { key: 'ip', dict: 'IP' },
      ],
    },
    {
      type: 'item',
      item: [
        { key: 'buy', dict: t('ways_to_purchase') },
        { key: 'management', dict: t('management_permission') },
        { key: 'oneToOne', dict: t('one_to_one') },
        { key: 'oneToMany', dict: t('one_to_many') },
      ],
    },
    {
      type: 'option',
      item: [
        { key: 'bbin', dict: 'BBIN' },
        { key: 'domain', dict: t('domain') },
      ],
    },
    {
      type: 'time',
      item: [
        { key: 'month', dict: t('month') },
        { key: 'year', dict: t('year') },
      ],
    },
  ];

  // 根據指定方式取得該估價
  const getEstimateOfChoice = (
    category: string,
    item: string,
    option: string,
  ) => {
    const choice = priceList.find(
      obj =>
        obj.category === category && obj.item === item && obj.option === option,
    );

    return choice ?? { category: '', item: '', option: '', pay: 0, time: '' };
  };

  // 根據帶入的類型取得該對應的字典
  const getDict = (type: string, key: string) => {
    const typeDictList = priceListDict.find(obj => obj.type === type);

    if (typeDictList) {
      const dictInfo = typeDictList.item.find(obj => obj.key === key);

      return dictInfo ? dictInfo.dict : '';
    }

    return '';
  };

  return {
    priceList,
    getEstimateOfChoice,
    getDict,
  };
};
