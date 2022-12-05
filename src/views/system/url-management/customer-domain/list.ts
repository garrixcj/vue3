import { ref, reactive } from 'vue';
import { values, isEmpty, omitBy, groupBy, forIn, trimEnd } from 'lodash';
import { url as urlAPI } from '@/api/domain';
import type {
  ListData,
  ListDataForAPI,
  ListForAPI,
  UrlStatusOption,
} from '../common/type';
import type { FormType } from '../common/search';

export type CheckNoDomainNameList = {
  id: number;
  domainName: string;
};

export type ListCondition = {
  formAngle: string;
  page: number;
  size: number;
  total: number;
  sort: 'id' | 'abnormalDate' | 'automaticRenewalDate';
  order: 'asc' | 'desc';
};

// 取得列表資料
export const useList = (form: FormType) => {
  // 原始列表資料
  const orgListData = ref<ListData[]>([]);
  // 列表資料
  const listData = ref<ListData[]>([]);
  // 原始查無域名列表
  const orgCheckNoDomainNameList = ref<CheckNoDomainNameList[]>([]);
  // 查無域名列表
  const checkNoDomainNameList = ref<CheckNoDomainNameList[]>([]);
  // 列表角度各個總數
  const listAngleTotalData = reactive({
    all: 0,
    normal: 0,
    abnormal: 0,
    noDomainName: 0,
  });
  // 列表條件
  const listCondition: ListCondition = reactive({
    formAngle: 'all',
    page: 1,
    size: 1000,
    total: 0,
    sort: 'id',
    order: 'asc',
  });

  // 取得選填參數
  const getOptionalParam = () => {
    const options = {
      domain_name: form.domainName,
      ip: form.ip,
      abnormal_area: '',
    };
    // 判斷異常地區不為「不限制」
    if (form.area !== 'all') {
      options.abnormal_area = form.area;
    }
    // 過濾為空的都不帶入
    return omitBy(options, value => {
      if (
        (typeof value !== 'number' && isEmpty(value)) ||
        (typeof value === 'number' && value === 0)
      ) {
        return true;
      }
      return false;
    });
  };

  // 取得域名資料
  const getTableData = (data: ListDataForAPI) => {
    orgListData.value = data.list.map((item: ListForAPI, key: number) =>
      buildData(item, key),
    );
    listData.value = orgListData.value;

    // 列表 - 顯示角度資料
    listAngleTotalData.all = data.all;
    listAngleTotalData.normal = data.normal;
    listAngleTotalData.abnormal = data.abnormal;

    // 總筆數
    listCondition.total = data.total;
  };

  const getTableDataByMultipleDomain = (data: ListDataForAPI) => {
    let domainNameInSearch = <string[]>[];
    let abnormal = 0;
    let normal = 0;
    let count = 0;
    orgListData.value = data.list.reduce(
      (acc: ListData[], item: ListForAPI) => {
        let result = acc;
        // 模糊搜尋(單一域名)
        if (
          form.multipleDomains.length <= 1 &&
          item.domain_name.indexOf(form.multipleDomains[0]) !== -1
        ) {
          // 判斷正常和異常的域名數量
          if (
            values(item.url_status).some(
              uItem => typeof uItem === 'number' && uItem === 0,
            )
          ) {
            abnormal += 1;
          } else {
            normal += 1;
          }
          result = [...result, buildData(item, count)];
          count += 1;

          // 精準搜尋(多域名)
        } else if (form.multipleDomains.includes(item.domain_name)) {
          // 有搜尋到的域名
          domainNameInSearch = [...domainNameInSearch, item.domain_name];
          // 判斷正常和異常的域名數量
          if (
            values(item.url_status).some(
              uItem => typeof uItem === 'number' && uItem === 0,
            )
          ) {
            abnormal += 1;
          } else {
            normal += 1;
          }
          result = [...result, buildData(item, count)];
          count += 1;
        }
        return result;
      },
      [],
    );
    listData.value = orgListData.value;

    // 查無域名
    let noCount = 1;
    orgCheckNoDomainNameList.value = form.multipleDomains.reduce(
      (acc: CheckNoDomainNameList[], item: string) => {
        let result = acc;
        if (!isEmpty(item) && !domainNameInSearch.includes(item)) {
          result = [...result, { id: noCount, domainName: item }];
          noCount += 1;
        }
        return result;
      },
      [],
    );
    checkNoDomainNameList.value = orgCheckNoDomainNameList.value;

    // 列表 - 顯示角度資料
    listAngleTotalData.all = orgListData.value.length;
    listAngleTotalData.normal = normal;
    listAngleTotalData.abnormal = abnormal;
    listAngleTotalData.noDomainName = checkNoDomainNameList.value.length;

    // 總筆數
    listCondition.total = orgListData.value.length;
  };

  // 取得異常地區資料
  const getAbnormalAreas = (
    data: {
      alert_time: string;
      area: string;
      d_status: string;
      id: string;
      isp: string;
    }[],
  ) => {
    let result: string[] = [];
    if (data.length > 0) {
      forIn(groupBy(data, 'alert_time'), (value, key) => {
        // 格式 日期 異常狀態[地區/isp],異常狀態[地區/isp]...
        let content = `${key} 檢查網址`;
        value.forEach(item => {
          content = `${content}${item.d_status}[${item.area}/${item.isp}],`;
        });
        // 去掉字尾逗號
        content = trimEnd(content, ',');
        result = [...result, content];
      });
    }
    return result;
  };

  // 建構資料
  const buildData = (item: ListForAPI, key: number) => {
    const result = {
      id: key + 1, // 流水號
      site: {
        group: item.site_group, // 站別
        name: item.site_name, // 站別名稱
      },
      suffix: item.login_code, // 後置碼
      manage: item.manage, // 管理
      previousNode: item.permission, // 上層指向
      domainName: item.domain_name, // 域名
      urlStatus: getUrlStatusOptions(item.url_status, item.domain_name), // 網址狀態
      abnormalState: item.abnormal_status, // 異常狀態
      abnormalDate: item.abnormal_date, // 最近異常日
      service: item.service_items, // 服務項目
      domainNameStatus: item.domain_name_status, // 域名狀態
      sslStatus: item.ssl_status, // 憑證狀態
      ip: item.ip, // IP
      automaticRenewalDate: item.renew_date, // 域名到期日
      systemDetection: item.system_note, // 系統檢測
      abnormalArea: getAbnormalAreas(item.error_note), // 異常地區
      applySSLEnable: item.ssl_enable, // 可申請憑證
      remark: item.note, // 備註
    };
    return result;
  };

  // 列表API
  const updateList = {
    // By 站別
    site: () => {
      return urlAPI
        .getCustomerDomainBySite(form.site, getOptionalParam())
        .then(resp => {
          if (resp.data.result) {
            getTableData(resp.data.data);
          }
          return true;
        });
    },
    // By IP
    IP: () => {
      return urlAPI
        .getCustomerDomainByIP(form.ip, getOptionalParam())
        .then(resp => {
          if (resp.data.result) {
            getTableData(resp.data.data);
          }
          return true;
        });
    },
    // By 全廳 - 單一域名
    singleDomainName: () => {
      return urlAPI
        .getCustomerDomainByDomainName(
          form.domain,
          [form.domainName],
          getOptionalParam(),
        )
        .then(resp => {
          if (resp.data.result) {
            getTableData(resp.data.data);
          }
          return true;
        });
    },
    // By 單一廳 - 多域名
    multipleDomainName: () => {
      return urlAPI
        .getCustomerDomainByDomain(form.domain, getOptionalParam())
        .then(resp => {
          if (resp.data.result) {
            getTableDataByMultipleDomain(resp.data.data);
          }
          return true;
        });
    },
  };

  // 取得列表資料
  const getList = () => {
    let act: keyof typeof updateList = 'site';
    if (form.type === 'domainName' && form.domain === 0) {
      act = 'singleDomainName';
    } else if (form.type === 'domainName' && form.domain > 0) {
      act = 'multipleDomainName';
    } else if (form.type === 'ip') {
      act = 'IP';
    }
    return new Promise(resolve => {
      updateList[act]().then(() => {
        resolve(true);
      });
    });
  };

  return {
    orgListData,
    listData,
    orgCheckNoDomainNameList,
    checkNoDomainNameList,
    listAngleTotalData,
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
