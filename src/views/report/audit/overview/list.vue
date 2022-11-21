<template lang="pug">
rd-card(no-separateLine no-padding :title="t('total_count')")
  template(#content)
    rd-table(border :data="data")
      rd-table-column(
        :label="t('currency')"
        prop="currency"
        align="center"
        :resizable="false"
      )
      rd-table-column(
        :label="t('total_wagers_count')"
        prop="wagers_total"
        align="right"
        header-align="center"
        :resizable="false"
      )
        template(#default="{ row }")
          | {{ groupSeparator(row.wagers_total) }}
      rd-table-column(
        :label="t('total_bet_amount')"
        prop="bet_amount"
        align="right"
        header-align="center"
        :resizable="false"
      )
        template(#default="{ row }")
          | {{ groupSeparator(row.bet_amount) }}
      rd-table-column(
        :label="t('total_gold')"
        prop="payoff"
        align="right"
        header-align="center"
        :resizable="false"
      )
        template(#default="{ row }")
          | {{ groupSeparator(row.payoff) }}
      rd-table-column(
        :label="t('jp')"
        prop="jp_amount"
        align="right"
        header-align="center"
        :resizable="false"
      )
        template(#default="{ row }")
          | {{ groupSeparator(row.jp_amount) }}
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { groupSeparator } from '@/components/utils/format/amount';

export default defineComponent({
  name: 'TotalList',
  props: {
    data: { type: Array, default: () => [] },
  },
  setup() {
    const { t } = useI18n({ useScope: 'parent' });

    return { t, groupSeparator };
  },
});
</script>
