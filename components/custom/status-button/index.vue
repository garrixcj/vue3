<template lang="pug">
//- tag按鈕 (備註： 請自訂寬度)
.status-block(
  :class="compositedClass"
  :style="{ minWidth: `${minWidth}px` }"
  @click.prevent="clickHook"
)
  span.label
    slot(name="label") {{ label }}
  span.value {{ value }}
  slot(name="suffix")
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue';

type ThemeTypes = 'default' | 'success' | 'warning' | 'danger';

export default defineComponent({
  name: 'RdStatusButton',
  props: {
    // 狀態標題
    label: {
      type: String,
    },
    // 狀態數值
    value: {
      type: [String, Number],
    },
    // 基礎樣式
    type: {
      type: String as PropType<ThemeTypes>,
      default: 'default',
    },
    // 禁用
    disabled: {
      type: Boolean,
    },
    // 觸發狀態(改變class)
    active: {
      type: Boolean,
    },
    // 觸發狀態時的class
    activeClass: {
      type: String,
      default: 'active',
    },
    // 預設class
    defaultClass: {
      type: String,
      default: '',
    },
    // 最小寬度
    minWidth: {
      type: [String, Number],
      default: '',
    },
  },
  emits: ['clickStatus'],
  setup(props, { emit }) {
    const compositedClass = computed(() => [
      props.defaultClass,
      {
        [props.activeClass]: props.active,
        disabled: props.disabled,
      },
      `${props.type}-theme`,
    ]);
    const clickHook = () => {
      emit('clickStatus');
    };

    return {
      clickHook,
      compositedClass,
    };
  },
});
</script>

<style lang="scss" scoped>
$themes: (
  'default': $primary,
  'success': $success,
  'warning': $warning,
  'danger': $danger,
);

.status-block {
  display: inline-flex;
  align-items: center;
  min-width: 125px;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;

  @each $name, $color in $themes {
    &.#{$name}-theme {
      color: $color;
      background-color: mix($white, $color, 95%);
      border: 1px solid $color;
      &.disabled {
        color: mix($white, $color, 40%);
        cursor: not-allowed;
        border-color: mix($white, $color, 40%);
        &.active {
          color: $white;
          background-color: mix($white, $color, 40%);
          border-color: mix($white, $color, 40%);
        }
      }
      &.active {
        color: $white;
        background-color: $color;
        border-color: $color;
        &:not(.disabled) {
          &:hover,
          &:focus {
            background-color: darken($color, 3%);
          }
          &:active {
            background-color: darken($color, 6%);
          }
        }
      }
      &:not(.disabled) {
        &:hover,
        &:focus {
          background-color: mix($white, $color, 90%);
        }
        &:active {
          background-color: mix($white, $color, 85%);
        }
      }
    }
  }
  .label {
    margin-right: auto;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
  }
  .value {
    margin-left: 15px;
    font-size: 18px;
    font-weight: 500;
    line-height: 1;
  }
  & + & {
    margin-left: 10px;
  }
}
</style>
