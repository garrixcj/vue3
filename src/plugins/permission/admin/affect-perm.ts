/**
 * Affect Hint 權限影響功能清單
 */

// import { permission as permissionApi } from "@/api/admin";
import { ref } from 'vue';
import RdCustomPanel from '@/components/custom/custom-panel/typing';

/**
 * 檢查權限(含下層)是否受到最高管理者影響
 * @param {ListItem} perm 權限
 * @return {Boolean} 是否影響
 */
export const checkTopManagementAffect = (
  perm: RdCustomPanel.ListItem,
): boolean => {
  // 判斷下層權限是否都受 最高管理者 權限影響
  const allTopSubDomainPerm =
    perm.children.length > 0
      ? perm.children.every(item => item.topSubDomain)
      : true;
  // todo test 寫法

  if (allTopSubDomainPerm && perm.topSubDomain) {
    return true;
  }
  return false;
};

export type AffectPerm = {
  count: number;
  data: { [key: string]: unknown[] };
};

// export const useAffectList = () => {
//   const affectList = ref<Record<number, AffectPerm>>({});
//   const updateAffectList = () => {
//     return permissionApi.getAffectList().then(resp => {
//       if (resp.data.result) {
//         affectList.value = resp.data.data;
//       }
//     });
//   };

//   return {
//     affectList,
//     updateAffectList
//   };
// };

export default {
  checkTopManagementAffect,
};
