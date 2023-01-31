import { ref, reactive } from 'vue';
import urlAPI from '@/api/url';
import type {
  ActiveDomainNameListData,
  ActiveDomainNameListDataForAPI,
  ActiveDomainNameListForAPI,
} from '../common/type';
import type { FormType } from '../common/search';

export type ListCondition = {
  formAngle: 'all' | number;
  total: number;
  sort: string;
  order: 'asc' | 'desc';
};

/**
 * 取得列表資料
 * @return {void}
 */
export const useList = () => {
  // 原始列表資料
  const orgListData = ref<ActiveDomainNameListData[]>([]);
  // 列表資料
  const listData = ref<ActiveDomainNameListData[]>([]);
  // 列表條件
  const listCondition: ListCondition = reactive({
    formAngle: 'all',
    total: 0,
    sort: 'rank',
    order: 'asc',
  });
  // 列表角度各個總數
  const listAngleTotalData = reactive({
    all: 0,
    normal: 0,
    highRisk: 0,
  });

  // 取得Table資料
  const getTableData = (data: ActiveDomainNameListDataForAPI) => {
    orgListData.value = data.data.map((item: ActiveDomainNameListForAPI) =>
      buildData(item),
    );
    listData.value = orgListData.value;

    // 列表 - 顯示角度資料
    listAngleTotalData.all = data.total;
    listAngleTotalData.normal = data.normal;
    listAngleTotalData.highRisk = data.high_risk;

    // 總筆數
    listCondition.total = data.total;
  };

  // 建構資料
  const buildData = (item: ActiveDomainNameListForAPI) => {
    const result = {
      rank: item.rank,
      name: item.name,
      domain: parseInt(item.domain, 10),
      suffix: item.login_code,
      domainName: item.domain_name,
      abnormalState: item.abnormal_status,
      failTag: item.fail_tag,
      ipTag: item.ip_tag,
      requestGrow:
        item.request_grow === '' ? -Infinity : parseFloat(item.request_grow),
      requestRatio: parseFloat(item.request_ratio),
      requestTotal: parseInt(item.request_total, 10),
      loginPassGrow:
        item.login_pass_grow === ''
          ? -Infinity
          : parseFloat(item.login_pass_grow),
      loginPassRatio: parseFloat(item.login_pass_ratio),
      loginPassTotal: parseInt(item.login_pass_total, 10),
      loginFailGrow:
        item.login_fail_grow === ''
          ? -Infinity
          : parseFloat(item.login_fail_grow),
      loginFailRatio: parseFloat(item.login_fail_ratio),
      loginFailTotal: parseInt(item.login_fail_total, 10),
    };
    return result;
  };

  // 取得列表資料
  const getList = (
    form: FormType,
    params: {
      domain?: number;
      keyword?: string;
    },
  ) => {
    return new Promise(resolve => {
      urlAPI
        .getActiveDomainName(form.date[0], form.date[1], params)
        .then(resp => {
          if (resp.data.result) {
            getTableData(resp.data.data);
          }
          resolve(true);
        });
    });
  };

  return {
    orgListData,
    listData,
    listCondition,
    listAngleTotalData,
    getList,
  };
};
