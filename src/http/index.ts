/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '@/http/http';
import multiHttp from '@/http/multi';
import inf from './inf';

// 設定 axios Headers PermName
export const setHeadersPermName = (name: string) => {
  (http.defaults.headers as Record<string, any>).PermName = name;
  (multiHttp.defaults.headers as Record<string, any>).PermName = name;
  (inf.defaults.headers as Record<string, any>).PermName = name;
};

export default {
  setHeadersPermName,
};
