export as namespace NavInfo;

export type SlotSet = {
  // 使用 feature-bar 的 icon slot 功能
  slot?: string;
  // 客製 當 feature-bar 變為 dropdown 時，內部 menu 的後綴 slot 功能
  menuSlot?: string;
  // 當 feature-bar 變為 dropdown 時，點擊 menu 後觸發的 hook function
  hook?: Function;
};
export type CustomSwitch = {
  // 開關
  enable: boolean;
  // 字典
  dict: string;
  // 名稱
  name: string;
  // 型態
  type: 'info' | 'icon' | 'iconCollapse';
  // 排序
  sort: number;
  // 連結
  link?: string;
  // badge數字
  count?: number;
  max?: number;
  // 預設開關
  default_enable?: boolean;
  defult_enable?: boolean; // todo remove old key
  defult_sort?: number; // todo remove old key
  // slot 功能
  slot?: string;
  // 點擊後的 hook function
  hook?: function;
  [key: string]: unknown;
} & SlotSet;
export type CustomStatus = {
  // 圖示開關
  collapse: {
    enable: boolean;
    default: boolean;
  };
  // 預設 nav bar功能
  info: CustomSwitch[];
  // 功能(icon)
  feature: CustomSwitch[];
};
export type CustomStatusForm = {
  // 圖示開關
  collapse: boolean;
  // 預設 nav bar功能
  info: CustomSwitch[];
  // 功能(icon)
  feature: CustomSwitch[];
};
