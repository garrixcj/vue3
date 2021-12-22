/**
 * 檢查檢視權限
 */
import { useStore } from 'vuex';
import { computed, Ref, watch } from 'vue';
import http from '@/http';

/**
 * 單一權限
 */
export const useAccess = (permission: string) => {
  const store = useStore();
  return computed(() => store.getters['permission/checkPerm'](permission));
};

/**
 * 分頁權限
 */
export const useTabAccess = (tabs: { name: string; perm: string }[]) => {
  const store = useStore();
  // tab過濾有權限的
  const currentTabs = computed(() =>
    tabs.filter(
      (tab) => !tab.perm || store.getters['permission/checkPerm'](tab.perm),
    ),
  );

  const tabPerms = tabs.reduce((acc, tab) => {
    acc[tab.name] =
      !tab.perm || store.getters['permission/checkPerm'](tab.perm);
    return acc;
  }, {} as Record<string, boolean>);

  // 設定api
  const setApiPerm = (activeTab: string) => {
    const permName = tabs.find((tab) => tab.name == activeTab)?.perm || '';
    if (permName !== '') {
      http.setHeadersPermName(permName);
    }
  };

  // 設定watch
  const setTabWatcher = (activeTab: Ref<string>) => {
    watch(
      activeTab,
      (tab) => {
        setApiPerm(tab);
      },
      { immediate: true },
    );
  };

  return { currentTabs, tabPerms, setApiPerm, setTabWatcher };
};
