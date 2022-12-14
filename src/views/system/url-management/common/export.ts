import { chunk } from 'lodash';
import { url as urlAPI } from '@/api/domain';
import { randomAlphanumeric } from '@/components/utils/random/index';
import { useAccesses } from '@/plugins/access/view';
import http from '@/http';

/**
 * 取得匯出權限
 * @param {string} permName 匯出權限名稱
 * @return {boolean}
 */
export const useExportAccesses = (permName: string) => {
  return useAccesses(['Downloads', permName]);
};

/**
 * 設定匯出權限
 * @param {string} permName 匯出權限名稱
 */
export const setExportPermName = (permName: string) => {
  http.setHeadersPermName(permName);
};

// 匯出客端域名的參數
export type ExportCustomerDomainNameParams = {
  domain_name?: string;
  ip?: string;
  abnormal_area?: string;
  service_item?: number[];
  domain_name_status?: number[];
  certificate_status?: number[];
  service_error?: number[];
  table_filter?: number;
  sort?: string;
  order?: string;
  export_remark?: string;
};

// 執行匯出客端域名資料
export const doExportCustomerDomainNameList = (
  type: string,
  site: string,
  domain: number,
  multipleDomainNameList: string[],
  checkNoDomainNameList: string[],
  lang: string,
  options: ExportCustomerDomainNameParams,
) => {
  // 判斷為批次搜尋域名的匯出
  if (type === 'domainName' && domain > 0) {
    // 匯出「查無域名」資料
    if (
      typeof options.table_filter !== 'undefined' &&
      options.table_filter === 3
    ) {
      return urlAPI.exportCustomerDomainByNoDomain(
        checkNoDomainNameList,
        lang,
        options,
      );
    }

    const token = randomAlphanumeric();

    // 多域名切筆數並用並發方式
    const chunkDomains = chunk(multipleDomainNameList, 30);
    let methods: Promise<boolean>[] = [];
    chunkDomains.forEach(item => {
      methods = [...methods, setDomainNamesBeforeExport(item, token)];
    });

    // 匯出「多域名」條件資料
    return Promise.all(methods).then(resp => {
      if (resp.every(item => item)) {
        return urlAPI.exportCustomerDomainByMultipleDomain(
          domain,
          token,
          lang,
          options,
        );
      }
      return { data: { result: false } };
    });
  }

  // 匯出「單一域名」條件且為全部廳資料
  if (
    type === 'domainName' &&
    domain === 0 &&
    typeof options.domain_name !== 'undefined'
  ) {
    return urlAPI.exportCustomerDomainByDomainName(
      options.domain_name,
      lang,
      options,
    );
    // 匯出「ＩＰ」條件資料
  } else if (type === 'ip' && typeof options.ip !== 'undefined') {
    return urlAPI.exportCustomerDomainByIP(options.ip, lang, options);
  }
  // 匯出「站別」條件資料
  return urlAPI.exportCustomerDomainBySite(site, lang, options);
};

// 匯出前需設定多域名暫存資料
const setDomainNamesBeforeExport = (
  domainNames: string[],
  token: string,
): Promise<boolean> => {
  return new Promise(resolve => {
    urlAPI.setDomainNamesBeforeExport(domainNames, token).then(resp => {
      if (resp.data.result) {
        resolve(true);
      }
      resolve(false);
    });
  });
};

// 匯出管端域名的參數
export type ExportAgentDomainNameOption = {
  domain_name?: string;
  service_error?: number[];
  sort?: string;
  order?: string;
  export_remark?: string;
};

/**
 * 匯出 「管端域名」
 * @param {string} type 搜尋類別(site、domainName)
 * @param {string} site 站別
 * @param {number} entrance 端口
 * @param {string} lang 語系
 * @param {object} options 其他條件選項
 * @return {void}
 */
export const doExportAgentDomainNameList = (
  type: string,
  site: string,
  entrance: number,
  lang: string,
  options: ExportAgentDomainNameOption,
) => {
  // 匯出「單一域名」條件資料
  if (type === 'domainName' && typeof options.domain_name !== 'undefined') {
    return urlAPI.exportAgentDomainName(
      options.domain_name,
      entrance,
      lang,
      options,
    );
  }
  // 匯出「站別」條件資料
  return urlAPI.exportAgentDomainNameBySite(site, entrance, lang, options);
};

// 匯出IP服務參數
export type ExportIPServiceOption = {
  ip?: string;
  ip_type?: number[];
  purchase_method?: number[];
  attack_status?: number[];
  table_filter?: number;
  export_remark?: string;
};

/**
 * 匯出 「IP服務」
 * @param {string} type 搜尋類別(site、domainName)
 * @param {string} site 站別
 * @param {string} lang 語系
 * @param {object} options 其他條件選項
 * @return {void}
 */
export const doExportIPServiceList = (
  type: string,
  site: string,
  lang: string,
  options: ExportIPServiceOption,
) => {
  // 匯出「單一IP」條件資料
  if (type === 'ip' && typeof options.ip !== 'undefined') {
    return urlAPI.exportIPService(options.ip, lang, options);
  }
  // 匯出「站別」條件資料
  return urlAPI.exportIPServiceBySite(site, lang, options);
};

// 匯出活躍域名參數
export type ExportActiveDomainNameOption = {
  domain?: number;
  keyword?: string;
  export_remark?: string;
  lang?: string;
  sort?: string;
  order?: string;
  table_filter?: number;
};

/**
 * 匯出 「活躍域名」
 * @param {string} start_date 開始日期
 * @param {string} end_date   結束日期
 * @param {object} options    其他選項
 * @return {void}
 */
export const doExportActiveDomainNameList = (
  startDate: string,
  endDate: string,
  options: ExportActiveDomainNameOption,
) => {
  return urlAPI.exportActiveDomainName(startDate, endDate, options);
};
