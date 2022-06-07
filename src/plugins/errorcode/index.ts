/**
 * 統整底層用 Errorcode 對應表
 * Todo lang.json要換掉
 */
import dict from './lang.json';

export const codeMap: Record<string, number[] | number> = {
  // 找不到路由對應
  routeForbidden: 667064001,
  // 無權限名稱對應
  permNameForbidden: 667064002,
  // 重新登入
  loginError: 667001001,
  // 使用者登出
  logout: 667001002,
  // 修改權限
  modify: 667064003,
  // 分項維護
  featureMaintain: 667077006,
  // API維護
  apiMaintain: 667158001,
  // 遊戲維護
  gameMaintain: 667160001,
};
// 無權限 Forbidden
export const forbiddenCodes = [
  codeMap.routeForbidden,
  codeMap.permNameForbidden,
];

// 頁面維護中(不包含API)
export const maintainCodes = [codeMap.featureMaintain, codeMap.gameMaintain];

// 登入狀態失敗
export const sessionCodes = [codeMap.loginError, codeMap.logout];

export type CodeLang = keyof typeof dict;
export type CodeKey = keyof typeof dict.en;
export type HexResponse = {
  code?: CodeKey;
  response_code?: string;
  time?: string;
  body?: string;
};

// 轉譯
export const codeT = (
  lang: CodeLang,
  key: CodeKey,
  option?: { [key: string]: string },
): string => {
  if (option) {
    return Object.keys(option).reduce(
      (acc, opt) => acc.replace(`{${opt}}`, option[opt]),
      dict[lang][key],
    );
  }
  return dict[lang][key];
};

// error code文本格式
export const getMsg = (
  lang: CodeLang,
  response: HexResponse,
  type = 'error',
) => {
  let msg = '';

  // 通用錯誤訊息
  if (response.code && codeT(lang, response.code)) {
    msg = `${codeT(lang, response.code)}`;
  } else if (type === 'warning') {
    // warning預設'無效的操作'
    msg = `${codeT(lang, 'invalid_operation')}`;
  } else {
    // error預設'系統錯誤'
    msg = `${codeT(lang, 'system_error')}`;
  }
  // error類型要加上error code及response_code
  if (type === 'error') {
    msg += `(${response.code as string})`;
    // 加上response_code
    if (response.response_code) {
      msg += `#${response.response_code}`;
    }
  }
  // 線路問題導致4xx或5xx等錯誤的情況
  if (type === 'network') {
    msg = `${codeT(lang, 'system_error')}( ${response.time} ) ${response.body}`;
  }

  msg = msg.toString();

  return msg;
};

// 末三碼大於500為warning
export const getType = (code: number | string) =>
  +code % 1000 > 500 ? 'warning' : 'error';

// 判斷是否維護中
export const isMaintain = (code: number | string) =>
  maintainCodes.includes(+code);

export default {
  codeMap,
  sessionCodes,
  forbiddenCodes,
  maintainCodes,
};
