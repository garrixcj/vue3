<template lang="pug">
//- sub-tab 專用 layout-content
//- 針對 sub-tab 提供連結的方式製成的layout
.rd-layout-sub-tab
  rd-sub-tabs(
    v-if="showMenu"
    :model-value="activeTab"
    :class="{ 'link-tab': isLinkTab }"
    :size="size"
    @update:model-value="changeTab"
  )
    rd-sub-tab-pane(
      v-for="tab in menu"
      :key="tab.name"
      :label="tab.label"
      :name="tab.name"
    )
      //- tab label
      template(#label)
        //- common custom label
        slot(v-if="$slots.label" name="label" :option="tab")
        //- specific custom label
        slot(v-else :name="`${tab.name}Label`" :option="tab")
          template(v-if="tab.newWindow")
            //- 新分頁
            a.label(:href="tab.href" target="_blank") {{ tab.label }}
          template(v-else-if="isLinkTab")
            //- router
            router-link.label(:to="tab.to || '#'") {{ tab.label }}
          template(v-else)
            //- 一般 tab label
            span.label {{ tab.label }}
      //- tab content
      slot(:name="tab.name")
</template>

<script lang="ts">
import { computed, defineComponent, inject, type PropType } from 'vue';
import { type RouteLocationRaw } from 'vue-router';

type TabMenu = {
  name: string;
  label: string;
  href?: string;
  to?: RouteLocationRaw;
  newWindow?: boolean;
  [key: string]: unknown;
};

export default defineComponent({
  name: 'RdLayoutSubTab',
  inheritAttrs: false,
  props: {
    // 選單 { name: 'activeTab', label: '分頁名稱' }
    menu: {
      type: Array as PropType<TabMenu[]>,
    },
    // 選單預設頁
    activeTab: {
      type: String,
      default: '',
    },
    // 頁簽標題型態 link連結/default預設純文字
    tabType: {
      type: String,
      default: 'text',
      validator: (type: string) => ['link', 'text'].indexOf(type) !== -1,
    },
    // 控制 label 的大小
    size: {
      type: String,
      default: 'default',
      validator: (val: string) => {
        const typeSet = ['default', 'large'];
        return typeSet.indexOf(val) !== -1;
      },
    },
  },
  emits: ['update:active-tab', 'new-window'],
  setup(props, { emit }) {
    // 接收上層 padding 設置(上層有就不需要，預設需要)
    const needPadding = !inject('UpLayer:hasPadding', false);

    // 切換tab觸發function
    const changeTab = (val: string) => {
      if (props.menu?.find(tab => tab.name === val && tab.newWindow)) {
        // 新分頁的 hook
        emit('new-window', val);
        emit('update:active-tab', val);
      } else {
        emit('update:active-tab', val);
      }
    };
    // 是否為連結頁簽標題
    const isLinkTab = computed(() => props.tabType === 'link');
    const showMenu = computed(() => props.menu && props.menu.length > 0);

    return {
      needPadding,
      isLinkTab,
      showMenu,
      changeTab,
    };
  },
});
</script>

<style lang="scss" scoped>
.rd-layout-sub-tab {
  .label {
    // 連結頁簽標題樣式覆蓋
    color: inherit;
    text-decoration: none;
  }
}
</style>
