<template lang="pug">
.rd-card
  //- 卡片標題
  .header(
    v-if="$slots.header || $slots.title || title || $slots.headerSuffix"
    :class="{ 'no-padding': padding.header, 'is-custom': $slots.header, 'no-separate-line': noSeparateLine }"
  )
    slot(name="header")
      //- 標題
      .title(v-if="$slots.title || title")
        slot(name="title") {{ title }}
      //- 副標題
      .subtitle(v-if="$slots.subTitle || subTitle")
        slot(name="subTitle") {{ subTitle }}
      //- 標題後綴
      .header-suffix(v-if="$slots.headerSuffix")
        slot(name="headerSuffix")

  //- 卡片內容
  .content(:class="[{ 'no-padding': padding.content }]")
    slot(name="content")

  //- 卡片底部
  .footer(v-if="$slots.footer" :class="{ 'no-padding': padding.footer }")
    slot(name="footer")
</template>

<script lang="ts">
import { computed, defineComponent, type PropType, type Ref } from 'vue';

type PaddingTypes = 'header' | 'footer' | 'content';

export default defineComponent({
  name: 'RdCard',
  props: {
    title: { type: String, default: '' },
    subTitle: { type: String, default: '' },
    noPadding: {
      type: [Boolean, Array] as PropType<boolean | PaddingTypes[]>,
      default: false,
    },
    noSeparateLine: { type: Boolean, default: false },
  },
  setup(props) {
    // 內距
    const padding: Ref<Record<PaddingTypes, boolean>> = computed(() => {
      const defaultPadding = { header: false, content: false, footer: false };
      if (Array.isArray(props.noPadding)) {
        return props.noPadding.reduce(
          (acc, slot) => ({ ...acc, [slot]: true }),
          defaultPadding,
        );
      }
      if (props.noPadding === true) {
        // 快速版 內容無padding
        return { ...defaultPadding, content: true };
      }
      // 預設 全部都有padding
      return defaultPadding;
    });

    return {
      padding,
    };
  },
});
</script>

<style lang="scss" scoped>
// 卡片內層的內距
@mixin slot-padding {
  padding: 15px 20px;
  &.no-padding {
    padding: 0;
  }
}
// 一般標題的上下內距
@mixin title-padding {
  padding: 15px 0px;
  &.is-custom {
    @include slot-padding;
  }
}

.rd-card {
  // 卡片基礎樣式
  width: 100%;
  font-size: 14px;
  background-color: $white;
  box-shadow: 0 0 12px 0 rgba(64, 78, 103, 0.05);

  .header {
    // 卡片標頭
    @include flex-basic;
    @include title-padding;
    border-bottom: 1px solid #ebeef5;
    &.no-separate-line {
      border-bottom: none;
    }
    .title {
      // 標題
      padding-left: 15px;
      font-size: 20px;
      font-weight: bold;
      line-height: 1;
      color: $mark-3;
      border-left: 3px solid $mark-3;
    }
    :slotted(.title) {
      // 標題固有屬性
      font-size: 20px;
      font-weight: bold;
      line-height: 1;
      color: $mark-3;
    }
    .subtitle {
      // 副標題
      padding-left: 10px;
      font-size: 14px;
      line-height: 1;
      color: $text-4;
    }
    &-suffix {
      // 後綴slot
      margin: 0 15px 0 auto;
    }
  }

  .content,
  .footer {
    @include slot-padding;
  }
}
</style>
