import type { ApplyDomain, BasicSetting } from './apply';
import { findIndex } from 'lodash';

/**
 * 取得域名格式檢查狀態
 * @param  {ApplyDomain[]} urlList 域名列表
 * @param  {BasicSetting} basicData 基本資料
 * @param  {number} index 當下域名索引
 * @param  {string} domain 域名
 * @param  {number} inputLimit 域名字數上限
 */
export const getState = (
  urlList: ApplyDomain[],
  basicData: BasicSetting,
  index: number,
  domain: string,
  inputLimit: number,
) => {
  // 當今天域名是空的
  if (!domain) {
    return '';
  }

  // 域名重複輸入(列表裡有重複的域名，第一個以外的才被視為重複)
  if (
    urlList.filter(obj => obj.domain === domain).length > 1 &&
    findIndex(urlList, ['domain', domain]) !== index
  ) {
    return 'double';
  }

  // 非二級域名不可使用
  const secondLevelRegex = /^[^\\.]+(\.[^\\.]+){1}$/;
  if (!secondLevelRegex.test(domain)) {
    return 'notSecondLevel';
  }

  // 域名格式錯誤(僅可輸入大小寫英文字母及數字，及「-」、「.」符號、字數不可超過一定的上限)
  const formatRegex = /^[a-zA-Z\d-]+(\.[a-zA-Z\d-]+){1}$/;
  if (!formatRegex.test(domain) || domain.length > inputLimit) {
    return 'formatError';
  }

  // 域名不可包含的字串
  const illegalTextRegex = /(bbin|bb-in|bbos|bb-os|bbgp|bbp|xbb|nbb)/;
  // 無法綁定，請洽專員(當字串裡有包含不可包含的字串時)
  if (illegalTextRegex.test(domain)) {
    return 'notBindingFindContact';
  }

  // 需要特殊判斷的頂級域名part1(完全不可用)
  const notUseDomain = /\.(ki)$/;
  // 無法綁定，請洽專員(當今天為特殊頂級域名，且購買方式為「bbin」時)
  if (notUseDomain.test(domain)) {
    return 'notBindingFindContact';
  }

  // 需要特殊判斷的頂級域名part2(依照購買方式決定是否不可用)
  const specialDomain = /\.(cn|us)$/;
  // 無法綁定，請洽專員(當今天為特殊頂級域名，且購買方式為「bbin」時)
  if (specialDomain.test(domain) && basicData.buy === 'bbin') {
    return 'notBindingFindContact';
  }

  // 一般的域名
  const normalDomain = /\.(com|net)$/;
  // 特殊頂級域名，不好解析
  if (!normalDomain.test(domain)) {
    return 'specialDomain';
  }

  // 域名格式正確
  return 'success';
};

/**
 * 判斷格式是否合法
 * @param  {string} format 域名格式檢查狀態
 */
export const checkFormatLegal = (format: string) => {
  // 網址是正常的格式(成功、特殊頂級域名，不好解析)
  const correctFormat = ['success', 'specialDomain'];

  return correctFormat.includes(format);
};

/**
 * 取得判斷域名格式的列表
 * @param  {ApplyDomain[]} urlList urlList 域名列表
 * @param  {BasicSetting} basicData basicData 基本資料
 * @param  {number} inputLimit 域名字數上限
 */
export const getListState = (
  urlList: ApplyDomain[],
  basicData: BasicSetting,
  inputLimit: number,
) => {
  return urlList.map((obj, index) => {
    // 取得域名格式檢查狀態
    const format = getState(urlList, basicData, index, obj.domain, inputLimit);
    return {
      key: obj.key,
      domain: obj.domain,
      // 塞入判斷出來的格式
      format: format,
      // 塞入是否合法的判斷
      legal: checkFormatLegal(format),
    };
  });
};
