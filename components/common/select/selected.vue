<template lang="pug">
.rd-selected
  template(v-if="mode === 'single'")
    //- 單選版面
    .single(tabindex="-1" :class="[sizeClass, { disabled }]")
      //- 單選顯示 (空字串為請選擇)
      .single__item(v-if="selectedData !== ''")
        slot(name="selected" :current="singleLabel")
          | {{ singleLabel?.label || singleLabel?.value || '' }}
      //- 預設畫面
      .single__placeholder(v-else)
        slot(name="placeholder")
          | {{ setting.placeholder || t('place-holder-default') }}
      rd-arrow-up(:collapse="visible")

  template(v-else)
    //- 多選版面
    .multiple(tabindex="-1" :class="[sizeClass, { disabled }]")
      .multiple__container
        //- 多選顯示
        .multiple__item(v-if="selectedData.length > 0")
          //- 全選時節省全部標籤顯示方式
          template(v-if="!!setting?.onlyAll && checkAll")
            rd-tag(
              type="success"
              closable
              :size="size"
              @close="changeAll(false)"
            ) {{ t('all') }}
          template(v-else)
            slot(name="selected" :current="multiTags")
              rd-tag(
                v-for="option in multiTags"
                :key="option.value"
                type="success"
                :size="size"
                :closable="!option.disabled"
                @close="handleClose(option)"
              ) {{ option.label }}
        //- 預設畫面
        .multiple__placeholder(v-else)
          slot(name="placeholder")
            | {{ setting.placeholder || t('place-holder-default') }}
        rd-arrow-up(:collapse="visible")
</template>

<script lang="ts">
import { computed, defineComponent, inject, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SelectOption, SelectedSetting, SelectedSize } from './typing';

export default defineComponent({
  name: 'RdSelected',
  setup() {
    // Init
    const { t } = useI18n({ useScope: 'parent' });

    // 上層模式
    const mode = inject('RdSelect:mode') as Ref<string>;
    const size = inject('RdSelect:size') as Ref<SelectedSize>;
    const sizeClass = computed(() => `size-${size.value}`);
    const visible = inject('RdSelect:visible') as Ref<boolean>;
    const disabled = inject('RdSelect:disabled');
    const setting = inject('RdSelect:selectedSetting', {}) as SelectedSetting;

    // CSS Var Setting
    const rdSelectWidth = computed(() => (setting.fill ? '100%' : 'auto'));
    const rdSelectMinWidth = computed(() =>
      setting.minWidth ? `${setting.minWidth}px` : '0',
    );
    const rdSelectMaxWidth = computed(() =>
      setting.maxWidth ? `${setting.maxWidth}px` : 'none',
    );

    // 已選取資料
    const selectedData = inject('RdSelect:selectedData') as Ref;

    // [單選]
    // 已選取資料顯示標籤
    const singleLabel = inject('RdSelect:selectedLabel') as Ref;

    // [多選]
    // 更新選中標籤值
    const multiTags = inject('RdSelect:selectedTags') as Ref;
    // 是否已全選
    const checkAll = inject('RdSelect:checkAll') as Ref<boolean>;
    // 觸發全選
    const changeAll = inject('RdSelect:changeAll') as Function;
    // 觸發 tag close
    const check = inject('RdSelect:check') as Function;
    const handleClose = (prop: SelectOption) => {
      check(false, prop);
    };

    return {
      // template use
      mode,
      size,
      sizeClass,
      visible,
      disabled,
      setting,
      selectedData,
      singleLabel,
      multiTags,
      checkAll,
      changeAll,
      handleClose,
      t,
      // style use
      rdSelectWidth,
      rdSelectMinWidth,
      rdSelectMaxWidth,
    };
  },
});
</script>

<style lang="scss" scoped>
$sizes: 'small', 'default', 'large';

// 輸入框外觀
@mixin input-border {
  width: v-bind(rdSelectWidth);
  min-width: v-bind(rdSelectMinWidth);
  max-width: v-bind(rdSelectMaxWidth);
  padding: 0 6px;
  font-weight: 400;
  color: $text-1;
  background-color: $white;
  border: 1px solid $input-border-color;
  border-radius: 2px;
  @content;
  @include form-item-border();
  // 輸入框預設內容樣式
  &__placeholder {
    color: $text-4;
  }
}

$size-max-height: (
  'small': 68px,
  'default': 78px,
  'large': 84px,
);
$size-multiple-padding: (
  'small': 1px,
  'default': 4px,
  'large': 6px,
);
.rd-selected {
  cursor: pointer;
  @include flex-basic;
  // 尺寸樣式
  @each $size in $sizes {
    .size-#{$size} {
      min-height: get-input-height($size);
      max-height: map-get($size-max-height, $size);
      font-size: get-input-font($size);
      line-height: get-input-height($size) - 2px; // 減掉 border
      .multiple__container {
        margin: map-get($size-multiple-padding, $size) 0;
      }
      .multiple__item {
        gap: 3px 6px;
      }
    }
  }
  // 單選已選擇
  .single {
    @include input-border;
    // 與下拉 icon 排版
    @include flex-basic(space-between) {
      flex: 1;
    }
    &__placeholder {
      padding-right: 4px;
    }
    &__item {
      @include space(5px);
      padding-right: 4px;
    }
  }
  // 多選已選擇
  .multiple {
    max-height: 68px;
    @include scrollbar;
    @include input-border;
    &__container {
      // 與下拉 icon 排版
      @include flex-basic(space-between) {
        flex: 1;
      }
    }
    &__placeholder {
      padding-right: 4px;
      line-height: 18px;
    }
    &__item {
      @include inline-flex-basic {
        flex-wrap: wrap;
      }
      .el-tag.is-closable {
        padding: 0px 4px;
        line-height: 18px;
      }
    }
  }
  // 禁用模式
  .disabled {
    color: $text-3;
    background-color: $background-5;
    :deep(.rd-arrow-up) {
      color: $text-3;
      cursor: not-allowed;
    }
    &:hover {
      cursor: not-allowed;
      border-color: $background-4;
    }
  }
  .rd-arrow-up {
    @include flex-basic(center);
    width: unset;
    height: unset;
    padding: 0;
    color: $text-2;
  }
}
// 驗證錯誤顯示紅框
@include form-item-status('error') {
  .single {
    @include form-item-border('error');
  }
}
</style>
