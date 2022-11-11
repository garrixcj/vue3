<template lang="pug">
rd-card.estimate-card(:title="t('estimate')" :sub-title="t('estimate_info')")
  template(#content)
    //- 資料列
    rd-grid-table(
      :columns="columns"
      :row="{ background: 'grey' }"
      :data-source="dataSource"
    )
    rd-grid-table-row(
      :columns="totalColumns"
      :row="{ background: 'white' }"
      :data-source="totalDataSource"
    )
      template(#total="{ row }")
        span.label {{ t('subtotal_count') }}
        span.value {{ row.subtotal }}
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import Big from 'big.js';
import {
  priceListByMethod,
  priceListDict,
  type PriceListType,
} from '../common/estimate';
import type { BasicSetting, EstimateTableData } from './detail';
import { exchangeRate } from '@/components/utils/format/amount';
import RdGridTable from '@/components/custom/grid-table/index.vue';
import RdGridTableRow from '@/components/custom/grid-table/row.vue';
import type { ColumnSet } from '@/components/custom/grid-table/grid-table';

export default defineComponent({
  name: 'UrlManagementEstimateCard',
  components: {
    RdGridTable,
    RdGridTableRow,
  },
  props: {
    // 選擇的購買方式
    buy: {
      type: String as PropType<BasicSetting['buy']>,
      required: true,
    },
    // 選擇的管理權限
    management: {
      type: String as PropType<BasicSetting['management']>,
      required: true,
    },
    // 數量
    count: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'local' });

    // 標題列
    const columns: ColumnSet[] = [
      {
        dataIndex: 'item',
        title: t('item'),
      },
      {
        dataIndex: 'option',
        title: t('option'),
      },
      {
        dataIndex: 'cost',
        title: t('cost'),
        align: 'right',
        titleAlign: 'right',
      },
      {
        dataIndex: 'count',
        title: t('count'),
        align: 'right',
        titleAlign: 'right',
      },
      {
        dataIndex: 'amount',
        title: t('amount'),
        align: 'right',
        titleAlign: 'right',
      },
    ];

    // 依照各類型的選擇組出資料
    const singleDataSource = (
      item: NonNullable<PriceListType['item']>,
      option: NonNullable<PriceListType['option']>,
    ): EstimateTableData | null => {
      let result = null;

      // 不用錢的組合不在列表裡，所以要過濾(ex: 購買方式為domain)
      if (priceListByMethod[`domainName-${item}-${option}`]) {
        const { pay, time } = priceListByMethod[`domainName-${item}-${option}`];

        result = {
          item: t(priceListDict[item]),
          option: t(priceListDict[option]),
          pay: pay,
          cost: `${exchangeRate(pay, 1)}/${t(priceListDict[time])}`,
          count: props.count,
          amount: exchangeRate(pay, props.count),
        };
      }

      return result;
    };

    // 資料列
    const dataSource = computed(() => {
      const result: EstimateTableData[] = [];

      // 取得購買方式的相關資訊
      const buyInfo = singleDataSource('buy', props.buy);
      if (buyInfo) {
        result.push(buyInfo);
      }

      // 取得管理權相方式的相關資訊
      const managementInfo = singleDataSource('management', props.management);
      if (managementInfo) {
        result.push(managementInfo);
      }
      return result;
    });

    // 小計標題列
    const totalColumns: ColumnSet[] = [
      {
        dataIndex: 'subtotal',
        align: 'right',
        customRender: { slot: 'total' },
        class: 'subtotal',
      },
    ];

    // 小計
    const totalDataSource = computed(() => {
      const subtotal = dataSource.value.reduce(
        (sum: number, obj: EstimateTableData) => {
          const pay = new Big(obj.pay).times(obj.count);

          return new Big(sum).plus(pay).toNumber();
        },
        0,
      );

      return { subtotal: exchangeRate(subtotal, 1) };
    });

    return {
      t,
      columns,
      dataSource,
      totalColumns,
      totalDataSource,
    };
  },
});
</script>

<style lang="scss" scoped>
.estimate-card {
  :deep(.subtotal) {
    @include space(15px);

    .value {
      font-weight: 500;
    }
  }
}
</style>
