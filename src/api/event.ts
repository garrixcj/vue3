// import { pick } from 'lodash';
// import http from '@/http/http';
import multiHttp from '@/http/multi';

/**
 * 活動相關
 */
// ? 原本只有利息寶系列，暫時保留此接口
export const event = {};

export default event;

export const multi = { ...event, http: multiHttp };
