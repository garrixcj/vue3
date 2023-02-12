<template lang="pug">
.rd-currency-icon(:class="'is-' + currency" :title="text")
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

type CurrencyType =
  | 'EUR'
  | 'GBP'
  | 'HKD'
  | 'IDR'
  | 'JPY'
  | 'KRW'
  | 'MYR'
  | 'CNY'
  | 'SGD'
  | 'THB'
  | 'TWD'
  | 'USD'
  | 'VND';

export default defineComponent({
  name: 'RdCurrencyIcon',
  props: {
    currency: {
      type: String as PropType<CurrencyType>,
      required: true,
    },
    text: {
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.rd-currency-icon {
  width: 23px;
  height: 23px;
  &.is-EUR {
    background: url('currency.png') -32px -3px;
  }
  &.is-GBP {
    background: url('currency.png') -3px -61px;
  }
  &.is-HKD {
    background: url('currency.png') -3px -32px;
  }
  &.is-IDR {
    background: url('currency.png') -32px -32px;
  }
  &.is-JPY {
    background: url('currency.png') -61px -3px;
  }
  &.is-KRW {
    background: url('currency.png') -61px -32px;
  }
  &.is-MYR {
    background: url('currency.png') -3px -3px;
  }
  &.is-CNY {
    background: url('currency.png') -32px -61px;
  }
  &.is-SGD {
    background: url('currency.png') -61px -61px;
  }
  &.is-THB {
    background: url('currency.png') -90px -3px;
  }
  &.is-TWD {
    background: url('currency.png') -90px -32px;
  }
  &.is-USD {
    background: url('currency.png') -90px -61px;
  }
  &.is-VND {
    background: url('currency.png') -3px -90px;
  }
}
</style>
