import { mapValues } from 'lodash';

// 特殊驗證規則
export const specialRules = {
  IPv4: '(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}',
  IPv6: '((([0-9a-fA-F]{1,4}:){3}[0-9a-fA-F]{1,4})(::)?|(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}))',
  Port: '(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{0,3}|0)',
  Domain:
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+',
  Float: '(-|\\+)?([0-9]+\\.?[0-9]*|\\.[0-9]+)',
  Date: '([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])',
  Time: '([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])',
  Epochdate:
    '(19[7-9][0-9]|2[0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])',
};

// 表單Item驗證規則
export const rules = {
  password: {
    pattern: '[a-z0-9]{6,12}',
    message: 'regexp_of_password',
    trigger: 'change',
  },
  memberPwd: {
    pattern: '(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{6,12}',
    message: 'regexp_of_member_password',
    trigger: 'change',
  },
  userPwd: {
    pattern: '((?=.*[a-z])(?=.*[0-9]))([a-z0-9]){6,12}',
    message: 'regexp_of_password',
    trigger: 'change',
  },
  account: {
    pattern: '[a-z0-9]{4,11}',
    message: 'regexp_of_account',
    trigger: 'change',
  },
  date: {
    pattern: new RegExp(specialRules.Date),
    message: 'regexp_of_date',
    trigger: 'change',
  },
  time: {
    pattern: new RegExp(specialRules.Time),
    message: 'regexp_of_time',
    trigger: 'change',
  },
  datetime: {
    pattern: new RegExp(`${specialRules.Date} ${specialRules.Time}`),
    message: 'regexp_of_datetime',
    trigger: 'change',
  },
  number: {
    pattern: new RegExp('[0-9]+'),
    message: 'regexp_of_number',
    trigger: 'change',
  },
  ipv4: {
    pattern: specialRules.IPv4,
    message: 'regexp_of_ip',
    trigger: 'change',
  },
  ipv6: {
    pattern: specialRules.IPv6,
    message: 'regexp_of_ip',
    trigger: 'change',
  },
};

export type ValidatorOptions = {
  // 訊息翻譯
  msgTrans?: (key: string) => string;
};

export const useFormValidator = ({ msgTrans } = {} as ValidatorOptions) => {
  return {
    rules: mapValues(rules, rule => ({
      ...rule,
      message: msgTrans?.(rule.message) || rule.message,
    })),
  };
};

// 基本驗證規則
export const basicRules = {
  alpha: new RegExp(`^[A-Za-z]+$`),
  alnum: new RegExp(`^[A-Za-z0-9]+$`),
  digit: new RegExp(`^[0-9]+$`),
  float: new RegExp(`^${specialRules.Float}$`),
  upper: new RegExp(`^[A-Z]+$`),
  lower: new RegExp(`^[a-z]+$`),
  lowerAlnum: new RegExp(`^[a-z0-9]+$`),
  word: new RegExp(`^[a-zA-Z0-9_]+$`),
  date: new RegExp(`^${specialRules.Date}$`),
  time: new RegExp(`^${specialRules.Time}$`),
  datetime: new RegExp(`^${specialRules.Date} ${specialRules.Time}$`),
  epochDate: new RegExp(`^${specialRules.Epochdate}$`),
  email: new RegExp(
    `^[a-zA-Z0-9.!#$%&'*+\\/=?^_\`{|}~-]+@${specialRules.Domain}$`,
  ),
  domain: new RegExp(`^${specialRules.Domain}$`),
  port: new RegExp(`^${specialRules.Port}$`),
  ipv4: new RegExp(`^${specialRules.IPv4}$`),
  ipv6: new RegExp(`^${specialRules.IPv6}$`),
};

/**
 * 資料驗證結果
 *
 * @param {string} data 需驗證之資料
 * @param {string} rule 驗證規則所對應的Key值
 * @return boolean
 */
export const formatCheck = (data: string, rule: string) => {
  const result = basicRules[rule as keyof typeof basicRules].test(data);

  return result;
};
