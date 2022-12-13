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
  firebase: {
    apiKey: 'AIzaSyBaGS6YvLyS0BW2BAWbJYa4HC5MKavJq6E',
    authDomain: 'pid-admin-deaf3.firebaseapp.com',
    databaseURL: 'https://pid-admin-deaf3.firebaseio.com',
    projectId: 'pid-admin-deaf3',
    storageBucket: 'pid-admin-deaf3.appspot.com',
    messagingSenderId: '547647742912',
    appId: '1:547647742912:web:cad8e72d61ad81c3231e25',
    measurementId: 'G-JJBDBYRMSD',
  },
  pusher: {
    appKey: 'hex-ws',
    host: 'socket.vir888.com',
  },
};
export default env;
