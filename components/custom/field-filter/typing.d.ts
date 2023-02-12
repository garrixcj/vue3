export as namespace FieldFilter;

// 欄位資訊結構
export type FieldSet = {
  key: string; // 用於是否顯示 table-column（emitField 觸發回傳的資料）
  name: string; // 自訂欄位顯示的文字
  visible: boolean; // 顯示該筆資料
  default: boolean; // 預設勾選
  disabled: boolean; // 禁用
  [key: string]: unknown;
};

// 群組欄位資訊結構
export type GroupFieldSet = FieldSet & { group: string };
