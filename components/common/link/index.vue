<template lang="pug">
.rd-link(:class="{ disabled }")
  a.link(
    v-if="!isText"
    v-bind="$attrs"
    :class="{ 'link-underline': underline, disabled }"
  )
    slot
  span.text(v-else :class="{ 'text-underline': underline }")
    slot
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RdLink',
  inheritAttrs: false,
  props: {
    underline: {
      type: Boolean,
      default: false,
    },
    // 是否為純文字狀態
    isText: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.rd-link {
  display: inline;
  font-size: 14px;
  line-height: 20px;
  .link {
    text-decoration: none;
    cursor: pointer;
    @include text-button($primary);
    &-underline {
      padding-bottom: 1px;
      @include btn-underline;
    }
  }
  &.disabled {
    &:hover {
      pointer-events: none;
    }
  }
  .link.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  .text {
    line-height: 20px;
    color: map-get($text-colors, '1');
    text-decoration: none;
    &-underline {
      padding-bottom: 1px;
      border-bottom: 1px solid map-get($text-colors, '1');
    }
  }
}
</style>
