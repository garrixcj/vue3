<template lang="pug">
rd-card.binding-table(no-padding)
  template(v-if="searched" #header)
    .header-container
      .header-container__prefix
        rd-field-filter.prefix-item(
          :fields="fieldsData"
          :default-value="customOptions"
          @confirm="confirm"
        )

        .prefix-item.search-time
          .search-time__title {{ t('search_time') }}
          .search-time__content
            rd-format-timer.time(:date-time="nowTime")

      .header-container__suffix
        //- 已綁定
        rd-status-button(
          :value="dataTotal.all_binding"
          :label="t('bind')"
          min-width="0"
          :active="form.type === 'binding'"
          :disabled="false"
          @click="tableSearch.status()"
        )

        //- UBAuth
        rd-status-button(
          :value="dataTotal.ub_auth"
          label="UBAuth"
          :min-width="105"
          :active="form.type === '1'"
          :disabled="false"
          @click="tableSearch.status('1')"
        )

        //- 短信驗證
        rd-status-button.suffix-item(
          :value="dataTotal.sms"
          :label="t('sms_verification')"
          min-width="0"
          :active="form.type === '2'"
          :disabled="false"
          @click="tableSearch.status('2')"
        )

        .suffix-item.sms-verification

        //- 未綁定
        .suffix-item.unbind
          .unbind-item.unbind__title {{ t('unbind') }}
          .unbind-item.unbind__total {{ dataTotal.unbind }}

        //- 匯出
        .suffix-item
          rd-button(
            v-if="checkExportPerm"
            type="default"
            @click="visible = true"
          ) {{ t('export') }}

    export-note(
      v-model:visible="visible"
      :params="{ functionName: 'member_two_factor_auth', tabName: 'binding_data_summary' }"
      @confirm="confirmExport"
    )

  template(#content)
    rd-table(
      border
      :data="data"
      :default-sort="{ prop: 'binding_at', order: 'descending' }"
      @sort-change="tableSearch.sort"
    )
      //- 註冊時間
      rd-table-column(
        v-if="isDisplayedColumns('created_at')"
        :label="t('registration_time')"
        prop="created_at"
        header-align="center"
        min-width="140"
        sortable
        :resizeable="false"
      )
        template(#default="{ row: { created_at } }")
          rd-format-timer.time(date-default="--" :date-time="created_at")
      //- 會員帳號
      rd-table-column(
        :label="t('member_account')"
        prop="username"
        header-align="center"
        sortable
        :min-width="105"
      )
        template(#default="{ row: { id, username } }")
          rd-link(
            v-if="checkUserDetailPerm"
            :href="`user/${id}/detail_info`"
            target="_blank"
          ) {{ username }}
          span(v-else) {{ username }}
      //- 名稱
      rd-table-column(
        v-if="isDisplayedColumns('alias')"
        :label="t('alias')"
        prop="alias"
        header-align="center"
        sortable
      )
      //- 綁定時間
      rd-table-column(
        :label="t('binding_time')"
        prop="binding_at"
        header-align="center"
        min-width="140"
        sortable
        :resizeable="false"
      )
        template(#default="{ row: { binding_at } }")
          rd-format-timer.time(date-default="--" :date-time="binding_at")
      //- 驗證方式
      rd-table-column(
        :label="t('verification_method')"
        prop="type"
        header-align="center"
        min-width="85"
      )
        template(#default="{ row: { type } }")
          span(v-if="type === '1'") UB Auth
          span(v-else-if="type === '2'") {{ t('sms_verification') }}
          span(v-else) --
      //- 手機號碼
      rd-table-column(
        v-if="isDisplayedColumns('telephone') && checkUserDataPerm"
        :label="t('telephone')"
        prop="telephone"
        header-align="center"
        min-width="85"
        :resizeable="false"
      )
        template(#default="{ row: { telephone } }")
          span(v-if="telephone") {{ telephone }}
          span(v-else) --
      //- 最後登入時間
      rd-table-column(
        v-if="isDisplayedColumns('last_login')"
        :label="t('last_login_time')"
        prop="last_login"
        header-align="center"
        min-width="145"
        sortable
        :resizeable="false"
      )
        template(#default="{ row: { last_login } }")
          rd-format-timer.time(date-default="--" :date-time="last_login")
      template(v-if="!searched" #empty)
        before-search-empty(:label="t('start_search')")

  template(v-if="data.length > 0" #footer)
    rd-pagination(
      background
      :current-page="tableOption.pagination.page"
      :page-size="tableOption.pagination.size"
      :page-sizes="[100, 300, 500]"
      :total="tableOption.pagination.total"
      @update:page-size="tableSearch.page(1, $event)"
      @update:current-page="tableSearch.page"
    )
</template>

<script lang="ts">
import { defineComponent, inject, reactive, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLoadingStore } from '@/stores/loading';
import { useTabWatcher, QuerySetting } from '@/components/utils/route-watch';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import RdFormatTimer from '@/components/custom/format-timer/date-time.vue';
import RdFieldFilter from '@/components/custom/field-filter/index.vue';
import RdStatusButton from '@/components/custom/status-button/index.vue';
import { exchangeRate } from '@/components/utils/format/amount';
import { notify } from '@/components/utils/notification';
import ExportNote from '@/plugins/export-note/index.vue';
import { useInitCustomField } from '@/plugins/custom-field/custom-field';
import { useAccess, useAccesses } from '@/plugins/access/view';
import { mapValues } from 'lodash';
import dayjs from 'dayjs';
import { bindingFieldsInitial } from './custom-field';
import type { BindingType, BindingTotal, BindingData } from './type';
import domainAPI from '@/api/domain';
import userAPI from '@/api/user';

export default defineComponent({
  name: 'BindingTable', // 列表
  components: {
    BeforeSearchEmpty,
    RdFormatTimer,
    RdFieldFilter,
    RdStatusButton,
    ExportNote,
  },
  setup() {
    const { t } = useI18n({ useScope: 'parent' });
    const loadingStore = useLoadingStore();
    const watcher = useTabWatcher('bindingDataSummary');
    const searched = inject('BindingDataSummary:searched');

    const form = inject('BindingDataSummary:searchForm', {
      domain: 0,
      users: [] as string[],
      date: ['', ''] as [string, string],
      type: 'binding',
    });

    // 匯出視窗
    const visible = ref(false);
    // 當前時間 (搜尋時間)
    const nowTime = dayjs().utcOffset(-4).format('YYYY-MM-DD HH:mm:ss');
    // 資料
    const data = ref<BindingData[]>([]);
    // 資料總數
    const dataTotal = ref<BindingTotal>({
      all_binding: '',
      ub_auth: '',
      sms: '',
      unbind: '',
    });

    // 表格選項
    const tableOption = reactive({
      pagination: {
        page: 1,
        size: 100,
        total: 0,
      },
      sort: {
        type: 'binding_at',
        order: 'descending',
      },
    });

    // 自訂欄位
    const { customOptions, fieldsData, isDisplayedColumns, confirm } =
      useInitCustomField(bindingFieldsInitial());

    // 設定回上一頁 query
    const querySet = new QuerySetting([
      // 廳主
      {
        key: 'domain',
        get: () => form.domain,
        set: (val: number) => {
          form.domain = val;
        },
        number: true,
        default: '',
        cached: true,
      },
      // 會員帳號
      {
        key: 'users',
        get: () => form.users,
        set: (val: string[] | string) => {
          form.users = typeof val == 'string' ? [val] : [...val];
        },
        filter: () => form.users.length > 0,
        optional: true,
        default: [],
        cached: true,
      },
      // 綁定開始時間
      {
        key: 'start_date_time',
        get: () => form.date[0],
        set: (val: string) => {
          form.date[0] = val;
        },
        filter: () => form.date.length > 0,
        optional: true,
        cached: true,
      },
      // 綁定結束時間
      {
        key: 'end_date_time',
        get: () => form.date[1],
        set: (val: string) => {
          form.date[1] = val;
        },
        filter: () => form.date.length > 0,
        optional: true,
        cached: true,
      },
      // 綁定類型
      {
        query: 'binding_type',
        key: 'mem_2fa_way',
        get: () => form.type,
        set: (val: string) => {
          form.type = val;
        },
        filter: () => form.type !== 'binding',
        default: 'binding',
      },
      // 排序
      {
        key: 'sort',
        get: () => tableOption.sort.type,
        set: (val: string) => {
          tableOption.sort.type = val || '';
        },
        default: 'binding_at',
      },
      // 排列
      {
        key: 'order',
        get: () => (tableOption.sort.order === 'descending' ? 'desc' : 'asc'),
        set: (val: string, query: { sort?: string }) => {
          if (query.sort !== '') {
            tableOption.sort.order =
              val === 'desc' ? 'descending' : 'ascending';
          }
        },
        filter: () => tableOption.sort.type !== '',
        default: 'desc',
        optional: true,
      },
      // 每頁筆數
      {
        key: 'limit',
        get: () => tableOption.pagination.size,
        set: (val: number) => {
          tableOption.pagination.size = val;
        },
        optional: true,
        required: 'api',
        number: true,
        default: 100,
      },
      // 頁數
      {
        key: 'page',
        get: () => tableOption.pagination.page,
        set: (val: number) => {
          tableOption.pagination.page = val;
        },
        optional: true,
        required: 'api',
        number: true,
        default: 1,
      },
    ]);

    // 搜尋
    const search = () => {
      watcher.queryRoute(querySet.getQuery());
    };

    // 取列表資料
    const getList = () => {
      return userAPI
        .getBindingList(form.domain, { ...querySet.getParam() })
        .then(resp => {
          if (resp.data.result) {
            data.value = resp.data.data;
            tableOption.pagination.total = data.value.length;
          }
        });
    };

    // 取總數資料
    const getTotal = () => {
      return domainAPI.getTotalBinding(form.domain).then(resp => {
        if (resp.data.result) {
          dataTotal.value = mapValues(
            resp.data.data as Record<BindingType, number>,
            value => exchangeRate(value, 1, 0),
          );
        }
      });
    };

    // 取資料
    const getSearchData = () => {
      loadingStore.page = true;
      Promise.all([getList(), getTotal()]).then(() => {
        loadingStore.page = false;
      });
    };

    // 表格搜尋
    const tableSearch = {
      // 狀態搜尋
      status(status = 'binding') {
        form.type = status;
        search();
      },
      // 頁數搜尋
      page(page: number, size?: number) {
        tableOption.pagination.page = page;
        if (size) {
          tableOption.pagination.size = size;
        }
        search();
      },
      // 排序搜尋
      sort({
        prop,
        order,
      }: {
        prop: string;
        order: 'ascending' | 'descending';
      }) {
        tableOption.sort.type = prop;
        tableOption.sort.order = order;
        tableSearch.page(1);
      },
    };

    // 匯出
    const confirmExport = (note: string) => {
      loadingStore.page = true;
      userAPI
        .exportBindingList(form.domain, {
          ...querySet.getParam(),
          export_remark: note,
        })
        .then(resp => {
          if (resp.data.result) {
            notify.success({
              title: t('success'),
              message: t('generation_success'),
            });
            visible.value = false;
            loadingStore.page = false;
          }
        });
    };

    // 判斷是否有 匯出 權限
    const checkExportPerm = computed(
      () =>
        data.value.length > 0 &&
        useAccesses(['Downloads', 'BindingDataSummaryExport']),
    );

    // 判斷是否有 會員詳細資料 權限
    const checkUserDetailPerm = useAccess('UserDetailInfo');

    // 判斷是否有 會員資料 權限
    const checkUserDataPerm = useAccess('UserData');

    watcher.setWatcher(() => {
      querySet.setField();
      getSearchData();
    });

    return {
      t,
      form,
      searched,
      visible,
      nowTime,
      data,
      dataTotal,
      tableOption,
      tableSearch,
      isDisplayedColumns,
      fieldsData,
      customOptions,
      confirm,
      confirmExport,
      checkExportPerm,
      checkUserDetailPerm,
      checkUserDataPerm,
    };
  },
});
</script>

<style lang="scss" scoped>
.binding-table {
  .header-container {
    @include flex-basic(space-between);
    width: 100%;

    &__prefix {
      @include flex-basic;
      .search-time {
        @include inline-flex-basic;

        &__title {
          @include space-multiline;
          color: $text-3;
        }
      }
    }

    &__suffix {
      @include flex-basic;
      .sms-verification {
        height: 14px;
        border-right: 1px solid $background-3;
      }

      .unbind {
        @include inline-flex-basic;
        @include space;
        font-size: 13px;
        line-height: normal;
        color: $text-3;

        &__total {
          font-size: 18px;
          font-weight: 500;
          color: $danger;
        }
      }
    }

    .prefix-item,
    .suffix-item {
      @include space-multiline;
    }
  }
  .time {
    white-space: nowrap;
  }
}
</style>
