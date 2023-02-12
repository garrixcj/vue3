<template lang="pug">
.rd-before-search
  .rd-before-search__image
    .image
  .rd-before-search__label
    | {{ label }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RdBeforeSearch',
  props: {
    label: {
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.rd-before-search {
  &__image {
    display: flex;
    justify-content: center;
    .image {
      width: 30%;
      max-width: 100px;
      height: 25vw;
      max-height: 100px;
      margin-top: 20%;
      background-image: url(before-search.svg);
      background-repeat: no-repeat;
      background-size: 100%;
    }
  }
  &__label {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
