<template lang="pug">
//- <i18n src="./lang.json"></i18n>
//- a-layout#main-layout(v-loading="loading")
//-   //- Menu 側欄
//-   a-layout-sider#menu(
//-     theme="light"
//-     collapsed-width="70"
//-     collapsible
//-     :collapsed="collapsed"
//-     :trigger="null"
//-     :width="210"
//-     @mouseover="expandMenu(true)"
//-     @mouseleave="expandMenu(false)"
//-   )
//-     .logo {{ collapsed ? t('control_system').substr(0, 1) : t('control_system') }}
//-     menu-tabs
//-   //- 右側主畫面
//-   a-layout
//-     nav-bar(@collapse="pinMenu")
//-     //- 內文
//-     a-layout-content#main-panel(v-loading="mainLoading")
//-       router-view(v-if="mainView")
el-container#main-layout
  rd-information
    rd-button(@click="layoutTest = !layoutTest") Layout
  el-header#main-header(v-if="layoutTest")
    .logo Logo
    .nav-bar Header
  el-container#main-body(:style="layoutTest ? '' : 'height: 100%'")
    el-aside#main-menu(v-if="layoutTest") Menu
    el-main#main-panel
      //- rd-scrollbar
      router-view
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed, watch } from 'vue';
// import { useI18n } from 'vue-i18n';
import { useLoadingStore } from '@/stores/loading';
import { useOperatorStore } from '@/stores/operator';
import { useWebSocketStore } from '@/stores/websocket';
import { useDisplayStore } from '@/stores/display';
// import { onBeforeRouteUpdate } from "vue-router";
// import { useWs } from '@/plugins/websocket';
// import isEmpty from "lodash/isEmpty";
// import NavBar from './nav/index.vue';
// import MenuTabs from './menu/index.vue';
import { ElContainer, ElHeader, ElAside, ElMain } from 'element-plus';

export default defineComponent({
  name: 'Index',
  components: {
    ElContainer,
    ElHeader,
    ElAside,
    ElMain,
    // NavBar,
    // MenuTabs,
  },
  setup() {
    // const { t, locale } = useI18n();
    const layoutTest = ref(false);
    // const loadingStore = useLoadingStore();
    // const operatorStore = useOperatorStore();
    // const webSocketStore = useWebSocketStore();
    // const displayStore = useDisplayStore();
    // const ws = useWs();
    // // 按鈕縮合功能
    // const collapsed = ref(false);
    // const isOpen = ref(false);
    // const pin = ref(true);
    // Loading
    // const loading = ref(false);
    // const mainLoading = computed(() => {
    //   return loadingStore.mainLoading;
    // });

    // // 開關縮合側欄 Menu (固定)
    // const pinMenu = () => {
    //   pin.value = !pin.value;
    //   collapsed.value = !collapsed.value;
    // };

    // // 暫時開關縮合側欄 Menu (Hover)
    // const expandMenu = (enter: boolean) => {
    //   if (!pin.value) {
    //     collapsed.value = !enter;
    //   }
    // };

    // 連上 websocket
    // const operatorId = computed(() => {
    //   return operatorStore.operator.id;
    // });
    // watch(
    //   () => operatorId.value,
    //   value => {
    //     const isConnected = webSocketStore.socket.isConnected;
    //     if (value && !isConnected) {
    //       ws.connect();
    //     } else if (isConnected) {
    //       ws.disconnect();
    //     }
    //   },
    //   { immediate: true },
    // );

    // // Main Layout 的 Global提供
    // provide("Locale", locale);
    // provide("menuCollapsed", collapsed);
    // provide("fullLoading", loading);

    // 主區塊重整機制
    // const mainView = computed(() => {
    //   return displayStore.mainView;
    // });
    // // 切換Router時元件行為(升降loading)
    // onBeforeRouteUpdate((to, from, next) => {
    //   // 先持續Loading
    //   loadingStore.index = true;
    //   if (to.path === from.path) {
    //     if (isEmpty(to.query)) {
    //       // 再重新產生iframe製造重整效果
    //       displayStore.reloadMainViewWithPermission();
    //       next();
    //     } else {
    //       setTimeout(() => {
    //         loadingStore.index = false;
    //       }, 500);
    //       next();
    //     }
    //   } else {
    //     // Path裡ID更換，且導到同一個route時
    //     if (to.name === from.name) {
    //       setTimeout(() => {
    //         loadingStore.index = false;
    //       }, 500);
    //     }
    //     setTimeout(() => {
    //       loadingStore.index = false;
    //     }, 500);
    //     next();
    //   }
    // });

    return {
      layoutTest,
      // t,
      // isOpen,
      // collapsed,
      // pinMenu,
      // loading,
      // mainLoading,
      // expandMenu,
      // mainView,
    };
  },
});
</script>

<style lang="scss" scoped>
$menu-width: 210px;
$collapsed-width: 70px;
$header-height: 56px;

#main {
  // 全外框
  &-layout {
    min-width: 767px;
    height: 100%;
  }
  &-header {
    @include flex-basic;
    height: $header-height;
    .logo {
      width: $menu-width;
      @include flex-basic;
      transition: width 0.3s;
    }
    .nav-bar {
      @include flex-basic;
      flex: 1;
      height: 100%;
      color: white;
      background-image: linear-gradient(90deg, #465570, #758eb0);
    }
  }
  &-body {
    height: calc(100% - $header-height);
  }
  &-menu {
    width: $menu-width;
    border: 1px solid $success;
  }
  // 內文
  &-panel {
    width: 100%;
    background: $background-5;
  }
  // 縮合
  &-layout.collapsed {
    #main-header .logo {
      width: $collapsed-width;
    }
  }
}
</style>
