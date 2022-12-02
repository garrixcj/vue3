import { ref } from 'vue';
import { url as urlAPI } from '@/api/domain';

// 站別資訊
export type SiteInfo = {
  big_group: string;
  domain: number;
  login_code: string;
  site_group: string;
  site_name: string;
};

// 站別下拉資訊
export type SiteOption = {
  label: string;
  value: string;
  code: string;
  domain: number;
};

// 取得「站別」的相關資料
export const useSiteList = () => {
  const siteOptions = ref<SiteOption[]>([]);

  // 取得站別列表資料
  const getSiteList = () => {
    return urlAPI.getSiteList().then(response => {
      if (response.data.result) {
        siteOptions.value = response.data.data.map((item: SiteInfo) => {
          const result = {
            label: item.site_name, // 站別名稱
            value: item.site_group, // 站別群組
            code: item.login_code, // 後置碼
            domain: item.domain, // 廳主ID
          };
          return result;
        });
      }
    });
  };

  // 根據站別取得相關資料
  const getSiteInfo = (site: string) => {
    return siteOptions.value.find(item => item.value === site);
  };

  return {
    siteOptions,
    getSiteList,
    getSiteInfo,
  };
};
