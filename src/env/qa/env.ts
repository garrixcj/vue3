import type { Env } from '@/env/typings';

const env: Env = {
  appEnv: 'qa',
  hosts: {
    ws: 'ws.vir777.net',
    bigBallOld: '//ctl-v2.vir777.net',
    bigBallV3: '//ctl-v3.vir777.net',
    pidAdmin: '//admin.vir777.net',
    rd3Casino: '//casino-admin.vir777.net',
    rd3: '//admin-v0.vir777.net',
    rd3Live: '//live-admin.vir777.net',
    rde: '//ltadmin.vir777.net',
  },
  firebase: {
    apiKey: 'AIzaSyBaGS6YvLyS0BW2BAWbJYa4HC5MKavJq6E',
    authDomain: 'pid-admin-deaf3.firebaseapp.com',
    databaseURL: 'https://pid-admin-deaf3.firebaseio.com',
    projectId: 'pid-admin-deaf3',
    storageBucket: 'pid-admin-deaf3.appspot.com',
    messagingSenderId: '547647742912',
    appId: '1:547647742912:web:7a2d29dd12807a76231e25',
    measurementId: 'G-Y8CXYZSERC',
  },
  pusher: {
    appKey: 'hex-ws',
    host: 'socket.vir777.net',
  },
  cloudHosts: {
    ws: 'ws.vir777.net',
    bigBallOld: '//ctl-v2-dev.vir777.net',
    bigBallV3: '//cloud-ctl-v3.vir777.net',
    pidAdmin: '//admin-cloud.vir777.net',
    rd3Casino: '//casino-admin-bbin.vir777.net',
    rd3: '//admin-cloud-v0.vir777.net',
    rd3Live: '//live-admin-bbin.vir777.net',
    rde: '//ltadmin.vir777.net',
  },
};
export default env;
