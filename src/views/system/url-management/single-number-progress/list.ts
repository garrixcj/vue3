import { ref } from 'vue';
import type {
  List,
  ListApi,
  SearchOptions,
  SearchTable,
} from './single-number-progress';
import { url as urlAPI } from '@/api/domain';
import { Buy, Management } from '../apply/apply';

// 購買方式前後端對照表
export const buyMap: Record<Buy, number> = {
  bbin: 1,
  domain: 2,
};
// 管理權限前後端對照表
export const managementMap: Record<Management, number> = {
  bbin: 1,
  domain: 2,
};

export const useList = () => {
  const list = ref<List[]>([]);
  const listTotal = ref(0);

  /**
   * 取得工單列表
   * @param  {SearchOptions & SearchTable} options 選填
   */
  const getList = (options: SearchOptions & SearchTable) => {
    return urlAPI.getTicketList(options).then(({ data }) => {
      if (data.result) {
        listTotal.value = data.data.total;
        list.value = data.data.list.map((obj: ListApi) => {
          return {
            id: obj.id,
            site: obj.site_group,
            status: obj.status,
            buy: obj.company_purchase ? 'bbin' : 'domain',
            management: obj.company_maintenance ? 'bbin' : 'domain',
            applyAt: obj.created_at,
            finishAt: obj.finished_at,
            progressCount: obj.processing_amount,
            abolishCount: obj.cancel_amount,
            canNotBindCount: obj.fail_amount,
            finishCount: obj.success_amount,
            domainList: obj.domain_names,
          };
        });
      }
    });
  };

  return {
    list,
    listTotal,
    getList,
  };
};
