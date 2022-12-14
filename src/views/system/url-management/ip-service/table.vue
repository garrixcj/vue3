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
    rd-divider(direction="vertical")
    //- 搜尋結果
    span.suffix {{ t('search_result_common', { num: groupSeparator(`${listCondition.total}`) }) }}

    //- 列表角度
    rd-status-button(
      v-for="(item, key) in listAnglesOptions"
      :key="key"
      :type="item.type"
      :value="listAngleTotalData[item.value]"
      :label="item.label"
      min-width="140"
      :active="item.value === listCondition.formAngle"
      @click="setListAngle(item.value)"
    )
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
      :default-sort="{ prop: 'id', order: 'ascending' }"
      :max-height="800"
      :min-width="1248"
    )
      //- 序號
      rd-table-column(
        v-if="isDisplayedColumns('id')"
        :label="t('increment_number')"
        header-align="center"
        align="center"
        prop="id"
        :resizable="false"
        width="60"
      )
        template(#default="{ row }")
          span {{ row.id + 1 }}
      //- 站別名稱
      rd-table-column(
        v-if="isDisplayedColumns('site')"
        :label="t('site')"
        header-align="center"
        prop="site"
        min-width="120"
        :resizable="false"
      )
        template(#default="{ row }")
          span {{ row.siteName }}
      //- 後置碼
      rd-table-column(
        v-if="isDisplayedColumns('suffix')"
        :label="t('suffix')"
        header-align="center"
        prop="suffix"
        :resizable="false"
        width="80"
      )
        template(#default="{ row }")
          span @{{ row.suffix }}
      //- IP類型
      rd-table-column(
        v-if="isDisplayedColumns('ipType')"
        :label="t('ip_type')"
        header-align="center"
        prop="ipType"
        :resizable="false"
        width="130"
      )
        template(#default="{ row }")
          span {{ getIPTypeDict(row.ipType) }}
      //- 購買方式
      rd-table-column(
        v-if="isDisplayedColumns('purchaseMethod')"
        :label="t('ways_to_purchase')"
        header-align="center"
        prop="purchaseMethod"
        :resizable="false"
        width="100"
      )
        template(#default="{ row }")
          span(v-if="row.purchaseMethod === 2") {{ t('purchase') }}
          span(v-else-if="row.purchaseMethod === 1") {{ t('default') }}
          span(v-else) --
      //- IPV4
      rd-table-column(
        v-if="isDisplayedColumns('ipv4')"
        label="IPv4"
        header-align="center"
        prop="ipv4"
        :resizable="false"
        width="140"
      )
        template(#default="{ row }")
          span(v-if="row.ipv4.length > 0")
            .ip(v-for="(item, index) in row.ipv4" :key="index") {{ item }}
          span(v-else) --
      //- IPv6
      rd-table-column(
        v-if="isDisplayedColumns('ipv6')"
        label="IPv6"
        header-align="center"
        prop="ipv6"
        :resizable="false"
        width="310"
      )
        template(#default="{ row }")
          span(v-if="row.ipv6.length > 0")
            .ip(v-for="(item, index) in row.ipv6" :key="index") {{ item }}
          span(v-else) --
      //- 攻擊狀態
      rd-table-column(
        v-if="isDisplayedColumns('attackStatus')"
        :label="t('attack_status')"
        header-align="center"
        prop="ipv6"
        :resizable="false"
        width="310"
      )
        template(#default="{ row }")
          span(v-if="getAttackStatus(row.attackStatus).length > 0")
            .attack-status(
              v-for="(item, index) in getAttackStatus(row.attackStatus)"
              :key="index"
            )
              span.attack(v-if="item === 2") {{ t('attacking') }}
          span(v-else) --
      //- 域名
      rd-table-column(
        v-if="isDisplayedColumns('domainName')"
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
  template(#footer)
    rd-pagination(
      v-model:current-page="listCondition.page"
      background
      no-total
      :page-size="listCondition.size"
      :page-sizes="[30, 50, 100]"
      :total="listCondition.total"
      @update:page-size="tableAct.page"
      @current-change="tableAct.size"
    )
export-note(
  v-model:visible="exportVisible"
  :params="exportParams"
  @confirm="exportFiled"
)
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { isEmpty } from 'lodash';
import { defineComponent, inject, ref } from 'vue';
import RdStatusButton from '@/components/custom/status-button/index.vue';
import RdFieldFilter from '@/components/custom/field-filter/index.vue';
import { ElTable } from 'element-plus';
import { groupSeparator } from '@/components/utils/format/amount';
import { useInitCustomField } from '@/plugins/custom-field/custom-field';
import ExportNote from '@/plugins/export-note/index.vue';
import { ipServiceFieldsInitial } from '../common/custom-fields';
import { useExportAccesses } from '../common/export';
import type { IPServiceListData } from '../common/type';
import type { AdvancedConditionsOptions } from '../common/list';
import type { ListCondition } from './list';

type ListAngles = 'all' | 'oneToOne' | 'oneToMany';

type ListAnglesOptions = {
  label: string;
  value: ListAngles;
  type: 'default';
};

export default defineComponent({
  name: 'IPServiceTable', // 網址管理 - IP服務
  components: {
    RdStatusButton,
    RdFieldFilter,
    ExportNote,
  },
  emits: ['change', 'export'],
  setup(props, { emit, expose }) {
    const { t } = useI18n({ useScope: 'parent' });
    // 進階條件
    const advancedConditions = inject(
      'UrlManagement:advancedConditions',
    ) as AdvancedConditionsOptions;

    // 原始列表資料
    const listData = inject('IPService:listData') as IPServiceListData[];

    const listRef = ref<InstanceType<typeof ElTable>>();

    const listCondition = inject('IPService:listCondition') as ListCondition;
    // 列表角度總數資料
    const listAngleTotalData = inject('IPService:listAngleTotalData') as Record<
      ListAngles,
      number
    >;
    // 列表角度選項
    const listAnglesOptions = ref<ListAnglesOptions[]>([
      { label: t('all_ip'), value: 'all', type: 'default' },
      { label: t('one_to_one_ip'), value: 'oneToOne', type: 'default' },
      { label: t('one_to_many_ip'), value: 'oneToMany', type: 'default' },
    ]);
    // 設定列表角度
    const setListAngle = (value: ListAngles) => {
      listCondition.page = 1;
      listCondition.total = listAngleTotalData[value];
      listCondition.formAngle = value;
      emit('change');
    };

    // table 動作
    const tableAct = {
      page: (value: number) => {
        listCondition.page = value;
        emit('change');
      },
      size: (value: number) => {
        listCondition.page = 1;
        listCondition.size = value;
        emit('change');
      },
    };

    // 自訂欄位
    const { customOptions, fieldsData, isDisplayedColumns, confirm } =
      useInitCustomField(ipServiceFieldsInitial(t));

    // 匯出相關
    const hasExportPerm = useExportAccesses('UrlIpServiceExport');
    const exportVisible = ref(false);
    const exportParams = {
      functionName: 'url_management',
      tabName: 'ip_service',
    } as const;
    // 執行匯出
    const exportFiled = (note: string) => {
      exportVisible.value = false;
      emit('export', note);
    };

    // 取得IP類型對應字典
    const getIPTypeDict = (id: number) => {
      if (!isEmpty(advancedConditions.ipType)) {
        return advancedConditions.ipType?.filter(item => item.label === id)[0]
          .dict;
      }
      return '--';
    };

    // 取得有效的攻擊狀態資訊
    const getAttackStatus = (data: number[]) => {
      return data.length > 0 && data[0] > 1 ? data : [];
    };

    // 重置捲軸高度
    const scrollTo = () => {
      listRef.value?.setScrollTop(0);
      listRef.value?.setScrollLeft(0);
    };
    // 封裝外部使用功能
    expose({
      scrollTo,
    });

    return {
      t,
      // API 資料
      listRef,
      listData,
      listCondition,
      groupSeparator,
      tableAct,
      getIPTypeDict,
      getAttackStatus,
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
.domain-name {
  @include flex-basic(flex-start, flex-start);
  flex-direction: column;
}
</style>
