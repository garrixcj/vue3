/* eslint-disable @typescript-eslint/no-explicit-any */
export as namespace UrlManagementRecord;

// 操作類別(0:全部、1:申請域名、2:申請域名-已完成、3:申請域名-作廢中、4:申請域名-已作廢、5:編輯備註、6:限制設定)
export type OperatorType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// 參數資料格式
export type ParamsType = {
  start_date: string;
  end_date: string;
  operator_type: OperatorType;
  domain_name: string;
  site_group: string;
  ticket_id: string | number;
  operator: string;
  ip: string;
  page: string | number;
  limit: string | number;
  sort: string;
  order: string;
};

// 操作記錄資料格式
export type RecordsType = {
  content: string;
  created_at: string;
  domain: number;
  id: number;
  operator: string;
  operator_id: number;
  operator_ip: string;
  operator_site: number;
  operator_type: number;
  site_group: string;
  ticket_id: number;
  updated_at: number;
};

// 域名列表資訊
export type DomainNamesType = {
  serial_number: number;
  domain_name: string;
};

// 表單格式
export type FormType = {
  date: [string, string];
  siteGroup: string;
  operatorType: OperatorType;
  domainName: string;
  ticketID: string | number;
  keyword: string;
  sort: string;
  order: string;
  page: number;
  limit: number;
};
