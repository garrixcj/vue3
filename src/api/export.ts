import http from '@/http/http';
import multiHttp from '@/http/multi';

export const exportApi = {
  http,
  // /**
  //  * 取得檔案列表
  //  */
  // getLists() {
  //   return this.http.get("/export/lists");
  // },
  // /**
  //  * 取得檔案數量
  //  */
  // getDownloadable() {
  //   return this.http.get("/export/downloadable");
  // }
  // /**
  //  * 刪除處理中的檔案
  //  * @param  {string} token
  //  */
  // putProcessing(token: string) {
  //   return this.http.put(`/export/${token}/cancel`);
  // },
  // /**
  //  * @param  {string} id
  //  * @param  {string} username
  //  * @param  {array} export_statuses
  //  */
  // getDomainAndSubUserExport(id: string, username: string, export_statuses: []) {
  //   return this.http.get(`/domain/${id}/export`, {
  //     params: {
  //       username,
  //       export_statuses
  //     }
  //   });
  // },
  /**
   * 檢查是否能生成匯出檔案
   * @param  {string} function_name
   * @param  {string} tab_name
   */
  checkAvailable(function_name: string, tab_name: string) {
    return this.http.get('/export/check', {
      params: {
        function_name,
        tab_name,
      },
    });
  },
  // /**
  //  * @param  {array} roles
  //  * @param  {array} export_statuses
  //  * @param  {number} page
  //  * @param  {number} limit
  //  */
  // getOnlyDomainExport(
  //   roles: [],
  //   export_statuses: [],
  //   page: number,
  //   limit: number
  // ) {
  //   return this.http.get("/users/export", {
  //     params: {
  //       roles,
  //       export_statuses,
  //       page,
  //       limit
  //     }
  //   });
  // },
  // /**
  //  * @param  {string} token
  //  */
  // getDownloadFile(token: string) {
  //   return this.http.get(`/export/download/${token}`, { responseType: "blob" });
  // }
};

export default exportApi;

export const multi = { ...exportApi, http: multiHttp };
