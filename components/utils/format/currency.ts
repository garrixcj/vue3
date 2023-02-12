/**
 * 幣別代碼 (顯示用)
 */
export enum Currency {
  CNY = 'RMB', // 人民幣
  RMB = 'RMB', // 人民幣
  USD = 'USD', // 美金
  HKD = 'HKD', // 港幣
  IDR = 'IDR', // 印尼盾
  KIDR = 'IDR/1000', // 印尼盾/千
  VND = 'VND', // 越南盾
  KVD = 'VND/1000', // 越南盾/千
  MYR = 'MYR', // 馬幣
  THB = 'THB', // 泰銖
  SGD = 'SGD', // 新幣
  JPY = 'JPY', // 日幣
  TWD = 'TWD', // 台幣
  KRW = 'KRW', // 韓幣
  EUR = 'EUR', // 歐元
  GBP = 'GBP', // 英鎊
  INR = 'INR', // 盧比
  USDT = 'USDT', // USDT
  PHP = 'PHP', // 披索
  MMK = 'MMK', // 緬甸幣
  BRL = 'BRL', // 巴西幣
  UUS = 'UUS', // 試玩幣
}

export type CurrencyCode = keyof typeof Currency;

export const sortCurrency: CurrencyCode[] = [
  'CNY', // 人民幣
  'VND', // 越南盾
  'KVD', // 越南盾/千
  'THB', // 泰銖
  'KRW', // 韓幣
  'USD', // 美金
  'IDR', // 印尼盾
  'KIDR', // 印尼盾/千
  'INR', // 盧比
  'EUR', // 歐元
  'GBP', // 英鎊
  'HKD', // 港幣
  'JPY', // 日幣
  'MYR', // 馬幣
  'SGD', // 新幣
  'TWD', // 台幣
  'PHP', // 披索
  'MMK', // 緬甸幣
  'BRL', // 巴西幣
];

/**
 * 幣別代碼顯示轉換
 * @param {CurrencyCode} currency 幣別代碼
 * @return {string}
 */
export const convertCurrency = (currency: CurrencyCode): string =>
  Currency[currency] || currency;

/**
 * 幣別相關資料做固定排序
 * @param   {Record<CurrencyCode, unknown>} currencyData  幣別資料 (Ex: { 'CNY', IDR: [], ...., VND: [] })
 * @returns {Record<CurrencyCode, unknown>} 回傳排序好的資料
 */
export const sortByCurrency = (currencyData: Record<CurrencyCode, unknown>) =>
  sortCurrency.reduce((acc, currency) => {
    if (typeof currencyData[currency] !== 'undefined') {
      acc[currency] = currencyData[currency];
    }
    return acc;
  }, {} as Record<CurrencyCode, unknown>);

export default {
  Currency,
  convertCurrency,
  sortByCurrency,
};
