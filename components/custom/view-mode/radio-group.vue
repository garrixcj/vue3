<template lang="pug">
.rd-radio__view-text
  | {{ value || '--' }}
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { isArray } from 'lodash';

export default defineComponent({
  name: 'RdViewRadioGroup',
  inheritAttrs: false,
  setup() {
    const slotDefault = inject('ViewMode:Slots') as Function;
    const props = slotDefault()[0].props;
    // 當前選定值
    const modelValue = props.modelValue;
    // * 因解析 vnode 太複雜所以使用 any
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const children = slotDefault()[0]
      .children?.default()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc: any[], child: any) => {
        if (isArray(child.children)) {
          // eslint-disable-next-line no-param-reassign
          acc = [...acc, ...child.children];
        } else {
          acc.push(child);
        }
        return acc;
      }, []);

    const value = ref('');
    // * 因解析vnode太複雜所以使用any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children.forEach((child: any) => {
      const label: string = child.props.label;
      const labelText: string = child.children?.default()[0].children;
      if (modelValue === label) {
        value.value = labelText || label;
      }
    });

    return {
      value,
    };
  },
});
</script>
