import http from '@/http/http';
import multiHttp from '@/http/multi';

export const exchange = {
  http,
  // /**
  //  * 取得支援幣別
  //  */
  // getCurrency() {
  //   return http.get("/currency");
  // },
  // /**
  //  * 取轉換過後的幣別匯率(以人民幣為基底)
  //  */
  // getTransExchange() {
  //   return this.http.get("/currency/cny/trans_exchange");
  // }
};

export default exchange;

export const multi = { ...exchange, http: multiHttp };
