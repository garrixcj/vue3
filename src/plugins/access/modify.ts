/**
 * 檢查修改權限
 */
import { computed } from 'vue';
import { useStore } from 'vuex';

export const useModifyAccess = (permission: string) => {
  const store = useStore();
  const hasModify = computed(() =>
    store.getters['permission/checkModifyPerm'](permission),
  );
  return { hasModify };
};
