/**
 * 遷移部分路由
 */
const proxyRoutes: Record<string, { route?: string; component?: string }> = {
  // 控端-管理者帳號(PID)
  AdminUserNew: { route: '/system/administrator/index' },
  // 控端-管理者帳號 - 帳號詳情
  AdminUserManagement_23: {
    route: '/system/administrator/:id(\\d+)',
    component: '/system/administrator/account/detail',
  },
  // 控端-管理者帳號 - 職務
  AdminUserManagement_40: {
    route: '/system/administrator/position/:id(\\d+)',
    component: '/system/administrator/account/position/detail',
  },
  // 遊戲平台管理
  GamePlatform: { route: '/system/game/index' },
  // 廳主維護資訊
  MaintainInfo: {
    route: '/system/maintain/index',
  },
};

export const addProxyRoute = (
  routes: { name: string; [key: string]: unknown }[],
) => {
  return routes.map(route => {
    if (proxyRoutes[route.name]) {
      return { ...route, ...proxyRoutes[route.name] };
    }
    return route;
  });
};

export const addProxyMenu = (
  menus: { name: string; [key: string]: unknown }[],
) => {
  return menus.map(menu => {
    if (proxyRoutes[menu.name] && proxyRoutes[menu.name].route) {
      return { ...menu, route: proxyRoutes[menu.name].route };
    }
    return menu;
  });
};

export default { addProxyRoute, addProxyMenu };
