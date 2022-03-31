/**
 * 檢查修改權限
 */
import { computed } from 'vue';
import { usePermissionStore } from '@/stores/permission';

export const useModifyAccess = (permission: string) => {
  const permissionStore = usePermissionStore();
  const hasModify = computed(() => permissionStore.checkModifyPerm(permission));
  return { hasModify };
};
