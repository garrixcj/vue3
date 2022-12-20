<i18n
  src="@/languages/system_setting/url_management/customer_domain_name.json"
></i18n>
<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
//- 基本搜尋列
.header
  rd-form(ref="formRef" inline size="large" :model="form" :rules="rules")
    //- 搜尋條件
    rd-form-item(:label="t('search_condition')" prop="type")
      rd-select(
        v-model:value="form.type"
        :options="typeOptions"
        @change="changeType"
      )
    //- 站別
    rd-form-item(v-if="displayField('site')" prop="site")
      rd-select(
        v-model:value="form.site"
        :quick-search="customSearch"
        :selected-setting="{ maxWidth: 240 }"
        :popper-setting="{ width: 'auto' }"
      )
        rd-option(
          v-for="(option, index) in siteOptions"
          :key="index"
          :value="option.value"
          :label="option.label"
          :option="option"
        )
          template(#suffix)
            | {{ `[ ${option.code} ]` }}
        template(#selected="{ current }")
          | {{ `${current?.label} [ ${current?.option.code} ]` }}
    //- 廳主
    rd-form-item(
      v-if="displayField('domain')"
      :label="t('domain')"
      prop="domain"
    )
      domain-selector(v-model:value="form.domain" all-opt)
    //- 域名關鍵字(全部廳 or 單一站別)
    rd-form-item(
      v-if="supportSingleDomainName && displayField('domainName')"
      prop="domainName"
      :required="form.type === 'domainName'"
    )
      template(#label)
        span {{ t('domain_name') }}
        rd-tooltip(v-if="form.type === 'domainName'" placement="top")
          i.mdi.mdi-information
          template(#content)
            .tooltip-content
              div {{ t('domain_information_2') }}
              div {{ t('domain_information_3') }}
      //- 單一搜尋
      rd-input.domain-input(
        v-model="form.domainName"
        :placeholder="t('input_keyword_at_least', { num: 6 })"
        clearable
      )
        template(#append)
          rd-checkbox(disabled :model-value="true") {{ t('fuzzy') }}
    //- 域名關鍵字(單一廳) By 多域名
    rd-form-item(
      v-if="supportMultipleDomainName && displayField('multipleDomains')"
      prop="multipleDomains"
    )
      template(#label)
        span {{ t('domain_name') }}
        rd-tooltip(placement="top")
          i.mdi.mdi-information
          template(#content)
            .tooltip-content
              div {{ t('domain_information_2') }}
              div {{ t('domain_information_3') }}
      //- 批次搜尋
      batch-input(
        v-model:visible="batchInputVisible"
        v-model:value="form.multipleDomains"
        :batch-info-text="t('batch_note_with_domain')"
        :batch-input-placeholder="t('input_project_with_comma')"
        :rule="rules.multipleDomains"
        width="350"
      )
        template(#append)
          rd-checkbox(
            :label="t('fuzzy')"
            disabled
            :model-value="form.multipleDomains.length <= 1"
          )
      template(#error="scope")
        .el-form-item__error(v-show="!batchInputVisible") {{ scope.error }}
    //- IP關鍵字
    rd-form-item(
      v-if="displayField('ip')"
      :label="form.type === 'site' ? 'IP' : ''"
      prop="ip"
      :required="form.type === 'ip'"
    )
      rd-input(
        v-model="form.ip"
        :placeholder="form.type === 'ip' ? t('please_enter_the_complete_ip_address') : t('not_required')"
        clearable
      )
    //- 異常地區
    rd-form-item(v-if="displayField('area')" prop="area")
      template(#label)
        span {{ t('abnormal_area') }}
        rd-tooltip(placement="top")
          i.mdi.mdi-information
          template(#content)
            .tooltip-content
              div ・{{ t('abnormal_area_information_1') }}
              div ・{{ t('abnormal_area_information_2') }}
              div {{ t('abnormal_area_information_3') }}
      rd-select(v-model:value="form.area" :quick-search="customSearch")
        rd-option(
          v-for="(option, index) in abnormalAreaOptions"
          :key="index"
          :value="option.value"
          :label="option.label"
          :option="option"
        )
        rd-option(divided)
        //- 單一地區
        rd-option(:label="t('abnormal_area')" group)
        rd-option(
          v-for="(option, index) in singleAreaOptions"
          :key="index"
          :value="option.value"
          :label="option.label"
          :option="option"
        )
    //- 搜尋
    rd-form-item
      rd-button(type="search" @click="search")
        i.mdi.mdi-magnify
        span {{ t('search') }}
  .header__footer
    //- 設定範例
    setting-example
    //- 申請域名
    rd-button.apply-url-btn(
      v-if="hasModifyPerm"
      type="primary"
      @click="applyDomainName"
    ) {{ t('apply_url') }}

before-search-empty(v-show="!searched" :label="t('start_search')")
//- 進階搜尋列
advanced-conditions(
  v-if="searched"
  :show-usage-groups="['service', 'domainNameStatus', 'sslStatus', 'abnormalState']"
  @change="advancedConditionAct.change"
)
//- 列表資料
list(
  v-if="searched"
  ref="listRef"
  @change="listAct.change"
  @sortChange="listAct.sort"
  @export="exportList"
  @update="listAct.updateApi"
)
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { isEmpty, intersection, orderBy, toInteger } from 'lodash';
import {
  type Ref,
  defineComponent,
  onMounted,
  provide,
  inject,
  ref,
  reactive,
  computed,
} from 'vue';
import DomainSelector from '@/plugins/domain-selector/index.vue';
import BatchInput from '@/components/custom/batch-input/index.vue';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import SettingExample from './setting-example.vue';
import AdvancedConditions from '../common/advanced-conditions.vue';
import List from './table.vue';
import { notify } from '@/components/utils/notification';
import { useTabWatcher, useQuery } from '@/components/utils/route-watch';
import { useModifyAccess } from '@/plugins/access/modify';
import {
  type FormType,
  useForm,
  useFormField,
  useFormOptions,
  useValidationRules,
  useAdvancedConditions,
} from '../common/search';
import { useList } from './list';
import {
  setExportPermName,
  doExportCustomerDomainNameList,
} from '../common/export';
import { type SiteOption, useAdvancedConditionList } from '../common/list';
import type { ListData, AbnormalStateConditions } from '../common/type';

export default defineComponent({
  name: 'CustomerDomain', // 網址管理 - 客端域名
  components: {
    BatchInput, // 批次搜尋
    BeforeSearchEmpty, // 搜尋前
    SettingExample, // 設定範例
    DomainSelector, // 廳主下拉
    AdvancedConditions, // 進階搜尋條件
    List, // 列表資料
  },
  setup() {
    const { t, locale } = useI18n({ useScope: 'local' });
    // Loading
    const setLoading = inject('UrlManagement:setLoading') as Function;
    // 判斷是否客端域名修改權限
    const { hasModify: hasModifyPerm } = useModifyAccess('CustomerUrl');
    // 已搜尋
    const searched = ref(false);
    // 更新API資料
    const updateApi = ref(false);
    // 自定義快搜
    const customSearch = inject<object>('UrlManagement:customSearch');
    // 站別列表
    const siteOptions = inject('UrlManagement:siteList') as Ref<SiteOption[]>;
    // 基本搜尋
    const basicForm = reactive({
      type: '',
      site: '',
      domain: 'all',
      multipleDomains: [],
    }) as {
      type: string;
      site: string;
      domain: 'all' | number;
      multipleDomains: string[];
    };

    // 域名狀態群組的過濾選項
    const { getAdvancedConditionsList } = useAdvancedConditionList(
      locale.value,
    );

    // 進階條件
    const { advancedForm, advancedFormKeys, abnormalStateGroup } =
      useAdvancedConditions();

    // 批次輸入框下拉開關
    const batchInputVisible = ref(false);
    const formRef = ref();
    // 表單相關
    const { form, initForm } = useForm();
    // 切換搜尋類別
    const changeType = (value: string) => {
      initForm();
      form.type = value;
    };
    // 表單欄位
    const { displayField, supportSingleDomainName, supportMultipleDomainName } =
      useFormField(form);
    // 表單下拉選項
    const {
      typeOptions,
      abnormalAreaOptions,
      singleAreaOptions,
      getAbnormalAreas,
    } = useFormOptions(t);
    // 驗證相關
    const { rules } = useValidationRules(t);

    const listRef = ref();
    // 列表資料
    const {
      listData,
      orgListData,
      unknownDomainNames,
      listAngleTotalData,
      listCondition,
      getList,
    } = useList();
    provide('CustomerDomain:listData', listData);
    provide('CustomerDomain:orgListData', orgListData);
    provide('CustomerDomain:listAngleTotalData', listAngleTotalData);
    provide('CustomerDomain:listCondition', listCondition);

    // 查無域名列表
    const unknownDomainNameList = computed(() => {
      return unknownDomainNames.value
        .filter((domainName, key) => {
          const mixNum = (listCondition.page - 1) * listCondition.size;
          const maxNum = listCondition.page * listCondition.size;
          return mixNum <= key && key < maxNum;
        })
        .map((domainName, id) => ({
          id,
          domainName,
        }));
    });
    provide('CustomerDomain:unknownDomainNameList', unknownDomainNameList);

    // 申請域名
    const applyDomainName = () => {
      window.open('/v3/system_setting/url_management/apply');
    };

    const watcher = useTabWatcher('customerDomain');
    const querySet = useQuery([
      {
        key: 'type',
        get: () => form.type,
        set: (val: FormType['type']) => {
          form.type = val;
        },
        default: '',
        cached: true,
      },
      {
        key: 'site',
        get: () => form.site,
        set: (val: string) => {
          form.site = val;
        },
        default: '',
        optional: true,
        cached: true,
      },
      {
        key: 'domain',
        get: () => form.domain,
        set: (val: 'all' | number) => {
          form.domain = val === 'all' ? val : toInteger(val);
        },
        default: 'all',
        cached: true,
      },
      {
        key: 'domain_name',
        query: 'domainName',
        get: () => form.domainName,
        set: (val: string) => {
          form.domainName = val;
        },
        default: '',
        optional: true,
        cached: true,
      },
      {
        key: 'multipleDomains',
        get: () => form.multipleDomains,
        set: (val: string[]) => {
          form.multipleDomains = val;
        },
        default: [],
        filter: () => !isEmpty(form.multipleDomains),
        optional: true,
        cached: true,
        array: true,
      },
      {
        key: 'ip',
        get: () => form.ip,
        set: (val: string) => {
          form.ip = val;
        },
        default: '',
        filter: () => !isEmpty(form.ip),
        optional: true,
        cached: true,
      },
      {
        key: 'abnormal_area',
        query: 'area',
        get: () => form.area,
        set: (val: string) => {
          form.area = val;
        },
        default: 'all',
        filter: type => !(type === 'api' && form.area === 'all'),
        cached: true,
        optional: true,
      },
      // 進階條件
      {
        key: 'service_item',
        query: 'service',
        get: () => advancedForm.service,
        set: (val: number[]) => {
          advancedForm.service = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.service),
        optional: true,
        numberArray: true,
      },
      {
        key: 'domain_name_status',
        query: 'domainNameStatus',
        get: () => advancedForm.domainNameStatus,
        set: (val: number[]) => {
          advancedForm.domainNameStatus = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.domainNameStatus),
        optional: true,
        numberArray: true,
      },
      {
        key: 'certificate_status',
        query: 'sslStatus',
        get: () => advancedForm.sslStatus,
        set: (val: number[]) => {
          advancedForm.sslStatus = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.sslStatus),
        optional: true,
        numberArray: true,
      },
      {
        key: 'fail_to_open',
        query: 'failToOpen',
        get: () => advancedForm.failToOpen,
        set: (val: number[]) => {
          advancedForm.failToOpen = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.failToOpen),
        optional: true,
        numberArray: true,
      },
      {
        key: 'partially_open',
        query: 'partiallyOpen',
        get: () => advancedForm.partiallyOpen,
        set: (val: number[]) => {
          advancedForm.partiallyOpen = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.partiallyOpen),
        optional: true,
        numberArray: true,
      },
      {
        key: 'openable',
        get: () => advancedForm.openable,
        set: (val: number[]) => {
          advancedForm.openable = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.openable),
        optional: true,
        numberArray: true,
      },
      {
        key: 'service_error',
        query: 'abnormalStatus',
        get: () => [
          ...advancedForm.failToOpen,
          ...advancedForm.partiallyOpen,
          ...advancedForm.openable,
        ],
        default: [],
        filter: type =>
          !(type === 'route') &&
          !isEmpty([
            ...advancedForm.failToOpen,
            ...advancedForm.partiallyOpen,
            ...advancedForm.openable,
          ]),
        optional: true,
        numberArray: true,
      },
      // Table條件
      {
        key: 'table_filter',
        query: 'angle',
        get: () => listCondition.formAngle,
        set: (val: 'all' | number) => {
          listCondition.formAngle = val === 'all' ? val : toInteger(val);
        },
        filter: type => !(type === 'api' && listCondition.formAngle === 'all'),
        optional: true,
        default: 'all',
      },
      {
        key: 'page',
        get: () => listCondition.page,
        set: (val: number) => {
          listCondition.page = updateApi.value ? 1 : val;
        },
        default: 1,
        number: true,
      },
      {
        key: 'size',
        get: () => listCondition.size,
        set: (val: number) => {
          listCondition.size = val;
        },
        default: 1000,
        number: true,
      },
      {
        key: 'sort',
        get: () => listCondition.sort,
        set: (val: 'id' | 'abnormalDate' | 'automaticRenewalDate') => {
          listCondition.sort = updateApi.value ? 'id' : val;
        },
        default: 'id',
      },
      {
        key: 'order',
        get: () => listCondition.order,
        set: (val: 'asc' | 'desc') => {
          listCondition.order = updateApi.value ? 'asc' : val;
        },
        default: 'asc',
      },
    ]);
    provide('CustomerDomain:basicSearchForm', basicForm);

    // 設定列表資料
    const setTableData = () => {
      // 判斷為查無域名角度
      if (listCondition.formAngle === 3) {
        // 分頁總數
        listCondition.total = unknownDomainNames.value.length;
      } else {
        listData.value = filterData();

        // 分頁總數
        listCondition.total = listData.value.length;

        // 排序
        listData.value = orderBy(
          listData.value,
          [listCondition.sort],
          [listCondition.order],
        );

        // 分頁顯示筆數
        if (!isEmpty(listData.value)) {
          listData.value = listData.value.filter(
            (item: ListData, key: number) => {
              const mixNum = (listCondition.page - 1) * listCondition.size;
              const maxNum = listCondition.page * listCondition.size;
              return mixNum <= key && key < maxNum;
            },
          );
        }
      }

      // 重置 Scrollbar 位置
      listRef.value?.scrollTo();
      // 清除 Select 和關閉批次
      listRef.value?.selectClear();
    };
    // 過濾列表資料
    const filterData = () => {
      const isNotAdvancedCondition = advancedFormKeys.every(
        key => advancedForm[key].length === 0,
      );
      return orgListData.value.reduce((acc: ListData[], item: ListData) => {
        let result = acc;
        const rowData = {
          service: item.service,
          domainNameStatus: item.domainNameStatus,
          sslStatus: [item.sslStatus],
          abnormalState: item.abnormalState,
        };
        // 判斷有中點擊的進階條件
        const isAdSearch = advancedFormKeys.some(key => {
          // 單一進階條件點擊項目
          const clickASData: number[] = advancedForm[key];
          if (!isEmpty(clickASData)) {
            let fieldData: number[] = rowData[key as keyof typeof rowData];
            // 異常狀態
            if (['failToOpen', 'partiallyOpen', 'openable'].includes(key)) {
              fieldData = rowData.abnormalState;
            }
            return !isEmpty(intersection(clickASData, fieldData));
          }
          return false;
        });

        // 判斷網址狀態裡有異常的協定
        const isAbnormal = !item.urlStatus.status;
        // 判斷列表顯示的網址狀態角度
        const isUrlStatus =
          listCondition.formAngle === 'all' ||
          (listCondition.formAngle === 1 && !isAbnormal) ||
          (listCondition.formAngle === 2 && isAbnormal);

        if (isUrlStatus && (isAdSearch || isNotAdvancedCondition)) {
          result = [...result, item];
        }
        return result;
      }, []);
    };

    // 列表
    const listAct = {
      reset: () => {
        listCondition.formAngle = 'all';
        listCondition.page = 1;

        // 排序重置
        listRef.value?.sortClear();
      },
      sort: (
        field: 'abnormalDate' | 'automaticRenewalDate',
        order: 'ascending' | 'descending' | null,
      ) => {
        // 排序對應表
        const orders: {
          ascending: 'asc';
          descending: 'desc';
        } = { ascending: 'asc', descending: 'desc' };
        listCondition.sort = 'id';
        listCondition.order = 'asc';
        if (order !== null) {
          listCondition.order = orders[order];
          listCondition.sort = field;
        }
        watcher.queryRoute(querySet.getQuery());
      },
      change: () => {
        watcher.queryRoute(querySet.getQuery());
      },
      updateApi: () => {
        updateApi.value = true;
        watcher.queryRoute(querySet.getQuery());
      },
    };
    // 進階條件
    const advancedConditionAct = {
      change: () => {
        listAct.reset();
        watcher.queryRoute(querySet.getQuery());
      },
      clear: () => {
        // 還原進階條件
        advancedFormKeys.forEach(key => {
          advancedForm[key] = [];
        });
        abnormalStateGroup.value = [];
      },
      init: () => {
        abnormalStateGroup.value = (
          [
            'failToOpen',
            'partiallyOpen',
            'openable',
          ] as AbnormalStateConditions[]
        ).filter(key => !isEmpty(advancedForm[key]));
      },
    };

    // 匯出列表資料
    const exportList = (note: string) => {
      setLoading(true);
      setExportPermName('CustomerUrlExport');

      const query = querySet.getQuery() as FormType;
      const params = querySet.getParam();

      // 判斷是否有備註
      if (!isEmpty(note)) {
        params.export_remark = note;
      }

      return doExportCustomerDomainNameList(
        query.type,
        query.site,
        query.domain === 'all' ? 0 : query.domain,
        query.multipleDomains,
        unknownDomainNames.value,
        locale.value,
        params,
      ).then(resp => {
        if (resp.data.result) {
          notify.success({
            title: t('success'),
            message: t('generation_success'),
          });
        }
        setExportPermName('CustomerUrl');
        setLoading(false);
      });
    };

    onMounted(() => {
      setLoading(true);
      Promise.all([getAdvancedConditionsList(), getAbnormalAreas()]).then(
        () => {
          setLoading(false);
        },
      );
    });

    // 點擊搜尋按鈕
    const search = () => {
      formRef.value.validate((validate: boolean) => {
        if (validate) {
          updateApi.value = true;
          // 還原列表條件
          listAct.reset();
          // 還原進階條件
          advancedConditionAct.clear();
          watcher.queryRoute(querySet.getQuery({ ignoreCached: true }));
        }
      });
    };
    // 更新列表資料
    const updateList = () => {
      querySet.setField();
      if (!searched.value || updateApi.value) {
        setLoading(true);
        searched.value = true;
        return getList(form, querySet.getParam()).then(resp => {
          if (resp) {
            advancedConditionAct.init();
            setTableData();

            const query = querySet.getQuery() as FormType;
            basicForm.type = query.type;
            basicForm.domain = query.domain;
            basicForm.multipleDomains = query.multipleDomains;
            basicForm.site = query.site;
          }
          updateApi.value = false;
          setLoading(false);
        });
      }
      setTableData();
    };
    // route watcher
    watcher.setWatcher((query: FormType) => {
      // 若有Type代表已有搜尋
      if (query.type && query.type !== '') {
        updateList();
      } else {
        searched.value = false;
        // 初始化表單
        initForm();
      }
    });

    return {
      t,
      hasModifyPerm,
      // 站別相關
      customSearch,
      siteOptions,
      // 搜尋相關
      searched,
      search,
      // 搜尋表單
      formRef,
      form,
      batchInputVisible,
      rules,
      typeOptions,
      displayField,
      supportSingleDomainName,
      supportMultipleDomainName,
      changeType,
      // 進階條件
      advancedConditionAct,
      // Table
      listRef,
      listAct,
      // 異常地區相關
      abnormalAreaOptions,
      singleAreaOptions,
      // 匯出相關
      exportList,
      applyDomainName,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  @include flex-basic(flex-start, flex-start);

  &__footer {
    @include flex-basic();

    margin-left: auto;

    .apply-url-btn {
      margin-left: 10px;
    }
  }

  .tooltip-content {
    @include flex-basic();
  }
}
</style>
