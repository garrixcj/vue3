/**
 * 回傳處理
 * TODO 先註解等待盤整功能
 */
import store from '@/store';
import router from '@/router';
import { NavigationFailureType, isNavigationFailure } from 'vue-router';
import { AxiosResponse, AxiosError } from 'axios';
import notify, { NotifyType } from '@/components/utils/notification';
import {
  codeMap,
  sessionCodes,
  forbiddenCodes,
  getMsg,
  getType,
  codeT,
  CodeLang,
} from '@/plugins/errorcode';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const isAllFailure = (failure: unknown) =>
  isNavigationFailure(failure, NavigationFailureType.aborted) ||
  isNavigationFailure(failure, NavigationFailureType.duplicated) ||
  isNavigationFailure(failure, NavigationFailureType.cancelled);

// todo 分離
// 記錄至 Google Analytics
// const logErrorEvent = (resp, type, code, lang) => {
//   const analytics = store.getters["app/firebaseAnalytics"];
//   if (analytics.app) {
//     analytics.logEvent("Error", {
//       // 使用者資訊
//       lang,
//       is_agent: false,
//       // 瀏覽器資訊
//       browser_name: Browser.name,
//       browser_version: Browser.version,
//       browser_type: Browser.type,
//       // request資訊
//       request_method: resp.config.method,
//       request_url: resp.config.url, // 不包含domain
//       request_full_url: resp.request.responseURL, // 包含domain
//       request_result: type, // successCall or failureCall
//       error_code: code
//     });
//   }
// };

// todo 分離
// 檢查二進位回傳型態並轉換格式
// const checkBlob = (resp: AxiosResponse) =>
//   new Promise((resolve: (value: string) => void) => {
//     const reader = new FileReader();
//     reader.readAsText(resp.data);
//     reader.onload = () => resolve(reader.result);
//   });

export default {
  async successCall(resp: AxiosResponse) {
    // let response = resp.data;
    // if (resp.data.type === "application/json") {
    //   response = "";
    //   // await checkBlob(resp).then((result: string) => {
    //   //   response = JSON.parse(result); // 錯誤代碼
    //   // });
    // }
    // const lang: CodeLang = store.getters["cookie/lang"];
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
    //     store.dispatch("display/reloadMainViewWithPermission");
    //   } else if (response.code === codeMap.featureMaintain) {
    //     // 功能維護中
    //     store.commit("loading/setAxiosLoading", false);
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
    //     store.commit("loading/setAxiosLoading", false);
    //   }
    // }

    return resp;
  },
  failureCall(err: AxiosError) {
    // /* 錯誤處理(顯示error code) */
    // if (!err.response?.data.result) {
    //   const response = err.response?.data;
    //   const lang: CodeLang = store.getters["cookie/lang"];
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
    //   store.commit("loading/setAxiosLoading", false);
    //   store.commit("loading/setPageLoading", false);
    // }
    return Promise.reject(err);
  },
};
