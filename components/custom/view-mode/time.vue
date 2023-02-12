<template lang="pug">
//- 檢視模式時time-picker預設版面
.text-group(v-if="isRange && startTime && endTime")
  | {{ `${startTime} ${rangeSeparator} ${endTime}` }}
.text-content(v-else-if="!isRange && singleTime")
  | {{ singleTime }}
.text-content(v-else)
  | --
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { timeFormat } from '../../utils/format/date';

export default defineComponent({
  name: 'RdViewTimePicker',
  inheritAttrs: false,
  setup() {
    const slotDefault = inject('ViewMode:Slots') as Function;
    const props = slotDefault()[0].props;

    // 是否為時間範圍選擇
    const isRange =
      props['is-range'] !== undefined && props['is-range'] !== false;

    // 選擇範圍時間的分隔符號
    const rangeSeparator = props['range-separator'] || '-';

    // 當前選定值
    const value =
      typeof props.modelValue === 'undefined' ? '' : props.modelValue;

    // 檢視用 - 取單一時間
    const getSingleTime = (value: Date) => {
      if (!isRange && !Array.isArray(value)) {
        return timeFormat(value);
      }
      return '';
    };

    // 單一時間
    const singleTime = getSingleTime(value);

    // 檢視用 - 取區間時間
    const getRangeTime = (values: Date[], index: number) => {
      if (isRange && Array.isArray(values)) {
        const value = values[index] || null;
        return timeFormat(value);
      }
      return '';
    };

    const startTime = getRangeTime(value, 0);
    const endTime = getRangeTime(value, 1);

    return {
      isRange,
      rangeSeparator,
      startTime,
      endTime,
      singleTime,
    };
  },
});
</script>

<style lang="scss" scoped>
.text-group {
  display: inline-flex;
}
</style>
