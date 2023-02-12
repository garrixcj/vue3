<template lang="pug">
tr.og-table-row__warp(:class="[{ 'selected-row': dataSource.selected }]")
  //- 勾選(直接使用CSS渲染速度比v-show來的快)
  td.og-table-row__selection(:class="{ 'hidden-field': !selection }")
    og-checkbox.checkbox(
      v-model="dataSource.selected"
      :disabled="dataSource.disabled"
      @change="$emit('selection-change')"
    )
  td.og-table-row__cell(
    v-for="(column, col) in currentColumns"
    :key="`cell-${col}`"
    v-memo="[column, filterColumn?.(column.dataIndex)]"
    :class="[column.class, getAlignClass(column.align), { 'hidden-field': !filterColumn?.(column.dataIndex) }]"
    :style="cellWidth(column)"
  )
    slot(:name="column.dataIndex" :row="dataSource")
      span {{ dataSource || '--' }}
</template>

<script lang="ts">
import {
  type Ref,
  type PropType,
  defineComponent,
  inject,
  ref,
  computed,
} from 'vue';
import { isEmpty } from 'lodash';
import OgCheckbox from '../checkbox/index.vue';
import type { ColumnSet, DataSource } from './og-table';

// 可接受對齊方式
const allowAlign = ['left', 'center', 'right'];

export default defineComponent({
  name: 'OGTableRow',
  components: { OgCheckbox },
  props: {
    // Checkbox 顯示
    selection: { type: Boolean, default: false },
    // 資料源
    dataSource: {
      type: Object as PropType<DataSource>,
      default: () => ({}),
    },
    // 每行設置
    columns: {
      type: Array as PropType<ColumnSet[]>,
      default: () => [],
    },
    // 隱藏列
    filterColumn: { type: Function },
  },
  emits: ['selection-change'],
  setup(props) {
    const tableColumns = inject<Ref<ColumnSet[]>>('OGTable:columns', ref([]));

    // 當前欄位
    const currentColumns = computed(() =>
      isEmpty(props.columns) ? tableColumns.value : props.columns,
    );

    // 欄位文字位置
    const getAlignClass = (columnAlign: string | undefined) =>
      allowAlign.find(align => align === columnAlign)
        ? `text-${columnAlign}`
        : '';
    // 取得寬度樣式
    const cellWidth = (column: ColumnSet) => {
      if (typeof column.width !== 'undefined') {
        return { width: `${column.width}px`, 'min-width': `${column.width}px` };
      }
      const count =
        currentColumns.value.filter(
          (item: ColumnSet) => typeof item.minWidth !== 'undefined',
        ).length | 1;
      return {
        width: `${100 / count}%`,
        'min-width': `${column.minWidth}px`,
      };
    };

    return {
      currentColumns,
      getAlignClass,
      cellWidth,
    };
  },
});
</script>

<style lang="scss" scoped>
$border-color: #ebeef5;
$border-line: 1px solid $border-color;
$shadow-color: #ecedf0;

// 欄位文字位置
@mixin align() {
  // 預設置左
  text-align: left;
  &.text {
    &-center {
      text-align: center;
    }
    &-right {
      text-align: right;
    }
  }
}

.og-table-row {
  &__warp {
    &:hover {
      background-color: mix($white, $border-color, 50%);
    }
  }
  &__selection {
    width: 50px;
    min-width: 50px;
    border-right: $border-line;
    border-bottom: $border-line;
    .checkbox {
      @include flex-basic(center);
    }
    &.hidden-field {
      display: none;
    }
  }
  &__cell {
    @include align();

    padding: 5px 12px;
    color: $text-1;
    word-break: break-all;
    border-right: $border-line;
    border-bottom: $border-line;
    &:last-child {
      border-right: none;
    }
    &.hidden-field {
      display: none;
    }
  }
}

.selected-row {
  background-color: $focus-2;
  &:hover {
    background-color: darken($focus-2, 3%);
  }
}
</style>
