/* eslint-disable @typescript-eslint/no-explicit-any */
export as namespace NotLoggedInList;

// 未登入日期區間類別
export type DateRangeKey = '7' | '14' | '30' | '90' | '180' | '180up' | 'never';

// 未登入日期區間總計
export type GroupTotals = Record<DateRangeKey, number>;

// 總計列表Form可帶入條件
export type SearchFormType = {
  day_group: string;
  type: string;
  page: number;
  limit: number;
  sort: string;
  order: string;
};

// 總計列表欄位資料
export type TableDataType = {
  day_group: number | string;
  total: number | string;
  bankrupt_total: number | string;
  block_total: number | string;
  disable_total: number | string;
  enable_total: number | string;
  locked_total: number | string;
};

// 未登入詳細列表欄位資料
export type DetailTableDataType = {
  parent: string;
  username: string;
  user_id: number;
  parent_id: number;
  currency: string;
  deposit_amount: number | string;
  withdrawal_amount: number | string;
  balance_difference: number | string;
  create_at: string;
  last_login: string;
  offline_days: number | string;
  enable: boolean;
  disable: boolean;
  block: boolean;
  bankrupt: boolean;
  [key: string]: unknown;
};

// 未登入詳細列表搜尋Form可帶入條件
export type DetailListFormType = {
  domain: number | string;
  dayGroup: DateRangeKey;
  type: DayCountKey;
  page: number;
  limit: number;
  sort: string;
  order: string;
};

// 未登入區間狀態
export type DayCountKey =
  | 'total'
  | 'enable'
  | 'disable'
  | 'block'
  | 'bankrupt'
  | 'locked';

// 未登入區間各狀態數量總計
export type DayCountType = Record<DayCountKey, number>;

// 匯出參數
export type ExportParamsType = {
  export_remark: string;
  lang: string;
  day_group: string | number;
};
