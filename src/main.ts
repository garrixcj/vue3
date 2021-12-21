import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/assets/scss/style.scss';
import '@mdi/font/scss/materialdesignicons.scss';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/components/style/scss/_element-default.scss';
import '@/components/style/scss/_element-cust.scss';

createApp(App).use(ElementPlus).use(store).use(router).mount('#app');
