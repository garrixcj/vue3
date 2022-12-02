import { ref, reactive, type Ref, provide } from 'vue';
import { url as urlAPI } from '@/api/domain';
import type { BasicSetting, RestrictionNum } from './detail';

// 取得站別限制相關
export const useSiteRestriction = () => {
  // 取得各購買方式可申請上限
  const restrictionNumByBuy: Record<BasicSetting['buy'], number> = reactive({
    bbin: 0,
    domain: 0,
  });
  provide('UrlManagement:restrictionNumByBuy', restrictionNumByBuy);

  // 取得工單申請限制設定
  const getTicketsRestriction = () => {
    return urlAPI.getTicketsRestriction().then(response => {
      if (response.data.result) {
        // 購買方式key對照表
        const typeKey = {
          company_verify: 'bbin',
          customer_verify: 'domain',
        } as const;

        // 塞入各上限
        response.data.data.forEach((obj: RestrictionNum) => {
          restrictionNumByBuy[
            typeKey[obj.restriction_type as keyof typeof typeKey]
          ] = obj.restriction_limit;
        });
      }
    });
  };

  // 已申請數量
  const requestionNum: Ref<number> = ref(0);
  provide('UrlManagement:requestionNum', requestionNum);

  // 取單一站別當天已申請網域數量
  /**
   * @param  {string} siteGroup 站別
   * @param  {number} companyPurchase 是否為公司買
   */
  const getSingleRequestionNum = (
    siteGroup: string,
    companyPurchase: number,
  ) => {
    return urlAPI
      .getSingleRequestionNum(siteGroup, companyPurchase)
      .then(response => {
        if (response.data.result) {
          requestionNum.value = response.data.data;
        }
      });
  };

  return {
    requestionNum,
    restrictionNumByBuy,
    getTicketsRestriction,
    getSingleRequestionNum,
  };
};
