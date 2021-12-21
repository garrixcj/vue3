import http, { HttpMulti as multiHttp } from "@/http/http";
import inf from "./inf";

// 設定 axios Headers PermName
export const setHeadersPermName = (name: string) => {
  http.defaults.headers.PermName = name;
  multiHttp.defaults.headers.PermName = name;
  inf.defaults.headers.PermName = name;
};

export default {
  setHeadersPermName
};
