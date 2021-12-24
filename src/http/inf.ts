/**
 * 長連線API執行攔截器設定，固定feedback
 */
import axios from 'axios';
import Response from './resp';

const Http = axios.create({
  baseURL: '/inf/',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

Http.interceptors.response.use(Response.successCall, Response.failureCall);

export default Http;
