<template lang="pug">
span.caret-wrapper(
  :class="[getOrderClass, size]"
  @click="handleClick($event, null)"
)
  i.sort-caret.ascending(@click="handleClick($event, 'ascending')")
  i.sort-caret.descending(@click="handleClick($event, 'descending')")
</template>

<script lang="ts">
import { type PropType, defineComponent, ref, computed, watch } from 'vue';

type SizeSets = 'small' | 'default' | 'large';

type SortSets = null | 'ascending' | 'descending';

export default defineComponent({
  name: 'SortButton',
  props: {
    // 預設排序
    defaultOrder: {
      type: String as PropType<SortSets>,
      default: null,
    },
    // 大小(small、default、large)
    size: {
      type: String as PropType<SizeSets>,
      default: 'default',
    },
  },
  emits: ['sort-change'],
  setup(props, { emit }) {
    const order = ref<SortSets>(null);

    watch(
      () => props.defaultOrder,
      (value: SortSets) => {
        order.value = value;
      },
      { immediate: true },
    );

    const handleClick = (event: MouseEvent, newOrder: SortSets) => {
      event.stopPropagation();
      if (order.value === newOrder) {
        order.value = null;
      } else {
        order.value = newOrder;
      }
      emit('sort-change', order.value);
    };

    const getOrderClass = computed(() => {
      return order.value !== null ? order.value : '';
    });

    return {
      handleClick,
      getOrderClass,
    };
  },
});
</script>

<style lang="scss" scoped>
$wrapper-height: (
  'small': 24px,
  'default': 30px,
  'large': 34px,
);
$caret-top: (
  'small': 4.3px,
  'default': 3px,
  'large': 5px,
);
$caret-bottom: (
  'small': 5.9px,
  'default': 5px,
  'large': 7px,
);
$border-color: (
  'default': #c0c4cc,
  'click': #409eff,
);

.caret-wrapper {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  overflow: initial;
  vertical-align: middle;
  cursor: pointer;

  @each $type, $size in $wrapper-height {
    &.#{$type} {
      height: $size;

      .sort-caret {
        &.ascending {
          top: map-get($caret-top, $type);
        }
        &.descending {
          bottom: map-get($caret-bottom, $type);
        }
      }
    }
  }

  &.small {
    .sort-caret {
      border-width: 3.2px;
    }
  }

  &.ascending .sort-caret.ascending {
    border-bottom-color: map-get($border-color, 'click');
  }

  &.descending .sort-caret.descending {
    border-top-color: map-get($border-color, 'click');
  }
}

.sort-caret {
  position: absolute;
  left: 7px;
  width: 0;
  height: 0;
  border: 5px solid transparent;

  &.ascending {
    border-bottom-color: map-get($border-color, 'default');
  }

  &.descending {
    border-top-color: map-get($border-color, 'default');
  }
}
</style>
