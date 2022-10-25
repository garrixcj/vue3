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
      "domain": "廳主"
    }
  }
</i18n>
<template lang="pug">
rd-card.estimate-card(:title="t('estimate')" :sub-title="t('estimate_info')")
  template(#content)
    rd-grid-table(
      :columns="columns"
      :row="{ background: 'grey' }"
      :data-source="dataSource"
    )
    .total
      span.label {{ t('subtotal_count') }}
      span.value {{ subtotalCount }}
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { estimate } from '../estimate';
import { exchangeRate } from '@/components/utils/format/amount';
import RdGridTable from '@/components/custom/grid-table/index.vue';

export default defineComponent({
  name: 'UrlManagementEstimateCard',
  components: {
    RdGridTable,
  },
  props: {
    // 選擇的購買方式
    buyOption: { type: String, required: true },
    // 選擇的管理權限
    managementOption: { type: String, required: true },
    // 數量
    count: { type: Number, required: true },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'local' });
    const { getEstimateOfChoice, getDict } = estimate();

    // 標題列
    const columns = [
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

    // 取得購買方式的相關資訊
    const buyInfo = getEstimateOfChoice('domainName', 'buy', props.buyOption);

    // 取得管理權相方式的相關資訊
    const managementInfo = getEstimateOfChoice(
      'domainName',
      'management',
      props.buyOption,
    );

    // 資料列
    const dataSource = computed(() => [
      {
        item: getDict('item', buyInfo.item),
        option: getDict('option', buyInfo.option),
        cost: `${exchangeRate(buyInfo.pay, 1)}/${getDict(
          'time',
          buyInfo.time,
        )}`,
        count: props.count,
        amount: exchangeRate(buyInfo.pay, props.count),
      },
      {
        item: getDict('item', managementInfo.item),
        option: getDict('option', managementInfo.option),
        cost: `${exchangeRate(managementInfo.pay, 1)}/${getDict(
          'time',
          managementInfo.time,
        )}`,
        count: props.count,
        amount: exchangeRate(managementInfo.pay, props.count),
      },
    ]);

    // 小計
    const subtotalCount = exchangeRate(
      buyInfo.pay + managementInfo.pay,
      props.count,
    );

    return {
      t,
      columns,
      dataSource,
      subtotalCount,
    };
  },
});
</script>

<style lang="scss" scoped>
.estimate-card {
  .content {
    .total {
      display: flex;
      justify-content: end;
      padding: 9px 15px;
      .label {
        padding-right: 15px;
      }
      .value {
        font-weight: 500;
      }
    }
  }
}
</style>
