<template lang="pug">
.rd-option(v-show="selectable")
  template(v-if="mode === 'single'")
    //- 單選
    .single-option
      template(v-if="group")
        .single-option__group {{ label }}
      template(v-else-if="divided")
        .single-option__divider
      template(v-else)
        .single-option__default(
          :class="{ 'is-selected': isSelected }"
          @click="select"
        )
          slot(:current="{ value, label, option }") {{ label }}
          .single-option__suffix(v-if="$slots.suffix")
            slot(name="suffix" :current="{ value, label, option }")
  template(v-else)
    //- 多選
    template(v-if="group")
      .multiple-option__group {{ label }}
    template(v-else-if="divided")
      .multiple-option__divider
    template(v-else)
      .multiple-option
        rd-checkbox.multiple-option__checkbox(
          v-if="all"
          :label="label"
          :model-value="checkAll"
          :indeterminate="indeterminate"
          @change="checkAllOpt"
        )
        rd-checkbox.multiple-option__checkbox(
          v-else
          :model-value="isChecked"
          @change="checkOpt"
        )
          slot(:current="{ value, label, option }")
            span {{ label }}
        .multiple-option__suffix(v-if="$slots.suffix")
          slot(name="suffix" :current="{ value, label, option }")
</template>

<script lang="ts">
import { computed, defineComponent, inject, warn, watch, type Ref } from 'vue';
import strmatcher from '../../utils/string-match/index';
import type { QuickSearchSetting } from './typing';

export default defineComponent({
  name: 'RdOption',
  props: {
    value: {
      type: [String, Number],
    }, // 辨識用唯一值
    label: {
      type: String,
    }, // 顯示標籤
    disabled: {
      type: Boolean,
      default: false,
    }, // 禁用
    group: {
      type: Boolean,
      default: false,
    }, // 作為群組當成選項但是不能按
    divided: {
      type: Boolean,
      default: false,
    }, // 作為分隔線當成選項但是不能按
    all: {
      type: Boolean,
      default: false,
    }, // 全選功能 [多選]
    option: {
      type: Object,
      default: () => ({}),
    }, // 其他客製化用選項
  },
  setup(props) {
    watch(
      props,
      () => {
        const { divided, all, group, value, label } = props;
        if (!divided && !all && !group && typeof value === 'undefined') {
          // 不是分隔、全選項、群組時，value 不存在值警告開發者
          warn(`${label} 選項的 prop value 需要綁定值！`);
        }
      },
      { immediate: true },
    );
    // 上層模式
    const mode = inject('RdSelect:mode') as Ref<string>;
    // 上層資料
    const selectedData = inject('RdSelect:selectedData') as Ref<
      (number | string)[] | (number | string)
    >;

    // 快搜
    const searchKeyword = inject('RdSelect:searchKeyword') as Ref<string>;
    const quickSearch = inject('RdSelect:quickSearch') as QuickSearchSetting;
    // 可選擇 (filter 後)
    const selectable = computed(() => {
      if (quickSearch) {
        // 不可選擇不可定義過濾
        if (props.all || props.group || props.divided || !props.label) {
          return !searchKeyword.value;
        }
        // 自定義過濾功能
        if (quickSearch.filter && typeof quickSearch.filter === 'function') {
          return quickSearch.filter(searchKeyword.value, props);
        }
        // 預設過濾功能 (僅過濾 label)
        const escapeRegexpString = (value = '') =>
          value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        const re = new RegExp(escapeRegexpString(searchKeyword.value), 'i');
        return (
          re.test(props.label) ||
          strmatcher.match(props.label, searchKeyword.value)
        );
      }
      return true;
    });

    // [單選]
    // 是否選中
    const isSelected = computed(() => props.value === selectedData.value);
    // 點擊選項
    const selectFn = inject('RdSelect:select') as Function;
    const select = () => {
      selectFn(props);
    };

    // [多選]
    // 是否勾選
    const isChecked = computed(
      () =>
        (selectedData.value as (object | number | string)[]).indexOf(
          props.value as object | number | string,
        ) !== -1,
    );
    // 更新選中標籤值
    const check = inject('RdSelect:check') as Function;
    // 一般勾選
    const checkOpt = (e: unknown) => {
      check(e, props);
    };

    // 多選全選
    // 是否已全選
    const checkAll = inject('RdSelect:checkAll') as Ref<boolean>;
    // 全選不穩定狀態 (有任何一個已經選取)
    const indeterminate = inject('RdSelect:indeterminate') as Ref<boolean>;
    // 觸發全選
    const changeAll = inject('RdSelect:changeAll') as Function;
    const checkAllOpt = (e: unknown) => {
      changeAll(e);
    };

    return {
      mode,
      isSelected,
      selectable,
      select,
      isChecked,
      checkAll,
      indeterminate,
      checkAllOpt,
      checkOpt,
      selectedData,
    };
  },
});
</script>

<style lang="scss" scoped>
$sizes: 'small', 'default', 'large';

.rd-option {
  .single-option {
    &__default {
      @include flex-basic;
      padding: 5px 10px;
      cursor: pointer;
      &:not(.is-selected):hover {
        background-color: $background-5;
      }
    }
    &__group {
      padding: 0 10px;
      font-size: 12px;
      line-height: 30px;
      color: $text-3;
    }
    &__divider {
      height: 1px;
      margin: 4px 0;
      background-color: $background-4;
    }
    &__suffix {
      margin-left: auto;
    }
    // 下拉選單 - 被選取選項
    .is-selected {
      color: $white;
      background-color: $primary;
    }
  }
  .multiple-option {
    &__group {
      padding: 0 10px;
      font-size: 12px;
      line-height: 30px;
      color: $text-3;
    }
    &__divider {
      height: 1px;
      margin: 4px 0;
      background-color: $background-4;
    }
    @include flex-basic;
    &__checkbox {
      &.el-checkbox {
        padding: 0px 10px;
        &:hover {
          background-color: $background-5;
        }
      }
    }
    &:hover {
      background-color: $background-5;
    }
    &__suffix {
      margin-right: 10px;
      margin-left: auto;
    }
    :deep(.el-checkbox) {
      // 調整勾選框位置
      top: 0;
    }
  }
}
</style>
