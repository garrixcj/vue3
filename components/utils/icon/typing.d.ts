export as namespace RdSort;

export type Orders = null | 'ascending' | 'descending';

export type ColumnSet = {
  dataIndex: string; // data key
  sortable?: boolean; // 排序
};
