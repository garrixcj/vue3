import { createI18n } from 'vue-i18n';
import { useCookieStore } from '@/stores/cookie';
import type { App } from 'vue';

const install = (app: App) => {
  const cookieStore = useCookieStore();
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: cookieStore.lang,
    missingWarn: false, // * 暫時關閉 warning
    fallbackWarn: false, // * 暫時關閉 warning
  });
  app.use(i18n);
};

export default { install };
