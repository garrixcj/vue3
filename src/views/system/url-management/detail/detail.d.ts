export as namespace UrlManagementDetail;

// 單號詳情 - 工單 - 資訊
export type TicketInfo = {
  id: number;
  siteGroup: string;
  domain: number;
  status: number;
};
// 單號詳情 - 工單 - 域名設定格式
export type TicketDetailUrl = {
  domain: string;
  progress: number;
  message: string;
};

// 單號詳情 - 域名設定格式api回傳url部分
type TicketDetailUrlFromApi = {
  domain_name: string;
  progress_rate: number;
  message: string;
};
