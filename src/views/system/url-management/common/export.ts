import { ref, reactive } from 'vue';
import { chunk } from 'lodash';
import { url as urlAPI } from '@/api/domain';
import { useAccesses } from '@/plugins/access/view';
import http from '@/http';

// 匯出基本設定
export const useExport = () => {
  const visible = ref(false);
  const params = reactive({
    functionName: '',
    tabName: '',
  });
  // 初始匯出設定
  const initExport = () => {
    toggleDialog(true);
    params.functionName = 'url_management';
    params.tabName = 'customer_url';
  };
  // 切換匯出視窗
  const toggleDialog = (status: boolean) => {
    visible.value = status;
  };
  return {
    visible,
    params,
    toggleDialog,
    initExport,
  };
};

/**
 * 取得匯出權限
 * @param {string} permName 匯出權限名稱
 * @return {boolean}
 */
export const getExportPerm = (permName: string) => {
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
  checkNoDomainNameList: string[],
  multipleDomainNameList: string[],
  token: string,
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
