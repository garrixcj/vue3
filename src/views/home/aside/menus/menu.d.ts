export as namespace Menu;

export type MenuItem = {
  id: string | number; // menu id
  name: string; // 功能名稱(key name)
  dict: string; // 字典
  note: string; // 功能名稱備註
  text?: string; // 字典轉換
  icon?: string; // icon (only Category)
  favorite?: boolean; // 我的最愛
  file?: string; // component file (only Feature)
  host?: string; // 網域 (only Feature)
  qstr?: string; // 參數 (iframe Feature)
  route?: string; // 網址路由 (only Feature)
  children?: Menu[]; // 子功能 (only Category)
  active?: boolean; // current menu
  open?: boolean; // 縮合
  [key: string]: unknown;
};
