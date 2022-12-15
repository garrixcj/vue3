<i18n>
{
  "zh-tw": {
    "no_data_yet": "暫無資料"
  },
  "zh-cn": {
    "no_data_yet": "暂无资料"
  },
  "en": {
    "no_data_yet": "No Data"
  },
  "ja": {
    "no_data_yet": "資料が見つかりません"
  },
  "ko": {
    "no_data_yet": "정보가 없습니다"
  },
  "id": {
    "no_data_yet": "No Data"
  },
  "vi": {
    "no_data_yet": "Không có dữ liệu"
  },
  "th": {
    "no_data_yet": "ยังไม่มีข้อมูล"
  },
  "es": {
    "no_data_yet": "No Data"
  }
}
</i18n>
<template lang="pug">
.og-table(v-loading="loading" :class="tablePaddingClass")
  table.og-table__wrap
    //- header區塊
    .og-table__header(ref="tableHeader")
      thead.og-table__header__content(
        :class="contentClass.header()"
        :style="`min-width: ${minWidth}px;`"
      )
        tr
          slot(name="header")

    //- body區塊
    .og-table__body(
      v-if="!noData"
      ref="tableBody"
      :noresize="false"
      :class="[{ 'has-scrollbar': scrollBar }]"
      @scroll="scroll.body()"
    )
      tbody.og-table__body__content(
        :class="contentClass.body()"
        :style="`min-width: ${minWidth}px;`"
      )
        tr
          slot

    //- 無資料
    .og-table__no-data(
      v-else
      ref="tableNoData"
      :class="background.noDataClass()"
      :style="background.noDataStyle()"
      :noresize="false"
      @scroll="scroll.noData()"
    )
      .og-table__no-data__content(:style="tableWidth")
        slot(name="no-data")
          .og-table__no-data__text {{ noDataText || t('no_data_yet') }}
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent, ref, computed } from 'vue';

// 可接受的paddingSize參數
const allowPaddingSize = ['small', 'medium', 'large'];
// 可接受背景顏色
const allowBgColor = ['none', 'white'];
// 可接受對齊方式
const allowAlign = ['left', 'center', 'right'];

export default defineComponent({
  name: 'OGTable',
  props: {
    // 捲動條
    scrollBar: {
      type: Boolean,
      default: false,
    },
    // 內容的loading遮罩
    loading: { type: Boolean, default: false },
    // 最小高度
    maxHeight: { type: Number, default: 400 },
    // 列表內距，不影響陰影線
    paddingSize: { type: String },
    // 列表的最小寬度
    minWidth: { type: Number, default: 260 },
    // 標題位置
    headerAlign: { type: String, default: 'left' },
    // 內容位置
    align: { type: String, default: 'left' },
    // 是否要顯示無資料的文字
    noData: { type: Boolean, default: false },
    // 無資料的文字
    noDataText: { type: String },
    // 無資料的背景顏色 (none / white)
    noDataBackground: { type: String, default: 'white' },
  },
  setup(props, { expose }) {
    const { t } = useI18n({ useScope: 'local' });

    const tableHeader = ref<HTMLElement>(document.createElement('div'));
    const tableBody = ref<HTMLElement>(document.createElement('div'));
    const tableNoData = ref<HTMLElement>(document.createElement('div'));

    const tableWidth = computed(() => {
      return { width: `${tableHeader.value.scrollWidth}px` };
    });

    const ogMaxHeight = computed(() => {
      // 設定高度 - (Header高度 + 陰影高度)
      const bodyMaxHeight =
        props.maxHeight - (tableHeader.value.scrollHeight + 3);
      return `${bodyMaxHeight}px`;
    });

    // Table和外層的內距
    const tablePaddingClass = computed(() => {
      if (
        typeof props.paddingSize !== 'undefined' &&
        allowPaddingSize.includes(props.paddingSize)
      ) {
        return `padding-${props.paddingSize}`;
      }
      return {};
    });

    // scroll 相關
    const scroll = {
      headerWidth: () => {
        return tableHeader.value.scrollWidth - tableHeader.value.clientWidth;
      },
      body: () => {
        if (scroll.headerWidth() <= tableBody.value.scrollLeft) {
          tableBody.value.scrollLeft = scroll.headerWidth();
        }
        tableHeader.value.scrollLeft = tableBody.value.scrollLeft;
      },
      noData: () => {
        if (scroll.headerWidth() <= tableNoData.value.scrollLeft) {
          tableNoData.value.scrollLeft = scroll.headerWidth();
        }
        tableHeader.value.scrollLeft = tableNoData.value.scrollLeft;
      },
    };

    const contentClass = {
      header: () => {
        const headerContentClass = [
          allowAlign.includes(props.headerAlign)
            ? `th-${props.headerAlign}`
            : '',
        ];
        return headerContentClass;
      },
      body: () => {
        const bodyContentClass = [
          allowAlign.includes(props.align) ? `td-${props.align}` : '',
        ];
        return bodyContentClass;
      },
    };

    const background = {
      noDataClass: () => {
        // 若background的值不在允許清單內，則當作色碼處裡
        if (
          props.noDataBackground !== '' &&
          !allowBgColor.includes(props.noDataBackground)
        ) {
          return { 'background-color': props.noDataBackground };
        }
        return {};
      },
      noDataStyle: () => {
        // 若background的值不在允許清單內，則當作色碼處裡
        if (
          props.noDataBackground !== '' &&
          !allowBgColor.includes(props.noDataBackground)
        ) {
          return { 'background-color': props.noDataBackground };
        }
        return {};
      },
    };

    // 重置捲軸高度
    const scrollTo = () => {
      tableBody.value.scrollLeft = 0;
      tableBody.value.scrollTop = 0;
    };
    // 封裝外部使用功能
    expose({
      scrollTo,
    });

    return {
      t,
      tableHeader,
      tableBody,
      tableNoData,
      tablePaddingClass,
      scroll,
      ogMaxHeight,
      tableWidth,
      contentClass,
      background,
    };
  },
});
</script>

<style lang="scss" scoped>
$border-color: #ebeef5;
$border-line: 1px solid $border-color;
$shadow-color: #ecedf0;

// 內距設定
@mixin paddingSize($num) {
  .og-table {
    // 整體左右內縮
    &__wrap {
      padding-right: #{$num + 'px'};
      padding-left: #{$num + 'px'};
    }
  }
}
// 背景顏色
@mixin bg-colors() {
  &.bg-none {
    background: none;
  }
  &.bg-white {
    background-color: $white;
  }
}
// Header 靠左、置中、靠左
@mixin headerJustifyContent() {
  &.th-left {
    :deep(th) {
      justify-content: left;
    }
  }
  &.th-center {
    :deep(th) {
      justify-content: center;
    }
  }
  &.th-right {
    :deep(th) {
      justify-content: right;
    }
  }
}
// 靠左、置中、靠左
@mixin justifyContent() {
  &.td-left {
    :deep(td) {
      justify-content: left;
    }
  }
  &.td-center {
    :deep(td) {
      justify-content: center;
    }
  }
  &.td-right {
    :deep(td) {
      justify-content: right;
    }
  }
}

@mixin display-table() {
  display: table;
  width: 100%;
  tr {
    height: 40px;
  }
}

.og-table {
  overflow: hidden;

  &__wrap {
    display: flex;
    flex-flow: column;
    height: 100%;
    border-collapse: collapse;
    border: $border-line;
    transition-duration: 0.3s;
  }

  &__header {
    margin-bottom: 3px;
    overflow-x: hidden;
    overflow-y: auto;
    border-bottom: $border-line;
    box-shadow: 0 1px 3px $shadow-color;

    &__content {
      @include display-table;
      @include headerJustifyContent();

      :deep(th) {
        @include flex-basic();

        flex: 1;
        height: 100%;
        min-height: 40px;
        padding: 0 10px;
        font-weight: 400;
        color: $primary-1;
      }
    }
  }
  &__body {
    &__content {
      @include display-table;
      @include justifyContent();

      :deep(td) {
        @include flex-basic();

        height: 100%;
        padding: 5px 10px;
        color: $text-1;
      }
    }
  }
  // 無資料
  &__no-data {
    @include bg-colors;
    overflow: auto;

    &__text {
      line-height: 60px;
      color: $no-data;
      text-align: center;
    }
  }

  // 內距設定
  &.padding {
    &-small {
      @include paddingSize(10);
    }
    &-medium {
      @include paddingSize(15);
    }
    &-large {
      @include paddingSize(20);
    }
  }

  .has-scrollbar {
    max-height: v-bind(ogMaxHeight);
    overflow: auto;
  }
}
</style>
