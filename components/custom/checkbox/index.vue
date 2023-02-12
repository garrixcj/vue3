<template lang="pug">
label.og-checkbox
  .og-checkbox__inner(:class="[innerClass]")
  input.og-checkbox__original(
    type="checkbox"
    :value="modelValue"
    style="display: none"
    :disabled="disabled"
    @change="change"
  )
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'OGCheckbox',
  props: {
    modelValue: { type: Boolean, default: false },
    // 禁用選項
    disabled: { type: Boolean, default: false },
    // 不穩定狀態
    indeterminate: { type: Boolean, default: false },
  },
  emits: ['change', 'update:model-value'],
  setup(props, { emit }) {
    const innerClass = computed(() => {
      let classes = '';
      if (props.disabled) {
        classes = 'is-disabled';
      }
      // 已勾選
      if (props.modelValue) {
        classes = `${classes} is-checked`;
      }
      // 不穩定狀態
      if (props.indeterminate && !props.modelValue) {
        classes = `${classes} is-indeterminate`;
      }
      return classes;
    });

    const change = () => {
      emit('update:model-value', !props.modelValue);
      emit('change', !props.modelValue);
    };

    return {
      innerClass,
      change,
    };
  },
});
</script>

<style lang="scss" scoped>
$border-color: #dcdfe6;
$border-line: 1px solid $border-color;
.og-checkbox {
  &__inner {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    cursor: pointer;
    background-color: $white;
    border: $border-line;
    border-radius: 2px;
    &:hover {
      border-color: $success;
    }
  }
  &__icon {
    @include flex-basic;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    font-size: 18px;
    color: $success;
  }
}

.is-checked {
  background-color: $success;
  border-color: $success;
  &::after {
    position: absolute;
    top: 1px;
    left: 5px;
    box-sizing: content-box;
    width: 3px;
    height: 8px;
    content: '';
    border: 1px solid $white;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scaleY(1);
  }
}
.is-indeterminate {
  background-color: $success;
  border-color: $success;
  &::after {
    position: absolute;
    top: 5px;
    right: 0;
    left: 0;
    display: block;
    height: 2px;
    content: '';
    background-color: $white;
    transform: scale(0.5);
  }
}
.is-disabled {
  cursor: not-allowed;
  background-color: $background-3;
  border-color: $offline;
  &:hover {
    border-style: none;
  }
}
</style>
