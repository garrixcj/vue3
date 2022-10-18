import { reactive, ref } from 'vue';
import { url as urlAPI } from '@/api/domain';
import { AxiosResponse } from 'axios';

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
export const useGetSiteListApi = () => {
  const siteOptions = ref<SiteOption[]>([]);

  // 取得站別列表資料
  const getSiteList = () => {
    return urlAPI.getSiteList().then((response: AxiosResponse) => {
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

  // 站別快搜規則
  const siteQuickSearch = (pattern: string) => {
    const escapeRegexpString = (value = '') =>
      String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    const re = new RegExp(escapeRegexpString(pattern), 'i');
    return siteOptions.value.filter(
      post => re.test(post.label) || re.test(post.code),
    );
  };

  return {
    siteOptions,
    getSiteList,
    siteQuickSearch,
  };
};

// 取得「單一站別」詳細資料
export const useGetSiteDetailApi = () => {
  const siteDetail = reactive({
    siteName: '', // 站別
    prefix: '', // 前置詞
    suffix: '', // 後置碼
    env: '', // 環境變數
    primaryDomain: '', // 主域名
    remark: '', // 備註
  });

  // 取得站別詳細資料
  const getSingleSiteInfo = (site_group: string) => {
    return urlAPI
      .getSingleSiteInfo(site_group)
      .then((response: AxiosResponse) => {
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
