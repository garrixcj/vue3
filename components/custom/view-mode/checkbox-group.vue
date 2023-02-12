<template lang="pug">
.rd-checkbox-group__view-text
  template(v-if="value.length > 0")
    .rd-checkbox__view-text(
      v-for="label in value"
      :key="label"
      :class="`rd-checkbox--${size}`"
    )
      i.mdi.mdi-check
      span.rd-checkbox__label
        | {{ label }}
  template(v-else)
    .rd-checkbox__view-text(:class="`rd-checkbox--${size}`")
      span.rd-checkbox__label
        | --
</template>

<script lang="ts">
import { defineComponent, inject, computed } from 'vue';
import { isArray } from 'lodash';
import { useFormItem } from 'element-plus';

export default defineComponent({
  name: 'RdViewCheckboxGroup',
  inheritAttrs: false,
  setup() {
    const slotDefault = inject('ViewMode:Slots') as Function;
    const props = slotDefault()[0].props;
    const { formItem } = useFormItem();

    // 元件尺寸
    const size = computed(() => {
      if (formItem?.size) {
        return formItem.size;
      }

      return props.size || 'default';
    });

    // 當前選定值
    const modelValue: string[] = Object.values(props.modelValue);
    const children = slotDefault()[0].children?.default();
    // * 因解析 vnode 太複雜所以使用 any
    const value = children
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc: string[], child: any) => {
        if (isArray(child.children)) {
          // eslint-disable-next-line no-param-reassign
          acc = [...acc, ...child.children];
        } else {
          acc.push(child);
        }
        return acc;
      }, [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc: string[], child: any) => {
        const label = child.props.label;
        const labelText = child.children?.default()[0].children;
        if (modelValue.indexOf(label) > -1) {
          acc.push(labelText || label);
        }
        return acc;
      }, []);

    return {
      value,
      size,
    };
  },
});
</script>

<style lang="scss" scoped>
.rd-checkbox__view-text {
  @include inline-flex-basic;
  @include space(5px);
  margin-right: 10px;
  .mdi-check {
    @include flex-basic;
    width: 14px;
    height: 14px;
    font-size: 18px;
    color: $success;
  }
  .rd-checkbox__label {
    line-height: 30px;
  }
  &.rd-checkbox--large {
    .rd-checkbox__label {
      line-height: 34px;
    }
  }
  &.rd-checkbox--small {
    .mdi-check {
      width: 14px;
      height: 14px;
      font-size: 16px;
    }
    .rd-checkbox__label {
      font-size: 14px;
      line-height: 24px;
    }
  }
}
</style>
