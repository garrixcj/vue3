export as namespace OGTable;

export type CustomSlot = {
  slot: string;
};

export type ColumnSet = {
  dataIndex: string; // data key
  title?: string | CustomSlot; // 標題
  align?: 'left' | 'right' | 'center'; // 資料對齊方式
  titleAlign?: 'left' | 'right' | 'center'; // 標題對齊方式
  customRender?: CustomSlot; // 客製化slot
  width?: number; // 寬度 px
  minWidth?: number; // 最小寬度 px
  class?: string; // custom class
  titleClass?: string; // custom class
  sortable?: boolean; // 排序
};

export type BackgroundColor = 'none' | 'white';

export type DataSource = {
  selected?: boolean;
  disabled?: boolean;
  [key: string]: unknown;
};
