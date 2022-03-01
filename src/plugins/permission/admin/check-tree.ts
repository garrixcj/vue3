/**
 * Permission Library - Check List
 * 權限使用方式函式庫 for Check List
 */
import { cloneDeep, groupBy } from 'lodash';
// import { permission as permissionApi } from "@/api/admin";
import { reactive } from 'vue';
// import strmatcher from "@/components/utils/strmatcher";

export type PermissionType = 'menu' | 'special' | 'general';

// 權限節點(提供可用的權限屬性)
export type Node = {
  id: number | string; // 權限id
  dict: string; // 字典檔
  type: string; // 權限型態
  parent: number;
  partial: boolean;
  children: Node[];
  oldPerm: boolean;
  [key: string]: unknown;
};
// 給checklist用的樹
export type CheckTreeNode = {
  id: number | string; // 權限id
  name: string;
  isModifyEnabled: boolean;
  isViewEnabled: boolean;
  modifyChecked: boolean;
  viewChecked: boolean;
  partialSync: boolean; // 判斷為第四層不需同步全選
  children: CheckTreeNode[];
} & Node;
// 節點群組
export type GroupNodes = {
  [key: number]: Node[];
};
// 權限樹 Ex: { menu: CheckTreeNode[] }
export type PermissionTree = { [key in PermissionType]?: CheckTreeNode[] };
// Check List客製化選項
export type CheckListOptions = {
  buildNode?: (node: Node) => object;
  category?: PermissionType[];
};
// 權限陣列集合 (送出表單用)
export type PermissionSet = {
  id: string | number;
  modify: boolean;
};
export type PermissionSetTree = { [key in PermissionType]?: PermissionSet[] };

/**
 * 遞迴填入資料
 * @param {CheckTreeNode[]} checkTree 樹狀物件(checklist)
 * @param {CheckTreeNode[]} nodes 一維節點資料
 */
export const fillData = (
  checkTree: CheckTreeNode[],
  nodes: PermissionSet[],
) => {
  checkTree.forEach(node => {
    const tmpNode = node;
    // Step1: 遞迴樹狀資料，找出對應填入資料的節點
    const currentEnableNode = nodes.find(data => data.id === node.id);
    if (currentEnableNode) {
      // Step2-1: 找到節點後填入資料
      tmpNode.modifyChecked = !!currentEnableNode.modify;
      tmpNode.viewChecked = true; // 取出權限即是有檢視權限
    } else {
      // Step2-2: 找到節點後填入資料
      tmpNode.modifyChecked = false;
      tmpNode.viewChecked = false;
    }
    // Step3: 向下遞迴
    if (node.children.length !== 0) {
      fillData(node.children, nodes);
    }
  });
};

/**
 * 取出權限
 */
export const flatPermission = (
  checkTree: CheckTreeNode[],
  full = false,
): PermissionSet[] =>
  checkTree.reduce((acc, perm) => {
    if (perm.children.length > 0) {
      // 計算子層有無開啟
      const childrenPerms = flatPermission(perm.children, full);
      const modify = perm.children[0].partialSync
        ? perm.modifyChecked
        : childrenPerms.some(child => child.modify);
      const partialParent =
        perm.children[0].partialSync &&
        ((perm.oldPerm && perm.modifyChecked) ||
          (!perm.oldPerm && perm.viewChecked));
      const selfPerm =
        childrenPerms.length > 0 || partialParent
          ? [
              {
                id: perm.id,
                modify,
              },
            ]
          : [];
      return [...acc, ...childrenPerms, ...selfPerm];
    }
    if (
      full ||
      (perm.oldPerm && perm.modifyChecked) ||
      (!perm.oldPerm && perm.viewChecked)
    ) {
      // 過濾
      return [
        ...acc,
        {
          id: perm.id,
          modify: perm.modifyChecked,
        },
      ];
    }
    return [...acc];
  }, [] as PermissionSet[]);

export const useCheckList = (
  { buildNode, category } = {} as CheckListOptions,
) => {
  const currentCategory = category || ['menu', 'special'];
  const tree = reactive(
    currentCategory.reduce((acc, cate) => {
      acc[cate] = [] as CheckTreeNode[];
      return acc;
    }, {} as PermissionTree),
  );

  /**
   * 生成樹節點
   * @param {Node} permission
   */
  const buildCheckNode = (permission: Node) => {
    // 檢視權限只有非舊權限
    const isViewEnabled =
      permission.children.length === 0 ||
      permission.children.some(child => child.type === 'Factor')
        ? !permission.old_perm
        : permission.children.some(childrenItem => !childrenItem.oldPerm);
    const isModifyEnabled =
      permission.children.length === 0 ||
      permission.children.some(child => child.type === 'Factor')
        ? permission.old_perm || permission.modify
        : permission.children.some(
            childrenItem => childrenItem.isModifyEnabled,
          );
    return {
      id: permission.id, // 權限id
      type: permission.type, // 權限型態
      children: permission.children, // 子權限
      name: permission.dict, // 名稱
      parent: permission.parent,
      isModifyEnabled,
      isViewEnabled,
      modifyChecked: false,
      viewChecked: false,
      oldPerm: permission.old_perm,
      partial: permission.partial,
      partialSync: permission.type === 'Factor', // 判斷為第四層不需同步全選
      ...(buildNode?.(permission) || {}),
    } as CheckTreeNode;
  };

  /**
   * 建出權限樹(二維群組陣列->樹狀陣列)
   * @param {GroupNodes} keyGroups 對應map的group
   * @param {number | string} parentId
   * @return {CheckTreeNode[]}
   */
  const constructTree = (
    keyGroups: GroupNodes,
    parentId: number | string = 0,
  ): CheckTreeNode[] => {
    return (
      keyGroups[+parentId]?.map((node: Node) => {
        const children = constructTree(keyGroups, node.id) || [];
        return buildCheckNode({ ...node, children });
      }) || []
    );
  };

  /**
   * 取得控端使用者可開放權限(checklist)
   * @return {Promise}
   */
  // const getPermissions = () => {
  //   return permissionApi.getPermission().then(resp => {
  //     currentCategory.forEach(cate => {
  //       tree[cate] = constructTree(groupBy(resp.data.data[cate], "parent"));
  //     });
  //   });
  // };

  /**
   * 樹狀資料填入 (checklist 用)
   * 需配合check-list的init使用
   * @public 樹狀資料填入，用於匯入勾選資料
   * @param {PermissionSet[]} nodes 一維節點資料
   * @return {Promise}
   */
  const fillTreeData = (nodes: PermissionSet[]) =>
    new Promise(resolve => {
      currentCategory.forEach((cate: PermissionType) => {
        fillData((tree[cate] as CheckTreeNode[]) || [], nodes);
      });
      resolve(true);
    });

  /**
   * 平攤權限樹狀勾選陣列
   */
  const flatTreePermission = () => {
    return currentCategory.reduce((acc, cate) => {
      acc[cate] = flatPermission((tree[cate] as CheckTreeNode[]) || []);
      return acc;
    }, {} as PermissionSetTree);
  };

  /**
   * 被filter後的樹(非即時響應所以不用computed)
   */
  const filterTree = reactive({} as PermissionTree);

  // const filterList = (
  //   list: CheckTreeNode[],
  //   keyword: string
  // ): CheckTreeNode[] => {
  //   return list.reduce((acc, perm) => {
  //     if (strmatcher.match(perm.name, keyword) && perm.parent !== 0) {
  //       return [...acc, perm];
  //     }
  //     if (perm.children.length > 0) {
  //       const childrenPerms = filterList(perm.children, keyword);
  //       if (childrenPerms.length > 0) {
  //         const selfPerm = cloneDeep(perm);
  //         selfPerm.children = childrenPerms;
  //         return [...acc, selfPerm];
  //       }
  //     }
  //     return acc;
  //   }, [] as CheckTreeNode[]);
  // };

  /**
   * filterTree的set function
   */
  // const keywordFilter = (keyword: string) => {
  //   currentCategory.forEach(cate => {
  //     filterTree[cate] = filterList(tree[cate] as CheckTreeNode[], keyword);
  //   });
  // };

  return {
    category: currentCategory,
    // 權限類別
    tree,
    buildCheckNode,
    constructTree,
    // getPermissions,
    fillTreeData,
    flatTreePermission,
    // 過濾
    filterTree,
    // keywordFilter
  };
};
