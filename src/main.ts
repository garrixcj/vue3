import { createApp, getCurrentInstance } from 'vue';
import App from './App.vue';
// UI Import
import 'normalize.css/normalize.css';
import '@/assets/scss/style.scss';
import '@/components/style/scss/_element-default.scss';
import '@/components/style/scss/_element-cust.scss';
import '@mdi/font/scss/materialdesignicons.scss';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
// Component Import
import RdComponets from '@/components/utils/rd';
import VLoading from '@/components/utils/loading';
// Router Settings
import router, { setRoute } from './router';
// Global Store
import store from './store';
// I18n
import VueI18n from '@/plugins/i18n';
// Websocket
// import VueNativeSock from 'vue-native-websocket-vue3';
// import WSProvider from '@/plugins/websocket';
// API
// import deviceApi from '@/api/device';

const defaultMixin = {
  // mounted() {
  //   const instance = getCurrentInstance();
  //   const parentNodeID = instance?.vnode.el?.parentNode.id;
  //   // 主顯示區塊載入完成，loading消失, iframe的loading已寫到iframe.vue了
  //   if (
  //     parentNodeID &&
  //     parentNodeID.indexOf('main-panel') !== -1 &&
  //     instance?.vnode?.el?.tagName !== 'IFRAME'
  //   ) {
  //     setTimeout(() => {
  //       store.commit('loading/setIndexLoading', false);
  //     }, 500);
  //   }
  // },
};

const app = createApp(App)
  .use(store)
  .use(RdComponets)
  .use(VueI18n)
  .use(VLoading)
  .mixin(defaultMixin);

// 產生App
const init = () => {
  app.use(router); // 需等待 setRoute 設定完才能生成 router
  app.mount('#app');
};

// 取得Host環境
// const setHost = store.dispatch('url/defineHost');

// 取得 websocket
// const setWebsocket = new Promise(resolve => {
//   deviceApi.getWs().then(response => {
//     if (
//       response.data.result &&
//       response.data.data &&
//       response.data.data.WEBSOCKET_HOST
//     ) {
//       // 因為IE不支援startswith函數，VueNativeSock判斷協定時有用到，故把協定判斷改由我方判斷
//       const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';

//       app.use(
//         VueNativeSock,
//         `${scheme}://${response.data.data.WEBSOCKET_HOST}`,
//         {
//           format: 'json',
//           reconnection: true,
//           reconnectionDelay: 3000,
//           connectManually: true,
//           store,
//           mutations: {
//             SOCKET_ONOPEN: 'websocket/onOpen',
//             SOCKET_ONCLOSE: 'websocket/onClose',
//             SOCKET_ONERROR: 'websocket/onError',
//             SOCKET_ONMESSAGE: 'websocket/onMessage',
//             SOCKET_RECONNECT: 'websocket/reconnect',
//             SOCKET_RECONNECT_ERROR: 'websocket/reconnectError',
//           },
//         },
//       );
//       // 全局提供連線方式
//       app.use(WSProvider);
//     }
//     resolve(true);
//   });
// });

// todo firebase 是否加入
// Promise.all([setHost, setWebsocket, setRoute])
Promise.all([setRoute])
  .then(() => {
    init();
  })
  .catch(err => {
    // app.config.globalProperties.$message(err);
  });

// Vuex Hot Reload // todo 驗證
if (module.hot) {
  module.hot.accept('./App.vue');
}
