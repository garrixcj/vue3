import { createI18n } from 'vue-i18n';
import store from '@/store';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: store.getters['cookie/lang'],
  missingWarn: false, // * 暫時關閉 warning
  fallbackWarn: false, // * 暫時關閉 warning
});

export default i18n;
