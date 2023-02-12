<i18n src="../../utils/rd/lang.json"></i18n>
<template lang="pug">
.og-table(v-loading="loading")
  //- header區塊
  .og-table__header-wrapper(ref="tableHeader")
    table.og-table__header
      thead
        slot(name="header" :columns="columns")
          og-table-header(
            :selection="selection"
            :default-sort="defaultSort"
            :select-all="selectAll"
            :indeterminate="indeterminate"
            :filter-column="filterColumn"
            :disabled="disabled"
            @selection-change="checkBoxAct.selectAll"
            @sort-change="sortChange"
          )
            template(v-for="(_, slot) in $slots" v-slot:[slot]="scope")
              slot(v-bind="scope" :name="slot")

  //- body區塊
  .og-table__body-wrapper(
    ref="tableBody"
    :class="[{ 'max-height': !!maxHeight }]"
    @scroll="syncHeaderScroll"
  )
    table.og-table__body(v-if="dataSource.length > 0")
      tbody
        slot(name="body" :columns="columns" :data="dataSource")
          og-table-row(
            v-for="(row, idx) in dataSource"
            :key="`data-${idx}`"
            :selection="selection"
            :filter-column="filterColumn"
            :data-source="row"
            @selection-change="checkBoxAct.select(row)"
          )
            template(v-for="(_, slot) in $slots" v-slot:[slot]="scope")
              slot(v-bind="scope" :name="slot")

    //- 無資料
    .og-table__no-data(v-else)
      slot(name="emptyData")
        span {{ emptyText || t('no_data') }}
</template>

<script lang="ts">
import { type CheckboxValueType } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { type PropType, defineComponent, provide, ref, computed } from 'vue';
import OgCheckbox from '../checkbox/index.vue';
import OgTableHeader from './header.vue';
import OgTableRow from './row.vue';
import type { ColumnSet, DataSource } from './og-table';

export default defineComponent({
  name: 'OGTable',
  components: {
    OgCheckbox,
    OgTableHeader,
    OgTableRow,
  },
  props: {
    // 內容的loading遮罩
    loading: { type: Boolean, default: false },
    // checkbox 顯示
    selection: { type: Boolean, default: false },
    // 禁能狀態
    disabled: { type: Boolean, default: false },
    // 每行設置
    columns: {
      type: Array as PropType<ColumnSet[]>,
      default: () => [],
    },
    // 資料源
    dataSource: {
      type: Array as PropType<DataSource[]>,
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
    // 最小高度
    maxHeight: { type: Number },
    // 暫無資料文字
    emptyText: {
      type: String,
      default: '',
    },
    // 過濾列
    filterColumn: { type: Function },
  },
  emits: ['selection-change', 'select-row', 'sort-change'],
  setup(props, { emit, expose }) {
    const { t } = useI18n({ useScope: 'local' });

    const tableHeader = ref<HTMLElement>(document.createElement('div'));
    const tableBody = ref<HTMLElement>(document.createElement('div'));

    provide(
      'OGTable:columns',
      computed(() => props.columns),
    );

    // 同步 Header X軸位置
    const syncHeaderScroll = () => {
      tableHeader.value.scrollLeft = tableBody.value.scrollLeft;
    };

    // table實際寬度
    const tableWidth = computed(() => {
      const width = props.columns.reduce((acc: number, item: ColumnSet) => {
        let result = acc;
        const widthTmp =
          typeof item.width !== 'undefined' ? +item.width : item.minWidth || 0;
        result = result + widthTmp;
        return result;
      }, 0);
      return `${width}px`;
    });

    // 最大高度
    const ogMaxHeight = computed(() => {
      // 設定高度 - (Header高度 + 陰影高度) - 邊框上下高度
      if (typeof props.maxHeight !== 'undefined') {
        const bodyMaxHeight =
          props?.maxHeight - (tableHeader.value.scrollHeight + 3) - 4;
        return `${bodyMaxHeight}px`;
      }
      return '';
    });

    // Checkbox 相關
    const selected = ref<DataSource[]>([]);
    const unDisabled = computed(() => {
      return props.dataSource.filter((item: DataSource) => !item.disabled);
    });
    // 全選狀態
    const selectAll = computed(
      () =>
        selected.value.length === unDisabled.value.length &&
        selected.value.length > 0,
    );
    // 不穩定狀態
    const indeterminate = computed(
      () =>
        !selectAll.value &&
        selected.value.length !== props.dataSource.length &&
        selected.value.length > 0,
    );
    const checkBoxAct = {
      // 單一選取
      select: (row: DataSource) => {
        selected.value = props.dataSource.filter(
          (item: DataSource) => item.selected && !item.disabled,
        );
        emit('selection-change', selected.value);
        emit('select-row', row);
      },
      // 全選
      selectAll: (val: CheckboxValueType) => {
        props.dataSource.forEach((item: DataSource) => {
          const result = item;
          if (!item.disabled) {
            result.selected = val as boolean;
          }
        });
        selected.value = val ? unDisabled.value : [];
        emit('selection-change', selected.value);
      },
      // 清除
      clear: () => {
        selected.value = [];
      },
    };

    // Sort 相關
    const sortChange = (column: {
      prop: string;
      order: 'ascending' | 'descending' | null;
    }) => {
      emit('sort-change', column);
    };

    // 重置捲軸高度
    const scrollTo = () => {
      tableBody.value.scrollLeft = 0;
      tableBody.value.scrollTop = 0;
    };
    // 封裝外部使用功能
    expose({
      scrollTo,
      clear: checkBoxAct.clear,
    });

    return {
      t,
      tableHeader,
      tableBody,
      syncHeaderScroll,
      tableWidth,
      ogMaxHeight,
      // Checkbox 相關
      selectAll,
      indeterminate,
      checkBoxAct,
      // Sort 相關
      sortChange,
    };
  },
});
</script>

<style lang="scss" scoped>
$border-color: #ebeef5;
$border-line: 1px solid $border-color;
$shadow-color: #ecedf0;

.og-table {
  border: $border-line;

  // 標題
  &__header-wrapper {
    margin-bottom: 3px;
    overflow-x: hidden;
    border-bottom: 2px solid $border-color;
    box-shadow: 0 1px 3px $shadow-color;
  }
  &__header {
    min-width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  // 內容
  &__body-wrapper {
    overflow: auto;
  }
  &__body {
    min-width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  // 無資料
  &__no-data {
    width: v-bind(tableWidth);
    line-height: 60px;
    color: $no-data;
    text-align: center;
    background-color: $white;
  }

  .max-height {
    max-height: v-bind(ogMaxHeight);
  }
}
</style>
