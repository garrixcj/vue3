<template lang="pug">
.not-logged-in-list__table
  rd-card(no-padding)
    template(#content)
      .top-bar
        field-filter(
          :fields="fieldsData"
          :defaultValue="customOptions"
          @confirm="confirm"
        )
      rd-table(
        border
        show-summary
        :data="tableData"
        :sum-text="t('total_count')"
      )
        rd-table-column(
          :label="t('since_then_offline_days')"
          header-align="center"
          prop="day_group"
          :resizable="false"
        )
          template(#default="scope")
            span(v-if="scope.row.day_group === 'never'") {{ t('never_logged_in') }}
            span(v-else-if="scope.row.day_group === '180up'") {{ t('180_days_ago') }}({{ t('estimated_value') }})
            span(v-else) {{ t('days_ago', { day: scope.row.day_group }) }}
            .table-column__tooltip
              rd-tooltip(placement="top")
                i.mdi.mdi-information
                template(#content)
                  | {{ getRangeContent(scope.row.day_group, scope.row.update_at) }}
        rd-table-column(
          :label="t('number_of_members')"
          header-align="center"
          align="right"
          prop="total"
          :resizable="false"
        )
          template(#default="scope")
            rd-button.custom-text(
              text
              @click="guideDetail(scope.row.day_group, 'total')"
            ) {{ scope.row.total }}
        rd-table-column(
          v-if="isDisplayedColumns('enable')"
          :label="t('enable')"
          header-align="center"
          align="right"
          prop="enable_total"
          :resizable="false"
        )
          template(#default="scope")
            rd-button.custom-text(
              text
              @click="guideDetail(scope.row.day_group, 'enable')"
            ) {{ scope.row.enable_total }}
        rd-table-column(
          v-if="isDisplayedColumns('disable')"
          :label="t('disable')"
          header-align="center"
          align="right"
          prop="disable_total"
          :resizable="false"
        )
          template(#default="scope")
            rd-button.custom-text(
              text
              @click="guideDetail(scope.row.day_group, 'disable')"
            ) {{ scope.row.disable_total }}
        rd-table-column(
          v-if="isDisplayedColumns('block')"
          :label="t('block')"
          header-align="center"
          align="right"
          prop="block_total"
          :resizable="false"
        )
          template(#default="scope")
            rd-button.custom-text(
              text
              @click="guideDetail(scope.row.day_group, 'block')"
            ) {{ scope.row.block_total }}
        rd-table-column(
          v-if="isDisplayedColumns('bankrupt')"
          :label="t('bankrupt')"
          header-align="center"
          align="right"
          prop="bankrupt_total"
          :resizable="false"
        )
          template(#default="scope")
            rd-button.custom-text(
              text
              @click="guideDetail(scope.row.day_group, 'bankrupt')"
            ) {{ scope.row.bankrupt_total }}
        rd-table-column(
          v-if="isDisplayedColumns('locked')"
          :label="t('lock')"
          header-align="center"
          align="right"
          prop="locked_total"
          :resizable="false"
        )
        rd-table-column(
          v-if="hasExportPerm"
          :label="t('operating')"
          header-align="center"
          align="center"
          :resizable="false"
        )
          template(#default="scope")
            rd-button.custom-text(
              text
              @click="checkExport(scope.row.day_group)"
            ) {{ t('export') }}
  export-note(
    v-model:visible="exportVisible"
    :params="exportParams"
    @confirm="exportFiled"
  )
</template>

<script lang="ts">
import { defineComponent, inject, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import FormatTimer from '@/components/custom/format-timer/date-time.vue';
import { notify } from '@/components/utils/notification';
import FieldFilter from '@/components/custom/field-filter/index.vue';
import ExportNote from '@/plugins/export-note/index.vue';
import { useInitCustomField } from '@/plugins/custom-field/custom-field';
import type { TableDataType, DetailListFormType, DateRangeKey } from './type';
import { notLoginCountFieldsInitial } from './custom-fields';
import { useExport } from './export';

export default defineComponent({
  name: 'NotLoggedInListTable', // 未登入會員名單統計列表
  components: {
    FormatTimer,
    ExportNote,
    FieldFilter,
  },
  props: {
    tableData: {
      type: Array as PropType<TableDataType[]>,
      require: true,
    },
  },
  setup() {
    // 預設載入
    const setLoading = inject('AccountsStructureGroup:setLoading') as Function;
    const form = inject(
      'AccountsStructureGroup:formSearchValue',
    ) as DetailListFormType;

    // 字典檔
    const { t } = useI18n({ useScope: 'parent' });

    // 組另開分頁連結
    const guideDetail = (dayGroup: string, type: string) => {
      window.open(
        `/v3/members/not_logged_in/structure_grouping/detail?domain=${form.domain}&day_group=${dayGroup}&type=${type}`,
      );
    };

    // 取天數說明
    const getRangeContent = (dayGroup: DateRangeKey, updateDate = '') => {
      let content = '';
      const range = {
        '14': [7, 14],
        '30': [14, 30],
        '90': [30, 90],
        '180': [90, 180],
      } as const;
      switch (dayGroup) {
        case '7':
          content = t('not_logged_in_tooltip_4');
          break;
        case 'never':
          content = t('not_logged_in_tooltip_3');
          break;
        case '180up':
          content = t('not_logged_in_tooltip_2', { date_time: updateDate });
          break;
        default:
          content = t('not_logged_in_tooltip_1', {
            before: range[dayGroup][0],
            after: range[dayGroup][1],
          });
          break;
      }
      return content;
    };

    // 自訂欄位
    const { customOptions, fieldsData, isDisplayedColumns, confirm } =
      useInitCustomField(notLoginCountFieldsInitial());

    // 匯出相關
    const {
      visible: exportVisible,
      params: exportParams,
      toggleDialog,
      initExport,
      hasExportPerm,
      exportMembersLastLoginGroup,
    } = useExport();

    // 點擊觸發匯出初始設定
    const dayGroupParam = ref<DateRangeKey>('7');
    const checkExport = (dayGroup: DateRangeKey) => {
      initExport();
      dayGroupParam.value = dayGroup;
    };

    // 執行匯出
    const exportFiled = (note: string) => {
      toggleDialog(false);
      setLoading(true);
      const params = { ...form };
      params.dayGroup = dayGroupParam.value;
      exportMembersLastLoginGroup(params, note).then(resp => {
        setLoading(false);
        if (resp.data.result) {
          notify.success({
            title: t('success'),
            message: t('generation_success'),
          });
        }
      });
    };

    return {
      exportVisible,
      exportParams,
      t,
      exportFiled,
      checkExport,
      guideDetail,
      hasExportPerm,
      getRangeContent,
      isDisplayedColumns,
      confirm,
      customOptions,
      fieldsData,
    };
  },
});
</script>

<style lang="scss" scoped>
.not-logged-in-list__table {
  .top-bar {
    @include inline-flex-basic;
    margin: 15px;
  }

  .table-column__tooltip {
    @include inline-flex-basic;
    margin: 0 5px;
    color: $text-3;
  }
}
</style>
