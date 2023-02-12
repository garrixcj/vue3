<template lang="pug">
//- 表格時間常用樣式
.datetime-formater(:class="{ 'force-wrap': wrap }")
  .date {{ date }}
  .time {{ time }}
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue';
import { type Dayjs } from 'dayjs';
import datetime from '../../utils/format/date';

export default defineComponent({
  name: 'RdFormatTimer',
  props: {
    // 日期時間(2020-03-13 17:00:00)
    dateTime: {
      type: [String, Date, Object] as PropType<string | Date | Dayjs>,
      default: '',
    },
    // 日期預設字串
    dateDefault: {
      type: String,
      default: '',
    },
    // 時間預設字串
    timeDefault: {
      type: String,
      default: '',
    },
    // 強制換行
    wrap: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const date = computed(() =>
      datetime.dateFormat(props.dateTime, props.dateDefault),
    );
    const time = computed(() =>
      datetime.timeFormat(props.dateTime, props.timeDefault),
    );

    return {
      date,
      time,
    };
  },
});
</script>

<style lang="scss" scoped>
.datetime-formater {
  &:not(.force-wrap) {
    @include space(5px);
    @include flex-basic(flex-start, flex-end);
  }
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
