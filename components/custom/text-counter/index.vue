<template lang="pug">
//- 文字計數器，用於 input 的後綴，跳脫 input 原生的 maxlength
.text-counter
  span.text-length(:class="{ 'is-error': error }") {{ counter }}
  span.text-separate {{ noIndent ? '/' : ' / ' }}
  span.text-max {{ maxlength }}
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'RdTextCounter',
  props: {
    // 狀態標題
    maxlength: {
      type: Number,
      default: 1,
    },
    // 文字
    text: {
      type: String,
      default: '',
    },
    // 取消空白間距 (縮小畫面時適用)
    noIndent: {
      type: Boolean,
      default: false,
    },
    // 取消驗證
    noValid: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const counter = computed(() => props.text.length);
    const error = computed(
      () => !props.noValid && counter.value > props.maxlength,
    );

    return {
      counter,
      error,
    };
  },
});
</script>

<style lang="scss" scoped>
.text-counter {
  order: 5; // 調整 suffix 排序到最後
  padding: 0 5px;
  font-size: 12px;
  line-height: 1;
  color: $text-3;
  .text-length {
    &.is-error {
      color: $danger;
    }
  }
}
</style>
