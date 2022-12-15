import { ref, reactive } from 'vue';
import { url as urlAPI } from '@/api/domain';
import type {
  ListData,
  ListDataForAPI,
  ListForAPI,
  UrlStatusOption,
} from '../common/type';
import type { FormType } from '../common/search';

export type ListCondition = {
  page: number;
  size: number;
  total: number;
  sort: 'id' | 'automaticRenewalDate';
  order: 'asc' | 'desc';
};

/**
 * 取得列表資料
 * @return {void}
 */
export const useList = () => {
  // 原始列表資料
  const orgListData = ref<ListData[]>([]);
  // 列表資料
  const listData = ref<ListData[]>([]);
  // 列表條件
  const listCondition: ListCondition = reactive({
    page: 1,
    size: 1000,
    total: 0,
    sort: 'id',
    order: 'asc',
  });

  // 取得域名資料
  const getTableData = (data: ListDataForAPI) => {
    orgListData.value = data.list.map((item: ListForAPI, key: number) =>
      buildData(item, key),
    );
    listData.value = orgListData.value;

    // 總筆數
    listCondition.total = data.total;
  };

  // 建構資料
  const buildData = (item: ListForAPI, key: number) => {
    const result = {
      id: key, // 流水號
      site: {
        group: item.site_group, // 站別
        name: item.site_name, // 站別名稱
      },
      suffix: item.login_code, // 後置碼
      manage: item.manage, // 管理
      previousNode: item.permission, // 上層指向
      domainName: item.domain_name, // 域名
      url: item.url, // 域名
      urlStatus: getUrlStatusOptions(
        item.url_status,
        typeof item.url !== 'undefined' ? item.url : '',
      ), // 網址狀態
      abnormalState: item.abnormal_status, // 異常狀態
      service: item.service_items, // 服務項目
      domainNameStatus: item.domain_name_status, // 域名狀態
      sslStatus: item.ssl_status, // 憑證狀態
      ip: item.ip, // IP
      automaticRenewalDate: item.renew_date, // 域名到期日
      systemDetection: item.system_note, // 系統檢測
      applySSLEnable: item.ssl_enable, // 可申請憑證
      remark: item.note, // 備註
    };
    return result;
  };

  // 客端域名列表API
  const updateList = {
    // By 站別
    site: (
      form: FormType,
      entrance: number,
      params: { domain_name?: string },
    ) => {
      return urlAPI
        .getAgentDomainNameBySite(form.site, entrance, params)
        .then(resp => {
          if (resp.data.result) {
            getTableData(resp.data.data);
          }
          return true;
        });
    },
    // By 全廳 - 單一域名
    singleDomainName: (form: FormType, entrance: number) => {
      return urlAPI.getAgentDomainName(form.domainName, entrance).then(resp => {
        if (resp.data.result) {
          getTableData(resp.data.data);
        }
        return true;
      });
    },
  };
  // 取得列表資料
  const getList = (
    form: FormType,
    entrance: number,
    params: { domain_name?: string },
  ) => {
    let act: keyof typeof updateList = 'site';
    if (form.type === 'domainName' && form.domain === 0) {
      act = 'singleDomainName';
    }
    return new Promise(resolve => {
      updateList[act](form, entrance, params).then(() => {
        resolve(true);
      });
    });
  };

  return {
    orgListData,
    listData,
    listCondition,
    getList,
  };
};

// 取得 網址狀態 的下拉資料
const getUrlStatusOptions = (
  urlStatus: { https: boolean; http: boolean; ub: boolean },
  domainName: string,
) => {
  const urlOptionTmp = [
    { label: 'www', type: 'info', url: `http://www.${domainName}`, key: 'www' },
    { label: 'https', type: 'success', url: '', key: 'https' },
    { label: 'http', type: 'success', url: '', key: 'http' },
    { label: 'UB', type: 'success', url: '', key: 'ub' },
  ] as UrlStatusOption[];

  const options = urlOptionTmp.map(item => {
    const result = item;
    if (item.key !== 'www') {
      // 協議
      const protocol = item.key === 'http' ? 'http://' : 'https://';
      result.url = `${protocol}${domainName}`;
      // 判斷不為寰宇瀏覽器且UB不顯示連結
      if (item.key === 'ub') {
        result.url = '';
      }
      // 狀態
      result.type = urlStatus[item.key] ? 'success' : 'danger';
    }
    return result;
  });

  // 網址整體狀態
  const status = options.every(
    item => item.label === 'www' || item.type === 'success',
  );

  return {
    status,
    options,
  };
};
