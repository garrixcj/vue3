/**
 * 數值相關格式轉換
 */

// 避免浮點數計算失誤 Ex: 0.3-0.2 = 0.099999...
import Big from 'big.js';

/**
 * 數值格式轉換 - 千分位分隔
 * @param {string} value 數值
 * @param {string} defaultText 預設數值
 * @return {string}
 */
export const groupSeparator = (value: string, defaultText = '--'): string =>
  Number.isNaN(parseInt(value, 10))
    ? defaultText
    : Number(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * 數值倍率轉換 無條件捨去 + 千分位分隔
 * @param {number | string} money 數值
 * @param {number} exchange 倍率
 * @param {number} tofix 取小數點到第幾位
 * @return {string}
 */
export const exchangeRate = (
  money: number | string,
  exchange: number,
  tofix = 2,
): string => {
  let value = new Big(money);

  // 無條件捨去
  Big.RM = 0;
  // 匯率轉換
  value = value.times(exchange);

  // 取至小數第2位，回傳千分位格式
  return value
    .toFixed(tofix)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

// ? toFixed 的四捨五入是 四捨六入五取偶
/**
 * 數值倍率轉換 - 四捨五入取至小數點 N 位
 * @param {number} value 數值
 * @param {number} scale 倍率
 * @param {number} tofix 取小數點到第幾位
 * @return {string}
 */
export const exchangeScale = (
  value: number,
  scale: number,
  tofix = 2,
): string => {
  const newValue = new Big(value);
  return newValue.times(scale).toFixed(tofix);
};

export default {
  groupSeparator, // 千分位分隔
  exchangeRate, // 無條件捨去+千分位分隔
  exchangeScale, // 四捨五入
};
