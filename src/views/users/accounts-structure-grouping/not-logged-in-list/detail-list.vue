<i18n src="@/languages/document/currency.json"></i18n>
<i18n
  src="@/languages/user/accounts_structure_grouping/not_logged_in_list.json"
></i18n>
<template lang="pug">
rd-information(is-open)
  ul
    li {{ t('not_logged_in_list_info_1') }}
    li {{ t('not_logged_in_list_info_2') }}
    li {{ t('not_logged_in_list_info_3') }}
rd-navbar-layout(noPrePage)
  template(#header)
    .header
      .title {{ title }}
      .header__tooltip
        rd-tooltip(placement="bottom")
          i.mdi.mdi-information
          template(#content)
            | {{ titleTooltip }}
    .divider
      rd-divider.line-height(direction="vertical")
    span {{ domainName }}
  template(#titleSuffix)
    rd-button(
      v-if="hasExportPerm"
      type="primary"
      size="large"
      @click="initExport"
    ) {{ t('export') }}
  template(#body)
    rd-layout-content
      rd-card(no-padding)
        template(#header)
          field-filter(
            :fields="fieldsData"
            :defaultValue="customOptions"
            @confirm="confirm"
          )
          .rd-card__divider
            rd-divider.line-height(direction="vertical")
          .filter-button
            rd-status-button(
              :value="dayCount.total"
              :label="t('number_of_members')"
              :active="form.type === 'total'"
              @click="quickSearch.changeFilter('total')"
              @clickStatus="searchData"
            )
            rd-status-button(
              :value="dayCount.enable"
              :label="t('enable')"
              :active="form.type === 'enable'"
              @click="quickSearch.changeFilter('enable')"
              @clickStatus="searchData"
            )
            rd-status-button(
              :value="dayCount.disable"
              :label="t('disable')"
              :active="form.type === 'disable'"
              @click="quickSearch.changeFilter('disable')"
              @clickStatus="searchData"
            )
            rd-status-button(
              :value="dayCount.block"
              :label="t('block')"
              :active="form.type === 'block'"
              @click="quickSearch.changeFilter('block')"
              @clickStatus="searchData"
            )
            rd-status-button(
              :value="dayCount.bankrupt"
              :label="t('bankrupt')"
              :active="form.type === 'bankrupt'"
              @click="quickSearch.changeFilter('bankrupt')"
              @clickStatus="searchData"
            )
        template(#content)
          rd-table(
            border
            :data="detailTableData"
            :default-sort="sortCondition"
            @sort-change="quickSearch.sortTable"
          )
            rd-table-column(
              type="index"
              :label="t('increment_number')"
              header-align="center"
              :index="getIndex"
              :resizable="false"
              width="100"
            )
            rd-table-column(
              v-if="isDisplayedColumns('parent_username')"
              :label="t('parent_username')"
              header-align="center"
              prop="parent"
              :resizable="false"
            )
            rd-table-column(
              :label="t('member_account')"
              header-align="center"
              prop="username"
              sortable
              :resizable="false"
            )
            rd-table-column(
              v-if="isDisplayedColumns('currency')"
              :label="t('currency')"
              header-align="center"
              :resizable="false"
            )
              template(#default="scope")
                .table-column__currency
                  div {{ t(`currency_${scope.row.currency}`) }}
                  div [{{ scope.row.currency }}]
            rd-table-column(
              v-if="isDisplayedColumns('deposit_amount_total')"
              :label="t('deposit_amount_total')"
              header-align="center"
              align="right"
              prop="deposit_amount"
              :resizable="false"
            )
            rd-table-column(
              v-if="isDisplayedColumns('withdrawal_amount_total')"
              :label="t('withdrawal_amount_total')"
              header-align="center"
              align="right"
              prop="withdrawal_amount"
              :resizable="false"
            )
            rd-table-column(
              v-if="isDisplayedColumns('balance_difference')"
              :label="t('balance_difference')"
              header-align="center"
              align="right"
              prop="balance_difference"
              :resizable="false"
            )
            rd-table-column(
              v-if="isDisplayedColumns('status')"
              :label="t('status')"
              header-align="center"
              :resizable="false"
            )
              template(#default="scope")
                .table-column__status
                  rd-tag(v-if="scope.row.enable" type="success") {{ t('enable') }}
                  rd-tag(v-else="!scope.row.enable" type="danger") {{ t('disable') }}
                  rd-tag.tag-block(v-if="scope.row.block") {{ t('block') }}
                  rd-tag.tag-bankrupt(v-if="scope.row.bankrupt") {{ t('bankrupt') }}
                  rd-tag.tag-lock(v-if="scope.row.lock") {{ t('lock') }}
            rd-table-column(
              v-if="isDisplayedColumns('member_establish_time')"
              :label="t('member_establish_time')"
              header-align="center"
              sortable
              prop="created_at"
              :resizable="false"
            )
              template(#default="scope")
                format-timer(:date-time="scope.row.created_at")
            rd-table-column(
              :label="t('last_login_time')"
              header-align="center"
              sortable
              prop="last_login"
              :resizable="false"
            )
              template(#default="scope")
                span(v-if="scope.row.last_login === ''") --
                format-timer(v-else :date-time="scope.row.last_login")
            rd-table-column(
              :label="t('since_then_offline_days')"
              header-align="center"
              sortable
              prop="last_login"
              :resizable="false"
            )
              template(#default="scope")
                span(v-if="scope.row.offline_days === ''") --
                span(v-else) {{ scope.row.offline_days }}
        template(#footer)
          rd-pagination(
            v-model:current-page="form.page"
            background
            :page-size="form.limit"
            :page-sizes="[300, 500, 1000]"
            :total="dataTotalNum"
            :no-sizes="false"
            :no-total="false"
            @update:page-size="quickSearch.changeSize"
            @current-change="searchData"
          )
export-note(
  v-model:visible="exportVisible"
  :params="exportParams"
  @confirm="exportFiled"
)
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLoadingStore } from '@/stores/loading';
import { RouteWatch, QuerySetting } from '@/components/utils/route-watch';
import RdStatusButton from '@/components/custom/status-button/index.vue';
import FormatTimer from '@/components/custom/format-timer/date-time.vue';
import { notify } from '@/components/utils/notification';
import FieldFilter from '@/components/custom/field-filter/index.vue';
import ExportNote from '@/plugins/export-note/index.vue';
import { useInitCustomField } from '@/plugins/custom-field/custom-field';
import type { DetailListFormType, DateRangeKey, DayCountKey } from './type';
import { notLoginFieldsInitial } from './custom-fields';
import {
  useGetListApi,
  useGetDayCountApi,
  useGetDomainApi,
} from './table-data';
import { useExport } from './export';

export default defineComponent({
  name: 'NotLoggedInListDetail', // 未登入會員名單詳細列表
  components: {
    RdStatusButton,
    FormatTimer,
    ExportNote,
    FieldFilter,
  },
  setup() {
    // 字典檔
    const { t } = useI18n({ useScope: 'local' });
    const form = reactive<DetailListFormType>({
      domain: 0,
      dayGroup: '7',
      type: 'total',
      page: 1,
      limit: 300,
      sort: '',
      order: '',
    });

    // 處理loading遮罩
    const loadingStore = useLoadingStore();

    //取得Title顯示資訊
    const title = computed(() => {
      if (form.dayGroup === 'never') {
        return t('never_logged_in');
      } else if (form.dayGroup === '180up') {
        return t('180_days_ago');
      } else {
        return t('days_ago', { day: form.dayGroup });
      }
    });

    // 取天數說明
    const range = {
      '14': [7, 14],
      '30': [14, 30],
      '90': [30, 90],
      '180': [90, 180],
    } as const;
    const titleTooltip = computed(() => {
      if (form.dayGroup === '7') {
        return t('not_logged_in_tooltip_4');
      } else if (form.dayGroup === 'never') {
        return t('not_logged_in_tooltip_3');
      } else if (form.dayGroup === '180up') {
        return t('not_logged_in_tooltip_2', { date_time: updateDate.value });
      } else {
        return t('not_logged_in_tooltip_1', {
          before: range[form.dayGroup][0],
          after: range[form.dayGroup][1],
        });
      }
    });

    // 取得序號
    const getIndex = (index: number) => {
      return (form.page - 1) * form.limit + index + 1;
    };

    // 自訂欄位
    const { customOptions, fieldsData, isDisplayedColumns, confirm } =
      useInitCustomField(notLoginFieldsInitial());

    // 匯出相關
    const {
      visible: exportVisible,
      params: exportParams,
      toggleDialog,
      initExport,
      hasExportPerm,
      exportMembersLastLoginGroup,
    } = useExport();

    // 執行匯出
    const exportFiled = (note: string) => {
      toggleDialog(false);
      loadingStore.page = true;
      exportMembersLastLoginGroup(form, note).then(
        (resp: { data: { result: boolean } }) => {
          loadingStore.page = false;
          if (resp.data.result) {
            notify.success({
              title: t('success'),
              message: t('generation_success'),
            });
          }
        },
      );
    };

    // 搜尋相關
    const { detailTableData, dataTotalNum, getMembersLastLoginGroupDetail } =
      useGetListApi();
    const { dayCount, updateDate, getMembersLastLoginGroup } =
      useGetDayCountApi();
    const { domainName, getDomain } = useGetDomainApi();
    const sortCondition = reactive({
      prop: 'lock_at',
      order: 'descending' as 'ascending' | 'descending',
    });

    // 驗證必帶欄位
    const checkParams = () => {
      if (!form.domain) {
        notify.error(t('select_domain'));
        return false;
      }

      if (!form.dayGroup) {
        notify.error(t('illegal_day'));
        return false;
      }

      return true;
    };

    // 觸發搜尋
    const searchData = () => {
      watcher.queryRoute(querySet.getQuery());
    };

    // 快速搜尋
    const quickSearch = {
      // 重新搜尋
      research() {
        form.page = 1;
        searchData();
      },
      // 更改顯示筆數
      changeSize(val: number) {
        form.limit = val;
        quickSearch.research();
      },
      // 更改過濾條件
      changeFilter(type: DayCountKey) {
        form.type = type;
        quickSearch.research();
      },
      // 更改排序條件
      sortTable(column: { prop: string; order: string }) {
        form.sort = column.prop;
        form.order = column.order === 'descending' ? 'desc' : 'asc';
        quickSearch.research();
      },
    };

    // route相關
    const querySet = new QuerySetting([
      {
        key: 'domain',
        get: () => form.domain,
        set: (val: number) => {
          form.domain = val;
        },
        default: '',
        number: true,
      },
      {
        key: 'page',
        get: () => form.page,
        set: (val: number | string) => {
          form.page = Number(val);
        },
        default: 1,
      },
      {
        key: 'limit',
        get: () => form.limit,
        set: (val: number | string) => {
          form.limit = Number(val);
        },
        default: 500,
      },
      {
        key: 'day_group',
        get: () => form.dayGroup,
        set: (val: DateRangeKey) => {
          form.dayGroup = val;
        },
      },
      {
        key: 'type',
        get: () => form.type,
        set: (val: DayCountKey) => {
          form.type = val;
        },
        default: 'total',
      },
      {
        key: 'sort',
        get: () => form.sort,
        set: (val: string) => {
          form.sort = val;
          sortCondition.prop = val;
        },
        default: 'last_login',
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

    // 監聽路由異動觸發呼叫api
    const watcher = new RouteWatch();
    watcher.setWatcher(() => {
      loadingStore.page = true;
      querySet.setField();
      if (checkParams()) {
        Promise.all([
          getMembersLastLoginGroup(form),
          getMembersLastLoginGroupDetail(form),
          getDomain(form.domain),
        ]).then(() => {
          dayCount[form.type] = dataTotalNum.value;
          loadingStore.page = false;
        });
      } else {
        loadingStore.page = false;
      }
    });

    return {
      detailTableData,
      dataTotalNum,
      form,
      dayCount,
      sortCondition,
      exportVisible,
      exportParams,
      domainName,
      t,
      getIndex,
      searchData,
      quickSearch,
      title,
      initExport,
      exportFiled,
      hasExportPerm,
      titleTooltip,
      isDisplayedColumns,
      confirm,
      customOptions,
      fieldsData,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  @include flex-basic;
  .title {
    font-size: 20px;
    font-weight: normal;
    white-space: nowrap;
  }
  .header__tooltip {
    margin-left: 5px;
    font-size: 14px;
    color: $text-3;
  }
}
.divider {
  @include divider-margin-vertical(0px, 15px);
}
.rd-card__divider {
  @include divider-margin-vertical(15px, 15px);
}
.line-height {
  height: 20px;
}
.tag-block {
  @include tag-color($freeze);
}
.tag-bankrupt {
  @include tag-color($suspended);
}
.tag-lock {
  @include tag-color($locked);
}
.table-column__status > * {
  @include space-multiline;
}
.table-column__currency {
  @include flex-basic(space-between);
}
</style>
