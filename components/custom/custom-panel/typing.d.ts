export as namespace RdCustomPanel;

// 清單結構各層各項結構 Category -> Item -> Child -> Special 四層結構
export type ListItem = {
  // Category / Item / Child / Special
  name: string;
  partialSync: boolean; // 部分更新(關閉自身不影響父層，開啟父層不連動開啟)
  viewChecked: boolean; // 檢視勾選
  modifyChecked: boolean; // 修改勾選
  viewDisabled: boolean; // 檢視禁能
  modifyDisabled: boolean; // 修改禁能
  isViewEnabled: boolean; // 可檢視
  isModifyEnabled: boolean; // 可修改
  topSubDomain?: boolean; // 可修改
  children: ListItem[];
  [key: string]: unknown;
};

export type BtnListItem = {
  // Category / Item / Child / Special
  name: string;
  partialSync: boolean; // 部分更新(關閉自身不影響父層，開啟父層不連動開啟)
  children: BtnListItem[];
  [key: string]: unknown;
};

export type Action = 'view' | 'modify';
