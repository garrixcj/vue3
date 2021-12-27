// import pick from 'lodash/pick';
import http from '@/http/http';
import multiHttp from '@/http/multi';

export const errorcode = {
  http,
  // /**
  //  * 取得external的錯誤代碼
  //  * @param  {string} lang
  //  */
  // getExternalErrorCode(lang: string) {
  //   return this.http.get("/error_code/externel", {
  //     params: {
  //       lang
  //     }
  //   });
  // },
  // /**
  //  * 匯出external的錯誤代碼
  //  * @param  {object} options.lang
  //  * @param  {object} options.export_remark
  //  */
  // exportExternalErrorCode(options: object) {
  //   const paramOptions = ["lang", "export_remark"];
  //   const params = pick(options, paramOptions);
  //   return this.http.post("/error_code/externel/export", params);
  // }
};
export default errorcode;

export const multi = { ...errorcode, http: multiHttp };
