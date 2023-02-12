export as namespace GridTable;

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
  span?: number; // col span計算方式 24塊
  flex?: number; // flex 自適應計算法
  class?: string; // custom class
  titleClass?: string; // custom class
};

export type SizeSets = 'small' | 'default' | 'large';

export type SizeStyle = {
  font?: SizeSets; // 字體大小
  content?: SizeSets; // 內容寬度
};

export type BorderStyle = 'grey' | 'green' | string;

export type BackgroundColor = 'none' | 'grey' | 'white' | 'blue' | string;

export type RowStyleSet = {
  background?: BackgroundColor;
  hover?: boolean;
  border?: BorderStyle;
  size?: SizeSets | SizeStyle;
  separateLine?: boolean;
};

export type MediaGrid = {
  xs: number; // < 768px
  sm: number; // >= 768px
  md: number; // >= 992px
  lg: number; // >= 1200px
  xl: number; // >= 1920px
};

export type GridSet = {
  line: number | MediaGrid;
  columnGap?: number;
  rowGap?: number;
};
