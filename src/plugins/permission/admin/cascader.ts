/**
 * Permission Library - Cascader
 * 權限使用方式函式庫 for Cascader
 */
import { groupBy } from 'lodash';
// import { permission as permissionApi } from "@/api/admin";

// 權限類型
export type PermissionType = 'menu' | 'special' | 'general';
// 樹結點
export type TreeNode = {
  children?: TreeNode[];
  [key: string]: unknown;
};
// 權限節點(提供可用的權限屬性)
export type Node = {
  id: number | string; // id
  dict: string; // 字典檔
  [key: string]: unknown;
};
// 節點群組
export type GroupNodes = {
  [key: number]: Node[];
};
// Cascader 客製化選項
export type CascaderOptions = {
  buildNode?: (node: Node) => object;
};

/**
 * 建出權限樹(二維群組陣列->樹狀陣列)
 * @param {GroupNodes} keyGroups 對應map的group
 * @param {number | string} parentId
 * @return {TreeNode[]}
 */
export const constructTree = (
  keyGroups: GroupNodes,
  parentId: number | string = 0,
): TreeNode[] => {
  return (
    keyGroups[+parentId]?.map((node: Node) => ({
      ...node,
      children: constructTree(keyGroups, node.id) || null,
    })) || null
  );
};

/**
 * 取得選項(一維陣列->二維陣列group->選項樹)
 * @param  {Node[]} nodes
 * @return {TreeNode[]}
 */
export const getOptions = (nodes: Node[]): TreeNode[] => {
  return constructTree(groupBy(nodes, 'parent'));
};

/**
 * 使用級聯選擇器設定權限
 * @param {Function} buildNode 客製化 node
 * @returns {object}
 */
export const useCascader = ({ buildNode } = {} as CascaderOptions) => {
  return {
    // 下拉的權限類別
    category: ['menu', 'special'] as PermissionType[],
    // 下拉的選項
    options: [] as TreeNode[],
    // 原始陣列(一維)
    origin: [] as Node[],
    buildNode,
    getOptions,
    /**
     * 取得權限清單(級聯選擇器下拉選單)
     * 大類只取選單權限跟特殊權限
     * 不取第四層
     */
    // async updateOptions() {
    //   const resp = await permissionApi.getPermission();
    //   const permission: Record<PermissionType, Node[]> = resp.data.result
    //     ? resp.data.data
    //     : {};

    //   this.origin = this.category.reduce((acc, type) => {
    //     return [
    //       ...acc,
    //       ...permission[type]
    //         .filter(perm => perm.type !== "Factor") // 過濾第四層
    //         .map((permission: Node) => ({
    //           ...permission,
    //           ...(this.buildNode?.(permission) || {})
    //         }))
    //     ];
    //   }, [] as Node[]);
    //   this.options = getOptions(this.origin);
    // }
  };
};
