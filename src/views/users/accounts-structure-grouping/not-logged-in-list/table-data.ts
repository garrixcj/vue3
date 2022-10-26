import { ref, reactive } from 'vue';
import { loginInfo, profile } from '@/api/user';
import type {
  SearchFormType,
  DetailTableDataType,
  DetailListFormType,
  DayCountType,
  TableDataType,
} from './type';

// 取單一未登入區間詳細列表資料相關
export const useGetListApi = () => {
  const detailTableData = ref([] as DetailTableDataType[]);
  const dataTotalNum = ref(0);
  const getMembersLastLoginGroupDetail = async (form: DetailListFormType) => {
    const params = {} as SearchFormType;
    params.day_group = form.dayGroup;
    params.page = form.page;
    params.limit = form.limit;
    params.sort = form.sort;
    params.order = form.order;

    if (typeof form.type !== 'undefined') {
      params.type = form.type;
    }

    const resp = await loginInfo.getMembersLastLoginGroupDetail(
      form.domain,
      params,
    );
    detailTableData.value = resp.data.data.list;
    dataTotalNum.value = Number(resp.data.data.total_num);
  };

  return {
    detailTableData,
    dataTotalNum,
    getMembersLastLoginGroupDetail,
  };
};

// 取單一未登入區間總數資料相關
export const useGetDayCountApi = () => {
  const dayCount: DayCountType = reactive({
    locked: 0,
    bankrupt: 0,
    block: 0,
    disable: 0,
    enable: 0,
    total: 0,
  });
  // 資料更新時間(目前只有180天以上是排程每天更新數值，其他天數區間都是即時資料)
  const updateDate = ref('');
  const getMembersLastLoginGroup = async (form: DetailListFormType) => {
    const option = {
      day_group: form.dayGroup,
    };
    const resp = await loginInfo.getMembersLastLoginGroup(form.domain, option);
    const data = resp.data.data[0];
    dayCount.total = data.total;
    dayCount.enable = data.enable_total;
    dayCount.disable = data.disable_total;
    dayCount.block = data.block_total;
    dayCount.bankrupt = data.bankrupt_total;
    dayCount.locked = data.locked_total;
    updateDate.value = data.update_at;
  };

  return { dayCount, updateDate, getMembersLastLoginGroup };
};

// 取廳主資料相關
export const useGetDomainApi = () => {
  const domainInfo = reactive({
    name: '',
    loginCode: '',
  });
  const getDomain = async (domain: string | number) => {
    const resp = await profile.getUserByID(domain);
    domainInfo.name = resp.data.data[0].name;
    domainInfo.loginCode = resp.data.data[0].login_code;
  };

  return { domainInfo, getDomain };
};

// 取所有未登入區間總數列表資料相關
export const useGetDayCountGroupApi = () => {
  const tableData = ref<TableDataType[]>([]);
  const getMembersLastLoginGroup = async (form: DetailListFormType) => {
    const resp = await loginInfo.getMembersLastLoginGroup(form.domain);
    tableData.value = resp.data.data;
  };

  return { tableData, getMembersLastLoginGroup };
};
