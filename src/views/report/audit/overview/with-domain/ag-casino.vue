<template lang="pug">
rd-table(border :data="data" :span-method="mergeGrid")
  //- Game Code
  rd-table-column(
    :label="t('ag_game_code')"
    prop="wagers_type"
    align="center"
    :resizable="false"
  )
  //- 幣別
  rd-table-column(
    :label="t('currency')"
    prop="currency"
    align="center"
    :resizable="false"
  )
  //- 總注單量
  rd-table-column(
    :label="t('total_wagers_count')"
    prop="wagers_total"
    align="right"
    header-align="center"
    :resizable="false"
  )
    template(#default="{ row }")
      | {{ groupSeparator(row.wagers_total) }}
  //- 總投注額
  rd-table-column(
    :label="t('total_bet_amount')"
    prop="bet_amount"
    align="right"
    header-align="center"
    :resizable="false"
  )
    template(#default="{ row }")
      | {{ groupSeparator(row.bet_amount) }}
  //- BBIN 總派彩
  rd-table-column(
    prop="payoff"
    align="right"
    header-align="center"
    :resizable="false"
  )
    template(#header)
      .table-header
        span {{ t('bbin_payoff') }}
        rd-tooltip(placement="top")
          i.mdi.mdi-information
          template(#content)
            | {{ t('bbin_payoff_description') }}
    template(#default="{ row }")
      | {{ groupSeparator(row.payoff) }}
  //- AG 總派彩
  rd-table-column(
    prop="ag_payoff"
    align="right"
    header-align="center"
    :resizable="false"
  )
    template(#header)
      .table-header
        span {{ t('ag_payoff') }}
        rd-tooltip(placement="top")
          i.mdi.mdi-information
          template(#content)
            | {{ t('ag_payoff_description') }}
    template(#default="{ row }")
      | {{ groupSeparator(row.ag_payoff) }}
  //- 總有效投注
  rd-table-column(
    :label="t('commissionable_total')"
    prop="commissionable"
    align="right"
    header-align="center"
    :resizable="false"
  )
    template(#default="{ row }")
      | {{ groupSeparator(row.commissionable) }}
  //- 中獎彩金
  rd-table-column(
    :label="t('jp')"
    prop="jp_amount"
    align="right"
    header-align="center"
    :resizable="false"
  )
    template(#default="{ row }")
      | {{ groupSeparator(row.jp_amount) }}
  //- jackpot交收
  rd-table-column(
    :label="t('jp_draw')"
    prop="jp_draw"
    align="right"
    header-align="center"
    :resizable="false"
  )
    template(#header)
      .table-header
        span {{ t('jp_draw') }}
        rd-tooltip(placement="top")
          i.mdi.mdi-information
          template(#content)
            | {{ t('jp_draw_description') }}
    template(#default="{ row }")
      | {{ groupSeparator(row.jp_draw) }}
  //- 第一名獎勵
  rd-table-column(
    :label="t('first_prize')"
    prop="first_prize"
    align="right"
    header-align="center"
    :resizable="false"
  )
    template(#default="{ row }")
      | {{ groupSeparator(row.first_prize) }}
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { groupSeparator } from '@/components/utils/format/amount';
import type { MergingColumnItem } from '../type';

export default defineComponent({
  name: 'AgCasino',
  props: {
    data: { type: Object, required: true },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'parent' });

    const mergingColumns = computed(() =>
      props.data.reduce(
        (
          acc: MergingColumnItem[],
          current: { wagers_type: string },
          index: number,
        ) => {
          if (
            acc.find(item => item.wagers_type === current.wagers_type) ===
            undefined
          ) {
            acc.push({
              wagers_type: current.wagers_type,
              index,
              count: props.data.filter(
                (item: { wagers_type: string }) =>
                  item.wagers_type === current.wagers_type,
              ).length,
            });
          }
          return acc;
        },
        [] as MergingColumnItem[],
      ),
    );
    // merge邏輯
    const mergeGrid = ({
      rowIndex,
      columnIndex,
    }: {
      rowIndex: number;
      columnIndex: number;
    }) => {
      // game code欄位
      if (columnIndex === 0) {
        const column = mergingColumns.value.find(
          (row: MergingColumnItem) => row.index === rowIndex,
        );
        if (column !== undefined) {
          return {
            rowspan: column.count,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    };

    return { groupSeparator, t, mergeGrid };
  },
});
</script>
<style lang="scss" scoped>
.table-header {
  @include space(3px);
}
</style>
