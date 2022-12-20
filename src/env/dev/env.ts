import type { Env } from '@/env/typings';

const env: Env = {
  appEnv: 'dev',
  hosts: {
    ws: 'ws.vir888.com',
    bigBallOld: '//ctl-v2-dev.vir888.com',
    bigBallV3: '//ctl-v3-dev.vir888.com',
    pidAdmin: '//admin.vir888.com',
    rd3Casino: '//casino-admin.vir888.com',
    rd3: '//admin-v0.vir888.com',
    rd3Live: '//live-admin.vir888.com',
    rde: '//ltadmin-dev.vir888.com',
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
  cloudHosts: {
    ws: 'ws.vir888.com',
    bigBallOld: '//ctl-v2-dev.vir888.com',
    bigBallV3: '//cloud-ctl-v3.vir888.com',
    pidAdmin: '//admin-cloud.vir888.com',
    rd3Casino: '//casino-admin-bbin.vir888.com',
    rd3: '//admin-cloud-v0.vir888.com',
    rd3Live: '//live-admin-bbin.vir888.com',
    rde: '//ltadmin-cloud.vir888.com',
  },
};
export default env;
