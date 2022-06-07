/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLoadingStore } from '@/stores/loading';
import { useCookieStore } from '@/stores/cookie';
import { useOperatorStore } from '@/stores/operator';
import { useMenuStore } from '@/stores/menu';
import { usePermissionStore } from '@/stores/permission';
import http from '@/http';
// import messages from '@/pages/home/menu/lang.json';
import systemApi from '@/api/system';
import { codeMap } from '@/plugins/errorcode';
import { type Router } from 'vue-router';

// 路由中介邏輯
export const routerMiddleware = (router: Router) => {
  router.beforeEach((to, from, next) => {
    const loadingStore = useLoadingStore();
    const cookieStore = useCookieStore();
    const operatorStore = useOperatorStore();
    const menuStore = useMenuStore();
    const permissionStore = usePermissionStore();
    // 主區塊顯示loading
    loadingStore.index = true;

    const locale = cookieStore.lang;
    // 設定網頁標題
    if (to.meta.title) {
      const title: string = to.meta.title;
      // title如果有字典檔就顯示字典檔的字
      // if (messages[locale][title]) {
      //   to.meta.title = messages[locale][title];
      // }
      document.title = to.meta.title || '';
    }

    // 設定Headers PermName
    if (to.meta.checkPermissions && to.meta.perm && to.path !== from.path) {
      http.setHeadersPermName(to.meta.perm as string);
    }
    // 是否要檢查登入狀態
    if (to.meta.auth) {
      // 檢查登入狀態
      const checkSid = () =>
        new Promise((resolve, reject) => {
          operatorStore.checkSession().then(resp => {
            if (resp.data.result) {
              // // 瀏覽記錄
              // if (to.meta.menuId) {
              //   // 新增最後訪問的記錄
              //   let menuId = to.meta.menuId;
              //   if (typeof menuId === 'string') {
              //     menuId = parseInt(menuId, 10);
              //   }
              //   menuStore.setVisited(menuId);
              // }
              resolve(resp); // 已登入
            } else {
              reject(resp); // 未登入
            }
          });
        });
      // 檢查分項維護
      const checkMaintenance = (permName: string) =>
        new Promise((resolve, reject) => {
          systemApi.getFeatureMaintenanceStatus(permName).then(resp => {
            if (!resp.data.data.status) {
              resolve(resp); // 非維護
            } else {
              reject(resp); // 維護狀態
            }
          });
        });
      checkSid()
        .then(() => {
          const ids = permissionStore.permissionIds || [];
          let menuId = to.meta.menuId;
          if (typeof menuId === 'undefined') {
            menuId = 0;
          } else if (typeof menuId === 'string') {
            menuId = parseInt(menuId, 10);
          }
          if (to.meta.checkPermissions && ids.indexOf(menuId) === -1) {
            // 要檢查權限並且沒有權限
            next('/forbidden');
          } else if (to.meta.perm !== undefined && to.meta.perm !== '') {
            // 有權限檢查功能維護
            checkMaintenance(to.meta.perm)
              .then(() => {
                // 非維護，正常導轉
                next();
              })
              .catch(resp => {
                // 維護中，導轉到維護頁面
                loadingStore.index = false;
                next(
                  `/error_page?date=${resp.data.data.end_at}&dict=${resp.data.data.dict}&code=${codeMap.featureMaintain}&name=${resp.data.data.perm_name}`,
                );
              });
          } else {
            next();
          }
        })
        .catch(() => {
          // session 有問題 倒回登入頁
          next('/login');
        });
      // 訪客可以訪問的頁面，如：維護頁、no service
    } else if (to.meta.guest) {
      next();
    } else {
      // 其餘一律導轉到登入頁
      next('/login');
    }
  });
};

export default routerMiddleware;
