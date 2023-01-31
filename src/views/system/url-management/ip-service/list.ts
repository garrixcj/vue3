import { ref, reactive } from 'vue';
import urlAPI from '@/api/url';
import type {
  IPServiceListData,
  IPServiceListDataForAPI,
  IPServiceListForAPI,
} from '../common/type';
import type { FormType } from '../common/search';

export type ListCondition = {
  formAngle: 'all' | number;
  page: number;
  size: number;
  total: number;
};

/**
 * 取得列表資料
 * @return {void}
 */
export const useList = () => {
  // 原始列表資料
  const orgListData = ref<IPServiceListData[]>([]);
  // 列表資料
  const listData = ref<IPServiceListData[]>([]);
  // 列表條件
  const listCondition: ListCondition = reactive({
    formAngle: 'all',
    page: 1,
    size: 30,
    total: 0,
  });
  // 列表角度各個總數
  const listAngleTotalData = reactive({
    all: 0,
    oneToOne: 0,
    oneToMany: 0,
  });

  // 取得域名資料
  const getTableData = (data: IPServiceListDataForAPI) => {
    orgListData.value = data.list.map(
      (item: IPServiceListForAPI, key: number) => buildData(item, key),
    );
    listData.value = orgListData.value;

    // 列表 - 顯示角度資料
    listAngleTotalData.all = data.all;
    listAngleTotalData.oneToOne = data.one_to_one;
    listAngleTotalData.oneToMany = data.one_to_many;

    // 總筆數
    listCondition.total = data.total;
  };

  // 建構資料
  const buildData = (item: IPServiceListForAPI, key: number) => {
    const result = {
      id: key, // 流水號
      siteName: item.site_name, // 站別名稱
      suffix: item.login_code, // 後置碼
      purchaseMethod: item.purchase_method, // 購買方式
      domainName: item.domain_name, // 域名
      ipType: item.ip_type, // IP類型
      ipv4: item.ipv4,
      ipv6: item.ipv6,
      attackStatus: item.under_attack, // 攻擊狀態
    };
    return result;
  };

  // 客端域名列表API
  const updateList = {
    // By 站別
    site: (form: FormType, params: { ip?: string }) => {
      return urlAPI.getIPServiceBySite(form.site, params).then(resp => {
        if (resp.data.result) {
          getTableData(resp.data.data);
        }
        return true;
      });
    },
    // By IP
    ip: (form: FormType) => {
      return urlAPI.getIPServiceByIP(form.ip).then(resp => {
        if (resp.data.result) {
          getTableData(resp.data.data);
        }
        return true;
      });
    },
  };
  // 取得列表資料
  const getList = (form: FormType, params: { ip?: string }) => {
    let act: keyof typeof updateList = 'site';
    if (form.type === 'ip') {
      act = 'ip';
    }
    return new Promise(resolve => {
      updateList[act](form, params).then(() => {
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
