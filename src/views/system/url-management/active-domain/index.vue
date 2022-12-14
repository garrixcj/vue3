<i18n src="@/languages/system_setting/url_management/active_url.json"></i18n>
<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
//- 基本搜尋列
.header
  rd-form(ref="formRef" inline :model="form" :rules="rules")
    //- 廳主
    rd-form-item(:label="t('domain')" prop="domain")
      domain-selector(v-model:value="form.domain" all-opt)
    //- 關鍵字
    rd-form-item(prop="keyword")
      template(#label)
        span {{ t('keyword') }}
        rd-tooltip(placement="top" :content="t('keyword_msg')")
          i.mdi.mdi-information
      rd-input(v-model="form.keyword" :placeholder="t('not_required')")
    //- 時間區間
    rd-form-item(prop="date")
      template(#label)
        span {{ t('date_interval') }}
        rd-tooltip(placement="top")
          i.mdi.mdi-information
          template(#content)
            .tooltip-content
              div ・{{ t('query_interval_is_up_to_n_days', { day: 180 }) }}
              div ・{{ t('active_url_date_time_info') }}
      //- 日期範圍
      rd-date-picker(
        v-model="form.date"
        type="daterange"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :disabled-date="disabledDate"
        :range-separator="t('to')"
        :start-placeholder="t('start_date')"
        :end-placeholder="t('end_date')"
      )
    //- 搜尋
    rd-form-item
      rd-button(type="search" @click="search")
        i.mdi.mdi-magnify
        span {{ t('search') }}

before-search-empty(v-show="!searched" :label="t('start_search')")
//- 進階搜尋列
advanced-conditions(
  v-if="searched"
  ref="advancedRef"
  :show-usage-groups="['abnormalState', 'growingPercent']"
  @change="advancedConditionAct.change"
)
//- 列表資料
list(
  v-if="searched"
  @change="listAct.change"
  @sortChange="listAct.sort"
  @export="exportList"
)
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { isEmpty, intersection, orderBy, toInteger } from 'lodash';
import { defineComponent, provide, inject, ref } from 'vue';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import DomainSelector from '@/plugins/domain-selector/index.vue';
import AdvancedConditions from '../common/advanced-conditions.vue';
import List from './table.vue';
import { useTabWatcher, useQuery } from '@/components/utils/route-watch';
import { notify } from '@/components/utils/notification';
import {
  useForm,
  useFormField,
  useFormOptions,
  useValidationRules,
  useAdvancedConditions,
} from '../common/search';
import {
  setExportPermName,
  doExportActiveDomainNameList,
} from '../common/export';
import { useList } from './list';
import type {
  ActiveDomainNameListData,
  AbnormalStateConditions,
} from '../common/type';

export default defineComponent({
  name: 'ActiveDomain', // 網址管理 - 活躍域名

  components: {
    BeforeSearchEmpty,
    DomainSelector,
    AdvancedConditions,
    List,
  },
  setup() {
    const { t, locale } = useI18n({ useScope: 'local' });

    // Loading
    const setLoading = inject('UrlManagement:setLoading') as Function;
    // 已搜尋
    const searched = ref(false);
    // 更新API資料
    const updateApi = ref(false);

    const formRef = ref();
    // 表單相關
    const { form, initForm } = useForm();
    // 表單欄位
    const { displayField } = useFormField(form);
    // 驗證相關
    const { rules } = useValidationRules(t);

    // 表單下拉選項
    let { typeOptions } = useFormOptions(t);
    typeOptions.value = typeOptions.value.filter(item => {
      return item.value !== 'ip';
    });

    // 只能搜前 180 天
    const disabledDate = (time: Date) => {
      return (
        dayjs(time).diff(dayjs(), 'day', true) > 0 ||
        dayjs(time).diff(dayjs(), 'day', true) < -180
      );
    };

    // 進階條件
    const { advancedForm, advancedFormKeys, abnormalStateGroup } =
      useAdvancedConditions();
    provide('UrlManagement:advancedForm', advancedForm);
    provide('UrlManagement:abnormalStateGroup', abnormalStateGroup);

    const listRef = ref();
    // 列表相關
    const {
      listData,
      orgListData,
      listCondition,
      listAngleTotalData,
      getList,
    } = useList();
    provide('ActiveDomainName:listData', listData);
    provide('ActiveDomainName:listCondition', listCondition);
    provide('ActiveDomainName:listAngleTotalData', listAngleTotalData);

    const watcher = useTabWatcher('activeDomain');
    const querySet = useQuery([
      {
        key: 'domain',
        get: () => form.domain,
        set: (val: 'all' | number) => {
          form.domain = val === 'all' ? val : toInteger(val);
        },
        default: 'all',
        filter: type => !(type === 'api' && form.domain === 'all'),
        optional: true,
        cached: true,
      },
      {
        key: 'keyword',
        get: () => form.keyword,
        set: (val: string) => {
          form.keyword = val;
        },
        default: '',
        optional: true,
        cached: true,
      },
      // 開始日期
      {
        key: 'start_date',
        get: () => form.date[0],
        set: (val: string) => {
          form.date[0] = val;
        },
        filter: () => !isEmpty(form.date[0]),
        optional: true,
        cached: true,
      },
      // 結束日期
      {
        key: 'end_date',
        get: () => form.date[1],
        set: (val: string) => {
          form.date[1] = val;
        },
        filter: () => !isEmpty(form.date[1]),
        optional: true,
        cached: true,
      },
      {
        key: 'date',
        get: () => form.date,
        filter: type => !(type === 'api') && !isEmpty(form.date),
        optional: true,
        cached: true,
        array: true,
      },
      // 進階條件
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
      {
        key: 'growing_percent',
        query: 'growingPercent',
        get: () => advancedForm.growingPercent,
        set: (val: number[]) => {
          advancedForm.growingPercent = val;
        },
        default: [],
        filter: () => !isEmpty(advancedForm.growingPercent),
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
        key: 'sort',
        get: () => listCondition.sort,
        set: (val: string) => {
          listCondition.sort = updateApi.value ? 'rank' : val;
        },
        default: 'rank',
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

    // 設定列表資料
    const setTableData = () => {
      listData.value = filterData();

      // 分頁總數
      listCondition.total = listData.value.length;

      // 排序
      listData.value = orderBy(
        listData.value,
        [listCondition.sort],
        [listCondition.order],
      );
      // 重置 Scrollbar 位置
      listRef.value?.scrollTo();
    };
    // 過濾列表資料
    const filterData = () => {
      const isNotAdvancedCondition = advancedFormKeys.every(
        key => advancedForm[key].length === 0,
      );
      return orgListData.value.reduce(
        (acc: ActiveDomainNameListData[], item: ActiveDomainNameListData) => {
          let result = acc;
          const rowData = {
            abnormalState: item.abnormalState,
          };
          // 是負數
          const isNegativeNumber =
            (item.requestGrow < 0 && item.requestGrow !== -Infinity) ||
            (item.loginPassGrow < 0 && item.loginPassGrow !== -Infinity) ||
            (item.loginFailGrow < 0 && item.loginFailGrow !== -Infinity);
          // 判斷有中點擊的進階條件
          const isAdSearch = advancedFormKeys.some(key => {
            // 單一進階條件點擊項目
            const clickASData: number[] = advancedForm[key];
            if (!isEmpty(clickASData)) {
              // 成長％數條件
              if (key === 'growingPercent') {
                if (clickASData.length < 2) {
                  // 勾選負數條件
                  if (clickASData.includes(1)) {
                    return isNegativeNumber;
                  }
                  // 勾選非負數條件
                  if (clickASData.includes(2)) {
                    return !isNegativeNumber;
                  }
                }
                return true;
              }
              let fieldData: number[] = rowData[key as keyof typeof rowData];
              // 異常狀態
              if (['failToOpen', 'partiallyOpen', 'openable'].includes(key)) {
                fieldData = rowData.abnormalState;
              }
              return !isEmpty(intersection(clickASData, fieldData));
            }
            return false;
          });

          // 判斷有高風險
          const isHighRisk = item.failTag || item.ipTag || isNegativeNumber;
          // 判斷列表顯示角度
          const isTableAngle =
            listCondition.formAngle === 'all' ||
            (listCondition.formAngle === 1 && !isHighRisk) ||
            (listCondition.formAngle === 2 && isHighRisk);

          if (isTableAngle && (isAdSearch || isNotAdvancedCondition)) {
            result = [...result, item];
          }
          return result;
        },
        [],
      );
    };

    // 列表
    const listAct = {
      reset: () => {
        listCondition.formAngle = 'all';

        // 排序重置
        listRef.value?.sortClear();
      },
      sort: (field: string, order: 'ascending' | 'descending' | null) => {
        // 排序對應表
        const orders: {
          ascending: 'asc';
          descending: 'desc';
        } = { ascending: 'asc', descending: 'desc' };
        listCondition.sort = 'rank';
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
      setExportPermName('ActiveUrlExport');

      const query = querySet.getQuery() as {
        start_date: string;
        end_date: string;
        growingPercent: number[];
        order: 'acs' | 'desc';
        sort: string;
      };
      const params = querySet.getParam();

      // 判斷是否有備註
      if (!isEmpty(note)) {
        params.export_remark = note;
      }

      return doExportActiveDomainNameList(query.start_date, query.end_date, {
        ...params,
        lang: locale.value,
      }).then(resp => {
        if (resp.data.result) {
          notify.success({
            title: t('success'),
            message: t('generation_success'),
          });
        }
        setExportPermName('ActiveUrl');
        setLoading(false);
      });
    };

    // 點擊搜尋按鈕
    const search = () => {
      formRef.value.validate((validate: boolean) => {
        if (validate) {
          updateApi.value = true;
          // 還原列表條件
          listAct.reset();
          // 還原進階條件
          advancedConditionAct?.clear();
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
            advancedConditionAct?.init();
            setTableData();
          }
          updateApi.value = false;
          setLoading(false);
        });
      }
      setTableData();
    };
    // route watcher
    watcher.setWatcher(
      (query: {
        domain?: number;
        start_date: string;
        end_date: string;
        keyword: string;
        tab: string;
        re: string;
        growingPercent?: number[];
        failToOpen?: number[];
        partiallyOpen?: number[];
        openable?: number[];
        angle?: number;
        sort: string;
        order: 'asc' | 'desc';
      }) => {
        // 若有Type代表已有搜尋
        if (!isEmpty(query.start_date) && !isEmpty(query.end_date)) {
          updateList();
        } else {
          searched.value = false;
          // 初始化表單
          initForm();
        }
      },
    );

    return {
      t,
      // 搜尋相關
      searched,
      search,
      // 搜尋表單
      formRef,
      form,
      rules,
      displayField,
      disabledDate,
      // 進階條件
      advancedConditionAct,
      // Table
      listRef,
      listAct,
      // 匯出相關
      exportList,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  .tooltip-content {
    @include flex-basic();
  }
}
</style>
