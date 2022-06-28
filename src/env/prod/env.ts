import type { Env } from '@/env/typings';

const env: Env = {
  appEnv: 'production',
  hosts: {
    ws: 'ws.vir000.com',
    bigBallOld: 'https://ctl-v2.vir000.com',
    bigBallV3: 'https://ctl-v3.vir000.com',
    pidAdmin: 'https://admin.vir000.com',
    rd3Casino: 'https://casino-admin.vir000.com',
    rd3: 'https://admin-v0.vir000.com',
    rd3Live: 'https://live-admin.vir000.com',
    rde: 'https://ltadmin.vir000.com',
  },
  firebase: {
    apiKey: 'AIzaSyBaGS6YvLyS0BW2BAWbJYa4HC5MKavJq6E',
    authDomain: 'pid-admin-deaf3.firebaseapp.com',
    databaseURL: 'https://pid-admin-deaf3.firebaseio.com',
    projectId: 'pid-admin-deaf3',
    storageBucket: 'pid-admin-deaf3.appspot.com',
    messagingSenderId: '547647742912',
    appId: '1:547647742912:web:b4e4d859e851c5cf231e25',
    measurementId: 'G-JD4R7WNVTZ',
  },
};
export default env;
