import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouteComponent,
} from 'vue-router';
// import { routerMiddleware } from './middleware';
// import { menu as menuApi } from "@/api/admin";

const view = (page: string) => () => import(`@/views/${page}.vue`);

// // 取得功能路由
// const getFeatureRoute = () =>
//   new Promise<RouteRecordRaw[]>(resolve => {
//     menuApi.getRoute().then(resp => {
//       let routeList: RouteRecordRaw[] = [];
//       if (resp.data.result) {
//         routeList = resp.data.data
//           .filter(item => item.route !== "")
//           .map(item => {
//             // 路由
//             const path = item.route.replace(/^\/+|\/+$/g, "");
//             // 路由參數
//             let props = {};
//             // 元件
//             let component: RouteComponent;
//             if (item.component) {
//               // 特殊路由走指定component
//               component = view(item.component.replace(/^\/+|\/+$/g, ""));
//             } else if (item.host === "VI_HOST") {
//               // Vue compoonent
//               component = view(path);
//             } else {
//               // 除此之外都走iframe
//               component = view("home/iframe");
//               props = {
//                 host: item.host, // Iframe Host
//                 path: item.file + item.qstr // Iframe Host
//               };
//             }

//             // 自定義資料
//             const meta = {
//               auth: true,
//               checkPermissions: true,
//               menuId: item.id,
//               title: item.dict,
//               perm: item.perm
//             };

//             return {
//               name: item.name || "",
//               path,
//               component,
//               props,
//               meta
//             } as RouteRecordRaw;
//           });
//       }
//       resolve(routeList);
//     });
//   });

// 訪客路由
const guestRoutes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: 'Home',
      guest: true,
    },
    component: view('home/home'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'Welcome',
      guest: true,
    },
    component: view('login/index'),
  },
  {
    path: '/ubauth',
    meta: {
      title: 'ubauth',
      guest: true,
    },
    component: view('ubauth'),
  },
  {
    path: '/device',
    meta: {
      title: 'machine_info_page',
      guest: true,
    },
    component: view('device'),
  },
];

// 特殊路由(變數)
const specialRoutes: Array<RouteRecordRaw> = [
  {
    path: '/user/operate_record/:id',
    meta: {
      title: 'operate_record',
      auth: true,
      checkPermissions: false,
    },
    component: view('home/iframe'),
    props: {
      host: 'RD3_HOST',
      path: '/user/operate_record',
      params: { id: 'User' },
    },
  },
  {
    path: '/game/bet_record/member/:id',
    meta: {
      title: 'bet_record',
      auth: true,
      checkPermissions: false,
    },
    component: view('home/iframe'),
    props: {
      host: 'RD3_HOST',
      path: '/game/betrecord_search/kind3?SearchData=MemberBets',
      params: { id: 'UserID' },
    },
  },
  {
    path: '/ball/cash_system/:id',
    meta: {
      title: 'transaction_record',
      auth: true,
      checkPermissions: false,
    },
    component: view('home/iframe'),
    props: {
      host: 'BIGBALL_V3_HOST',
      path: '/cl/index.php?module=CashSystem',
      params: { id: 'mid' },
    },
  },
];

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
    component: view('home/home'),
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
  },
];

// 產生 router
const router = createRouter({
  history: createWebHistory(),
  routes: guestRoutes,
});

// 設定路由
export const setRoute = new Promise(resolve => {
  // getFeatureRoute().then(routerList => {
  const mainRouter = {
    path: '/',
    name: 'layout',
    meta: { auth: true },
    redirect: '/home',
    component: view('home/index'),
    children: [
      ...defaultRoutes,
      ...specialRoutes,
      // ...routerList,
      ...[],
      ...fallbackRoutes,
    ],
  };
  router.addRoute(mainRouter);
  // beforeEach 邏輯
  // routerMiddleware(router);
  resolve(true);
  // });
});

export default router;
