import { provide, reactive, ref, computed } from 'vue';
import { isEmpty, keys } from 'lodash';
import dayjs from 'dayjs';
import { formatCheck } from '@/components/utils/validator/validator';
import type { AdvancedConditionsType, AbnormalStateConditions } from './type';
import { url as urlAPI } from '@/api/domain';

export type FormType = {
  type: string;
  site: string;
  domain: number | 'all';
  domainName: string;
  multipleDomains: string[];
  ip: string;
  area: string;
  keyword: string;
  date: string[];
};

type FieldName =
  | 'site'
  | 'url'
  | 'domainName'
  | 'ip'
  | 'area'
  | 'domain'
  | 'multipleDomains'
  | 'keyword'
  | 'date';

// 表單資料
export const useForm = () => {
  // 搜尋參數
  const form: FormType = reactive({
    type: '',
    site: '',
    domain: 'all',
    domainName: '',
    multipleDomains: [],
    ip: '',
    area: 'all',
    keyword: '',
    date: [],
  });

  // 初始化搜尋參數
  const initForm = () => {
    form.type = '';
    form.site = '';
    form.domain = 'all';
    form.domainName = '';
    form.multipleDomains = [];
    form.ip = '';
    form.area = 'all';
    form.keyword = '';
    form.date = [];
  };

  return {
    form,
    initForm,
  };
};

// 驗證規則
export const useValidationRules = (
  t: (key: string, params?: { num?: number; day?: number }) => string,
) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // 客製化「域名」驗證
  const customDomainNameValid = (rule: any, value: string | string[]) => {
    return new Promise<void>((resolve, reject) => {
      const values = typeof value === 'string' ? [value] : value;
      values.forEach(item => {
        if (item) {
          // 不得小於6個字元
          if (item.length < 6) {
            reject(t('domain_name_input_validator', { num: 6 }));
          }
          // 只能有大小寫英文、數字和點，且必須 >= 6個字元
          if (!/^[A-Za-z0-9.-]{6,}$/.test(item)) {
            reject(t('format_error'));
          }
        }
      });
      resolve();
    });
  };

  // 客製化「IP」驗證
  const customIPValid = (rule: any, value: string) => {
    return new Promise<void>((resolve, reject) => {
      if (
        value !== '' &&
        !(formatCheck(value, 'ipv4') || formatCheck(value, 'ipv6'))
      ) {
        reject(t('format_error'));
      }
      resolve();
    });
  };

  // 客製化「日期」驗證
  const customDateValid = (rule: any, value: string[]) => {
    return new Promise<void>((resolve, reject) => {
      if (!isEmpty(value)) {
        // 含第一天故加1
        const interval = dayjs(value[1])
          .add(1, 'day')
          .diff(dayjs(value[0]), 'day', true);
        if (interval > 180) {
          reject(
            t('date_search_limit_180_and_search_interval', { day: interval }),
          );
        }
      }
      resolve();
    });
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // 表單驗證規則
  const rules = reactive({
    // 搜尋類別
    type: [{ required: true, message: t('not_null'), trigger: 'change' }],
    // 站別
    site: [{ required: true, message: t('not_null'), trigger: 'change' }],
    // 域名
    domainName: [
      { required: true, message: t('not_null'), trigger: 'change' },
      {
        asyncValidator: customDomainNameValid,
        trigger: 'change',
      },
    ],
    // 多域名
    multipleDomains: [
      { required: true, message: t('not_null'), trigger: 'change' },
      { asyncValidator: customDomainNameValid, trigger: 'change' },
    ],
    ip: [
      { required: true, message: t('not_null'), trigger: 'change' },
      { asyncValidator: customIPValid, trigger: 'change' },
    ],
    // 日期區間
    date: [
      { required: true, message: t('not_null'), trigger: 'change' },
      { asyncValidator: customDateValid, trigger: 'change' },
    ],
  });

  return {
    rules,
    customDomainNameValid,
    customIPValid,
  };
};

// 進階條件
export const useAdvancedConditions = () => {
  const advancedRef = ref();

  // 進階條件
  const advancedForm: Record<AdvancedConditionsType, number[]> = reactive({
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
  provide('UrlManagement:advancedForm', advancedForm);

  const advancedFormKeys = keys(advancedForm) as AdvancedConditionsType[];

  // 異常狀態
  const abnormalStateGroup = ref<AbnormalStateConditions[]>([]);
  provide('UrlManagement:abnormalStateGroup', abnormalStateGroup);

  return {
    advancedRef,
    advancedForm,
    advancedFormKeys,
    abnormalStateGroup,
  };
};

// 表單欄位相關
export const useFormField = (form: FormType) => {
  // 檢驗是否可以顯示該欄位
  const displayField = (value: FieldName) => {
    // 搜尋類別對應的搜尋條件
    const searchType = {
      site: ['site', 'url', 'domainName', 'ip', 'area'],
      domainName: ['domain', 'domainName', 'multipleDomains', 'area'],
      ip: ['ip', 'area'],
    };
    const type = form.type as keyof typeof searchType;
    if (form.type !== '') {
      return searchType[type].includes(value);
    }
    return false;
  };

  // 支援單一域名的搜尋條件
  const supportSingleDomainName = computed(() => {
    return (
      form.type === 'site' ||
      (form.type === 'domainName' && form.domain === 'all')
    );
  });

  // 支援多域名的搜尋條件
  const supportMultipleDomainName = computed(() => {
    return form.type === 'domainName' && form.domain !== 'all';
  });

  return {
    displayField,
    supportSingleDomainName,
    supportMultipleDomainName,
  };
};

// 表單下拉選項
export const useFormOptions = (t: (key: string) => string) => {
  // 類別選項
  const typeOptions = ref([
    { value: 'site', label: t('site') },
    { value: 'domainName', label: t('domain_name') },
    { value: 'ip', label: 'IP' },
  ]);

  // 異常地區選項
  const abnormalAreaOptions = ref([{ value: 'all', label: t('not_limit') }]);
  // 單一地區選項
  const singleAreaOptions = ref<{ label: string; value: string }[]>([]);
  // 取得異常地區列表
  const getAbnormalAreas = () => {
    return urlAPI.getAbnormalAreas().then(response => {
      if (response.data.result) {
        singleAreaOptions.value = response.data.data.map((item: string) => ({
          label: item,
          value: item,
        }));
      }
    });
  };

  return {
    typeOptions,
    abnormalAreaOptions,
    singleAreaOptions,
    getAbnormalAreas,
  };
};