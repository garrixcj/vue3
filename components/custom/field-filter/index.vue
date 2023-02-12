<i18n src="../../utils/rd/lang.json"></i18n>
<template lang="pug">
.field-filter(:class="$attrs.class")
  rd-popover(
    ref="popoverRef"
    trigger="click"
    :placement="popover?.placement"
    :width="popover?.width || 'auto'"
    :disabled="!!$attrs.disabled"
    @hide="cancel"
  )
    //- Popover 內容
    slot(name="content" :fields="currentFields")
      //- 選項空間
      .field-filter__option-container
        rd-checkbox-group.field-filter__options(
          v-model="value"
          :style="optionsStyle"
        )
          rd-checkbox.field-filter__option(
            v-for="(obj, index) in currentFields"
            :key="index"
            :label="obj.key"
            :disabled="obj.disabled"
          )
            span.label {{ obj.name }}
    //- Popover 的確認/取消按鈕
    slot(name="footer")
      .field-filter__confirm
        rd-button(type="secondary" @click="cancel") {{ popover?.cancelText || t('cancel') }}
        rd-button(type="primary" @click="confirm") {{ popover?.confirmText || t('apply') }}
    //- Switch 顯示
    template(#reference)
      slot(name="button")
        rd-button(v-bind="$attrs") {{ t('custom_field') }}
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  type PropType,
  provide,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { type Placement } from 'element-plus';
import type { FieldSet } from './typing';
import { uniq, min } from 'lodash';

type PopoverSet = {
  // 標題
  title: string;
  // 確認按紐文字
  confirmText?: string;
  // 取消按鈕文字
  cancelText?: string;
  // 寬度
  width?: number | string;
  // placement
  placement?: Placement;
};

export default defineComponent({
  // 自訂欄位
  name: 'RdFieldFilter',
  inheritAttrs: false,
  props: {
    // popover 設定
    popover: {
      type: Object as PropType<PopoverSet>,
    },
    // 欄位預設
    fields: {
      type: Array as PropType<FieldSet[]>,
      default: () => [],
    },
    // 預設勾選狀態陣列
    defaultValue: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });
    const popoverRef = ref();

    // 目前顯示資料
    const currentFields = computed(() =>
      props.fields.filter(field => field.visible),
    );
    provide('FieldFilter:currentFields', currentFields);
    // grid row 最大數量 10
    const optionsStyle = computed(() => {
      const rowLimit = 10;
      return {
        gridTemplateRows: `repeat(${min([
          rowLimit,
          currentFields.value.length,
        ])}, 1fr)`,
      };
    });
    // 目前勾選狀態
    const value = ref<string[]>(props.defaultValue);
    provide('FieldFilter:value', value);

    // 預設值更新時更新內部綁定值
    watch(
      () => props.defaultValue,
      () => {
        value.value = props.defaultValue;
      },
    );

    // 重置成預設資料
    const reset = () => {
      value.value = uniq([...props.defaultValue]);
    };

    const cancel = () => {
      popoverRef.value.hide();
      reset();
      emit('cancel');
    };
    const confirm = () => {
      popoverRef.value.hide();
      emit('confirm', value.value);
    };

    return {
      t,
      popoverRef,
      currentFields,
      optionsStyle,
      value,
      cancel,
      confirm,
    };
  },
});
</script>

<style lang="scss" scoped>
.field-filter {
  &__option-container {
    padding: 10px;
    margin-bottom: 10px;
    background-color: $primary-5;
    border-radius: 6px;
  }
  &__options {
    // 超過 10 個就橫向發展
    // [optionStyles] 因 v-bind css 無法綁定到 popover 的 teleport 物件上，故使用 style 製作
    display: grid;
    grid-auto-flow: column;
    gap: 10px;
    :deep(.el-checkbox) {
      height: 14px;
      margin-right: 0;
    }
    :deep(.el-checkbox__label) {
      line-height: 1;
    }
  }
  &__option {
    @include space(5px);
    min-width: 220px;
    .label {
      line-height: 1;
    }
  }
  &__confirm {
    @include flex-basic(flex-end);
  }
}
</style>
