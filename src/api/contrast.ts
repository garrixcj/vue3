// import pick from "lodash/pick";
import http from '@/http/http';
import multiHttp from '@/http/multi';

export const contrast = {
  http,
  // /**
  //  * 匯出external的代碼對照
  //  * @param  {object} options 可帶選項
  //  */
  // exportExternalContrast(options: object) {
  //   const keys = ["lang", "export_remark"];
  //   return this.http.post("/contrast/external/export", pick(options, keys));
  // }
};

export default contrast;
export const multi = { ...contrast, http: multiHttp };
