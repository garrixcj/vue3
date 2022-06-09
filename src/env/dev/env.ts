import type { Env } from '@/env/typings';

const env: Env = {
  appEnv: 'dev',
  hosts: {
    // 先暫時寫測試站資料
    ws: 'ws.vir888.com',
    bigBallOld: 'http://ctl-v2-dev.vir888.com',
    bigBallV3: 'http://ctl-v3-dev.vir888.com',
    pidAdmin: 'http://admin.vir888.com',
    rd3Casino: 'http://casino-admin.vir888.com',
    rd3: 'http://admin-v0.vir888.com',
    rd3Live: 'http://live-admin.vir888.com',
    rde: 'http://ltadmin-dev.vir888.com',
  },
};
export default env;
