<template lang="pug">
span {{ activeText }}
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'RdViewSwitch',
  setup() {
    // 檢視模式無響應效果需求
    const slotDefault = inject('ViewMode:Slots') as Function;
    const props = slotDefault()[0].props;

    const getTrueCase = (value: boolean | string | number) => {
      if (
        typeof props['active-value'] !== 'undefined' ||
        typeof props.activeValue !== 'undefined'
      ) {
        return value === (props['active-value'] || props.activeValue);
      }
      if (
        typeof props['inactive-value'] !== 'undefined' ||
        typeof props.inactiveValue !== 'undefined'
      ) {
        return value !== (props['inactive-value'] || props.inactiveValue);
      }
      return !!value;
    };

    // 開關是否開啟
    const trueCase = getTrueCase(props.modelValue);

    const getText = (value: boolean) => {
      if (props.activeText || props['active-text']) {
        // 上層有設置
        return (props.activeText || props['active-text']) as string;
      }
      if (
        typeof props.active !== 'undefined' &&
        typeof props.active !== 'string'
      ) {
        // active 設置
        return (value ? props.active.text : props.active.inverseText) || '';
      }
      return '';
    };

    // 右側文字
    const activeText = getText(trueCase);

    return {
      activeText,
    };
  },
});
</script>
