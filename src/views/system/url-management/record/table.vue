<i18n src="@/languages/system_setting/url_management/record.json"></i18n>
<template lang="pug">
.table-list
  rd-card(no-padding)
    template(#content)
      rd-table(
        border
        :data="tableData"
        :default-sort="sortCondition"
        @sort-change="quickSearch.sortTable"
      )
        rd-table-column(
          :label="t('operate_time')"
          header-align="center"
          sortable
          prop="created_at"
          :resizable="false"
          width="180px"
        )
          template(#default="{ row }")
            format-timer(:date-time="row.created_at")
        rd-table-column(
          :label="t('site')"
          header-align="center"
          prop="site_group"
          :resizable="false"
          width="250px"
        )
          template(#default="{ row }")
            span(v-if="row.site_group !== null") {{ getSiteName(row.site_group) }}
            span(v-else) {{ t('all') }}
        rd-table-column(
          :label="t('suffix')"
          header-align="center"
          prop="site"
          :resizable="false"
          width="150px"
        )
          template(#default="{ row }")
            span {{ getLoginCode(row.site_group) }}
        rd-table-column(
          :label="t('operation_item')"
          header-align="center"
          prop="operator_type"
          :resizable="false"
          width="150px"
        )
          template(#default="{ row }")
            span {{ getOperatorType(row.operator_type)?.label }}
        rd-table-column(
          :label="t('operational_content')"
          header-align="center"
          prop="content"
          min-width="250px"
          :resizable="false"
        )
          template(#default="{ row }")
            detail(
              :type="row.operator_type"
              :content="getContent(row.content)"
              @showDomainNames="showDomainNames"
            )
        rd-table-column(
          :label="t('operator')"
          header-align="center"
          prop="operator"
          :resizable="false"
          width="150px"
        )
          template(#default="{ row }")
            .column__operator-title
              span(v-if="row.operator_site === 3") {{ t('system') }}
              span(v-else-if="row.operator_site === 1") {{ t('manager') }}
              span(
                v-else-if="row.operator_site === 2 && row.domain === row.operator_id"
              ) {{ t('domain') }}
              span(v-else) {{ t('domain_sub_account') }}
            .column__operator
              span(v-if="row.operator_site !== 3")
                span(v-if="row.is_exist") {{ row.operator }}
                rd-tag.tag-advanced(v-else size="small") {{ t('account_not_exist') }}
        rd-table-column(
          :label="t('operator_ip')"
          header-align="center"
          prop="operator_ip"
          :resizable="false"
          width="150px"
        )
    template(v-if="typeof dataTotal !== 'undefined' && dataTotal > 0" #footer)
      rd-pagination(
        v-model:current-page="form.page"
        background
        :page-size="form.limit"
        :page-sizes="[30, 50, 100]"
        :total="dataTotal"
        :no-sizes="false"
        :no-total="false"
        @update:page-size="quickSearch.changeSize"
        @current-change="search"
      )
domain-dialog(v-model="visible")
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  provide,
  type Ref,
  type PropType,
} from 'vue';
import { useI18n } from 'vue-i18n';
import FormatTimer from '@/components/custom/format-timer/date-time.vue';
import type { SiteOption as SiteOptionType } from '../common/list';
import type { RecordsType, DomainNamesType, FormType } from './type';
import { useInitial } from './initial';
import Detail from './detail.vue';
import DomainDialog from './dialog.vue';

export default defineComponent({
  name: 'RecordContent',
  components: {
    FormatTimer,
    Detail,
    DomainDialog,
  },
  props: {
    tableData: {
      type: Array as PropType<RecordsType[]>,
      require: true,
    },
    dataTotal: {
      type: Number,
      require: true,
    },
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    // 站別資訊
    const siteOptions = inject('UrlManagementRecord:siteOptions') as Ref<
      SiteOptionType[]
    >;
    // 排序設定
    const sortCondition = inject('UrlManagementRecord:sortCondition') as Ref<{
      prop: string;
      order: 'ascending' | 'descending';
    }>;
    // 表單資訊
    const form = inject('UrlManagementRecord:form') as FormType;
    // 搜尋方法
    const search = inject('UrlManagementRecord:search') as Function;

    // 取後置碼
    const getLoginCode = (site: string) => {
      const siteInfo = siteOptions.value.find(item => item.value === site);
      return typeof siteInfo?.code !== 'undefined'
        ? `@${siteInfo?.code}`
        : '--';
    };

    // 取站別名稱
    const getSiteName = (site: string) => {
      const siteInfo = siteOptions.value.find(item => item.value === site);
      return typeof siteInfo?.label !== 'undefined' ? siteInfo?.label : '--';
    };

    // 取操作內容
    const getContent = (content: string) => {
      return JSON.parse(content);
    };

    // 取操作類別
    const { operatorOption, applyOption } = useInitial();
    const getOperatorType = (type: number) => {
      return applyOption
        .concat(operatorOption)
        .find(item => item.value === type);
    };

    // 快速搜尋
    const quickSearch = {
      // 重新搜尋
      research() {
        form.page = 1;
        search();
      },
      // 更改顯示筆數
      changeSize(val: number) {
        form.limit = val;
        quickSearch.research();
      },
      // 更改排序條件
      sortTable(column: { prop: string; order: string }) {
        form.sort = column.prop;
        form.order = column.order === 'descending' ? 'desc' : 'asc';
        quickSearch.research();
      },
    };

    // 顯示域名列表相關
    // 控制dialog顯示參數
    const visible = ref(false);
    // 域名資料列
    const domainNames = ref<DomainNamesType[]>([]);
    // 顯示域名dialog
    const showDomainNames = (domainName: string[]) => {
      domainNames.value = domainName.map((item, index) => {
        return {
          serial_number: index + 1,
          domain_name: item,
        };
      });
      visible.value = true;
    };
    provide('UrlManagementRecord:domainNames', domainNames);

    return {
      t,
      form,
      visible,
      showDomainNames,
      getLoginCode,
      getSiteName,
      getContent,
      getOperatorType,
      sortCondition,
      quickSearch,
      search,
    };
  },
});
</script>

<style lang="scss" scoped>
.tag-advanced {
  @include tag-color($text-4);
}
</style>
