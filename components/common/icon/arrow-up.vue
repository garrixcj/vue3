<template lang="pug">
i.rd-arrow-up.mdi.mdi-chevron-up(:class="[{ 'is-reverse': collapse }]")
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RdArrowUp', // 收合箭頭Icon
  props: {
    // 收合狀態
    collapse: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.rd-arrow-up {
  box-sizing: border-box;
  display: block;
  width: 30px;
  height: 30px;
  padding: 6px;
  font-size: 18px;
  line-height: 1;
  color: $primary;
  cursor: pointer;
  transition: 0.3s;
  transform: rotate(180deg);
  // 逆時鐘轉
  &.is-reverse {
    transform: rotate(0deg);
  }
}
</style>
