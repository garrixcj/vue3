<template lang="pug">
//- Menu Tab 功能列表
.menu-tabs(:class="{ 'is-collapsed': collapsed }")
  .tabs-nav
    //- 分頁
    .tab-label(
      v-for="tab in tabs"
      :class="{ 'is-active': tab.name === activeTab }"
      @click="changeTab(tab.name)"
    )
      i(:class="tab.icon")
    //- 當前分頁底線
    .active-bar
  .tab-pane-active
    keep-alive
      component(:is="activeComponent")
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  useCssVars,
  defineAsyncComponent,
  inject,
} from 'vue';
import { useI18n } from 'vue-i18n';
// import { useMenuStore } from '@/stores/menu';

export default defineComponent({
  name: 'MenuTabs',
  components: {
    Menu: defineAsyncComponent(() => import('./menu.vue')),
    FavoriteMenu: defineAsyncComponent(() => import('./favorite.vue')),
    RecordMenu: defineAsyncComponent(() => import('./record.vue')),
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    // const menuStore = useMenuStore();
    // Tabs
    const tabs = ref([
      {
        name: 'menu',
        icon: 'mdi mdi-view-dashboard',
        component: 'menu',
      },
      {
        name: 'favorite',
        icon: 'mdi mdi-star',
        component: 'favorite-menu',
      },
      {
        name: 'history',
        icon: 'mdi mdi-history',
        component: 'record-menu',
      },
    ]);
    const activeTab = ref('menu');

    const collapsed = inject('Main:Collapsed');

    // 當前執行分頁索引
    const activeTabIndex = computed(() => {
      const currentIndex = tabs.value
        .map(tab => tab.name)
        .indexOf(activeTab.value);
      return currentIndex >= 0 ? currentIndex : 0;
    });

    // 當前執行分頁內容元件名稱
    const activeComponent = computed(() => {
      return tabs.value[activeTabIndex.value].component;
    });

    // active bar 的位移距離
    const displacement = computed(() => {
      return activeTabIndex.value * 70;
    });
    useCssVars(() => ({
      'active-displacement': `${displacement.value}px`,
    }));

    /**
     * 換頁
     * @param {string} tab 即將跳轉的分頁
     */
    const changeTab = (tab: string) => {
      activeTab.value = tab;
    };

    // // 取得我的最愛
    // menuStore.getFavorite();
    // // 取得歷史紀錄
    // menuStore.getVisited();

    return { tabs, activeTab, activeComponent, changeTab, collapsed, t };
  },
});
</script>

<style lang="scss" scoped>
$tab-width: 70px;
$tab-height: 50px;
$tab-bar-height: 2px;
$menu-tabs-width: 3 * $tab-width;
$logo-height: 56px;
$menu-tabs-height: calc(100% - #{$logo-height});
$tab-content-height: calc(100% - #{$tab-height});

// 側欄選單分頁
.menu-tabs {
  width: $menu-tabs-width;
  height: $menu-tabs-height;
  box-shadow: 8px 0 10px -6px rgba(33, 33, 33, 0.2);
  transition: all 0.3s;
  // Tabs 觸發點按鈕集合
  .tabs-nav {
    @include flex-basic(center);
    position: relative;
    height: $tab-height;
    // Tab 名稱
    .tab-label {
      @include flex-basic(center);
      width: $tab-width;
      height: $tab-height;
      color: $text-1;
      cursor: pointer;
      border-bottom: 1px solid $background-3;
      &.is-active {
        color: $focus-1;
      }
      &:hover {
        background-color: $background-5;
      }
    }
    //- Tab 底線
    .active-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: $tab-width;
      height: $tab-bar-height;
      background-color: $focus-1;
      transition: transform 0.3s;
      transform: translateX(var(--active-displacement));
    }
  }
  // Tab 內容
  .tab-pane-active {
    height: $tab-content-height;
  }
  // 縮合
  &.is-collapsed {
    width: $tab-width;
    .tab-label:not(.is-active) {
      display: none;
    }
    .active-bar {
      transform: translateX(0px);
    }
  }
}
</style>
