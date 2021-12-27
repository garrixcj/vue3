import http from '@/http/http';
import multiHttp from '@/http/multi';

export const device = {
  http,
  // /**
  //  * 取得Websocket host
  //  */
  // getWs() {
  //   return this.http.get("/device/ws");
  // }
  // /**
  //  * 取得Firebase host
  //  */
  // getFirebase() {
  //   return this.http.get("/firebase");
  // },
  // /**
  //  * 取得Env old seesion.getEnv
  //  */
  // getEnv() {
  //   return this.http.get("/env");
  // }
};

export default device;

export const multi = { ...device, http: multiHttp };
