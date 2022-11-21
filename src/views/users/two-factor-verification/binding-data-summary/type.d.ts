export as namespace BindingDataSummary;

// 綁定分類 key
export type BindingType = 'all_binding' | 'ub_auth' | 'sms' | 'other';

// 綁定資料總數格式
export type BindingTotal = Record<BindingType, string>;

// 綁定資料格式
export type BindingData = {
  id: number; // 會員 id
  username: string; // 會員帳號
  alias: string; // 會員名稱
  created_at: string; // 註冊時間
  binding_at: string; // 綁定時間
  type: string; // 驗證方式
  telephone: string; // 手機號碼
  last_login: string; // 最後登入時間
};
