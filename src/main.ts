import { createApp, getCurrentInstance } from 'vue';
import App from './App.vue';
// UI Import
import 'normalize.css/normalize.css';
import '@/assets/scss/style.scss';
import '@/components/style/scss/element-default.scss';
import '@/components/style/scss/element-cust.scss';
import '@/components/style/scss/mdi/materialdesignicons.scss';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
// Component Import
import RdComponets from '@/components/utils/rd';
import VLoading from '@/components/utils/loading';
// Router Settings
import router from '@/router';
// Global Store
import store from '@/stores/index';
import { useLoadingStore } from '@/stores/loading';
// I18n
import VueI18n from '@/plugins/i18n';
// Websocket
import { WSCreator, WSProvider } from '@/plugins/websocket';
// Firebase
import { FirebaseCreator } from '@/plugins/firebase';
// Cookie
// import CookiePlugin from '@/plugins/cookie';
import routerMiddleware from '@/router/middleware';

const defaultMixin = {
  mounted() {
    const instance = getCurrentInstance();
    const loadingStore = useLoadingStore();
    const parentNodeID = instance?.vnode.el?.parentNode.id;
    // 主顯示區塊載入完成，loading 消失，iframe 的 loading 已寫到 iframe.vue 了
    if (
      parentNodeID &&
      parentNodeID.indexOf('main-panel') !== -1 &&
      instance?.vnode?.el?.tagName !== 'IFRAME'
    ) {
      setTimeout(() => {
        loadingStore.index = false;
      }, 500);
    }
  },
};

const app = createApp(App)
  .use(store)
  .use(RdComponets)
  .use(VueI18n)
  .use(VLoading)
  .use(WSCreator)
  .use(WSProvider)
  .use(FirebaseCreator)
  // .use(CookiePlugin)
  .mixin(defaultMixin)
  .use(router)
  .use(routerMiddleware);

app.mount('#app');
