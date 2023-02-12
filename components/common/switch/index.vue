<template lang="pug">
el-switch.rd-switch(
  v-bind="$attrs"
  :active-text="activeText"
  :inactive-text="inactiveText"
  :class="[typeClass, 'switch-core', coreIconClass]"
  :width="36"
)
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue';
import { ElSwitch } from 'element-plus';

// theme
type SwitchType = 'success' | 'danger' | 'info';
// 核心 icon
type SwitchCoreIcon = 'check' | 'close' | 'stop';
// 設置
type SwitchSet = {
  type: SwitchType; // 基礎型態
  coreIcon?: SwitchCoreIcon; // 核心 icon
  text?: string; // 顯示文字 (與開關設置同側時文本)
  inverseText?: string; // 反向顯示文字 (與開關設置不同側時文本)
};

export default defineComponent({
  name: 'RdSwitch',
  components: { ElSwitch },
  props: {
    // 開啟狀態設置
    active: {
      type: [String, Object] as PropType<SwitchType | SwitchSet>,
    },
    inactive: {
      type: [String, Object] as PropType<SwitchType | SwitchSet>,
    },
  },
  setup(props, { attrs, expose }) {
    // attrs 不會判斷 model-value / modelValue
    const modelValue = computed(() =>
      typeof attrs.modelValue !== 'undefined'
        ? attrs.modelValue
        : attrs['model-value'],
    );
    // 開關是否開啟
    const trueCase = computed(() => {
      if (
        typeof attrs['active-value'] !== 'undefined' ||
        typeof attrs.activeValue !== 'undefined'
      ) {
        return (
          modelValue.value === (attrs['active-value'] || attrs.activeValue)
        );
      }
      if (
        typeof attrs['inactive-value'] !== 'undefined' ||
        typeof attrs.inactiveValue !== 'undefined'
      ) {
        return (
          modelValue.value !== (attrs['inactive-value'] || attrs.inactiveValue)
        );
      }
      return !!modelValue.value;
    });

    // core icon class
    const activeIcon = computed(() => {
      if (
        typeof props.active !== 'undefined' &&
        typeof props.active !== 'string'
      ) {
        return props.active?.coreIcon || 'check';
      }
      return 'check';
    });
    const inactiveIcon = computed(() => {
      if (
        typeof props.inactive !== 'undefined' &&
        typeof props.inactive !== 'string'
      ) {
        return props.inactive?.coreIcon || 'close';
      }
      return 'close';
    });
    const coreIconClass = computed(
      () =>
        `switch-core__${
          trueCase.value ? activeIcon.value : inactiveIcon.value
        }`,
    );

    // type class
    const activeType = computed(() => {
      if (
        typeof props.active !== 'undefined' &&
        typeof props.active !== 'string'
      ) {
        return props.active.type || 'success';
      }
      return props.active || 'success';
    });
    const inactiveType = computed(() => {
      if (
        typeof props.inactive !== 'undefined' &&
        typeof props.inactive !== 'string'
      ) {
        return props.inactive.type || 'info';
      }
      return props.inactive || 'info';
    });

    const typeClass = computed(
      () =>
        `switch-core__${
          trueCase.value ? activeType.value : inactiveType.value
        } switch-background__${
          trueCase.value ? activeType.value : inactiveType.value
        }`,
    );

    // 右側文字
    const activeText = computed(() => {
      if (attrs.activeText || attrs['active-text']) {
        // 上層有設置
        return (attrs.activeText || attrs['active-text']) as string;
      }
      if (
        typeof props.active !== 'undefined' &&
        typeof props.active !== 'string'
      ) {
        // active 設置
        return (
          (trueCase.value ? props.active.text : props.active.inverseText) || ''
        );
      }
      return '';
    });
    // 左側文字
    const inactiveText = computed(() => {
      if (attrs.inactiveText || attrs['inactive-text']) {
        // 上層有設置
        return (attrs.inactiveText || attrs['inactive-text']) as string;
      }
      if (
        typeof props.inactive !== 'undefined' &&
        typeof props.inactive !== 'string'
      ) {
        // active 設置
        return (
          (!trueCase.value
            ? props.inactive.text
            : props.inactive.inverseText) || ''
        );
      }
      return '';
    });

    expose({ activeText });

    return {
      trueCase,
      coreIconClass,
      typeClass,
      activeText,
      inactiveText,
    };
  },
});
</script>

<style lang="scss" scoped>
// 核心顏色
$switch-core-types: (
  'success': $success,
  'info': $info,
  'danger': $danger,
);
@mixin core-color() {
  @each $type, $color in $switch-core-types {
    &.switch-core__#{$type} {
      :deep(.el-switch__core) .el-switch__action {
        background-color: $color;
      }
      :deep(.el-switch__label--right) {
        color: $color;
      }
    }
  }
}

// 底色
$switch-bg-types: (
  'success': #d9f5e9,
  'info': #e5e8eb,
  'danger': #ffe8eb,
);
@mixin bg-color() {
  @each $type, $color in $switch-bg-types {
    &.switch-background__#{$type} {
      :deep(.el-switch__core) {
        background-color: $color;
        border-color: $color;
      }
    }
  }
}

// Icon
$switch-core-icons: (
  // mdi-check
  'check': '\F012C',
  // mdi-minus
  'stop': '\F0374',
  // mdi-close
  'close': '\F0156'
);
@mixin core-icon() {
  @each $icon, $content in $switch-core-icons {
    &.switch-core__#{$icon} {
      :deep(.el-switch__core) .el-switch__action::after {
        content: $content;
      }
    }
  }
}
.rd-switch {
  &.switch-core {
    :deep(.el-switch__core) .el-switch__action::after {
      display: inline-block;
      font-family: 'Material Design Icons';
      font-size: 12px;
      font-weight: 700;
      line-height: 16px;
      color: #fff;
      text-align: center;
    }
  }
  @include core-icon;
  @include core-color;
  @include bg-color;
}
</style>
