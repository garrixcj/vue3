<template lang="pug">
rd-card(no-padding)
  template(#header)
    //- 自訂欄位
    rd-field-filter(
      size="small"
      :fields="fieldsData"
      :default-value="customOptions"
      @confirm="confirm"
    )
      template(#content)
        rd-field-filter-group
    rd-divider(direction="vertical")
    //- 搜尋結果
    span.suffix {{ t('search_result_common', { num: groupSeparator(`${listCondition.total}`) }) }}

    //- 列表角度
    rd-status-button(
      v-for="(item, key) in listAnglesOptions"
      :key="key"
      :type="item.type"
      :value="listAngleTotalData[item.key]"
      :label="item.label"
      min-width="140"
      :active="item.value === listCondition.formAngle"
      @click="setListAngle(item.key, item.value)"
    )
      //- 高風險
      template(v-if="item.key === 'highRisk'" #label)
        span {{ t('high_risk') }}
        rd-tooltip(effect="dark" placement="top")
          template(#content)
            div {{ t('high_risk_tooltip') }}
            div 1. {{ t('negative_growth_of_accessed_domain_name') }}
            div 2. {{ t('much_login_fail') }}
            div 3. {{ t('much_ip_repeat') }}
          i.mdi.mdi-information.tooltip-info
    //- 匯出
    .export(v-if="hasExportPerm && listData.length > 0")
      rd-divider(direction="vertical")
      rd-button(type="default" size="small" @click="exportVisible = true") {{ t('export') }}

  template(#content)
    //- 列表資料
    rd-table(
      ref="listRef"
      border
      :data="listData"
      :default-sort="{ prop: 'rank', order: 'ascending' }"
      :min-width="1248"
      @sort-change="sortAct.change"
    )
      //- 廳主
      rd-table-column(
        :label="t('domain')"
        header-align="center"
        align="center"
        prop="domain"
        :resizable="false"
        width="80"
      )
        template(#default="{ row }")
          span {{ getDomainLabel(row.domain) }}
      //- 後置碼
      rd-table-column(
        :label="t('suffix')"
        header-align="center"
        prop="suffix"
        :resizable="false"
        width="80"
      )
        template(#default="{ row }")
          span @{{ row.suffix }}
      //- 域名
      rd-table-column(
        :label="t('domain_name')"
        header-align="center"
        prop="domainName"
        :resizable="false"
        :min-width="185"
      )
        template(#default="{ row }")
          .domain-name(v-if="row.domainName.length > 0")
            rd-link(
              v-for="(item, index) in row.domainName"
              :key="index"
              :href="`http://${item}`"
              target="_blank"
            ) {{ item }}
          div(v-else) --
      //- 異常狀態
      rd-table-column(
        :label="t('abnormal_state')"
        header-align="center"
        prop="abnormalState"
        min-width="140"
        :resizable="false"
      )
        template(#default="{ row }")
          span(v-if="row.abnormalState.length > 0")
            rd-tag.tag-container(
              v-for="(item, index) in row.abnormalState"
              :key="index"
              :type="getAbnormalStateColor(item)"
              size="small"
            ) {{ t(`url_abnormal_state_tag_${item}`) }}
          span(v-else) --
      //- 域名訪問群組
      rd-table-column(
        :label="t('domain_visited')"
        header-align="center"
        :resizable="false"
      )
        //- 排名
        rd-table-column(
          :label="t('rank')"
          header-align="center"
          align="center"
          prop="rank"
          sortable
          :resizable="false"
          width="85"
        )
        //- 訪問次數
        rd-table-column(
          v-if="isDisplayedColumns('requestTotal')"
          :label="t('visited_num')"
          header-align="center"
          align="right"
          prop="requestTotal"
          sortable
          :resizable="false"
          width="120"
        )
          template(#default="{ row }")
            span {{ groupSeparator(row.requestTotal) }}
        //- 佔比
        rd-table-column(
          v-if="isDisplayedColumns('requestRatio')"
          :label="t('percent')"
          header-align="center"
          align="right"
          prop="requestRatio"
          sortable
          :resizable="false"
          width="120"
        )
          template(#default="{ row }")
            span {{ isInteger(row.requestRatio) ? `${groupSeparator(row.requestRatio)}.00` : groupSeparator(row.requestRatio) }}
        //- 成長％數
        rd-table-column(
          :label="t('growing_percent')"
          header-align="center"
          align="right"
          prop="requestGrow"
          sortable
          :resizable="false"
          width="120"
        )
          template(#default="{ row }")
            span(
              :class="{ 'red-font': row.requestGrow < 0 && row.requestGrow !== -Infinity }"
            ) {{ isInteger(row.requestGrow) ? `${groupSeparator(row.requestGrow)}.00` : groupSeparator(row.requestGrow) }}
      //- 登入成功群組
      rd-table-column(
        :label="t('login_result_1')"
        header-align="center"
        :resizable="false"
      )
        //- 訪問次數
        rd-table-column(
          v-if="isDisplayedColumns('loginPassTotal')"
          :label="t('login_num')"
          header-align="center"
          align="right"
          prop="loginPassTotal"
          sortable
          :resizable="false"
          width="120"
        )
          template(#default="{ row }")
            span {{ groupSeparator(row.loginPassTotal) }}
        //- 佔比
        rd-table-column(
          v-if="isDisplayedColumns('loginPassRatio')"
          :label="t('percent')"
          header-align="center"
          align="right"
          prop="loginPassRatio"
          sortable
          :resizable="false"
          width="120"
        )
          template(#default="{ row }")
            span {{ isInteger(row.loginPassRatio) ? `${groupSeparator(row.loginPassRatio)}.00` : groupSeparator(row.loginPassRatio) }}
        //- 成長％數
        rd-table-column(
          :label="t('growing_percent')"
          header-align="center"
          align="right"
          prop="loginPassGrow"
          sortable
          :resizable="false"
          width="120"
        )
          template(#default="{ row }")
            span(
              :class="{ 'red-font': row.loginPassGrow < 0 && row.loginPassGrow !== -Infinity }"
            ) {{ isInteger(row.loginPassGrow) ? `${groupSeparator(row.loginPassGrow)}.00` : groupSeparator(row.loginPassGrow) }}
      //- 登入失敗群組
      rd-table-column(
        :label="t('login_fail')"
        header-align="center"
        :resizable="false"
      )
        //- 訪問次數
        rd-table-column(
          v-if="isDisplayedColumns('loginFailTotal')"
          :label="t('login_num')"
          header-align="center"
          align="right"
          prop="loginFailTotal"
          sortable
          :resizable="false"
          width="120"
        )
          template(#default="{ row }")
            span {{ groupSeparator(row.loginFailTotal) }}
        //- 佔比
        rd-table-column(
          v-if="isDisplayedColumns('loginFailRatio')"
          :label="t('percent')"
          header-align="center"
          align="right"
          prop="loginFailRatio"
          sortable
          :resizable="false"
          width="120"
        )
          template(#default="{ row }")
            span {{ isInteger(row.loginFailRatio) ? `${groupSeparator(row.loginFailRatio)}.00` : groupSeparator(row.loginFailRatio) }}
        //- 成長％數
        rd-table-column(
          :label="t('growing_percent')"
          header-align="center"
          align="right"
          prop="loginFailGrow"
          sortable
          :resizable="false"
          width="120"
        )
          template(#default="{ row }")
            span(
              :class="{ 'red-font': row.loginFailGrow < 0 && row.loginFailGrow !== -Infinity }"
            ) {{ isInteger(row.loginFailGrow) ? `${groupSeparator(row.loginFailGrow)}.00` : groupSeparator(row.loginFailGrow) }}
      //- 風險
      rd-table-column(
        :label="t('risk')"
        header-align="center"
        align="center"
        prop="risk"
        :resizable="false"
        width="100"
      )
        template(#default="{ row }")
          .risk
            rd-tooltip(placement="bottom" :content="t('much_login_fail')")
              i.mdi.mdi-account-remove.risk__icon(
                :class="{ 'is-abnormal': row.failTag }"
              )
            rd-tooltip(placement="bottom" :content="t('much_ip_repeat')")
              i.mdi.mdi-ip.risk__icon(:class="{ 'is-abnormal': row.ipTag }")
export-note(
  v-model:visible="exportVisible"
  :params="exportParams"
  @confirm="exportFiled"
)
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { isInteger } from 'lodash';
import { type Ref, defineComponent, inject, ref } from 'vue';
import RdStatusButton from '@/components/custom/status-button/index.vue';
import RdFieldFilter from '@/components/custom/field-filter/index.vue';
import RdFieldFilterGroup from '@/components/custom/field-filter/group.vue';
import { ElTable } from 'element-plus';
import { groupSeparator } from '@/components/utils/format/amount';
import { useInitCustomField } from '@/plugins/custom-field/custom-field';
import ExportNote from '@/plugins/export-note/index.vue';
import { initialActiveDomainNameFields } from '../common/custom-fields';
import { useExportAccesses } from '../common/export';
import type { DomainOption } from '@/plugins/domain-selector/domain';
import type { ActiveDomainNameListData } from '../common/type';
import type { ListCondition } from './list';

type ListAngles = 'all' | 'normal' | 'highRisk';
type ListAnglesValue = 'all' | 1 | 2;

type ListAnglesOptions = {
  label: string;
  value: ListAnglesValue;
  key: ListAngles;
  type: 'default' | 'danger';
};

export default defineComponent({
  name: 'ActiveDomainNameTable', // 網址管理 - 活躍域名
  components: {
    RdStatusButton,
    RdFieldFilter,
    RdFieldFilterGroup,
    ExportNote,
  },
  emits: ['change', 'export', 'sortChange'],
  setup(props, { emit, expose }) {
    const { t } = useI18n({ useScope: 'parent' });
    // 取得異常狀態色系
    const getAbnormalStateColor = inject(
      'UrlManagement:getAbnormalStateColor',
    ) as Function;

    // 廳主列表
    const domainList = inject<Ref<DomainOption[]>>(
      'ActiveDomainName:domainList',
    );
    // 取得廳主名稱
    const getDomainLabel = (id: number) => {
      return domainList?.value.find(item => item.value === id)?.label;
    };

    // 原始列表資料
    const listData = inject(
      'ActiveDomainName:listData',
    ) as ActiveDomainNameListData[];

    const listRef = ref<InstanceType<typeof ElTable>>();
    const sortAct = {
      // 預設排序
      defaultSort: (prop: string, order: 'ascending' | 'descending') => {
        listRef.value?.sort(prop, order);
      },
      change: ({
        prop,
        order,
      }: {
        order: 'ascending' | 'descending' | null;
        prop: 'rank';
      }) => {
        if (order === null) {
          sortAct.defaultSort('rank', 'ascending');
        }
        emit('sortChange', prop, order);
      },
      clear: () => {
        listCondition.sort = 'rank';
        listCondition.order = 'asc';
        listRef.value?.clearSort();
      },
    };

    const listCondition = inject(
      'ActiveDomainName:listCondition',
    ) as ListCondition;
    // 列表角度總數資料
    const listAngleTotalData = inject(
      'ActiveDomainName:listAngleTotalData',
    ) as Record<ListAngles, number>;
    // 列表角度選項
    const listAnglesOptions = ref<ListAnglesOptions[]>([
      { label: t('all'), value: 'all', key: 'all', type: 'default' },
      { label: t('normal'), value: 1, key: 'normal', type: 'default' },
      { label: t('high_risk'), value: 2, key: 'highRisk', type: 'danger' },
    ]);
    // 設定列表角度
    const setListAngle = (key: ListAngles, value: ListAnglesValue) => {
      listCondition.total = listAngleTotalData[key];
      listCondition.formAngle = value;
      emit('change');
    };

    // 自訂欄位
    const { customOptions, fieldsData, isDisplayedColumns, confirm } =
      useInitCustomField(initialActiveDomainNameFields(t));

    // 匯出相關
    const hasExportPerm = useExportAccesses('ActiveUrlExport');
    const exportVisible = ref(false);
    const exportParams = {
      functionName: 'url_management',
      tabName: 'active_url',
    } as const;
    // 執行匯出
    const exportFiled = (note: string) => {
      exportVisible.value = false;
      emit('export', note);
    };

    // 重置捲軸高度
    const scrollTo = () => {
      listRef.value?.setScrollLeft(0);
    };
    // 封裝外部使用功能
    expose({
      scrollTo,
      sortClear: sortAct.clear,
      defaultSort: sortAct.defaultSort,
    });

    return {
      t,
      // API 資料
      listRef,
      listData,
      listCondition,
      sortAct,
      groupSeparator,
      getAbnormalStateColor,
      getDomainLabel,
      isInteger,
      // 切換角度
      listAngleTotalData,
      listAnglesOptions,
      setListAngle,
      // 自訂欄位
      customOptions,
      fieldsData,
      isDisplayedColumns,
      confirm,
      // 匯出
      exportVisible,
      exportParams,
      hasExportPerm,
      exportFiled,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  @include flex-basic(space-between);
  .suffix {
    margin-right: auto;
  }
}
.red-font {
  color: $danger;
}
.risk {
  @include space;
  &__icon {
    font-size: 20px;
    color: $background-3;
  }
  .is-abnormal {
    color: $danger;
  }
}
</style>
