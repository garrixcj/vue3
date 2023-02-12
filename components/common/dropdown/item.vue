<template lang="pug">
//- 客製按鈕下拉選單
.rd-dropdown-item
  //- 群組
  li.el-dropdown-menu__item--divided(
    v-if="group && ($attrs.divided === '' || $attrs.divided === true)"
  )
  .rd-dropdown-item__content.is-group(v-if="group")
    slot
      i.mdi(v-if="$attrs.icon" :class="`mdi-${$attrs.icon}`")
      span {{ label }}
  el-dropdown-item(v-else v-bind="$attrs")
    //- router-link
    router-link.rd-dropdown-item__content(
      v-if="to"
      :to="to"
      :target="newWindow ? '_blank' : ''"
    )
      slot
        i.mdi(v-if="$attrs.icon" :class="`mdi-${$attrs.icon}`")
        span {{ label }}
    //- link
    a.rd-dropdown-item__content(
      v-else-if="link"
      :href="link"
      :target="newWindow ? '_blank' : ''"
    )
      slot
        i.mdi(v-if="$attrs.icon" :class="`mdi-${$attrs.icon}`")
        span {{ label }}
    //- normal
    .rd-dropdown-item__content(v-else)
      slot
        i.mdi(v-if="$attrs.icon" :class="`mdi-${$attrs.icon}`")
        span {{ label }}
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { type RouteLocationRaw } from 'vue-router';
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';

export default defineComponent({
  name: 'RdDropdownItem',
  components: { ElDropdown, ElDropdownMenu, ElDropdownItem },
  inheritAttrs: false,
  props: {
    // 標籤
    label: {
      type: String,
    },
    // 連結
    link: {
      type: String,
    },
    // router-link to
    to: {
      type: Object as PropType<RouteLocationRaw>,
    },
    // 另開
    newWindow: {
      type: Boolean,
    },
    // 群組標籤
    group: {
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped>
$item-paddings: (
  'small': 10px,
  'default': 15px,
  'large': 17px,
);
$item-line-height: (
  'small': 28px,
  'default': 30px,
  'large': 30px,
);

.rd-dropdown-item__content {
  color: inherit;
  text-decoration: none;
  &.is-group {
    padding: 0 map-get($item-paddings, 'default');
    font-size: 12px;
    line-height: map-get($item-line-height, 'default');
    color: $text-3;
  }
}
.el-dropdown-menu {
  .rd-dropdown-item :deep(.el-dropdown-menu__item) {
    i.el-icon {
      // 避免顯示 el-icon
      display: none;
    }
  }
  @each $size, $padding in $item-paddings {
    &--#{$size} .rd-dropdown-item__content.is-group {
      padding: 0 $padding;
      line-height: map-get($item-line-height, $size);
    }
  }
}
</style>
