<i18n src="../../utils/rd/lang.json"></i18n>
<template lang="pug">
.rd-grid-table
  //- 標頭區塊
  .rd-grid-table-header(
    v-if="!noHeader"
    :style="gridStyle"
    :class="{ 'is-media': !!mediaGrid }"
  )
    //- Grid Layout
    slot(name="header" :columns="columns" :grid="grid")
      template(v-if="!!mediaGrid")
        //- 預設標頭生成方式(RWD版)
        rd-grid-table-header(
          v-for="n in maxHeaderGrid"
          :key="`grid-${n}`"
          :line="n"
          :class="getMediaClass(n)"
        )
          template(v-for="(_, slot) in $slots" v-slot:[slot]="scope")
            slot(v-bind="scope" :name="slot")
      template(v-else)
        //- 預設標頭生成方式
        rd-grid-table-header(
          v-for="n in maxHeaderGrid"
          :key="`grid-${n}`"
          :line="n"
        )
          template(v-for="(_, slot) in $slots" v-slot:[slot]="scope")
            slot(v-bind="scope" :name="slot")
  //- 資料區塊
  .rd-grid-table-body(
    v-if="dataSource.length > 0"
    ref="tableBody"
    :style="gridStyle"
    :class="{ 'has-scrollbar': scrollBar, 'is-media': !!mediaGrid }"
  )
    slot(name="body" :data="dataSource" :maxGrid="maxHeaderGrid")
      //- 內容
      rd-grid-table-row(
        v-for="(data, index) in dataSource"
        :key="`data-${index}`"
        :line="index % maxHeaderGrid"
        :data-source="data"
      )
        template(v-for="(_, slot) in $slots" v-slot:[slot]="scope")
          slot(v-bind="scope" :name="slot")
  //- 查無資料
  .rd-grid-table-empty(
    v-else
    :class="row.background ? `bg-${row.background}` : 'bg-none'"
  )
    slot(name="emptyData")
      span {{ emptyText || t('no_data') }}
</template>

<script lang="ts">
import { computed, defineComponent, provide, ref, type PropType } from 'vue';
import { max } from 'lodash';
import { useI18n } from 'vue-i18n';
import RdGridTableRow from './row.vue';
import RdGridTableHeader from './header.vue';
import type { ColumnSet, GridSet, MediaGrid, RowStyleSet } from './grid-table';

export type RdGridTableExpose = {
  scrollTo: (height: number) => void;
};

export default defineComponent({
  name: 'RdGridTable',
  components: {
    RdGridTableRow,
    RdGridTableHeader,
  },
  props: {
    // 捲動條
    scrollBar: {
      type: Boolean,
      default: false,
    },
    // 資料源
    dataSource: {
      type: Array as PropType<object[]>,
      default: () => [],
    },
    // 每行設置
    columns: {
      type: Array as PropType<ColumnSet[]>,
      default: () => [],
    },
    // 每列樣式設置
    row: {
      type: Object as PropType<RowStyleSet>,
      default: () => ({}),
    },
    // 最小寬度
    minWidth: {
      type: Number,
    },
    // 最小高度
    maxHeight: {
      type: Number,
    },
    // 移除標頭
    noHeader: {
      type: Boolean,
      default: false,
    },
    // 網格設定，預設只設定一行
    grid: {
      type: [Number, Object] as PropType<number | GridSet>,
      default: 1,
    },
    // 暫無資料文字
    emptyText: {
      type: String,
      default: '',
    },
  },
  setup(props, { expose }) {
    const { t } = useI18n({ useScope: 'local' });
    const tableBody = ref<HTMLElement>(document.createElement('div'));
    provide(
      'GridTable:columns',
      computed(() => props.columns),
    );
    provide(
      'GridTable:row',
      computed(() => props.row),
    );

    // [public]卷軸方法
    const scrollTo = (height = 0) => {
      tableBody.value.scrollTop = height;
    };

    // 使用rwd排版
    const mediaGrid = computed(() =>
      typeof props.grid !== 'number' && typeof props.grid.line !== 'number'
        ? props.grid.line
        : undefined,
    );

    const maxHeaderGrid = computed(() => {
      if (props.dataSource.length === 0) {
        return 1;
      }
      if (mediaGrid.value) {
        const mediaMax = max(Object.values(mediaGrid.value)) || 1;
        return mediaMax > props.dataSource.length
          ? props.dataSource.length
          : mediaMax;
      }
      if (typeof props.grid !== 'number') {
        return props.grid.line > props.dataSource.length
          ? props.dataSource.length
          : (props.grid.line as number);
      }
      return props.grid > props.dataSource.length
        ? props.dataSource.length
        : props.grid;
    });

    const gridStyle = computed(() => {
      if (typeof props.grid === 'number') {
        return {
          gridTemplateColumns: `repeat(${+props.grid}, 1fr)`,
        };
      } else if (props.grid) {
        return {
          gridTemplateColumns: `repeat(${+props.grid.line}, 1fr)`,
          gridColumnGap: props.grid.columnGap
            ? `${props.grid.columnGap}px`
            : '10px',
          gridRowGap: props.grid.rowGap ? `${props.grid.rowGap}px` : '10px',
        };
      }
      return {};
    });

    // CSS Var Setting
    const gridMedia = computed(() => ({
      xs: mediaGrid.value ? `repeat(${mediaGrid.value.xs || 1}, 1fr)` : '',
      sm: mediaGrid.value ? `repeat(${mediaGrid.value.sm || 1}, 1fr)` : '',
      md: mediaGrid.value ? `repeat(${mediaGrid.value.md || 1}, 1fr)` : '',
      lg: mediaGrid.value ? `repeat(${mediaGrid.value.lg || 1}, 1fr)` : '',
      xl: mediaGrid.value ? `repeat(${mediaGrid.value.xl || 1}, 1fr)` : '',
    }));
    const gridMaxHeight = computed(() => `${props.maxHeight}px`);

    const getMediaClass = (n: number) => {
      if (mediaGrid.value) {
        return (Object.keys(mediaGrid.value) as (keyof MediaGrid)[]).reduce(
          (acc, media) => {
            if (mediaGrid.value && n <= mediaGrid.value[media]) {
              acc.push(`grid-media-${media}`);
            }
            return acc;
          },
          [] as string[],
        );
      }
      return '';
    };

    expose({ scrollTo } as RdGridTableExpose); // 封裝外部使用功能

    return {
      // template use
      t,
      gridStyle,
      maxHeaderGrid,
      tableBody,
      mediaGrid,
      getMediaClass,
      // style use
      gridMedia,
      gridMaxHeight,
    };
  },
});
</script>

<style lang="scss" scoped>
// 背景顏色
@mixin background() {
  &.bg-none {
    background: none;
  }
  &.bg-grey {
    background-color: $background-5;
  }
  &.bg-white {
    background-color: $white;
  }
  &.bg-blue {
    background-color: $primary-4;
  }
}

.rd-grid-table {
  &-header,
  &-body {
    display: grid;
    gap: 10px;
    &.is-media {
      @include media-xs {
        grid-template-columns: v-bind('gridMedia.xs') !important;
      }
      @include media-sm {
        grid-template-columns: v-bind('gridMedia.sm') !important;
      }
      @include media-md {
        grid-template-columns: v-bind('gridMedia.md') !important;
      }
      @include media-lg {
        grid-template-columns: v-bind('gridMedia.lg') !important;
      }
      @include media-xl {
        grid-template-columns: v-bind('gridMedia.xl') !important;
      }
    }
  }
  &-header.is-media {
    @include media-xs {
      > :not(.grid-media-xs) {
        display: none;
      }
    }
    @include media-sm {
      > :not(.grid-media-sm) {
        display: none;
      }
    }
    @include media-md {
      > :not(.grid-media-md) {
        display: none;
      }
    }
    @include media-lg {
      > :not(.grid-media-lg) {
        display: none;
      }
    }
    @include media-xl {
      > :not(.grid-media-xl) {
        display: none;
      }
    }
  }
  &-empty {
    line-height: 60px;
    color: $text-4;
    text-align: center;
    @include background;
  }
  .has-scrollbar {
    @include scrollbar;
    height: v-bind(gridMaxHeight);
  }
}
</style>
