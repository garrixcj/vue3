<i18n
  src="@/languages/system_setting/url_management/single-number-progress.json"
></i18n>
<template lang="pug">
rd-form(ref="formRef" inline size="large" :model="form" :rules="rules")
  .search__main
    //- 搜尋條件
    rd-form-item(:label="t('search_condition')" required prop="condition")
      rd-select(
        v-model:value="form.condition"
        :options="conditionOptions"
        @change="resetCondition"
      )
    //- 站別
    rd-form-item(v-show="form.condition === 'site'" prop="site")
      rd-select(
        v-model:value="form.site"
        quick-search
        :popper-setting="{ width: 'auto' }"
        @change="updateFuzzy"
      )
        rd-option(:label="t('all')" value="all")
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
            | {{ `${current.label} [${current.option.code}]` }}
    //- 廳主
    rd-form-item(v-show="form.condition === 'domain'" prop="domain")
      domain-selector(
        v-model:value="form.domain"
        all-opt
        @change="updateFuzzy"
      )
    //- 域名
    rd-form-item(prop="domainName")
      template(#label)
        span {{ t('domain_name') }}
        rd-tooltip(placement="top")
          template(#content)
            div(v-if="form.condition === 'site'") {{ t('fuzzy_search_site') }}
            div(v-else) {{ t('fuzzy_search_domain') }}
            div {{ t('unfuzzy_search_all') }}
          i.mdi.mdi-information
      rd-input(
        v-model="form.domainName"
        :placeholder="t('input_keyword_at_least', { num: 6 })"
        clearable
      )
        template(#append)
          rd-checkbox(
            v-model="form.fuzzy"
            :disabled="form.site === 'all' || form.domain === 'all'"
          ) {{ t('fuzzy') }}
    //- 單號
    rd-form-item(:label="t('trans_number')" prop="id")
      rd-input(
        v-model="form.id"
        :placeholder="t('please_enter_complete_trans_number')"
        clearable
      )
    //- 時間區間
    rd-form-item(prop="dateType")
      rd-select.append-select(
        v-model:value="form.dateType"
        :options="dateTypeOptions"
        @change="clearDate"
      )
      rd-date-picker(
        v-model="form.rangeDate"
        type="datetimerange"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        :range-separator="t('to')"
        :start-placeholder="t('start_date')"
        :end-placeholder="t('end_date')"
      )
    //- 搜尋
    rd-form-item
      rd-button(type="search" size="large" @click="search")
        i.mdi.mdi-magnify
        span {{ t('search') }}
    //- 限制設定
    rd-form-item
      rd-button(type="primary" size="large" @click="restrictionVisible = true") {{ t('setting_limit') }}
  .search__secondary(v-if="!isBeforeSearch")
    //- 購買方式
    rd-form-item(:label="t('ways_to_purchase')" prop="buy")
      .checkbox-group
        rd-checkbox(
          :model-value="form.buy.length === allBuy.length"
          @change="selectAll($event, 'buy', allBuy)"
        )
        rd-checkbox-group(
          v-model="form.buy"
          size="small"
          @change="updateQuery(false)"
        )
          rd-checkbox-button.primary-convert(
            v-for="(info, progress) in buyOptions"
            :key="progress"
            :label="info.value"
          ) {{ info.label }}
    //- 管理權限
    rd-form-item(:label="t('management_permission')" prop="management")
      .checkbox-group
        rd-checkbox(
          :model-value="form.management.length === allManagement.length"
          @change="selectAll($event, 'management', allManagement)"
        )
        rd-checkbox-group(
          v-model="form.management"
          size="small"
          @change="updateQuery(false)"
        )
          rd-checkbox-button.primary-convert(
            v-for="(info, progress) in managementOptions"
            :key="progress"
            :label="info.value"
          ) {{ info.label }}
    //- 進度
    rd-form-item(:label="t('processe')" prop="processe")
      .checkbox-group
        rd-checkbox(
          :model-value="form.progress.length === allProgress.length"
          @change="selectAll($event, 'progress', allProgress)"
        )
        rd-checkbox-group(
          v-model="form.progress"
          size="small"
          @change="updateQuery(false)"
        )
          rd-checkbox-button.primary-convert(
            v-for="(info, progress) in progressListMap"
            :key="progress"
            :label="progress"
          ) {{ t(info.dict) }}
    //- 狀態
    rd-form-item(:label="t('status')" prop="status")
      .checkbox-group
        rd-checkbox(
          :model-value="form.status.length === allStatus.length"
          @change="selectAll($event, 'status', allStatus)"
        )
        rd-checkbox-group(
          v-model="form.status"
          size="small"
          @change="updateQuery(false)"
        )
          rd-checkbox-button.primary-convert(
            v-for="(info, stauts) in statusListMap"
            :key="stauts"
            :label="stauts"
          ) {{ t(info.dict) }}
restriction-dialog(v-model="restrictionVisible")
before-search(v-if="isBeforeSearch" :label="t('start_search')")
table-card(
  v-else
  :search-options="exportOptions"
  :current-page="tableForm.page"
  :page-size="tableForm.limit"
  :order="tableForm.order"
  :sort="tableForm.sort"
  :site-options="siteOptions"
  :list="list"
  :total="listTotal"
  @update:current-page="listAction.changePage"
  @update:page-size="listAction.changePageSize"
  @sortChange="listAction.changeSort"
)
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteList } from '../common/list';
import DomainSelector from '@/plugins/domain-selector/index.vue';
import TableCard from './table.vue';
import BeforeSearch from '@/components/custom/before-search/index.vue';
import type {
  SearchForm,
  SearchOptions,
  SearchTable,
} from './single-number-progress';
import { progressListMap } from './progress';
import { statusListMap } from './status';
import { useList, buyMap, managementMap } from './list';
import {
  useTabWatcher,
  useQuery,
  type SetUsing,
} from '@/components/utils/route-watch';
import { useLoadingStore } from '@/stores/loading';
import RestrictionDialog from './restriction-dialog.vue';
import type { Buy, Management } from '../apply/apply';
import { useModifyAccess } from '@/plugins/access/modify';
import { flatten, omit } from 'lodash';

export default defineComponent({
  name: 'SingleNumberProgress', // 網址管理 - 單號進度
  components: {
    DomainSelector,
    TableCard,
    BeforeSearch,
    RestrictionDialog,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    // 是否搜尋
    const isBeforeSearch = ref(true);
    const formRef = ref();
    const loading = useLoadingStore();
    // 是否顯示限制設定的dialog
    const restrictionVisible = ref(false);
    // 是否有修改權限
    const { hasModify } = useModifyAccess('ApplicationProgress');

    // 搜尋條件
    const form = reactive<SearchForm>({
      condition: 'site',
      site: '',
      domain: '',
      domainName: '',
      fuzzy: false,
      id: '',
      dateType: 'apply',
      rangeDate: [],
      buy: [],
      management: [],
      progress: [],
      status: [],
    });

    // table條件
    const tableForm = reactive<SearchTable>({
      page: 1,
      limit: 30,
      sort: 'finished_at',
      order: 'descending',
    });

    // 匯出的條件
    const exportOptions = ref<SearchOptions>({});

    // 條件選項
    const conditionOptions = [
      // 站別
      {
        value: 'site',
        label: t('site'),
      },
      // 廳主
      {
        value: 'domain',
        label: t('domain'),
      },
    ];

    // 當搜尋條件異動時，將2個條件都清空
    const resetCondition = () => {
      form.domain = '';
      form.site = '';
      formRef.value.resetFields('site');
      formRef.value.resetFields('domain');
    };

    // 在選擇全部時，域名搜尋改為精準
    const updateFuzzy = (value: string) => {
      if (value === 'all') {
        form.fuzzy = false;
      }
    };

    // 站別相關
    const { getSiteList, siteOptions } = useSiteList();

    // 先載入站別列表
    onMounted(() => {
      loading.page = true;
      getSiteList().then(() => {
        loading.page = false;
      });
    });

    // 時間類型選項
    const dateTypeOptions = [
      // 申請日期
      {
        value: 'apply',
        label: t('application_date'),
      },
      // 完成日期
      {
        value: 'finish',
        label: t('finished_date'),
      },
    ];

    // 清除form 的 日期條件
    const clearDate = () => {
      form.rangeDate = [];
    };

    // 購買方式選項
    const buyOptions = [
      // 公司買
      {
        value: 'bbin',
        label: 'BBIN',
      },
      // 廳主買
      {
        value: 'domain',
        label: t('domain'),
      },
    ];

    // 管理權限選項
    const managementOptions = [
      // 公司管
      {
        value: 'bbin',
        label: 'BBIN',
      },
      // 廳主管
      {
        value: 'domain',
        label: t('domain'),
      },
    ];

    // 更新Query
    const updateQuery = (ignoreCached: boolean) => {
      watcher.queryRoute(querySet.getQuery({ ignoreCached }));
    };

    // 提供更新方法給作廢後的資料刷新
    provide('UrlManagement:abolishConfirmCallback', () => {
      updateQuery(false);
    });

    // 全部的購買方式
    const allBuy = buyOptions.map(obj => obj.value) as Buy[];
    // 全部的管理方式
    const allManagement = managementOptions.map(
      obj => obj.value,
    ) as Management[];
    // 全部的單據狀態
    const allStatus = Object.keys(statusListMap);
    // 全部的域名進度
    const allProgress = Object.keys(progressListMap);
    // 全選時的動作
    const selectAll = (
      value: boolean,
      formKey: 'progress' | 'status' | 'buy' | 'management',
      allOptions: string[],
    ) => {
      // 選項全部被選取
      form[formKey] = value ? allOptions : [];

      // 觸發搜尋
      updateQuery(false);
    };

    // 驗證規則
    const rules = {
      site: [
        {
          trigger: 'change',
          asyncValidator: (rule: object, site: string) => {
            return new Promise<void>((resolve, reject) => {
              if (form.condition === 'site' && !site) {
                reject(t('not_null'));
              }
              resolve();
            });
          },
        },
      ],
      domain: [
        {
          trigger: 'change',
          asyncValidator: (rule: object, domain: number) => {
            return new Promise<void>((resolve, reject) => {
              if (form.condition === 'domain' && !domain) {
                reject(t('not_null'));
              }
              resolve();
            });
          },
        },
      ],
      domainName: [
        {
          trigger: 'change',
          asyncValidator: (rule: object, domain: string) => {
            return new Promise<void>((resolve, reject) => {
              // 當今天只有1~5字(空的不判斷) || 有域名但是卻不符合規則(只能輸入大小寫英文、數字、標點符號的「杠或點」)時錯誤
              if (
                (domain.length >= 1 && domain.length < 6) ||
                (domain && !/^[a-zA-Z\d-/.]+$/.test(domain))
              ) {
                reject(t('format_error'));
              }
              resolve();
            });
          },
        },
      ],
      id: [
        {
          trigger: 'change',
          pattern: /^[0-9]+$/,
          message: t('format_error'),
        },
      ],
    };

    // 陣列的過濾判斷
    const arrayFilter = (
      key: keyof typeof form,
      type: SetUsing,
      current: string,
    ) => {
      // 當今天是getParam時直接取form的值判斷，getQuery時才取current
      const values = (type === 'api' ? form[key] : current) as string[];

      return values && values.length > 0;
    };

    const watcher = useTabWatcher('singleNumberProgress');
    // // 搜尋條件陣列
    const querySet = useQuery([
      // 前端 － 搜尋條件
      {
        key: 'condition',
        get: () => form.condition,
        set: (val: string) => {
          form.condition = val;
        },
        optional: false,
        default: 'site',
        cached: true,
        // getQuery時才回傳
        filter: type => type === 'route',
      },
      // 前後端 － 站別
      {
        key: 'site_group',
        query: 'site',
        get: () => form.site,
        set: (val: string) => {
          form.site = val;
        },
        optional: true,
        default: '',
        // 當今天是getQuery直接回傳，當今天是getParam且有值且不是全部時回傳
        filter: type => !(type === 'api' && form.site === 'all'),
        cached: true,
      },
      // 前後端 － 廳主
      {
        key: 'domain',
        get: () => form.domain,
        set: (val: number | 'all') => {
          if (val) {
            form.domain = val === 'all' ? val : +val;
          }
        },
        optional: true,
        default: '',
        // 當今天是getQuery直接回傳，當今天是getParam且有值且不是全部時回傳
        filter: type => !(type === 'api' && form.domain === 'all'),
        cached: true,
      },
      // 前後端 － 域名
      {
        key: 'domain_name',
        query: 'domainName',
        get: () => form.domainName,
        set: (val: string) => {
          form.domainName = val;
        },
        optional: true,
        default: '',
        cached: true,
      },
      // 前端 － 模糊
      {
        key: 'fuzzy',
        get: () => form.fuzzy,
        set: (val: 0 | 1) => {
          form.fuzzy = val === 0 ? false : true;
        },
        optional: true,
        default: false,
        binary: true,
        cached: true,
        filter: type => type === 'route',
      },
      // 後端 － 模糊
      {
        key: 'fuzzy',
        // get需將boolen轉為1、0
        get: () => +form.fuzzy,
        optional: true,
        default: false,
        binary: true,
        cached: true,
        // 當今天是getParam且域名有值時才回傳
        filter: type => type === 'api' && !!form.domainName,
      },
      // 前後端 － 單號
      {
        key: 'ticket_id',
        query: 'id',
        get: () => form.id,
        set: (val: string) => {
          form.id = val;
        },
        optional: true,
        default: '',
        cached: true,
      },
      // 前端 － 日期的類型(申請日期、完成日期)
      {
        key: 'dateType',
        get: () => form.dateType,
        set: (val: string) => {
          form.dateType = val;
        },
        optional: true,
        default: 'apply',
        cached: true,
        filter: type => type === 'route',
      },
      // 前端 － 日期的範圍
      {
        key: 'rangeDate',
        get: () => form.rangeDate,
        set: (val: string[]) => {
          // 過度期寫法，url在只有單一個值得時候會變成string而非array
          form.rangeDate = Array.isArray(val) ? val : [val];
        },
        filter: (type, target) =>
          type === 'route' &&
          arrayFilter('rangeDate', type, target?.current as string),
        default: [],
        cached: true,
      },
      // 後端 － 申請日期的開始
      {
        key: 'start_date_time',
        get: () => form.rangeDate[0],
        // 當今天是getParam且日期類型是申請日期且不為空
        filter: (type, target) =>
          type === 'api' &&
          form.dateType === 'apply' &&
          arrayFilter('rangeDate', type, target?.current as string),
        default: [],
        cached: true,
      },
      // 後端 － 申請日期的結束
      {
        key: 'end_date_time',
        get: () => form.rangeDate[1],
        // 當今天是getParam且日期類型是申請日期且不為空
        filter: (type, target) =>
          type === 'api' &&
          form.dateType === 'apply' &&
          arrayFilter('rangeDate', type, target?.current as string),
        default: [],
        cached: true,
      },
      // 後端 － 完成日期的開始
      {
        key: 'finish_start_date_time',
        get: () => form.rangeDate[0],
        // 當今天是getParam且日期類型是完成日期且不為空
        filter: (type, target) =>
          type === 'api' &&
          form.dateType === 'finish' &&
          arrayFilter('rangeDate', type, target?.current as string),
        default: [],
        cached: true,
      },
      // 後端 － 完成日期的結束
      {
        key: 'finish_end_date_time',
        get: () => form.rangeDate[1],
        // 當今天是getParam且日期類型是完成日期且不為空
        filter: (type, target) =>
          type === 'api' &&
          form.dateType === 'finish' &&
          arrayFilter('rangeDate', type, target?.current as string),
        default: [],
        cached: true,
      },
      // 前端 － 購買方式
      {
        key: 'buy',
        get: () => form.buy,
        set: (val: string[]) => {
          // 過度期寫法，url在只有單一個值得時候會變成string而非array
          form.buy = Array.isArray(val) ? val : [val];
        },
        filter: (type, target) =>
          type === 'route' &&
          arrayFilter('buy', type, target?.current as string),
        default: [],
      },
      // 後端 － 購買方式
      {
        key: 'purchase_method',
        // 將購買方式轉換為後端的id
        get: () => form.buy.map(value => buyMap[value as Buy]),
        filter: (type, target) =>
          type === 'api' && arrayFilter('buy', type, target?.current as string),
        default: [],
      },
      // 前端 － 管理權限
      {
        key: 'management',
        get: () => form.management,
        set: (val: string[]) => {
          // 過度期寫法，url在只有單一個值得時候會變成string而非array
          form.management = Array.isArray(val) ? val : [val];
        },
        filter: (type, target) =>
          type === 'route' &&
          arrayFilter('management', type, target?.current as string),
        default: [],
      },
      // 後端 － 管理權限
      {
        key: 'maintenance_method',
        // 將管理權限轉換為後端的id
        get: () =>
          form.management.map(value => managementMap[value as Management]),
        filter: (type, target) =>
          type === 'api' &&
          arrayFilter('management', type, target?.current as string),
        default: [],
      },
      // 前端 － 域名進度
      {
        key: 'progress',
        get: () => form.progress,
        set: (val: string[]) => {
          // 過度期寫法，url在只有單一個值得時候會變成string而非array
          form.progress = Array.isArray(val) ? val : [val];
        },
        filter: (type, target) =>
          type === 'route' &&
          arrayFilter('progress', type, target?.current as string),
        default: [],
      },
      // 後端 － 域名進度
      {
        key: 'progress_rates',
        // 域名進度 - 將key轉換為後端id
        get: () => form.progress.map(progress => progressListMap[progress].key),
        filter: (type, target) =>
          type === 'api' &&
          arrayFilter('progress', type, target?.current as string),
        default: [],
      },
      // 前端 － 單據狀態
      {
        key: 'status',
        get: () => form.status,
        set: (val: string[]) => {
          // 過度期寫法，url在只有單一個值得時候會變成string而非array
          form.status = Array.isArray(val) ? val : [val];
        },
        filter: (type, target) =>
          type === 'route' &&
          arrayFilter('status', type, target?.current as string),
        default: [],
      },
      // 後端 － 單據狀態
      {
        key: 'tickets_status',
        // 因前端單一狀態對照後端會有多個狀態的情況(ex: 「前」:處理中 -> 「後」:待處理、處理中)
        // 故先取得該前端狀態對應的複數後端對照id，再整理成一個array
        get: () =>
          flatten(form.status.map(status => statusListMap[status].keys)),
        filter: (type, target) =>
          type === 'api' &&
          arrayFilter('status', type, target?.current as string),
        default: [],
      },
      // 前後端 － 頁數
      {
        key: 'page',
        get: () => tableForm.page,
        set: (val: number) => {
          tableForm.page = val;
        },
        optional: false,
        default: 1,
        number: true,
      },
      // 前後端 － 每頁幾筆
      {
        key: 'limit',
        get: () => tableForm.limit,
        set: (val: number) => {
          tableForm.limit = val;
        },
        optional: false,
        default: 30,
        number: true,
      },
      // 前後端 － 排序欄位
      {
        key: 'sort',
        get: () => tableForm.sort,
        set: (val: string) => {
          tableForm.sort = val;
        },
        optional: false,
        default: 'finished_at',
      },
      // 前端 － 排序
      {
        key: 'order',
        query: 'order',
        get: () => tableForm.order,
        set: (val: string) => {
          tableForm.order = val;
        },
        optional: false,
        default: 'descending',
        filter: type => type === 'route',
      },
      // 後端 － 排序
      {
        key: 'order',
        get: () => (tableForm.order === 'descending' ? 'desc' : 'asc'),
        optional: false,
        default: 'desc',
        filter: type => type === 'api',
      },
    ]);

    // 列表相關
    const { list, listTotal, getList } = useList();

    // 更新資料
    const updateData = () => {
      const params = querySet.getParam() as SearchOptions & SearchTable;
      // 順便將條件塞入，提供給匯出使用
      exportOptions.value = omit(params, Object.keys(tableForm));

      getList(params).then(() => {
        isBeforeSearch.value = false;
        loading.page = false;
      });
    };

    watcher.setWatcher(() => {
      loading.page = true;

      // 將值更新到form上面
      querySet.setField();

      const query = querySet.getQuery();
      // 當有domain或site則代表已經搜尋所以要去拿資料(因為是必填)
      if (query.domain || query.site) {
        updateData();
      } else {
        formRef.value?.resetFields();
        isBeforeSearch.value = true;
        list.value = [];
        loading.page = false;
      }
    });

    // 驗證並將query設定到url上去搜尋
    const search = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          loading.page = true;

          // 將非主要條件的搜尋條件都回歸預設
          form.buy = [];
          form.management = [];
          form.progress = [];
          form.status = [];
          tableForm.page = 1;
          tableForm.limit = 30;
          tableForm.sort = 'finished_at';
          tableForm.order = 'descending';

          updateQuery(true);
        }
      });
    };

    // 欄位與排序key對照表
    const sort = {
      siteName: 'site_group',
      applyAt: 'created_at',
      finishAt: 'finished_at',
    };
    // 列表相關動作
    const listAction = {
      // 切換頁數
      changePage: (page = 1) => {
        tableForm.page = page;

        updateQuery(false);
      },
      // 切換每頁幾筆
      changePageSize: (size = 30) => {
        listAction.changePage();
        tableForm.limit = size;

        updateQuery(false);
      },
      // 切換排序
      changeSort: (event = { prop: 'finished_at', order: 'descending' }) => {
        listAction.changePage();
        tableForm.sort = sort[event.prop as keyof typeof sort];
        tableForm.order = event.order;

        updateQuery(false);
      },
    };

    return {
      t,
      form,
      conditionOptions,
      siteOptions,
      statusListMap,
      progressListMap,
      allStatus,
      allProgress,
      selectAll,
      dateTypeOptions,
      isBeforeSearch,
      rules,
      formRef,
      search,
      list,
      loading,
      clearDate,
      resetCondition,
      restrictionVisible,
      buyOptions,
      managementOptions,
      allBuy,
      allManagement,
      updateFuzzy,
      listTotal,
      listAction,
      hasModify,
      updateQuery,
      exportOptions,
      tableForm,
    };
  },
});
</script>

<style lang="scss" scoped>
// 時間選擇器前面的下拉要顯示不同的顏色，但是現行沒有，所以直接改
.append-select {
  :deep(.rd-selected .single) {
    background-color: $background-5;
  }
}
.checkbox-group {
  @include flex-basic;
  @include space;
}
</style>
