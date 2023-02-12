<template lang="pug">
.rd-grid-table-header-row
  .rd-grid-table-header-row__wrap
    //- 標頭的 row
    .rd-grid-table-header-row__cell(
      v-for="(column, col) in currentColumns"
      :key="`header-${col}`"
      :class="[{ 'custom-width': !!column.width || !!column.span }, columnClass, getAlignClass(column.titleAlign), getSpanClass(column.span), column.titleClass]"
      :style="!!column.width ? { width: `${column.width}px` } : getFlexStyle(column.flex)"
    )
      template(v-if="getTitleSlot(column.title)")
        slot(:name="getTitleSlot(column.title)" :col="column" :line="line - 1")
      template(v-else)
        span {{ column.title || '' }}
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
import type { CustomSlot, ColumnSet, RowStyleSet } from './grid-table';

const sizes = ['small', 'default', 'large'];
const aligns = ['left', 'right', 'center'];

export default defineComponent({
  // Row 排列元件 (Header)
  name: 'RdGridTableHeaderRow',
  props: {
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

    const getTitleSlot = (title: string | CustomSlot | undefined) => {
      if (typeof title === 'object') {
        return title.slot || '';
      }
      return '';
    };

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
      columnClass,
      getAlignClass,
      getSpanClass,
      getFlexStyle,
      getTitleSlot,
    };
  },
});
</script>

<style lang="scss" scoped>
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
      padding: 5px 15px;
    }
    &-default {
      padding: 10px 15px;
    }
    &-large {
      padding: 15px 15px;
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

.rd-grid-table-header-row {
  color: $text-3;
  border: 1px solid transparent;
  &__wrap {
    @include flex-basic;
    @include col-span(gt-col);
  }
  &__cell {
    @include column-cell;
    @include fontSize;
    @include size;
    @include align;
  }
}
</style>
