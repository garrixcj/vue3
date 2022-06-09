import type { Env } from '@/env/typings';

const env: Env = {
  appEnv: 'production',
  hosts: {
    // 先暫時寫測試站資料
    ws: 'ws.vir000.com',
    bigBallOld: 'https://ctl-v2.vir000.com',
    bigBallV3: 'https://ctl-v3.vir000.com',
    pidAdmin: 'https://admin.vir000.com',
    rd3Casino: 'https://casino-admin.vir000.com',
    rd3: 'https://admin-v0.vir000.com',
    rd3Live: 'https://live-admin.vir000.com',
    rde: 'https://ltadmin.vir000.com',
  },
};
export default env;
