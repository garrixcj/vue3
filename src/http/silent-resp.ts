/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 靜音回傳處理(response不會有alert)
 * TODO 需盤整哪部分是不需要alert的
 */
import { useCookieStore } from '@/stores/cookie';
import { useDisplayStore } from '@/stores/display';
import { useLoadingStore } from '@/stores/loading';
import { router } from '@/router';
import { NavigationFailureType, isNavigationFailure } from 'vue-router';
import { notify } from '@/components/utils/notification';
import message from '@/components/utils/message';
import {
  codeMap,
  sessionCodes,
  forbiddenCodes,
  useCodeTrans,
} from '@/plugins/errorcode';
import type { AxiosError } from 'axios';
import type { FalseResponse, HexResponse, ResponseData } from './typings';
import { logEventBase } from '@/plugins/firebase';

export const isAllFailure = (failure: unknown) =>
  isNavigationFailure(failure, NavigationFailureType.aborted) ||
  isNavigationFailure(failure, NavigationFailureType.duplicated) ||
  isNavigationFailure(failure, NavigationFailureType.cancelled);

// 記錄至 Google Analytics
const logErrorEvent = (resp: HexResponse, type: string, code: number) => {
  logEventBase('Error', {
    // request資訊
    request_method: resp.config.method,
    request_url: resp.config.url, // 不包含domain
    request_full_url: resp.request.responseURL, // 包含domain
    request_result: type, // successCall or failureCall
    error_code: code,
  });
};

// 檢查二進位回傳型態並轉換格式
const checkBlob = (resp: HexResponse<Blob>) =>
  new Promise((resolve: (value: string) => void) => {
    const reader = new FileReader();
    reader.readAsText(resp.data);
    reader.onload = () => resolve(reader.result as string);
  });

export default {
  async successCall(resp: HexResponse<ResponseData | Blob>) {
    const cookieStore = useCookieStore();
    const displayStore = useDisplayStore();
    const loadingStore = useLoadingStore();
    let response = resp.data as ResponseData;
    if (resp.data.type === 'application/json') {
      await checkBlob(resp as HexResponse<Blob>).then((result: string) => {
        response = JSON.parse(result); // 錯誤代碼
      });
    }
    const { t: codeT, getMsg } = useCodeTrans(cookieStore.lang);
    // 錯誤處理
    if (response.result === false) {
      // 記錄至GA
      logErrorEvent(
        resp as HexResponse<FalseResponse>,
        'successCall',
        (resp as HexResponse<FalseResponse>).data.code,
      );
      if (sessionCodes.indexOf(response.code) !== -1) {
        // 請重新登入
        router.push('/login').then(failure => {
          if (!isAllFailure(failure)) {
            notify.error({
              title: codeT('error'),
              message: getMsg(response),
            });
          }
        });
      } else if (forbiddenCodes.indexOf(response.code) !== -1) {
        // 沒有權限
        router.push('/forbidden').then(failure => {
          if (!isAllFailure(failure)) {
            notify.error({
              title: codeT('error'),
              message: getMsg(response),
            });
          }
        });
        // 沒有修改權限
      } else if (response.code === codeMap.modify) {
        notify.error({
          title: codeT('error'),
          message: getMsg(response),
        });
        displayStore.reloadMainViewWithPermission();
      } else if (response.code === codeMap.featureMaintain) {
        // 功能維護中
        loadingStore.axios = false;
        router.push(
          `/error_page?date=${response.data.end_at}&dict=${response.data.dict}&code=${response.code}&name=${response.data.perm_name}`,
        );
      } else if (response.code === codeMap.apiMaintain) {
        // API維護中
        let errorMessage = codeT('api_maintenance_message_1');
        if (response.data.end_time !== '' && response.data.end_time !== null) {
          errorMessage = codeT('api_maintenance_message', {
            time: response.data.end_time,
          });
        }
        notify.error({
          title: codeT('error'),
          message: errorMessage,
        });
      } else if (response.code && !response.data) {
        // 有錯誤代碼且沒有data
        const type = response.type === 'warning' ? 'warning' : 'error';
        const title = codeT(type);
        const message = getMsg(response, type);
        // 顯示錯誤訊息
        notify[type]({
          title,
          message,
        });
        loadingStore.axios = false;
      }
    }

    return resp;
  },
  async failureCall(err: AxiosError<ResponseData | Blob>) {
    const cookieStore = useCookieStore();
    const loadingStore = useLoadingStore();
    /* 錯誤處理(顯示error code) */
    let response = err.response?.data as ResponseData;
    if (!response.result) {
      // 因下載專區會以 Blob 格式請求，須進行額外轉換
      if (response instanceof Blob) {
        await checkBlob(err.response as HexResponse<Blob>).then(result => {
          response = JSON.parse(result);
        });
      }
      const { getMsg, getBodyMsg } = useCodeTrans(cookieStore.lang);
      // 記錄至GA
      logErrorEvent(
        err.response as HexResponse<FalseResponse>,
        'failureCall',
        (err.response as HexResponse<FalseResponse>)?.data.code,
      );
      // 預設錯誤的情況，後端有回傳error_code
      if (typeof response === 'object') {
        message.error(getMsg(response));
      }

      // 因線路問題無法 call 到 server 的情況
      if (typeof response === 'string') {
        message.error(getBodyMsg(response));
      }

      message.error(getMsg(response));
      // 500等錯誤回傳時，降下所有Loading
      loadingStore.axios = false;
      // 進axios error時，不會進promise.then，會無法控制page，所以統一降下loading
      loadingStore.page = false;
    }
    return Promise.reject(err);
  },
};
