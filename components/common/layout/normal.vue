<template lang="pug">
//- 含標題與內文，一般框架
//- 可以使用帶入tab
.rd-layout
  //- 標頭
  .rd-layout__header
    slot(name="title")
      h2 {{ title }}
    .after-title
      slot(name="afterTitle")
    .title-suffix
      slot(name="titleSuffix")
  //- 內文
  .rd-layout__body
    slot(name="body")
      rd-tabs.tab-menu(
        v-if="showMenu"
        :model-value="activeTab"
        :class="{ 'link-tab': isLinkTab }"
        @tab-click="changeTab"
      )
        rd-tab-pane(
          v-for="tab in menu"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
          :lazy="isLazy(tab.lazy)"
        )
          //- tab label
          template(#label)
            //- common custom label
            slot(v-if="$slots.label" name="label" :option="tab")
            //- specific custom label
            slot(v-else :name="`${tab.name}Label`" :option="tab")
              template(v-if="tab.newWindow")
                //- 新分頁
                a.link-label(:href="tab.href" target="_blank") {{ tab.label }}
              template(v-else-if="isLinkTab")
                //- router
                router-link.link-label(:to="tab.to || '#'") {{ tab.label }}
              template(v-else)
                //- 一般 tab label
                span.text-label {{ tab.label }}
          //- tab content
          slot(:name="tab.name")
</template>

<script lang="ts">
import { computed, defineComponent, provide, type PropType } from 'vue';
import { type RouteLocationRaw } from 'vue-router';
import { type TabsPaneContext } from 'element-plus/es/tokens/tabs';

type TabMenu = {
  name: string;
  label: string;
  href?: string;
  to?: RouteLocationRaw;
  newWindow?: boolean;
  lazy?: boolean;
  [key: string]: unknown;
};

export default defineComponent({
  name: 'RdLayout',
  props: {
    // 標題
    title: {
      type: String,
    },
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
  },
  emits: ['update:active-tab', 'new-window'],
  setup(props, { emit }) {
    // 該 layout 本身提供內距，下層 RdLayoutContent 不會再增加推移
    provide('UpLayer:hasPadding', true);

    // 切換tab觸發function
    const changeTab = (val: TabsPaneContext) => {
      if (val.index !== undefined && props.menu?.[+val.index].newWindow) {
        // 新分頁的 hook
        emit('new-window', val.paneName);
        emit('update:active-tab', val.paneName);
      } else {
        emit('update:active-tab', val.paneName);
      }
    };
    // 是否為連結頁簽標題
    const isLinkTab = computed(() => props.tabType === 'link');
    // 是否懶加載
    const isLazy = (tabLazy = false) => isLinkTab.value || tabLazy;
    const showMenu = computed(() => props.menu && props.menu.length > 0);

    return {
      isLinkTab,
      showMenu,
      changeTab,
      isLazy,
    };
  },
});
</script>

<style lang="scss" scoped>
.rd-layout {
  @include mainframe(&);
  height: 100%;
  overflow: auto;
  &__header {
    @include flex-basic;
    .title-suffix {
      margin-left: auto;
    }
  }
  &__body {
    .tab-menu {
      @include tab-no-line;
      :deep(.el-tabs__item.is-top:nth-child(n)) {
        // 取消 rd-tab 的 padding，由 link-label 來撐開版面
        padding: 0;
      }
      .link-label {
        // 連結頁簽標題樣式覆蓋
        display: block;
        padding: 12px 15px;
        color: inherit;
        text-decoration: none;
      }
      .text-label {
        display: block;
        padding: 12px 15px;
      }
    }
  }
}
</style>
