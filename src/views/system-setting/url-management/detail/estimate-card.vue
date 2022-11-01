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
    //- 小計列
    rd-grid-table.subtotal-table(
      no-header
      :columns="totalColumns"
      :row="{ background: 'none' }"
      :data-source="totalDataSource"
    )
      template(#total="{ row }")
        span.label {{ t('subtotal_count') }}
        span.value {{ row.subtotalCount }}
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEstimate } from '../estimate';
import type { BasicSetting } from './detail';
import { exchangeRate } from '@/components/utils/format/amount';
import RdGridTable from '@/components/custom/grid-table/index.vue';

export default defineComponent({
  name: 'UrlManagementEstimateCard',
  components: {
    RdGridTable,
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
    const { getEstimateOfChoice, getDict } = useEstimate();

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
    const buyInfo = getEstimateOfChoice('domainName', 'buy', props.buy);

    // 取得管理權相方式的相關資訊
    const managementInfo = getEstimateOfChoice(
      'domainName',
      'management',
      props.management,
    );

    // 資料列
    const dataSource = computed(() => {
      const result = [];

      // 購買方式
      if (buyInfo) {
        result.push({
          item: t(getDict(buyInfo.item)),
          option: t(getDict(buyInfo.option)),
          cost: `${exchangeRate(buyInfo.pay, 1)}/${t(getDict(buyInfo.time))}`,
          count: props.count,
          amount: exchangeRate(buyInfo.pay, props.count),
        });
      }

      // 管理權限
      if (managementInfo) {
        result.push({
          item: t(getDict(managementInfo.item)),
          option: t(getDict(managementInfo.option)),
          cost: `${exchangeRate(managementInfo.pay, 1)}/${t(
            getDict(managementInfo.time),
          )}`,
          count: props.count,
          amount: exchangeRate(managementInfo.pay, props.count),
        });
      }

      return result;
    });

    // 小計標題列
    const totalColumns = [
      {
        dataIndex: 'subtotalCount',
        align: 'right',
        customRender: { slot: 'total' },
        class: 'subtotal',
      },
    ];

    // 小計
    const totalDataSource = computed(() => {
      const buyPay = buyInfo ? buyInfo.pay : 0;
      const managementPay = managementInfo ? managementInfo.pay : 0;

      return [
        {
          subtotalCount: exchangeRate(buyPay + managementPay, props.count),
        },
      ];
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
  .content {
    .subtotal-table {
      .subtotal {
        .label {
          padding-right: 15px;
        }
        .value {
          font-weight: 500;
        }
      }
    }
  }
}
</style>
