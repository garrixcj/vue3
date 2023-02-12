<template lang="pug">
.rd-checkbox__view-text(:class="`rd-checkbox--${size}`")
  template(v-if="isChecked")
    i.mdi.mdi-check
    span.rd-checkbox__label {{ trueLabel }}
  template(v-else)
    span.rd-checkbox__label --
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';
import { useFormItem } from 'element-plus';

export default defineComponent({
  name: 'RdViewCheckbox',
  inheritAttrs: false,
  setup() {
    const slotDefault = inject('ViewMode:Slots') as Function;
    const props = slotDefault()[0].props;
    const { formItem } = useFormItem();

    // 元件尺寸
    const size = computed(() => {
      if (formItem?.size) {
        return formItem.size;
      }

      return props.size || 'default';
    });
    // 打勾時的 label 文字
    const slotLabel = slotDefault()[0].children?.default()[0].children;
    const trueLabel = slotLabel || props.label;

    // 判斷是否勾選，同 element-plus 判斷邏輯
    const getCheckState = (): boolean => {
      // 當前選定值
      const value: boolean | string | number | undefined = props.modelValue;
      // 自定義 true 的 value，對應 el-checkbox 的 trueLabel
      const trueValue: string | number | undefined = props['true-label'];

      if (typeof trueValue !== 'undefined') {
        return value === trueValue;
      }
      return !!value;
    };

    let isChecked = getCheckState();

    return {
      isChecked,
      size,
      trueLabel,
    };
  },
});
</script>

<style lang="scss" scoped>
.rd-checkbox__view-text {
  @include inline-flex-basic;
  @include space(5px);
  margin-right: 10px;
  .mdi-check {
    @include flex-basic;
    width: 14px;
    height: 14px;
    font-size: 18px;
    color: $success;
  }
  .rd-checkbox__label {
    line-height: 30px;
  }
  &.rd-checkbox--large {
    .rd-checkbox__label {
      line-height: 34px;
    }
  }
  &.rd-checkbox--small {
    .mdi-check {
      width: 14px;
      height: 14px;
      font-size: 16px;
    }
    .rd-checkbox__label {
      font-size: 14px;
      line-height: 24px;
    }
  }
}
</style>
