<template lang="pug">
.rd-panel-card
  .rd-panel-card__row(
    v-for="(row, id) in dataSource"
    :key="id"
    :class="[contentAlign(align), defaultStatus]"
  )
    //- 卡片標題
    .rd-panel-card__title(:class="titleStatus(row.status)")
      slot(:name="row.titleSlot" :data="row")
        slot(name="title" :data="row")
          span {{ row.title }}
          slot(name="titleSuffix" :data="row")
    //- 內容
    .rd-panel-card__content(
      :class="[contentAlign(row.align), contentStatus(row.status)]"
    )
      slot(:name="row.contentSlot" :data="row")
        slot(name="content" :data="row")
          span {{ row.content }}
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue';

type StatusType = 'default' | 'success' | 'warning' | 'danger';
type StatusSetting = {
  content?: StatusType;
  title?: StatusType;
};
type AlignType = 'left' | 'right';
type DataSet = {
  content: string | number;
  title: string;
  status?: StatusType | StatusSetting;
  align?: AlignType; // 只能對內容調整對其方式，標題固定在左
  titleSlot?: string;
  contentSlot?: string;
  [key: string]: unknown;
};

export default defineComponent({
  name: 'RdPanelCard',
  props: {
    // 資料來源
    dataSource: {
      type: Array as PropType<DataSet[]>,
      default: () => [],
    },
    // 全部卡片狀態
    status: {
      type: String as PropType<StatusType>,
      default: 'default',
    },
    // 最小寬度
    minWidth: {
      type: [String, Number],
      default: 100,
    },
    // 對齊方式
    align: {
      type: String as PropType<AlignType>,
      default: 'right',
    },
  },
  setup(props) {
    // CSS Var Setting
    const cardMinWidth = computed(() => `${props.minWidth}px`);

    // 預設樣板
    const defaultStatus = computed(() =>
      typeof props.status === 'string' ? `${props.status}-status__theme` : '',
    );

    // 客製化標題狀態 class
    const titleStatus = (status: StatusType | StatusSetting | undefined) =>
      typeof status !== 'string' && status?.title
        ? `${status.title}-status`
        : '';
    // 客製化內容狀態
    const contentStatus = (status: StatusType | StatusSetting | undefined) =>
      typeof status === 'string'
        ? `${status}-status`
        : status?.content
        ? `${status.content}-status`
        : '';

    // 內容對齊方式
    const contentAlign = (align: AlignType | undefined) =>
      align ? `align-${align}` : '';

    return {
      // template use
      defaultStatus,
      titleStatus,
      contentStatus,
      contentAlign,
      // style use
      cardMinWidth,
    };
  },
});
</script>

<style lang="scss" scoped>
$types: (
  'danger': $danger,
  'warning': $warning,
  'success': $success,
  'default': $text-1,
);
// 狀態樣式顏色(預設)
@mixin theme-color() {
  @each $name, $color in $types {
    &.#{$name}-status__theme {
      .rd-panel-card__content {
        color: $color;
      }
    }
  }
}

// 顏色
@mixin color() {
  @each $name, $color in $types {
    &.#{$name}-status {
      color: $color;
    }
  }
}

// 連結覆蓋
@mixin link() {
  :deep(.rd-link) {
    @content;
  }
}

.rd-panel-card {
  display: inline-block;
  min-width: v-bind(cardMinWidth);
  padding: 10px;
  background-color: $white;
  border: 1px solid $background-3;
  border-radius: 4px;
  @include space-vertical;

  &__row {
    @include flex-basic;
    @include space;
    @include theme-color;
    &.align-right .rd-panel-card__content {
      margin-left: auto;
    }
  }

  &__row &__title {
    margin-right: 10px;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: $text-3;
    @include color;
    @include space(5px);
  }
  &__row &__content {
    @include flex-basic(flex-end);
    @include color;
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    @include link {
      line-height: 14px;
      .link {
        font-size: 14px;
        font-weight: 600;
        line-height: 14px;
      }
    }
    &.align-right {
      margin-left: auto;
    }
    &.align-left {
      margin-left: 10px;
    }
  }
}
</style>
