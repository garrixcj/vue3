<template lang="pug">
.rd-mini-card(:class="[`${type}-theme`, defaultStatus]")
  //- 卡片標題
  .rd-mini-card__title(:class="[titleAlign, titleStatus]")
    slot(name="title")
      span {{ title }}
      slot(name="titleSuffix")
  //- 內容
  .rd-mini-card__content(:class="[contentAlign, contentStatus]")
    slot(name="content")
      span {{ content }}
</template>

<script lang="ts">
import { computed, defineComponent, warn, type PropType } from 'vue';

type CardTypes = 'main' | 'vertical' | 'horizontal';
type StatusType = 'default' | 'success' | 'warning' | 'danger';
type StatusSetting = {
  content?: StatusType;
  title?: StatusType;
};
type AlignType = 'left' | 'right';
type AlignSetting = {
  content?: AlignType;
  title?: AlignType;
};

export default defineComponent({
  name: 'RdMiniCard',
  props: {
    // 標題
    title: {
      type: String,
      default: '',
    },
    // 內容數值
    content: {
      type: [String, Number],
      default: '',
    },
    // 卡片類型
    type: {
      type: String as PropType<CardTypes>,
      default: 'main',
    },
    // 卡片狀態
    status: {
      type: [String, Object] as PropType<StatusType | StatusSetting>,
      default: 'default',
    },
    // 最小寬度
    minWidth: {
      type: [String, Number],
      default: 100,
    },
    // 對齊方式
    align: {
      type: [String, Object] as PropType<AlignType | AlignSetting>,
      default: 'right',
    },
  },
  setup(props) {
    if (
      typeof props.align !== 'string' &&
      typeof props.align?.title !== 'undefined'
    ) {
      if (props.type === 'main') {
        warn('主要樣式標題只能置中！！');
      } else if (props.type === 'horizontal') {
        warn('水平樣式標題只會置右！！');
      }
    }

    // CSS Var Setting
    const cardMinWidth = computed(() => `${props.minWidth}px`);

    const defaultStatus = computed(() =>
      typeof props.status === 'string'
        ? `${props.status}-status__theme`
        : 'default-status__theme',
    );

    const titleStatus = computed(() =>
      typeof props.status !== 'string' && props.status.title
        ? `${props.status.title}-status`
        : '',
    );
    const contentStatus = computed(() =>
      typeof props.status !== 'string' && props.status.content
        ? `${props.status.content}-status`
        : '',
    );

    const titleAlign = computed(() => {
      if (props.type === 'main') {
        return '';
      }
      if (typeof props.align === 'string') {
        return `align-${props.align}`;
      }

      return `align-${props.align.title || 'right'}`;
    });
    const contentAlign = computed(() =>
      props.align === 'left' ||
      (typeof props.align !== 'string' && props.align.content === 'left')
        ? 'align-left'
        : 'align-right',
    );

    return {
      // template use
      defaultStatus,
      titleStatus,
      contentStatus,
      titleAlign,
      contentAlign,
      // style use
      cardMinWidth,
    };
  },
});
</script>

<style lang="scss" scoped>
$type-colors: (
  'danger': $danger,
  'warning': $warning,
  'success': $success,
  'default': map-get($text-colors, '1'),
);
$default-bg-color: $background-3;
// 狀態樣式顏色(預設)
@mixin theme-color($bg: false) {
  @each $name, $color in $type-colors {
    &.#{$name}-status__theme {
      @if $bg {
        .rd-mini-card__title {
          color: white;
          background-color: $color;
          @if $name == 'default' {
            color: $color;
            background-color: $default-bg-color;
          }
        }
      }
      .rd-mini-card__content {
        color: $color;
      }
    }
  }
}

// 顏色
@mixin color($bg: false) {
  @each $name, $color in $type-colors {
    &.#{$name}-status {
      @if $bg {
        color: white;
        background-color: $color;
        @if $name == 'default' {
          color: $color;
          background-color: $default-bg-color;
        }
      } @else {
        color: $color;
      }
    }
  }
}
// 左右對齊
@mixin align() {
  &.align-right {
    justify-content: flex-end;
  }
  &.align-left {
    justify-content: flex-start;
  }
}

// 連結覆蓋
@mixin link() {
  :deep(.rd-link) {
    @content;
  }
}

.rd-mini-card {
  display: inline-block;
  min-width: v-bind(cardMinWidth);
  overflow: hidden;
  background-color: $white;
  border: 1px solid $background-3;
  border-radius: 4px;

  // 預設
  &__title {
    @include space(5px);
    @include flex-basic(flex-end);
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    color: map-get($text-colors, '3');
  }
  &__content {
    @include flex-basic(flex-end);
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
    @include link {
      line-height: 20px;
      .link {
        font-size: 18px;
        font-weight: 600;
        line-height: 20px;
      }
    }
  }
  // 主要樣式
  &.main-theme {
    // 主要樣式：標題-狀態底色，內容-狀態文字色
    @include theme-color(true);
  }
  &.main-theme &__title {
    @include flex-basic(center);
    @include color(true);
    height: 24px;
  }
  &.main-theme &__content {
    height: 44px;
    padding: 0 10px;
    font-size: 26px;
    line-height: 44px;
    @include align;
    @include color();
    @include link {
      line-height: 44px;
      .link {
        font-size: 26px;
        line-height: 44px;
      }
    }
  }

  // 次要樣式 - 垂直
  &.vertical-theme {
    padding: 9px 10px;
    @include space-vertical(5px);
    // 次要樣式：內容-狀態文字色
    @include theme-color;
  }
  &.vertical-theme &__title,
  &.vertical-theme &__content {
    @include align;
    @include color;
  }
  &.vertical-theme &__content {
    height: 20px;
  }

  // 次要樣式 - 水平
  &.horizontal-theme {
    @include flex-basic() {
      display: inline-flex;
    }
    @include space;
    // 次要樣式：內容-狀態文字色
    @include theme-color;
    padding: 4px 10px;
  }
  &.horizontal-theme &__title {
    @include color;
    margin-right: 10px;
  }
  &.horizontal-theme &__content {
    @include color;
    &.align-right {
      margin-left: auto;
    }
  }
}
</style>
