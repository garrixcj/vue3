import http from '@/http/http';
import multiHttp from '@/http/multi';

export const stopbet = {
  http,
  // /**
  //  * 取得停押設定
  //  * @param  {string} id
  //  */
  // getStopbet(id: string) {
  //   return this.http.get(`/user/${id}/stopbet`);
  // },
  // /**
  //  * 設定停押設定
  //  * @param  {string} id
  //  * @param  {0|1} stopbet
  //  */
  // putStopbet(id: string, stopbet: 0 | 1) {
  //   return this.http.put(`/user/${id}/stopbet`, { stopbet });
  // }
};

export default stopbet;

export const multi = { ...stopbet, http: multiHttp };
