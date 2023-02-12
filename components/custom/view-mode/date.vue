<template lang="pug">
//- 檢視模式時date-picker預設版面
.text-group(v-if="isRange && startDate && endDate")
  .datetime
    .date {{ startDate }}
    .time(v-if="isDateTime") {{ startTime }}
  .separator {{ rangeSeparator }}
  .datetime
    .date {{ endDate }}
    .time(v-if="isDateTime") {{ endTime }}
.text-content(v-else-if="!isRange && singleDate")
  .datetime
    .date {{ singleDate }}
    .time(v-if="isDateTime") {{ singleTime }}
.text-content(v-else)
  | --
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { dateFormat, timeFormat } from '../../utils/format/date';

type DateTimeType = 'date' | 'time';

export default defineComponent({
  name: 'RdViewDatePicker',
  inheritAttrs: false,
  setup() {
    const slotDefault = inject('ViewMode:Slots') as Function;
    const props = slotDefault()[0].props;

    // 是否為時間範圍選擇
    const type = props.type;
    const isRange = type ? type.indexOf('range') > -1 : false;

    // 是否為 datetime 格式
    const isDateTime = type ? type.indexOf('datetime') > -1 : false;

    // 選擇範圍時間的分隔符號
    const rangeSeparator = props['range-separator'] || '-';

    // 當前選定值
    const value = props.modelValue;

    // 檢視用 - 取單日日期時間
    const getSingleDateTime = (value: Date, type: DateTimeType) => {
      if (!isRange && !Array.isArray(value)) {
        if (type === 'date') {
          return dateFormat(value);
        }
        if (type === 'time') {
          return timeFormat(value);
        }
      }
      return '';
    };

    // 單日日期、時間
    const singleDate = getSingleDateTime(value, 'date');
    const singleTime = getSingleDateTime(value, 'time');

    // 檢視用 - 取區間日期時間
    const getRangeDateTime = (
      values: Date[],
      index: number,
      type: DateTimeType,
    ) => {
      if (isRange && Array.isArray(value)) {
        const value = values[index] || null;
        if (type === 'date') {
          return dateFormat(value);
        }
        if (type === 'time') {
          return timeFormat(value);
        }
      }
      return '';
    };

    // 區間日期、時間
    const startDate = getRangeDateTime(value, 0, 'date');
    const startTime = getRangeDateTime(value, 0, 'time');
    const endDate = getRangeDateTime(value, 1, 'date');
    const endTime = getRangeDateTime(value, 1, 'time');

    return {
      isRange,
      isDateTime,
      rangeSeparator,
      singleDate,
      singleTime,
      startDate,
      startTime,
      endDate,
      endTime,
    };
  },
});
</script>

<style lang="scss" scoped>
.text-group {
  display: inline-flex;
  @include space(5px);
}
.datetime {
  @include space(5px);
  @include flex-basic(flex-start, flex-end);
  .date {
    font-size: 14px;
    line-height: 16px;
    color: $text-1;
  }
  .time {
    font-size: 12px;
    line-height: 14px;
    color: $text-3;
  }
}
</style>
