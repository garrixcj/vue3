<template lang="pug">
.og-table-row(
  :class="[getBgClass, { 'selected-row': visible }]"
  :style="getBgStyle"
)
  //- row
  .og-table-row__wrap
    //- 多選欄位
    .og-table-row__selection(v-if="showSelection")
      rd-checkbox(
        :model-value="visible"
        :indeterminate="indeterminate"
        @update:model-value="checkBoxAct.update($event)"
        @change="checkBoxAct.click($event)"
      )
    //- 欄位
    .og-table-row__item(
      v-for="name in filterSlotNames"
      :key="name"
      :class="setItemClass(name)"
      :style="setItemStyle(name)"
    )
      slot(:name="name")
</template>

<script lang="ts">
import { type CheckboxValueType } from 'element-plus';
import { type PropType, defineComponent, computed } from 'vue';
import { keys } from 'lodash';

// 可接受字型大小
const allowFontSize = ['small', 'default', 'large'];
// 可接受背景顏色
const allowBgColor = ['none', 'white'];

export default defineComponent({
  name: 'OGTableColumn',
  props: {
    // Checkbox 狀態
    visible: { type: Boolean, default: false },
    // Checkbox 不穩定狀態
    indeterminate: { type: Boolean, default: false },
    // Checkbox 顯示
    showSelection: { type: Boolean, default: false },
    // 資料
    data: {
      type: Object as PropType<{ [key: string]: unknown }>,
      default: () => ({}),
    },
    // 自訂要顯示數個欄位的slot名稱
    slotNames: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    // 文字尺寸 (small / default / large)
    fontSize: { type: String, default: 'default' },
    // 背景顏色 (none / white)
    background: { type: String, default: '' },
    // 自訂欄寬，key值指定欄位，value決定寬度(需填數字，單位為px)
    fieldWidth: {
      type: Object as PropType<{ [key: string]: number }>,
      default: () => ({}),
    },
    // 自訂最小欄寬，key值指定欄位，value決定寬度(需填數字，單位為px)
    fieldMinWidth: {
      type: Object as PropType<{ [key: string]: number }>,
      default: () => ({}),
    },
    // 自訂義的class; 若為Object，key值能指定欄位的class
    customFieldClass: { type: [String, Object] },
  },
  emits: ['update:visible', 'selection-change'],
  setup(props, { emit, slots }) {
    // 過濾欄位
    const filterSlotNames = computed(() => {
      return props.slotNames.filter(item => keys(slots).includes(item));
    });

    // 取得背景顏色的class
    const getBgClass = computed(() => {
      if (allowBgColor.includes(props.background)) {
        return `bg-${props.background}`;
      }
      return 'bg-white';
    });
    // 指定色碼的style
    const getBgStyle = computed(() => {
      // 若background的值不在允許清單內，則當作色碼處裡
      if (props.background !== '' && !allowBgColor.includes(props.background)) {
        return { 'background-color': props.background };
      }
      return '';
    });

    // 設定 item class
    const setItemClass = (fieldName: string) => {
      const itemClass = [
        allowFontSize.includes(props.fontSize) ? `font-${props.fontSize}` : '',
      ];

      // 自訂義class
      if (typeof props.customFieldClass === 'string') {
        // 為string則每個欄位都填入class
        itemClass.push(props.customFieldClass);
      } else if (typeof props.customFieldClass === 'object') {
        // 為object則根據欄位名稱填入對應的class
        itemClass.push(props.customFieldClass[fieldName]);
      }

      return itemClass;
    };
    // 設定 item style
    const setItemStyle = (fieldName: string) => {
      const itemStyle = [];

      // 自訂寬度
      if (
        props.fieldWidth !== undefined &&
        props.fieldWidth[fieldName] !== undefined
      ) {
        itemStyle.push({
          flex: 'none',
          width: `${props.fieldWidth[fieldName]}px`,
        });
      }

      // 自訂最小寬度
      if (
        props.fieldMinWidth !== undefined &&
        props.fieldMinWidth[fieldName] !== undefined
      ) {
        itemStyle.push({ 'min-width': `${props.fieldMinWidth[fieldName]}px` });
      }

      return itemStyle;
    };

    // Checkbox
    const checkBoxAct = {
      update: (val: CheckboxValueType) => {
        emit('update:visible', val);
      },
      click: (value: CheckboxValueType) => {
        emit('selection-change', value, value ? [props.data] : []);
      },
    };

    return {
      filterSlotNames,
      getBgClass,
      getBgStyle,
      setItemClass,
      setItemStyle,
      checkBoxAct,
    };
  },
});
</script>

<style lang="scss" scoped>
$border-color: #ebeef5;
$border-line: 1px solid $border-color;

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
// 背景顏色
@mixin bg-colors() {
  &.bg-white {
    background-color: $white;
    :hover {
      > div {
        background-color: mix($white, $border-color, 50%);
      }
    }
  }
}

.og-table-row {
  @include bg-colors;

  &__wrap {
    display: flex;
    width: 100%;
    border-bottom: $border-line;
  }

  &__item {
    @include fontSize;
    @include flex-basic();

    flex: 1;
    flex-wrap: wrap;

    min-width: 60px;
    line-height: 20px;
    word-break: break-all;
    border-right: $border-line;
    transition-duration: 0.3s;

    &:last-child {
      border-right: none;
    }
  }

  &__selection {
    @include flex-basic(center, center);

    width: 50px;
    border-right: $border-line;
    transition-duration: 0.3s;
  }

  &.selected-row {
    background-color: $focus-2;
    :hover {
      > div {
        background-color: darken($focus-2, 3%);
      }
    }
  }
}
</style>
