/**
 * 初次設定 Cookie Plugin
 */
import { useCookieStore } from '@/stores/cookie';

const install = () => {
  const cookieStore = useCookieStore();
  // 設定語系
  cookieStore.updateLang(cookieStore.lang);
  // 設定平台
  cookieStore.initPlatform();
};

export default { install };
