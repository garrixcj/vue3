import { type Placement } from 'element-plus';

export as namespace RdSelect;

export type SelectedSize = 'small' | 'default' | 'large';

// 下拉選單彈出匡設定
export type PopperSetting = {
  width?: number | string; // popover 寬度
  maxHeight?: number; // popper 長度
  placement?: Placement; // 氣泡框位置
};
// 快搜選項
export type QuickSearchSetting = {
  placeholder?: string; // 快搜 placeholder
  filter?: Function; // 自定義快搜
};
// 已選定輸入匡選項
export type SelectedSetting = {
  placeholder?: string; // 請選擇 placeholder
  fill?: boolean; // width 100% (default false)
  minWidth?: number; // 最小寬度
  maxWidth?: number; // 最大寬度
  onlyAll?: boolean; // [多選] 只顯示全部標籤
};

// 選項 (同 option.vue 的 props)
export type SelectOption = {
  value: number | string; // 辨識用唯一值
  label: string; // 顯示標籤
  disabled?: boolean; // 禁用
  group?: boolean; // 作為群組當成選項但是不能按
  divided?: boolean; // 作為分隔蠆當成選項但是不能按
  // * 不建議使用 all 選項，即使 options 可以帶入此參數
  // all?: boolean; // 作為群組當成選項但是不能按 [多選]
  option?: object; // 其他客製化用選項
};
