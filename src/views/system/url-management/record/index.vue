<i18n src="@/languages/system_setting/url_management/record.json"></i18n>
<template lang="pug">
.url-management-record
  .search-bar
    rd-form(ref="formRef" inline size="large" :model="form" :rules="rules")
      //- 操作時間
      rd-form-item(:label="t('operate_time')" prop="date")
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
      //- 站別
      rd-form-item(:label="t('site')" prop="siteGroup")
        rd-select(
          v-model:value="form.siteGroup"
          :quick-search="customSearch"
          :selected-setting="{ maxWidth: 240 }"
          :popper-setting="{ width: 'auto' }"
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
            span(v-if="!!current?.option?.code") {{ `${current.label} [${current.option.code}]` }}
      //- 操作項目
      rd-form-item(:label="t('operation_item')" prop="operatorType")
        rd-select(
          v-model:value="form.operatorType"
          :placeholder="t('please_select')"
        )
          rd-option(
            v-for="(option, index) in operatorOption"
            :key="index"
            :value="option.value"
            :label="option.label"
            :option="option"
          )
          rd-option(divided)
          rd-option(
            v-for="(option, index) in applyOption"
            :key="index"
            :value="option.value"
            :label="option.label"
            :option="option"
          )
      //- 域名
      rd-form-item(:label="t('domain_name')" prop="domainName")
        rd-input(
          v-model="form.domainName"
          :placeholder="t('input_keyword_at_least', { num: 6 })"
          clearable
        )
      //- 單號
      rd-form-item(:label="t('trans_number')" prop="ticketID")
        rd-input(
          v-model="form.ticketID"
          :placeholder="t('please_enter_complete_trans_number')"
          clearable
        )
      //- 關鍵字
      rd-form-item(:label="t('keyword')" prop="keyword")
        template(#label)
          label {{ t('keyword') }}
          rd-tooltip(placement="top" :offset="0")
            i.mdi.mdi-information
            template(#content)
              div IP{{ t('enter_example') }}
              div ※ IPv4：111.222.3.4
              div ※ IPv6：2401:e180:8821:909e:abc1:abc2:abc3:abc4
              div ※ {{ t('ipv6_hint') }}
              div 【2401:e180:8821:909e】:abc1:abc2:abc3:abc4
              div 【2401:e180:8821:909e】:abc5:abc6:abc7:abc8
        rd-input(
          v-model="form.keyword"
          :placeholder="t('not_required')"
          clearable
        )
          template(#prepend)
            rd-select(v-model:value="keywordType" :options="keywordOptions")
      //- 搜尋按鈕
      rd-form-item
        rd-button(type="search" size="large" @click="search")
          i.mdi.mdi-magnify
          span {{ t('search') }}
  before-search(v-show="!searched" :label="t('start_search')")
  table-list(v-if="searched" :tableData="tableData" :dataTotal="dataTotal")
</template>

<script lang="ts">
import { defineComponent, reactive, ref, inject, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { useLoadingStore } from '@/stores/loading';
import { useTabWatcher, useQuery } from '@/components/utils/route-watch';
import { formatCheck } from '@/components/utils/validator/validator';
import BeforeSearch from '@/components/custom/before-search/index.vue';
import { url } from '@/api/domain';
import { useSiteList } from '../common/list';
import type { ParamsType, RecordsType, FormType, OperatorType } from './type';
import TableList from './table.vue';
import { useInitial } from './initial';

export default defineComponent({
  name: 'UrlManagementRecord', // 網址管理 - 操作紀錄
  components: {
    TableList,
    BeforeSearch,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const loadingStore = useLoadingStore();
    // 取選項初始值
    const { operatorOption, applyOption, keywordOptions } = useInitial();

    // 取站別列表
    const { getSiteList, siteOptions } = useSiteList();
    getSiteList();
    provide('UrlManagementRecord:siteOptions', siteOptions);
    // 自定義站別快搜
    const customSearch = inject<object>('UrlManagement:customSearch');

    const disabledDate = (time: Date) => {
      return dayjs(time).diff(dayjs(), 'day', true) > 0;
    };

    // 搜尋相關
    const formRef = ref();
    const form = reactive<FormType>({
      date: ['', ''],
      siteGroup: 'all',
      operatorType: 0,
      domainName: '',
      ticketID: '',
      keyword: '',
      sort: '',
      order: '',
      page: 1,
      limit: 30,
    });
    provide('UrlManagementRecord:form', form);
    // 關鍵字搜尋類別
    const keywordType = ref<'operator' | 'ip'>('operator');
    // 操作記錄資料列
    const tableData = ref<RecordsType[]>([]);
    // 操作記錄資料總數
    const dataTotal = ref(0);

    // 客製化驗證
    const customValid = {
      domainName(rule: unknown, value: string) {
        return new Promise<void>((resolve, reject) => {
          if (value !== '' && value.length < 6) {
            reject(t('input_keyword_at_least', { num: 6 }));
          } else {
            resolve();
          }
        });
      },
      ticketID(rule: unknown, value: string) {
        return new Promise<void>((resolve, reject) => {
          if (value !== '' && !/^([1-9][0-9]*)$/.test(value)) {
            reject(t('please_enter_trans_number'));
          } else {
            resolve();
          }
        });
      },
      keyword(rule: unknown, value: string) {
        return new Promise<void>((resolve, reject) => {
          if (
            value !== '' &&
            keywordType.value === 'ip' &&
            !formatCheck(value, 'ipv4') &&
            !formatCheck(value, 'ipv6')
          ) {
            reject(t('please_enter_the_complete_ip_address'));
          } else {
            resolve();
          }
        });
      },
    };

    // 表單驗證規則
    const rules = reactive({
      domainName: [
        {
          required: false,
          asyncValidator: customValid.domainName,
          trigger: 'change',
        },
      ],
      ticketID: [
        {
          required: false,
          asyncValidator: customValid.ticketID,
          trigger: 'change',
        },
      ],
      keyword: [
        {
          required: false,
          asyncValidator: customValid.keyword,
          trigger: 'change',
        },
      ],
    });

    // 排序設定
    const sortCondition = reactive({
      prop: 'created_at',
      order: 'descending' as 'ascending' | 'descending',
    });
    provide('UrlManagementRecord:sortCondition', sortCondition);

    // 處理置頂
    const scrollToTop = inject('UrlManagement:scrollToTop') as Function;
    const searched = ref(false);

    // 點擊搜尋
    const search = () => {
      formRef.value.validate((validate: boolean) => {
        if (validate) {
          searched.value = true;
          scrollToTop();
          watcher.queryRoute(querySet.getQuery());
        }
      });
    };
    provide('UrlManagementRecord:search', search);

    //觸發搜尋
    const searchData = () => {
      loadingStore.page = true;
      const options: ParamsType = {};
      if (form.date[0] !== '' && form.date[1] !== '') {
        options.start_date = form.date[0];
        options.end_date = form.date[1];
      }
      if (form.operatorType > 0) {
        options.operator_type = form.operatorType;
      }
      if (form.domainName !== '') {
        options.domain_name = form.domainName;
      }
      if (form.siteGroup !== '' && form.siteGroup !== 'all') {
        options.site_group = form.siteGroup;
      }
      if (form.ticketID > 0) {
        options.ticket_id = form.ticketID;
      }
      if (form.keyword !== '' && keywordType.value === 'operator') {
        options.operator = form.keyword;
      }
      if (form.keyword !== '' && keywordType.value === 'ip') {
        options.ip = form.keyword;
      }
      if (form.page > 0 && form.limit > 0) {
        options.page = form.page;
        options.limit = form.limit;
      }
      if (form.sort !== '' && form.order !== '') {
        options.sort = form.sort;
        options.order = form.order;
      }

      url.getRecord(options).then(resp => {
        if (resp.data.result) {
          tableData.value = resp.data.data.list;
          dataTotal.value = resp.data.data.total;
        }
        loadingStore.page = false;
      });
    };

    // route相關
    const querySet = useQuery([
      {
        key: 'start_date',
        get: () => {
          return form.date !== null ? form.date[0] : '';
        },
        set: (val: string) => {
          form.date[0] = val;
        },
        default: '',
        optional: true,
      },
      {
        key: 'end_date',
        get: () => {
          return form.date !== null ? form.date[1] : '';
        },
        set: (val: string) => {
          form.date[1] = val;
        },
        default: '',
        optional: true,
      },
      {
        key: 'site_group',
        get: () => form.siteGroup,
        set: (val: string) => {
          form.siteGroup = val;
        },
        default: 'all',
      },
      {
        key: 'operator_type',
        get: () => form.operatorType,
        set: (val: number) => {
          form.operatorType = val as OperatorType;
        },
        default: 0,
        number: true,
      },
      {
        key: 'domain_name',
        get: () => form.domainName,
        set: (val: string) => {
          form.domainName = val;
        },
        default: '',
        optional: true,
      },
      {
        key: 'ticket_id',
        get: () => form.ticketID,
        set: (val: number) => {
          form.ticketID = val;
        },
        default: '',
        number: true,
        optional: true,
      },
      {
        key: 'operator',
        get: () => {
          return keywordType.value === 'operator' ? form.keyword : '';
        },
        set: (val: string) => {
          if (val !== '') {
            form.keyword = val;
            keywordType.value = 'operator';
          }
        },
        default: '',
        optional: true,
      },
      {
        key: 'ip',
        get: () => {
          return keywordType.value === 'ip' ? form.keyword : '';
        },
        set: (val: string) => {
          if (val !== '') {
            form.keyword = val;
            keywordType.value = 'ip';
          }
        },
        default: '',
        optional: true,
      },
      {
        key: 'page',
        get: () => form.page,
        set: (val: number) => {
          form.page = val;
        },
        default: 1,
        number: true,
      },
      {
        key: 'limit',
        get: () => form.limit,
        set: (val: number) => {
          form.limit = val;
        },
        default: 30,
        number: true,
      },
      {
        key: 'sort',
        get: () => form.sort,
        set: (val: string) => {
          form.sort = val;
          sortCondition.prop = val;
        },
        default: 'created_at',
      },
      {
        key: 'order',
        get: () => form.order,
        set: (val: string) => {
          form.order = val;
          sortCondition.order = val === 'desc' ? 'descending' : 'ascending';
        },
        default: 'desc',
      },
    ]);

    // 監聽路由異動觸發搜尋
    const watcher = useTabWatcher('record');
    watcher.setWatcher((query: { re: number }) => {
      formRef.value?.resetFields();
      querySet.setField();
      if (typeof query.re !== 'undefined') {
        searchData();
      } else {
        tableData.value = [];
        dataTotal.value = 0;
        searched.value = false;
      }
    });

    return {
      t,
      form,
      formRef,
      rules,
      search,
      customSearch,
      siteOptions,
      operatorOption,
      applyOption,
      keywordOptions,
      keywordType,
      tableData,
      dataTotal,
      sortCondition,
      searched,
      disabledDate,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-bar {
  margin-top: 15px;
}
</style>
