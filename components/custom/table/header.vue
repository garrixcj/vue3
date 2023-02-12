<template lang="pug">
tr.og-table-header-row__warp
  //- 勾選(直接使用CSS渲染速度比v-show來的快)
  th.og-table-header-row__selection(:class="{ 'hidden-field': !selection }")
    og-checkbox.checkbox(
      :model-value="currentSelectAll"
      :indeterminate="currentIndeterminate"
      :disabled="disabled"
      @change="change"
    )
  th.og-table-header-row__cell(
    v-for="(column, col) in currentColumns"
    :key="`header-${col}`"
    :class="[column.titleClass, getAlignClass(column.titleAlign), { 'hidden-field': !filterColumn?.(column.dataIndex) }]"
    :style="cellWidth(column)"
  )
    slot(:name="`header-${column.dataIndex}`")
      span {{ column.title || '' }}
      rd-sort(
        v-if="column.sortable"
        :model-value="columnsSort[column.dataIndex]"
        @change="sortChange(column.dataIndex, $event)"
      )
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
import { useSort } from '../../utils/icon/index';
import type { Orders } from '../../utils/icon/typing';
import type { ColumnSet } from './og-table';

// 可接受對齊方式
const allowAlign = ['left', 'center', 'right'];

export default defineComponent({
  name: 'OGTableHeaderRow',
  components: { OgCheckbox },
  props: {
    // Checkbox 顯示
    selection: { type: Boolean, default: false },
    // Checkbox 全選
    selectAll: { type: Boolean, default: false },
    // Checkbox 不穩定狀態
    indeterminate: { type: Boolean, default: false },
    // 禁能狀態
    disabled: { type: Boolean, default: false },
    // 每行設置
    columns: {
      type: Array as PropType<ColumnSet[]>,
      default: () => [],
    },
    // 預設排序
    defaultSort: {
      type: Object as PropType<{
        prop: string;
        order: 'ascending' | 'descending';
      }>,
      default: () => ({}),
    },
    // 隱藏列
    filterColumn: { type: Function },
  },
  emits: ['selection-change', 'sort-change'],
  setup(props, { emit }) {
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
        ).length || 1;
      return {
        width: `${100 / count}%`,
        'min-width': `${column.minWidth}px`,
      };
    };

    // Checkbox 相關
    const currentSelectAll = computed(() => props.selectAll);
    const currentIndeterminate = computed(() => props.indeterminate);
    const change = () => {
      emit('selection-change', !props.selectAll);
    };

    // Sort 相關
    const { columnsSort, setSort } = useSort(currentColumns.value);
    // 設定欄位的預設排序方式
    setSort(props.defaultSort.prop, props.defaultSort.order);
    // 排序
    const sortChange = (prop: string, order: Orders) => {
      setSort(prop, order);
      emit('sort-change', { prop, order });
    };

    return {
      currentColumns,
      getAlignClass,
      cellWidth,
      // Checkbox 相關
      currentSelectAll,
      currentIndeterminate,
      change,
      // Sort 相關
      columnsSort,
      sortChange,
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
  // 預設置中
  text-align: center;
  &.text {
    &-left {
      text-align: left;
    }
    &-right {
      text-align: right;
    }
  }
}

.og-table-header-row {
  &__selection {
    width: 50px;
    min-width: 50px;
    border-right: $border-line;
    .checkbox {
      @include flex-basic(center);
    }
    &.hidden-field {
      display: none;
    }
  }
  &__warp {
    height: 40px;
  }
  &__cell {
    @include align();

    padding: 5px 12px;
    font-weight: 400;
    color: $primary-1;
    border-right: $border-line;
    &:last-child {
      border-right: none;
    }
    &.hidden-field {
      display: none;
    }
  }
}
</style>
