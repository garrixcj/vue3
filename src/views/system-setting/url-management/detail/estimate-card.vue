<i18n>
  {
    "zh-tw": {
      "estimate": '預估費用',
      "estimate_info": '以下為試算費用，請以實際收費金額為準 (幣別：RMB)',
      "item": "項目",
      "option": "選項",
      "cost": "費用",
      "count": "數量",
      "amount": "金額",
      "month": "月",
      "year": "年",
      "subtotal_count": "小計",
      "ways_to_purchase": "購買方式",
      "management_permission": "管理權限",
      "domain": "廳主",
    }
  }
</i18n>
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
        span.value {{ row.subtotalCount }}
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { mapKeys } from 'lodash';
import Big from 'big.js';
import { priceList, priceListDict } from '../common/estimate';
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
    count: { type: Number, required: true },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'local' });

    // 標題列
    const columns: ColumnSet[] = [
      { dataIndex: 'item', title: t('item') },
      { dataIndex: 'option', title: t('option') },
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

    const priceListByMethod = mapKeys(
      priceList,
      obj => `${obj.category}-${obj.item}-${obj.option}`,
    );

    // 資料列
    const dataSource = computed(() => {
      const result: EstimateTableData[] = [];

      // 取得購買方式的相關資訊
      if (priceListByMethod[`domainName-buy-${props.buy}`]) {
        const buyInfo = priceListByMethod[`domainName-buy-${props.buy}`];

        // 購買方式
        result.push({
          item: t(priceListDict.buy),
          option: buyInfo.option ? t(priceListDict[buyInfo.option]) : '',
          pay: buyInfo.pay,
          cost: `${exchangeRate(buyInfo.pay, 1)}/${t(
            priceListDict[buyInfo.time],
          )}`,
          count: props.count,
          amount: exchangeRate(buyInfo.pay, props.count),
        });
      }

      // 取得管理權相方式的相關資訊
      if (priceListByMethod[`domainName-management-${props.management}`]) {
        const managementInfo =
          priceListByMethod[`domainName-management-${props.management}`];

        // 管理權限
        result.push({
          item: t(priceListDict.management),
          option: managementInfo.option
            ? t(priceListDict[managementInfo.option])
            : '',
          pay: managementInfo.pay,
          cost: `${exchangeRate(managementInfo.pay, 1)}/${t(
            priceListDict[managementInfo.time],
          )}`,
          count: props.count,
          amount: exchangeRate(managementInfo.pay, props.count),
        });
      }

      return result;
    });

    // 小計標題列
    const totalColumns: ColumnSet[] = [
      {
        dataIndex: 'subtotalCount',
        align: 'right',
        customRender: { slot: 'total' },
        class: 'subtotal',
      },
    ];

    // 小計
    const totalDataSource = computed(() => {
      return {
        subtotalCount: exchangeRate(
          dataSource.value.reduce((sum: number, obj: EstimateTableData) => {
            return new Big(sum)
              .plus(new Big(obj.pay).times(obj.count))
              .toNumber();
          }, 0),
          1,
        ),
      };
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
  .subtotal {
    .label {
      padding-right: 15px;
    }
    .value {
      font-weight: 500;
    }
  }
}
</style>
