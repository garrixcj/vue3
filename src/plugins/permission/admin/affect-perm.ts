/**
 * Affect Hint 權限影響功能清單
 */

// import { permission as permissionApi } from "@/api/admin";
import { ref } from 'vue';

export type AffectPerm = {
  count: number;
  data: { [key: string]: unknown[] };
};

/**
 * 受到 最高管理者 權限影響的權限
 * @param {ListItem} perm 權限
 * @return {Boolean} 是否影響
 */
export const affectedPerm = (perm: RdCustomPanel.ListItem): boolean => {
  // 判斷下層權限是否都受 最高管理者 權限影響
  const allTopSubDomainPerm =
    perm.children.length > 0
      ? perm.children.every(item => item.topSubDomain)
      : true;
  // todo test 寫法
  // const allTopSubDomainPerm = perm.children.length < 0 || perm.children.every(item => item.topSubDomain);

  if (allTopSubDomainPerm && perm.topSubDomain) {
    return true;
  }
  return false;
  // return !!(allTopSubDomainPerm && perm.topSubDomain) && true;
};

export default {
  affectedPerm,
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
