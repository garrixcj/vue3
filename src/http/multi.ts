/**
 * 多API同時執行攔截器設定，自行定義 api 後的 feedback
 */
import axios from 'axios';
import Response from './silent-resp';

const HttpMulti = axios.create({
  baseURL: '/hex/',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

HttpMulti.interceptors.response.use(Response.successCall, Response.failureCall);

export default HttpMulti;
