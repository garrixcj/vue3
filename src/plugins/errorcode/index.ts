/**
 * 統整底層用 Errorcode 對應表
 */
import dict from '@/language/error/msg.json';
import type { ResponseData } from '@/http/typings';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useTrans } from '@/plugins/i18n/replace';

dayjs.extend(utc);

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

// 取得 errorcode 轉譯功能
export const useCodeTrans = (lang: string) => {
  const { t } = useTrans(dict, lang);
  // error code文本格式
  const getMsg = (response: ResponseData, type = 'error') => {
    let msg = '';

    // 通用錯誤訊息
    if (response.code && t(`${response.code}`)) {
      msg = `${t(`${response.code}`)}`;
    } else if (type === 'warning') {
      // warning預設'無效的操作'
      msg = `${t('invalid_operation')}`;
    } else {
      // error預設'系統錯誤'
      msg = `${t('system_error')}`;
    }
    // error類型要加上error code及response_code
    if (type === 'error') {
      msg += `(${response.code})`;
      // 加上response_code
      if (response.response_code) {
        msg += `#${response.response_code}`;
      }
    }

    msg = msg.toString();

    return msg;
  };

  // 線路異常時，無法取得錯誤的物件時，包裝錯誤頁面的 body 內容
  const getBodyMsg = (body: string) => {
    let msg = '';
    const time = dayjs().utcOffset(-4).format('YYYY-MM-DD HH:mm:ss');
    // 線路問題導致4xx或5xx等錯誤的情況
    msg = `${codeT('system_error')}( ${time} ) ${body}`;
    msg = msg.toString();

    return msg;
  };

  return { t, getMsg, getBodyMsg };
};

export const { t: codeT } = useTrans(dict);

// error code文本格式
export const getMsg = (
  lang: string,
  response: ResponseData,
  type = 'error',
) => {
  let msg = '';

  // 通用錯誤訊息
  if (response.code && codeT(`${response.code}`, {}, lang)) {
    msg = `${codeT(`${response.code}`, {}, lang)}`;
  } else if (type === 'warning') {
    // warning預設'無效的操作'
    msg = `${codeT('invalid_operation', {}, lang)}`;
  } else {
    // error預設'系統錯誤'
    msg = `${codeT('system_error', {}, lang)}`;
  }
  // error類型要加上error code及response_code
  if (type === 'error') {
    msg += `(${response.code})`;
    // 加上response_code
    if (response.response_code) {
      msg += `#${response.response_code}`;
    }
  }

  msg = msg.toString();

  return msg;
};

// 線路異常時，無法取得錯誤的物件時，包裝錯誤頁面的 body 內容
export const getBodyMsg = (lang: string, body: string) => {
  let msg = '';
  const time = dayjs().utcOffset(-4).format('YYYY-MM-DD HH:mm:ss');
  // 線路問題導致4xx或5xx等錯誤的情況
  msg = `${codeT('system_error', {}, lang)}( ${time} ) ${body}`;
  msg = msg.toString();

  return msg;
};

// 判斷 errorcode 是否維護中
export const isMaintain = (code: number | string) =>
  maintainCodes.includes(+code);

export default {
  codeMap,
  sessionCodes,
  forbiddenCodes,
  maintainCodes,
};
