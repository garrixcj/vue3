/**
 * 檢查修改權限
 */
import { useStore } from 'vuex';
import { computed } from 'vue';

export const useModifyAccess = (permission: string) => {
  const store = useStore();
  const hasModify = computed(() =>
    store.getters['permission/checkModifyPerm'](permission),
  );
  return { hasModify };
};
