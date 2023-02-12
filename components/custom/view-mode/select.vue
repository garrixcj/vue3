<template lang="pug">
.rd-select__view-text
  //- 多選
  template(v-if="multiple")
    .rd-select__multiple-all(
      v-if="multipleLabels.length === options.length && onlyAll"
    )
      rd-tag(type="success") {{ t('all') }}
    .rd-select__multiple-item(
      v-for="(item, index) in multipleLabels"
      v-else-if="multipleLabels.length > 0"
    )
      rd-tag(:key="index" type="success") {{ item }}
    .rd-select__single(v-else)
      | --
  //- 單選
  template(v-else)
    .rd-select__single
      | {{ singleLabel }}
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SelectOption } from '../../common/select/typing';

type ValueType = number | string | number[] | string[];

export default defineComponent({
  name: 'RdViewSelect',
  inheritAttrs: false,
  setup() {
    // Init
    const { t } = useI18n({ useScope: 'parent' });
    const slotDefault = inject('ViewMode:Slots') as Function;
    const props = slotDefault()[0].props;

    // 當前選擇項目
    const value: ValueType = props.value;

    // 全部選項
    const options: SelectOption[] = props.options;

    // 是否為多選
    const multiple = props.multiple !== undefined && props.multiple !== false;

    // 是否只顯示全部tag
    const onlyAll: boolean =
      props['selected-setting'] !== undefined &&
      props['selected-setting'].onlyAll;

    // 回傳label
    const getLabel = (value: string | number) => {
      if (typeof value === 'string' || typeof value === 'number') {
        const option = options.find(item => item.value === value);
        if (typeof option?.label !== 'undefined') {
          return option.label;
        }
      }
      return '--';
    };

    const singleLabel = getLabel(value as string | number);

    const multipleLabels: string[] = [];

    if (Array.isArray(value)) {
      value.forEach((item: string | number) => {
        const label = getLabel(item);
        multipleLabels.push(label);
      });
    }

    return {
      t,
      singleLabel,
      multipleLabels,
      options,
      multiple,
      onlyAll,
    };
  },
});
</script>

<style lang="scss" scoped>
.rd-select {
  &__view-text,
  &__multiple {
    display: flex;
  }
}
.el-tag {
  padding: 0px 4px;
  margin: 3px;
  line-height: 18px;
}
</style>
