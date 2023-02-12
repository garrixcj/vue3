<template lang="pug">
.rd-grid-table-row(:class="rowClass")
  .rd-grid-table-row__wrap(:class="wrapClass")
    //- 資料的 row
    .rd-grid-table-row__cell(
      v-for="(column, col) in currentColumns"
      :key="`cell-${col}`"
      :class="[{ 'custom-width': !!column.width || !!column.span }, columnClass, getAlignClass(column.align), getSpanClass(column.span), column.class]"
      :style="!!column.width ? { width: `${column.width}px` } : getFlexStyle(column.flex)"
    )
      template(v-if="column.customRender?.slot")
        slot(
          :name="column.customRender.slot"
          :row="dataSource"
          :col="column"
          :line="line"
        )
      template(v-else)
        span {{ dataSource[column.dataIndex] || '' }}
  //- 下層內容物
  slot(name="content" :row="dataSource")
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  ref,
  type PropType,
  type Ref,
} from 'vue';
import type { ColumnSet, RowStyleSet } from './grid-table';

const backgroundColors = ['none', 'grey', 'white', 'blue'];
const borderColors = ['grey', 'green'];
const sizes = ['small', 'default', 'large'];
const aligns = ['left', 'right', 'center'];

export default defineComponent({
  // Row 排列元件
  name: 'RdGridTableRow',
  props: {
    // 資料源
    dataSource: {
      type: Object,
      default: () => ({}),
    },
    // grid line
    line: {
      type: Number,
      default: 0,
    },
    // 每行設置
    columns: {
      type: Array as PropType<ColumnSet[]>,
    },
    // 每列樣式設置
    row: {
      type: Object as PropType<RowStyleSet>,
    },
  },
  setup(props) {
    const tableColumns = inject<Ref<ColumnSet[]>>('GridTable:columns', ref([]));
    const currentColumns = computed(() => props.columns || tableColumns.value);
    const tableRowStyle = inject<Ref<RowStyleSet>>('GridTable:row', ref({}));
    const currentRow = computed(
      () => props.row || tableRowStyle.value,
    ) as Ref<RowStyleSet>;

    // 列樣式
    const rowClass = computed(() => [
      // 背景色
      backgroundColors.find(color => color === currentRow.value.background)
        ? `bg-${currentRow.value.background}`
        : 'bg-grey',
      // 邊框色
      currentRow.value?.border ? 'border' : '',
      borderColors.find(color => color === currentRow.value.border)
        ? `border-${currentRow.value.border}`
        : '',
      currentRow.value.hover ? 'hover-effect' : '',
    ]);
    // 列容器樣式 (容器對下層的樣式)
    const wrapClass = computed(() => [
      currentRow.value.separateLine ? 'dash-separate' : '',
    ]);
    // 每個欄位樣式
    const columnClass = computed(() => {
      let classes = '';
      if (typeof currentRow.value.size === 'string') {
        classes = sizes.find(size => size === currentRow.value.size)
          ? `size-${currentRow.value.size} font-${currentRow.value.size}`
          : 'size-default font-default';
      } else if (currentRow.value.size) {
        const fontClass = currentRow.value.size.font
          ? `font-${currentRow.value.size.font}`
          : 'font-default';
        const contentClass = currentRow.value.size.content
          ? `size-${currentRow.value.size.content}`
          : 'size-default';
        classes = `${fontClass} ${contentClass}`;
      } else {
        classes = 'size-default font-default';
      }
      return classes;
    });

    // 欄位文字位置
    const getAlignClass = (columnAlign: string | undefined) =>
      aligns.find(align => align === columnAlign) ? `text-${columnAlign}` : '';

    // 網格欄位
    const getSpanClass = (span: number | undefined) =>
      span && span > 0 && span < 25 ? `gt-col-${span}` : '';

    // flex 自適應拓展
    const getFlexStyle = (flex: number | undefined) => (flex ? { flex } : {});

    return {
      currentColumns,
      rowClass,
      wrapClass,
      columnClass,
      getAlignClass,
      getSpanClass,
      getFlexStyle,
    };
  },
});
</script>

<style lang="scss" scoped>
// 深化百分比
$darken-weight: 3%;
$white-weight: 40%;

// 外匡線顏色
@mixin border() {
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;
  &.border-grey {
    border-color: $background-3;
  }
  &.border-green {
    border-color: $success;
  }
}

// 背景顏色
@mixin background() {
  &.bg-none {
    background: none;
    border-color: transparent;
  }
  &.bg-grey {
    background-color: $background-5;
    border-color: $background-5;
    &.hover-effect:hover {
      background-color: darken($background-5, $darken-weight);
      border-color: darken($background-5, $darken-weight);
    }
  }
  &.bg-white {
    background-color: $white;
    border-color: $white;
    &.hover-effect:hover {
      background-color: mix($white, $primary-4, $white-weight);
      border-color: mix($white, $primary-4, $white-weight);
    }
  }
  &.bg-blue {
    background-color: $primary-4;
    border-color: $primary-4;
    &.hover-effect:hover {
      background-color: darken($primary-4, $darken-weight);
      border-color: darken($primary-4, $darken-weight);
    }
  }
}

// 虛線
@mixin dashed() {
  &.dash-separate {
    > :not(:first-child) {
      position: relative;
      &::before {
        position: absolute;
        top: 5px;
        left: 0;
        height: calc(100% - 10px);
        content: '';
        border-left: 1px $background-3 dashed;
      }
    }
  }
}

// flex 版面
@mixin column-cell() {
  box-sizing: border-box;
  flex: 1;
  &.custom-width {
    flex: none;
  }
}

// 文字 size
@mixin fontSize() {
  line-height: 20px;
  &.font {
    &-small {
      font-size: 12px;
    }
    &-default {
      font-size: 14px;
    }
    &-large {
      font-size: 16px;
    }
  }
}

// 欄位 size content
@mixin size() {
  &.size {
    &-small {
      padding: 4px 15px;
    }
    &-default {
      padding: 9px 15px;
    }
    &-large {
      padding: 14px 15px;
    }
  }
}

// 欄位文字位置
@mixin align() {
  text-align: left;
  &.text {
    // 預設左邊
    &-center {
      text-align: center;
    }
    &-right {
      text-align: right;
    }
  }
}

.rd-grid-table-row {
  color: $text-1;
  @include background;
  @include border;
  &__wrap {
    @include flex-basic;
    @include dashed;
    @include col-span(gt-col);
  }
  &__head,
  &__cell {
    @include column-cell;
    @include fontSize;
    @include size;
    @include align;
  }
}
</style>
