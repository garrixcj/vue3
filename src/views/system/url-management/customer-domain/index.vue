<i18n
  src="@/languages/system_setting/url_management/customer_domain_name.json"
></i18n>
<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
//- 基本搜尋列
.header
  rd-form(ref="formRef" inline :model="form" :rules="rules")
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
          | {{ `${current?.label} [${current?.option.code}]` }}
    //- 廳主
    rd-form-item(
      v-if="displayField('domain')"
      :label="t('domain')"
      prop="domain"
    )
      domain-selector(v-model:value="form.domain" :allOpt="allOption")
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
      )
    //- 異常地區
    rd-form-item(v-if="displayField('area')" prop="area")
      template(#label)
        span {{ t('abnormal_area') }}
        rd-tooltip(placement="top")
          i.mdi.mdi-information
          template(#content)
            .tooltip-content
              div {{ t('abnormal_area_information_1') }}
              div {{ t('abnormal_area_information_2') }}
              div {{ t('abnormal_area_information_3') }}
      rd-select(v-model:value="form.area")
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
    rd-button.apply-url-btn(type="primary") {{ t('apply_url') }}

before-search-empty(v-show="!searched" :label="t('start_search')")
//- 進階搜尋列
advanced-conditions(
  v-if="searched"
  ref="advancedRef"
  :show-usage-groups="['service', 'domainNameStatus', 'sslStatus', 'abnormalState']"
  @change="clickAct.advancedCondition"
)
//- 列表資料
List(
  v-if="searched"
  ref="listRef"
  @change="clickAct.listCondition"
  @export="exportList"
  @sortChange="clickAct.listSort"
)
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { isEmpty, intersection, omitBy, orderBy } from 'lodash';
import {
  nextTick,
  defineComponent,
  onMounted,
  provide,
  inject,
  ref,
} from 'vue';
import { useLoadingStore } from '@/stores/loading';
import DomainSelector from '@/plugins/domain-selector/index.vue';
import BatchInput from '@/components/custom/batch-input/index.vue';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import SettingExample from './setting-example.vue';
import AdvancedConditions from '../common/advanced-conditions.vue';
import List from './table.vue';
import { randomAlphanumeric } from '@/components/utils/random/index';
import { notify } from '@/components/utils/notification';
import { useTabWatcher, useQuery } from '@/components/utils/route-watch';
import { useSiteList } from '../common/list';
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
  type ExportCustomerDomainNameParams,
  setExportPermName,
  doExportCustomerDomainNameList,
} from '../common/export';
import type { ListData } from '../common/type';

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

    const loadingStore = useLoadingStore();

    // 已搜尋
    const searched = ref(false);

    // 下拉全部選項
    const allOption = inject<object>('UrlManagement:allOption');
    // 自定義快搜
    const customSearch = inject<object>('UrlManagement:customSearch');
    // 站別相關
    const { getSiteList, siteOptions } = useSiteList();

    // 進階條件
    const {
      advancedRef,
      advancedForm,
      advancedFormKeys,
      advancedGroupCheckAll,
      resetAdvancedCondition,
    } = useAdvancedConditions();
    provide('UrlManagement:advancedForm', advancedForm);
    provide('UrlManagement:advancedGroupCheckAll', advancedGroupCheckAll);

    // 批次輸入框下拉開關
    const batchInputVisible = ref(false);
    const formRef = ref();
    // 表單相關
    const { form, orgForm, cachedForm, resetForm, initForm } = useForm();
    provide('CustomerDomain:basicSearchForm', orgForm);
    // 表單欄位
    const { displayField, supportSingleDomainName, supportMultipleDomainName } =
      useFormField();
    // 表單下拉選項
    const {
      typeOptions,
      abnormalAreaOptions,
      singleAreaOptions,
      getAbnormalAreas,
    } = useFormOptions();
    // 驗證相關
    const { rules } = useValidationRules();
    // 切換搜尋類別
    const changeType = (value: string) => {
      initForm();
      form.type = value;
    };

    const listRef = ref();
    // 列表資料
    const {
      listData,
      orgListData,
      orgCheckNoDomainNameList,
      checkNoDomainNameList,
      listAngleTotalData,
      listCondition,
      getList,
    } = useList(form);
    provide('CustomerDomain:listData', listData);
    provide('CustomerDomain:orgListData', orgListData);
    provide('CustomerDomain:checkNoDomainNameList', checkNoDomainNameList);
    provide('CustomerDomain:listAngleTotalData', listAngleTotalData);
    provide('CustomerDomain:listCondition', listCondition);

    // 點擊動作
    const clickAct = {
      // 進階條件
      advancedCondition: () => {
        resetAct.listCondition();
        resetForm();
        setTableData();
      },
      // 列表條件
      listCondition: () => {
        resetForm();
        setTableData();
      },
      // 列表欄位排序
      listSort: (
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
        setTableData();
      },
    };
    // 重置動作
    const resetAct = {
      // 重置列表 Scrollbar 位置
      scrollBar: () => {
        listRef.value?.listRef?.setScrollTop(0);
        listRef.value?.listRef?.setScrollLeft(0);
      },
      // 還原搜尋參數
      listCondition: () => {
        listCondition.formAngle = 'all';
        listCondition.page = 1;

        // 排序重置
        listRef.value?.sortAct.clear();
      },
      // 還原異常狀態
      abnormalState: () => {
        advancedRef.value?.abnormalStatusAct.clear();
      },
    };

    // 設定列表資料
    const setTableData = () => {
      listCondition.loading = true;

      // 判斷為查無域名角度
      if (listCondition.formAngle === 'noDomainName') {
        // 分頁總數
        listCondition.total = orgCheckNoDomainNameList.value.length;

        // 分頁顯示筆數
        checkNoDomainNameList.value = orgCheckNoDomainNameList.value.filter(
          (item: { id: number; domainName: string }, key: number) => {
            const mixNum = (listCondition.page - 1) * listCondition.size;
            const maxNum = listCondition.page * listCondition.size;
            return mixNum <= key && key < maxNum;
          },
        );
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

      nextTick(() => {
        setTimeout(() => {
          // 重置 Scrollbar 位置
          resetAct.scrollBar();

          listCondition.loading = false;
        }, 1000);
      });
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
        const isAdSearch = advancedFormKeys.some(acKey => {
          // 單一進階條件點擊項目
          const clickASData: number[] = advancedForm[acKey];
          if (!isEmpty(clickASData)) {
            let fieldData: number[] = rowData[acKey as keyof typeof rowData];
            // 異常狀態
            if (['notOpen', 'partiallyOpen', 'open'].includes(acKey)) {
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
          (listCondition.formAngle === 'normal' && !isAbnormal) ||
          (listCondition.formAngle === 'abnormal' && isAbnormal);

        if (isUrlStatus && (isAdSearch || isNotAdvancedCondition)) {
          result = [...result, item];
        }
        return result;
      }, []);
    };

    // 匯出列表資料
    const exportList = (note: string) => {
      loadingStore.axios = true;
      setExportPermName('CustomerUrlExport');

      // 列表角度
      let tableFilter = 0;
      if (listCondition.formAngle === 'normal') {
        tableFilter = 2;
      } else if (listCondition.formAngle === 'abnormal') {
        tableFilter = 2;
        // 查無域名
      } else if (listCondition.formAngle === 'noDomainName') {
        tableFilter = 3;
      }

      // 異常地區
      let abnormalArea = '';
      // 判斷異常地區不為「不限制」
      if (orgForm.area !== 'all') {
        abnormalArea = orgForm.area;
      }

      const optionsTmp: ExportCustomerDomainNameParams = {
        domain_name: orgForm.domainName,
        ip: orgForm.ip,
        abnormal_area: abnormalArea,
        service_item: advancedForm.service,
        domain_name_status: advancedForm.domainNameStatus,
        certificate_status: advancedForm.sslStatus,
        service_error: [
          ...advancedForm.notOpen,
          ...advancedForm.partiallyOpen,
          ...advancedForm.open,
        ],
        table_filter: tableFilter,
        sort: listCondition.sort,
        order: listCondition.order,
        export_remark: note,
      };
      // 過濾為空的都不帶入
      const options = omitBy(optionsTmp, value => {
        if (
          (typeof value !== 'number' && isEmpty(value)) ||
          (typeof value === 'number' && value === 0)
        ) {
          return true;
        }
        return false;
      });

      // 查無域名資料
      const noDomainNameList = orgCheckNoDomainNameList.value.map(
        item => item.domainName,
      );

      return doExportCustomerDomainNameList(
        orgForm.type,
        orgForm.site,
        orgForm.domain,
        noDomainNameList,
        orgForm.multipleDomains,
        randomAlphanumeric(),
        locale.value,
        options,
      ).then(resp => {
        if (resp.data.result) {
          notify.success({
            title: t('success'),
            message: t('generation_success'),
          });
        }
        setExportPermName('CustomerUrl');
        loadingStore.axios = false;
      });
    };

    onMounted(() => {
      loadingStore.page = true;
      Promise.all([getSiteList(), getAbnormalAreas()]).then(() => {
        loadingStore.page = false;
      });
    });
    const watcher = useTabWatcher('customerDomain');
    // route相關
    const querySet = useQuery([
      {
        key: 'type',
        get: () => form.type,
        set: (val: FormType['type']) => {
          form.type = val;
        },
        default: '',
      },
      {
        key: 'site',
        get: () => form.site,
        set: (val: string) => {
          form.site = val;
        },
        default: '',
      },
      {
        key: 'domain',
        get: () => form.domain,
        set: (val: number) => {
          form.domain = val;
        },
        default: 0,
        number: true,
      },
      {
        key: 'domainName',
        get: () => form.domainName,
        set: (val: string) => {
          form.domainName = val;
        },
        default: '',
      },
      {
        key: 'multipleDomains',
        get: () => form.multipleDomains,
        set: (val: string[]) => {
          form.multipleDomains = val;
        },
        default: [],
      },
      {
        key: 'ip',
        get: () => form.ip,
        set: (val: string) => {
          form.ip = val;
        },
        default: '',
      },
      {
        key: 'area',
        get: () => form.area,
        set: (val: string) => {
          form.area = val;
        },
        default: 'all',
      },
    ]);
    // 點擊搜尋按鈕
    const search = () => {
      formRef.value.validate((validate: boolean) => {
        if (validate) {
          watcher.queryRoute(querySet.getQuery());
        }
      });
    };
    // 更新列表資料
    const updateList = () => {
      loadingStore.axios = true;
      searched.value = true;
      querySet.setField();
      getList().then(resp => {
        if (resp.every(item => item)) {
          // 緩存搜尋參數
          cachedForm();
          resetAdvancedCondition();
          resetAct.listCondition();
          resetAct.abnormalState();
          setTableData();
        }
        loadingStore.axios = false;
      });
    };
    // route watcher
    watcher.setWatcher((query: FormType) => {
      // 還原進階條件
      resetAdvancedCondition();
      // 還原列表條件
      resetAct.listCondition();
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
      allOption,
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
      advancedRef,
      // Table
      listRef,
      clickAct,
      // 異常地區相關
      abnormalAreaOptions,
      singleAreaOptions,
      // 匯出相關
      exportList,
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
