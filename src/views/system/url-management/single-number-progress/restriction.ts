import { ref, reactive } from 'vue';
import { url as urlAPI } from '@/api/domain';
import type { RestrictionNumApi } from '../apply/apply';
import { Buy } from '../apply/apply';

// 取得站別限制相關
export const useSiteRestriction = () => {
  // 取得各購買方式可申請上限
  const restrictionNum: Record<Buy, number> = reactive({
    bbin: 0,
    domain: 0,
  });

  // 取得工單申請限制設定
  const getRestriction = () => {
    return urlAPI.getTicketsRestriction().then(response => {
      if (response.data.result) {
        // 塞入各上限
        response.data.data.forEach((obj: RestrictionNumApi) => {
          const key =
            obj.restriction_type === 'company_verify' ? 'bbin' : 'domain';

          restrictionNum[key] = obj.restriction_limit;
        });
      }
    });
  };

  /**
   * 修改工單申請限制設定
   * @param  {number} bbin 公司買的數量
   * @param  {number} domain 廳主買的數量
   */
  const putRestriction = (bbin: number, domain: number) => {
    return urlAPI
      .putTicketRestriction(bbin, domain)
      .then(response => response.data.result);
  };

  // 已申請數量
  const requestionNum = ref<number>(0);

  /**
   * 取單一站別當天已申請網域數量
   * @param  {string} siteGroup 站別
   * @param  {number} companyPurchase 是否為公司買
   */
  const getRequestionNum = (siteGroup: string, companyPurchase: 0 | 1) => {
    return urlAPI
      .getSingleRequestionNum(siteGroup, companyPurchase)
      .then(response => {
        if (response.data.result) {
          requestionNum.value = response.data.data;
        }
      });
  };

  // 今日還可申請的總筆數
  const canApplyNum = (buy: Buy) => restrictionNum[buy] - requestionNum.value;

  return {
    requestionNum,
    restrictionNum,
    getRestriction,
    putRestriction,
    getRequestionNum,
    canApplyNum,
  };
};
