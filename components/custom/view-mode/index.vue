<i18n src="../../utils/rd/lang.json"></i18n>
<template lang="pug">
template(v-if="hasModify")
  //- 修改模式
  slot
template(v-else)
  //- 檢視模式
  slot(name="view")
    span(v-if="!component") {{ label }}
    component(:is="`RdView${component}`" v-else v-bind="$attrs")
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, provide } from 'vue';
import { useI18n } from 'vue-i18n';

// 大小
const components = [
  'DatePicker',
  'TimePicker',
  'Checkbox',
  'CheckboxGroup',
  'Select',
  'Switch',
  'RadioGroup',
];

export default defineComponent({
  // 檢視模式元件公版
  name: 'ViewMode',
  components: {
    RdViewDatePicker: defineAsyncComponent(() => import('./date.vue')),
    RdViewTimePicker: defineAsyncComponent(() => import('./time.vue')),
    RdViewCheckbox: defineAsyncComponent(() => import('./checkbox.vue')),
    RdViewCheckboxGroup: defineAsyncComponent(
      () => import('./checkbox-group.vue'),
    ),
    RdViewSelect: defineAsyncComponent(() => import('./select.vue')),
    RdViewSwitch: defineAsyncComponent(() => import('./switch.vue')),
    RdViewRadioGroup: defineAsyncComponent(() => import('./radio-group.vue')),
  },
  inheritAttrs: false,
  props: {
    // 檢視模式
    hasModify: { type: Boolean, default: false },
    // 檢視模式文字
    label: { type: String, default: '--' },
    // 套用元件
    component: {
      type: String,
      validator: (name: string) => components.indexOf(name) !== -1,
    },
  },
  setup(props, { slots }) {
    // Init
    const { t } = useI18n({ useScope: 'local' });
    provide('ViewMode:Slots', slots.default);

    return {
      t,
    };
  },
});
</script>
