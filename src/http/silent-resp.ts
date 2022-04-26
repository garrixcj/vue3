/**
 * 靜音回傳處理(response不會有alert)
 * TODO 先註解等待盤整功能
 */
import { NavigationFailureType, isNavigationFailure } from 'vue-router';
import { type AxiosError } from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useCookieStore } from '@/stores/cookie';
import { useDisplayStore } from '@/stores/display';
import { useLoadingStore } from '@/stores/loading';
import router from '@/router';
import {
  codeMap,
  codeT,
  forbiddenCodes,
  getMsg,
  getType,
  sessionCodes,
  CodeLang,
} from '@/plugins/errorcode';
import type { HexResponse } from './typings';

dayjs.extend(utc);

export const isAllFailure = (failure: unknown) =>
  isNavigationFailure(failure, NavigationFailureType.aborted) ||
  isNavigationFailure(failure, NavigationFailureType.duplicated) ||
  isNavigationFailure(failure, NavigationFailureType.cancelled);

export default {
  async successCall(resp: HexResponse) {
    // const cookieStore = useCookieStore();
    // const displayStore = useDisplayStore();
    // const loadingStore = useLoadingStore();
    // let response = resp.data;
    // if (resp.data.type === "application/json") {
    //   response = "";
    //   // await checkBlob(resp).then((result: string) => {
    //   //   response = JSON.parse(result); // 錯誤代碼
    //   // });
    // }
    // const lang: CodeLang = cookieStore.lang;
    // // 錯誤處理
    // if (response.result === false) {
    //   // logErrorEvent(resp, "successCall", resp.data.code, lang); // 記錄至GA
    //   if (sessionCodes.indexOf(response.code) !== -1) {
    //     // 請重新登入
    //     router.push("/login").then(failure => {
    //       if (!isAllFailure(failure)) {
    //         notify.error({
    //           message: codeT(lang, "error"),
    //           description: getMsg(lang, response)
    //         });
    //       }
    //     });
    //   } else if (forbiddenCodes.indexOf(response.code) !== -1) {
    //     // 沒有權限
    //     router.push("/forbidden").then(failure => {
    //       if (!isAllFailure(failure)) {
    //         notify.error({
    //           message: codeT(lang, "error"),
    //           description: getMsg(lang, response)
    //         });
    //       }
    //     });
    //     // 沒有修改權限
    //   } else if (response.code === codeMap.modify) {
    //     notify.error({
    //       message: codeT(lang, "error"),
    //       description: getMsg(lang, response)
    //     });
    //     displayStore.reloadMainViewWithPermission();
    //   } else if (response.code === codeMap.featureMaintain) {
    //     // 功能維護中
    //     loadingStore.axios = false;
    //     router.push(
    //       `/error_page?date=${response.data.end_at}&dict=${response.data.dict}&code=${response.code}&name=${resp.data.data.perm_name}`
    //     );
    //   } else if (response.code === codeMap.apiMaintain) {
    //     // API維護中
    //     let errorMessage = codeT(lang, "api_maintenance_message_1");
    //     if (response.data.end_time !== "" && response.data.end_time !== null) {
    //       errorMessage = codeT(lang, "api_maintenance_message", {
    //         time: response.data.end_time
    //       });
    //     }
    //     notify.error({
    //       message: codeT(lang, "error"),
    //       description: errorMessage
    //     });
    //   } else if (response.code) {
    //     // 有錯誤代碼

    //     // 末三碼大於500為warning
    //     const type: NotifyType = getType(response.code);
    //     const description = getMsg(lang, response, type);
    //     const message = codeT(lang, type);
    //     // 顯示錯誤訊息
    //     notify[type]({
    //       message,
    //       description
    //     });
    //     loadingStore.axios = false;
    //   }
    // }

    return resp;
  },
  failureCall(err: AxiosError) {
    // const cookieStore = useCookieStore();
    // const loadingStore = useLoadingStore();
    // /* 錯誤處理(顯示error code) */
    // if (!err.response?.data.result) {
    //   const response = err.response?.data;
    //   const lang: CodeLang = cookieStore.lang;
    //   // logErrorEvent(err, "failureCall", err.response?.data.code, lang); // 記錄至GA
    //   // 預設錯誤的情況，後端有回傳error_code
    //   if (typeof response === "object") {
    //     notify.error({ message: getMsg(lang, response) });
    //   }

    //   // 因線路問題無法 call 到 server 的情況
    //   if (typeof response === "string") {
    //     const time = dayjs().utcOffset(-4).format("YYYY-MM-DD HH:mm:ss");

    //     notify.error({
    //       message: getMsg(
    //         lang,
    //         {
    //           time,
    //           body: err.response?.data
    //         },
    //         "network"
    //       )
    //     });
    //   }

    //   notify.error({ message: getMsg(lang, response) });
    //   // 500等錯誤回傳時，將下所有Loading
    //   loadingStore.axios = false;
    //   loadingStore.page = false;
    // }
    return Promise.reject(err);
  },
};
