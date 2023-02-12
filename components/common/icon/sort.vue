<template lang="pug">
span.caret-wrapper(:class="[orderClass]" @click="nextOrder()")
  i.sort-caret.ascending(@click.stop="handleClick('ascending')")
  i.sort-caret.descending(@click.stop="handleClick('descending')")
</template>

<script lang="ts">
import { type PropType, defineComponent, computed } from 'vue';

type Orders = null | 'ascending' | 'descending';

export default defineComponent({
  name: 'RdSort',
  props: {
    modelValue: { type: String as PropType<Orders>, default: null },
  },
  emits: ['change', 'update:model-value'],
  setup(props, { emit }) {
    const orderClass = computed(() => {
      return props.modelValue !== null ? `is-${props.modelValue}` : '';
    });

    const handleClick = (newOrder: Orders) => {
      const order = props.modelValue === newOrder ? null : newOrder;
      emit('change', order);
      emit('update:model-value', order);
    };

    // 切換至下一個排序(順序: null -> asc -> desc -> null)
    const nextOrder = () => {
      let order = null;
      if (props.modelValue === 'ascending') {
        order = 'descending';
      } else if (props.modelValue === null) {
        order = 'ascending';
      }
      emit('change', order);
      emit('update:model-value', order);
    };

    return {
      orderClass,
      handleClick,
      nextOrder,
    };
  },
});
</script>

<style lang="scss" scoped>
.caret-wrapper {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  height: 14px;
  overflow: initial;
  vertical-align: middle;
  cursor: pointer;

  .sort-caret {
    position: absolute;
    left: 7px;
    width: 0;
    height: 0;
    border: 5px solid transparent;

    &.ascending {
      top: -5px;
      border-bottom-color: $background-2;
    }

    &.descending {
      bottom: -3px;
      border-top-color: $background-2;
    }
  }

  &.is-ascending .sort-caret.ascending {
    border-bottom-color: $primary;
  }

  &.is-descending .sort-caret.descending {
    border-top-color: $primary;
  }
}
</style>
