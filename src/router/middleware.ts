import { Router } from 'vue-router';
import store from '@/store';
import http from '@/http';
import messages from '@/pages/home/menu/lang.json';
import systemApi from '@/api/system';
import { codeMap } from '@/plugins/errorcode';

// 路由中介邏輯
export const routerMiddleware = (router: Router) => {
  router.beforeEach((to, from, next) => {
    // 主區塊顯示loading
    store.commit('loading/setIndexLoading', true);

    const locale: keyof typeof messages = store.getters['cookie/lang'];

    // 設定網頁標題
    if (to.meta.title) {
      const title = to.meta.title as keyof typeof messages.en;
      // title如果有字典檔就顯示字典檔的字
      if (messages[locale][title]) {
        to.meta.title = messages[locale][title];
      }
      document.title = to.meta.title as string;
    }

    // 設定Headers PermNamse
    if (to.meta.checkPermissions && to.meta.perm && to.path !== from.path) {
      http.setHeadersPermName(to.meta.perm as string);
    }
    // 是否要檢查登入狀態
    if (to.meta.auth) {
      // 檢查登入狀態
      const checkSid = () =>
        new Promise((resolve, reject) => {
          store.dispatch('operator/checkSession').then(resp => {
            if (resp.data.result) {
              // 瀏覽記錄
              if (to.meta.menuId) {
                // 新增最後訪問的記錄
                store.dispatch('menu/setVisited', to.meta.menuId);
              }
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
          const ids = store.getters['permission/permissionIds'] || [];
          // 要檢查權限並且沒有權限
          if (to.meta.checkPermissions && ids.indexOf(to.meta.menuId) === -1) {
            next('/forbidden');
          } else if (to.meta.perm !== undefined && to.meta.perm !== '') {
            checkMaintenance(to.meta.perm)
              .then(() => {
                // 非維護，正常導轉
                next();
              })
              .catch(resp => {
                // 維護中，導轉到維護頁面
                store.commit('loading/setIndexLoading', false);
                next(
                  `/error_page?date=${resp.data.data.end_at}&dict=${resp.data.data.dict}&code=${codeMap.featureMaintain}&name=${resp.data.data.perm_name}`,
                );
              });
          } else {
            next();
          }
        })
        .catch(() => {
          next('/login');
        });
      // 訪客可以訪問的頁面，如：維護頁、no service
    } else if (to.meta.guest) {
      next();
      // 其餘一律導轉到登入頁
    } else {
      next('/login');
    }
  });
};

export default routerMiddleware;