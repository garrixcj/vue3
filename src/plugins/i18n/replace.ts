/**
 * 取用部分有問題的字典檔
 * @,|,{,},$ 此類文字需要被跳脫，否則vue-i18n v9.x版本嚴謹度會無法載入字典
 */

import { useI18n } from 'vue-i18n';
import { mapValues } from 'lodash';

/**
 * 使用轉譯文字(舊版字典適用)
 * 非 setup 環境下可用
 * @param  {json} dict 字典檔
 * @param  {string} defaultLang 預設語系
 */
export const useTrans = (
  dict: { [key: string]: Record<string, string> },
  defaultLang?: string,
) => {
  const t = (
    key: string,
    option?: { [key: string]: string },
    lang?: string,
  ) => {
    const currentLang = lang || defaultLang;
    if (!currentLang) {
      return key;
    }
    if (option) {
      return Object.keys(option).reduce(
        (acc, opt) => acc.replace(`{${opt}}`, option[opt]),
        dict[currentLang][key],
      );
    }
    return dict[currentLang][key];
  };

  return { t };
};

/**
 * 轉譯字典
 * @param  {json} dict 字典檔
 */
export const replaceSpecialCharacters = (dictValue: string | never) => {
  let result = dictValue;
  const specialRules = {
    // 鏈結化語法正則
    link: { syntax: '@', regexp: new RegExp('@[:|.]') },
    // 複數 pipe 語法正則
    plural: { syntax: '|', regexp: new RegExp(' \\| ') },
  };
  if (typeof dictValue === 'string') {
    Object.values(specialRules).forEach(rule => {
      // 不中就 replace
      if (!rule.regexp.test(result)) {
        result = result.replace(rule.syntax, `{'${rule.syntax}'}`);
      }
    });
  }

  return result;
};

/**
 * 轉譯字典檔 Json
 * @param  {json} dict 字典檔
 * @notice 注意：i18n特性會將字典 in-place 合成，在 useI18n 前後取得的dict會有差異
 */
export const replaceDict = (dict: {
  [key: string]: Record<string, string>;
}) => {
  return mapValues(dict, langJson =>
    mapValues(langJson, value => replaceSpecialCharacters(value)),
  );
};

/**
 * 使用轉譯文字for i18n(舊版字典適用)
 * 必須要在 setup 內使用 (同useI18n)
 * 注意 i18n 宣告會有先後問題，這個要先宣告
 * @param  {json} dict 字典檔
 * @param  {I18nOptions} options i18n 選項
 */
export const useI18nTrans = (
  dict: {
    [key: string]: Record<string, string>;
  },
  options: { [key: string]: unknown },
) => {
  const { t } = useI18n({ messages: replaceDict(dict), ...options });

  return { t };
};
