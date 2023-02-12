<template lang="pug">
//- 客製按鈕下拉選單
el-dropdown(v-if="options.length > 0 || $slots.dropdown" v-bind="$attrs")
  //- trigger
  slot
    rd-button.rd-dropdown-button(
      :type="currentButtonType || 'default'"
      :size="$attrs.size || 'default'"
      :class="`rd-dropdown-button__${buttonType}`"
      :disabled="$attrs.disabled"
    )
      slot(name="buttonLabel")
        span {{ label }}
        i.mdi.mdi-chevron-down
  //- dropdown menu
  template(#dropdown)
    slot(name="dropdown" :options="options")
      el-dropdown-menu
        rd-dropdown-item(
          v-for="(option, idx) in options"
          :key="idx"
          v-bind="option"
        )
          slot(v-if="$slots.item" name="item" :option="option")
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue';
import { type RouteLocationRaw } from 'vue-router';
import { ElDropdown, ElDropdownMenu } from 'element-plus';
import RdDropdownItem from './item.vue';

type ButtonType = 'default' | 'secondary' | 'primary' | '';
const customButton = ['success', 'danger'] as const;
type CustomButtonType = typeof customButton[number];

type RdDropdownItemOption = {
  // 指令
  command?: string | number | object;
  // 禁用
  disabled?: boolean;
  // 分割線
  divided?: boolean;
  // 標籤文本
  label?: string;
  // 置左icon
  icon?: string;
  // 連結
  link?: string;
  // 另開
  newWindow?: boolean;
  // router-link to
  to?: RouteLocationRaw;
  [key: string]: unknown;
};

export default defineComponent({
  name: 'RdDropdown',
  components: { ElDropdown, ElDropdownMenu, RdDropdownItem },
  inheritAttrs: false,
  props: {
    // 觸發按鈕內文
    label: {
      type: String,
    },
    // 觸發按鈕類型
    buttonType: {
      type: String as PropType<ButtonType | CustomButtonType>,
    },
    // dropdown menu item
    options: {
      type: Array as PropType<RdDropdownItemOption[]>,
      default: () => [],
    },
  },
  setup(props) {
    // 存在 rd-button 的原生樣式，若為客製化樣式則回傳預設
    const currentButtonType = computed(() =>
      customButton.find(customType => props.buttonType === customType)
        ? 'default'
        : props.buttonType,
    );

    return {
      currentButtonType,
    };
  },
});
</script>

<style lang="scss" scoped>
$custom-types: (
  'success': $success,
  'danger': $danger,
);
.rd-dropdown {
  @each $type, $color in $custom-types {
    &-button__#{$type} {
      @include outline-button($color);
    }
  }
}
</style>
