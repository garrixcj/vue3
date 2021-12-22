import { createApp } from 'vue';
import App from './App.vue';
// UI Import
import RdComponets from '@/components/utils/rd';
import 'element-plus/dist/index.css';
import '@/assets/scss/style.scss';
import '@mdi/font/scss/materialdesignicons.scss';
import '@/components/style/scss/_element-default.scss';
import '@/components/style/scss/_element-cust.scss';
// Router Settings
import router from './router';
// Global Store
import store from './store';
// I18n
import VueI18n from '@/plugins/i18n';

createApp(App)
  .use(store)
  .use(VueI18n)
  .use(RdComponets)
  .use(router)
  .mount('#app');
