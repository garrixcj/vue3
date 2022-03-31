/**
 * 檢查檢視權限
 */
import { computed, watch } from 'vue';
import { usePermissionStore } from '@/stores/permission';
import http from '@/http';
import type { Ref } from 'vue';

/**
 * 單一權限
 */
export const useAccess = (permission: string) => {
  const permissionStore = usePermissionStore();
  return computed(() => permissionStore.checkPerm(permission));
};

/**
 * 分頁權限
 */
export const useTabAccess = (tabs: { name: string; perm: string }[]) => {
  const permissionStore = usePermissionStore();
  // tab過濾有權限的
  const currentTabs = computed(() =>
    tabs.filter(tab => !tab.perm || permissionStore.checkPerm(tab.perm)),
  );

  const tabPerms = tabs.reduce((acc, tab) => {
    acc[tab.name] = !tab.perm || permissionStore.checkPerm(tab.perm);
    return acc;
  }, {} as Record<string, boolean>);

  // 設定api
  const setApiPerm = (activeTab: string) => {
    const permName = tabs.find(tab => tab.name == activeTab)?.perm || '';
    if (permName !== '') {
      http.setHeadersPermName(permName);
    }
  };

  // 設定watch
  const setTabWatcher = (activeTab: Ref<string>) => {
    watch(
      activeTab,
      tab => {
        setApiPerm(tab);
      },
      { immediate: true },
    );
  };

  return { currentTabs, tabPerms, setApiPerm, setTabWatcher };
};
