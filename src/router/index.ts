import { type App } from 'vue';
import {
  createRouter,
  createWebHistory,
  type RouteComponent,
  type RouteRecordRaw,
} from 'vue-router';
import { routerMiddleware } from './middleware';
// todo use new v3 route setting
import routeJson from './route.json';

const view = (page: string) => () => import(`@/views/${page}.vue`);

// 取得功能路由
const getFeatureRoute = () =>
  routeJson
    .filter(item => item.route !== '')
    .map(item => {
      // 路由
      const path = item.route.replace(/^\/+|\/+$/g, '');
      // 路由參數
      let props = {};
      // 元件
      let component: RouteComponent;
      if (item.component) {
        // 特殊路由走指定component
        component = view(item.component.replace(/^\/+|\/+$/g, ''));
      } else if (item.host === 'VI_HOST') {
        // Vue component
        component = view(path);
      } else {
        // 除此之外都走iframe
        component = view('home/iframe');
        props = {
          host: item.host, // Iframe Host
          path: item.file + item.qstr, // Iframe Host
        };
      }

      // 自定義資料
      const meta = {
        auth: true,
        checkPermissions: true,
        menuId: item.id,
        title: item.dict,
        perm: item.perm,
      };

      return {
        name: item.name || '',
        path,
        component,
        props,
        meta,
      } as RouteRecordRaw;
    });

// 訪客路由
const guestRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'Welcome',
      guest: true,
    },
    component: view('login/index'),
    beforeEnter() {
      // 回退 login 路由
      window.location.href = '/login';
    },
  },
  {
    path: '/device',
    meta: {
      title: 'machine_info_page',
      guest: true,
    },
    component: view('device'),
    beforeEnter() {
      // 回退 device 路由
      window.location.href = '/device';
    },
  },
];

// 特殊路由(變數)
const specialRoutes: Array<RouteRecordRaw> = [];

// 預設路由(需登入)
const defaultRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    meta: {
      title: 'go_home',
      auth: true,
      checkPermissions: false,
    },
    redirect: '/home',
  },
  {
    path: '/home',
    name: '首頁',
    meta: {
      title: 'go_home',
      auth: true,
      checkPermissions: false,
    },
    component: view('home/home'),
    beforeEnter() {
      // 退回vue2架構下的 /home
      window.location.href = '/home';
    },
  },
  {
    // todo delete test route
    path: '/playground',
    name: 'Playground',
    meta: {
      title: 'Welcome',
      guest: true,
    },
    component: view('home/playground'),
  },
];

// 預設錯誤路由(需登入，置於route最後)
const fallbackRoutes: Array<RouteRecordRaw> = [
  {
    path: 'forbidden',
    meta: {
      title: 'forbidden',
      auth: true,
      checkPermissions: false,
    },
    props: { message: 'forbidden' },
    component: view('error/index'),
  },
  {
    path: 'error_page',
    meta: {
      title: 'unable_show_page',
      auth: true,
      checkPermissions: false,
    },
    component: view('error/index'),
  },
  {
    path: ':pathMatch(.*)*',
    meta: {
      title: 'unable_show_page',
      auth: true,
      checkPermissions: false,
    },
    props: { message: 'unable_show_page' },
    component: view('error/index'),
    beforeEnter() {
      // 亂打路由進入 v3 皆會回退 v2 的 forbidden
      window.location.href = '/forbidden';
    },
  },
];

export const install = (app: App) => {
  const routerList = getFeatureRoute();
  const mainRouter = {
    path: '/',
    name: 'layout',
    meta: { auth: true },
    component: view('home/index'),
    children: [
      ...defaultRoutes,
      ...specialRoutes,
      ...routerList,
      ...fallbackRoutes,
    ],
  };
  // 產生 router
  const router = createRouter({
    // 路由從 v3 開始
    history: createWebHistory('/v3/'),
    // 預設加入訪客路由
    routes: [...guestRoutes, mainRouter],
  });
  routerMiddleware(router);
  app.use(router);
};

export default { install };
