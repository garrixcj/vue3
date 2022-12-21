import { provide } from 'vue';
import commonDict from '@/languages/system_setting/url_management/common.json';
import { ref, reactive } from 'vue';
import { useTrans } from '@/plugins/i18n/replace';
import { url as urlAPI } from '@/api/domain';
import type { AdvancedConditionsType } from './type';

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

  return {
    siteOptions,
    getSiteList,
  };
};

type AdvancedConditionsAPIType =
  | 'domain'
  | 'error'
  | 'openable'
  | 'service'
  | 'ssl'
  | 'warning';
export type AdvancedConditionsOptions = Record<
  AdvancedConditionsType,
  { label: number; type: string; dict?: string }[]
>;

// 取得「進階條件」域名狀態群組的各個過濾選項
export const useAdvancedConditionList = (lang: string) => {
  const { t } = useTrans(commonDict, lang);

  // 進階搜尋條件
  const advancedConditions: AdvancedConditionsOptions = reactive({
    service: [],
    domainNameStatus: [],
    sslStatus: [],
    failToOpen: [],
    partiallyOpen: [],
    openable: [],
    ipType: [],
    purchaseMethod: [],
    attackStatus: [],
    growingPercent: [],
  });
  provide('UrlManagement:advancedConditions', advancedConditions);

  // 建構進階條件群組資料
  const buildGroupOptions = (
    groups: Record<AdvancedConditionsAPIType, number[]>,
  ) => {
    // IP類型
    advancedConditions.ipType = [
      { label: 4, type: '', dict: t('client') },
      { label: 5, type: '', dict: t('agent_site') },
      { label: 1, type: '', dict: t('one_to_one_ip') },
      { label: 2, type: '', dict: t('one_to_many_ip') },
      { label: 3, type: '', dict: t('shopping_network_ip') },
    ];
    // 購買方式
    advancedConditions.purchaseMethod = [
      { label: 1, type: '', dict: t('default') },
      { label: 2, type: '', dict: t('purchase') },
    ];
    // 攻擊狀態
    advancedConditions.attackStatus = [
      { label: 1, type: '', dict: t('normal') },
      { label: 2, type: '', dict: t('attacking') },
    ];
    // 成長%數
    advancedConditions.growingPercent = [
      { label: 1, type: '', dict: t('negative_number') },
      { label: 2, type: '', dict: t('non_negative_number') },
    ];
    // 群組名稱對應
    const groupKeys = [
      { key: 'service', value: 'service', type: '' },
      { key: 'domain', value: 'domainNameStatus', type: '' },
      { key: 'ssl', value: 'sslStatus', type: '' },
      { key: 'error', value: 'failToOpen', type: 'danger-convert' },
      { key: 'warning', value: 'partiallyOpen', type: 'warning-convert' },
      { key: 'openable', value: 'openable', type: 'success-convert' },
    ] as {
      key: AdvancedConditionsAPIType;
      value: AdvancedConditionsType;
      type: string;
    }[];
    groupKeys.forEach(item => {
      advancedConditions[item.value] = groups[item.key].map(id => {
        return {
          label: id,
          type: item.type,
        };
      });
    });
  };

  // 取得進階條件的域名狀態選項
  const getAdvancedConditionsList = () => {
    return urlAPI.getDomainNameFilterOption().then(resp => {
      if (resp.data.result) {
        buildGroupOptions(resp.data.data);
      }
    });
  };

  // 取得異常狀態 - 子項目顏色
  const getAbnormalStateColor = (value: number) => {
    const failToOpen = advancedConditions.failToOpen;
    const partiallyOpen = advancedConditions.partiallyOpen;
    const openable = advancedConditions.openable;

    // 無法開啟
    if (typeof failToOpen.find(item => item.label === value) !== 'undefined') {
      return 'danger';

      // 部分開啟
    } else if (
      typeof partiallyOpen.find(item => item.label === value) !== 'undefined'
    ) {
      return 'warning';

      // 可開啟
    } else if (
      typeof openable.find(item => item.label === value) !== 'undefined'
    ) {
      return 'success';
    }
    return '';
  };
  provide('UrlManagement:getAbnormalStateColor', getAbnormalStateColor);

  return {
    advancedConditions,
    getAdvancedConditionsList,
  };
};
