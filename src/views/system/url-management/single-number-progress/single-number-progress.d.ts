export as namespace UrlManagementSingleBumberProgress;

// 搜尋form
export type SearchForm = {
  condition: string;
  site: string;
  domain: number | '' | 'all';
  domainName: string;
  fuzzy: boolean;
  id: string;
  dateType: string;
  rangeDate: string[];
  buy: string[];
  management: string[];
  progress: string[];
  status: string[];
  page: number;
  limit: number;
  sort: string;
  order: string;
};

// 搜尋的參數
export type SearchOptions = {
  domain?: number;
  site_group?: string;
  domain_name?: string;
  fuzzy?: 0 | 1;
  ticket_id?: string;
  tickets_status?: number[];
  progress_rates?: number[];
  start_date_time?: string;
  end_date_time?: string;
  finish_start_date_time?: string;
  finish_end_date_time?: string;
  purchase_method?: number[];
  maintenance_method?: number[];
  page: number;
  limit: number;
  sort: string;
  order: string;
};

type DomainNameApi = {
  domain_name: string;
  message: string;
  progress_rate: number;
  ticket_id: number;
};
// api的列表回傳
export type ListApi = {
  id: number;
  site_group: string;
  status: number;
  company_purchase: boolean;
  company_maintenance: boolean;
  created_at: string;
  finished_at: string;
  processing_amount: number;
  cancel_amount: number;
  fail_amount: number;
  success_amount: number;
  domain_names: domainName[];
};

export type DomainName = {
  domainName: string;
  message: string;
  progress: number;
  ticketId: number;
};
// 列表
export type List = {
  site: string;
  id: number;
  buy: string;
  management: string;
  applyAt: string;
  finishAt: string;
  progressCount: number;
  canNotBindCount: number;
  abolishCount: number;
  finishCount: number;
  status: number;
  domainList: domainName[];
};

// 作廢列表
export type AbolishList = { id: number; siteName: string; suffix: string };
// 作廢的動作
export type AbolishAction = 'single' | 'multi';
