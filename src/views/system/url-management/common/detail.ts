import { reactive } from 'vue';
import urlAPI from '@/api/url';

// 站別詳細資料
export type SiteDetail =
  | 'siteName'
  | 'prefix'
  | 'suffix'
  | 'env'
  | 'primaryDomain'
  | 'remark';

// 取得「單一站別」詳細資料
export const useSiteDetail = () => {
  const siteDetail: Record<SiteDetail, string> = reactive({
    siteName: '', // 站別
    prefix: '', // 前置詞
    suffix: '', // 後置碼
    env: '', // 環境變數
    primaryDomain: '', // 主域名
    remark: '', // 備註
  });

  // 取得站別詳細資料
  const getSingleSiteInfo = (site_group: string) => {
    return urlAPI.getSingleSiteInfo(site_group).then(response => {
      if (response.data.result) {
        siteDetail.siteName = response.data.data.name;
        siteDetail.prefix = response.data.data.prefix;
        siteDetail.suffix = response.data.data.login_code;
        siteDetail.env = response.data.data.env;
        siteDetail.primaryDomain = response.data.data.main_domain;
        siteDetail.remark = response.data.data.note;
      }
    });
  };

  return {
    siteDetail,
    getSingleSiteInfo,
  };
};
