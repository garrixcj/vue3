import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import Browser from './detect';
import { type App, type InjectionKey, inject } from 'vue';
import env from '@/env';
import { useCookieStore } from '@/stores/cookie';
import { State } from './typings';

// Firebase Provider Key
export const FirebaseKey: InjectionKey<State> = Symbol();

// 紀錄進入 app 的事件
export const logAppEvent = () => {
  const cookieStore = useCookieStore();
  const analytics = getAnalytics();
  logEvent(analytics, 'AdminVue3', {
    browser_name: Browser?.name,
    browser_version: Browser?.version,
    browser_type: Browser?.type,
    lang: cookieStore.lang,
  });
  setUserProperties(analytics, {
    Browser: `${Browser?.name} ${Browser?.version}`,
    Language: cookieStore.lang,
  });
};

// 紀錄事件
export const logEventBase = (key: string, info: object) => {
  const cookieStore = useCookieStore();
  const analytics = getAnalytics();
  if (analytics.app) {
    logEvent(analytics, key, {
      // 使用者資訊
      lang: cookieStore.lang,
      is_agent: false,
      // 瀏覽器資訊
      browser_name: Browser?.name,
      browser_version: Browser?.version,
      browser_type: Browser?.type,
      // 其他資訊
      ...info,
    });
  }
};

// 使用 Firebase
export const useFirebase = () => {
  const firebase = inject(FirebaseKey, {});
  return firebase;
};

// Create Firebase
export const FirebaseCreator = {
  install: (app: App) => {
    const firebaseApp = initializeApp(env.firebase);
    app.provide(FirebaseKey, {
      analytics: getAnalytics(firebaseApp),
    });
  },
};
