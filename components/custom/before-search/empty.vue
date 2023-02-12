<template lang="pug">
.rd-before-search-empty
  .rd-before-search-empty__image
    .image
  .rd-before-search-empty__label
    | {{ label }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  // 開始搜尋吧 for Table empty slot version
  name: 'RdBeforeSearchEmpty',
  props: {
    label: {
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.rd-before-search-empty {
  padding: 80px 0;
  &__image {
    @include flex-basic(center);
    .image {
      width: 100px;
      height: 100px;
      background-image: url(before-search.svg);
      background-repeat: no-repeat;
      background-size: 100%;
    }
  }
  &__label {
    margin-top: 10px;
    line-height: 1;
    color: $text-1;
    text-align: center;
  }
}
</style>
