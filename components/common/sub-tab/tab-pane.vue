<template lang="pug">
//- 將 label 傳送至 .rd-sub-tab-nav 底下
teleport(v-if="isMounted" :to="`#${navId}`")
  .rd-sub-tab-label(
    :class="[{ active: activeKey === name }, `is-${labelSize}`]"
    @click="updateActiveKey(name)"
  )
    slot(name="label")
      .label {{ label }}

//- SubTab 的內容
.rd-sub-tab-pane(v-if="activeKey === name")
  slot
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'RdSubTabPane',
  props: {
    // tab-pane key
    name: {
      type: String,
    },
    // tab 標籤
    label: {
      type: String,
    },
  },
  setup() {
    // Nav teleport 目標
    const navId = inject('RdSubTabs:navId');
    // Nav teleport 目標是否已經 mounted
    const isMounted = inject('RdSubTabs:isMounted');
    // active tab key
    const activeKey = inject('RdSubTabs:activeKey');
    // 更新 active tab key
    const updateActiveKey: Function = inject(
      'RdSubTabs:updateValue',
      () => false,
    );
    // label size
    const labelSize = inject('RdSubTabs:size', 'default');

    return {
      isMounted,
      activeKey,
      navId,
      labelSize,
      updateActiveKey,
    };
  },
});
</script>

<style lang="scss" scoped>
@mixin sub-tab-label {
  :slotted(.label) {
    @content;
  }
  .label {
    @content;
  }
}
.rd-sub-tab-label {
  // label 基本樣式
  display: flex;
  align-items: center;
  font-weight: 500;
  color: $text-3;
  cursor: pointer;
  background-color: $background-4;
  border-radius: 20px;
  transition: color 0.3s ease, background-color 0.3s ease;
  @include sub-tab-label {
    padding: 2px 15px;
    line-height: 20px;
  }
  &.is-large {
    @include sub-tab-label {
      // size large
      padding: 6px 18px;
      line-height: 18px;
    }
  }
  &.active {
    // label 被點選後呈現的樣式
    color: $white;
    background-color: $primary;
  }
}
</style>
