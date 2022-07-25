<template lang="pug">
el-config-provider(:locale="elLocale")
//- //- 有外框版
//- el-container#main-layout(v-loading="loading")
//-   rd-information
//-     rd-button(@click="layoutTest = !layoutTest") Layout
//-   aside-menu(
//-     v-if="layoutTest"
//-     @mouseover="expandMenu(true)"
//-     @mouseleave="expandMenu(false)"
//-   )
//-   el-container#main-body(:style="layoutTest ? '' : 'height: 100%'")
//-     header-navbar(v-if="layoutTest" @collapse="pinMenu")
//-     el-main#main-panel(v-loading="mainLoading")
//-       //- rd-scrollbar
//-       router-view
//- 無外框版
el-container#main-layout(v-loading="loading")
  el-container#main-body(:style="'height: 100%'")
    el-main#main-panel(v-loading="mainLoading")
      router-view
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLoadingStore } from '@/stores/loading';
import { useOperatorStore } from '@/stores/operator';
import { useWebSocketStore } from '@/stores/websocket';
import { useDisplayStore } from '@/stores/display';
import { onBeforeRouteUpdate } from 'vue-router';
import { useWs } from '@/plugins/websocket';
import isEmpty from 'lodash/isEmpty';
import { ElContainer, ElMain } from 'element-plus';
import HeaderNavbar from './header/index.vue';
import AsideMenu from './aside/index.vue';
// Element locale
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import zhTw from 'element-plus/lib/locale/lang/zh-tw';
import en from 'element-plus/lib/locale/lang/en';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const elLocaleMap: Record<string, any> = {
  'zh-tw': zhTw,
  'zh-cn': zhCn,
  en: en,
};

export default defineComponent({
  name: 'AppIndex',
  components: {
    ElConfigProvider,
    ElContainer,
    ElMain,
    HeaderNavbar,
    AsideMenu,
  },
  setup() {
    const layoutTest = ref(true);

    const { t, locale } = useI18n();
    const elLocale = computed(() => elLocaleMap[locale.value] || en);
    // Main Layout Locale
    provide('Main:Locale', locale);

    // Main Layout Loading
    const loading = ref(false);
    provide('Main:Loading', loading);
    // Main View Loading
    const loadingStore = useLoadingStore();
    const mainLoading = computed(() => {
      return loadingStore.mainLoading;
    });
    // 按鈕縮合功能
    const collapsed = ref(false);
    const pin = ref(true);
    // 開關縮合側欄 Menu (固定)
    const pinMenu = () => {
      pin.value = !pin.value;
      collapsed.value = !collapsed.value;
    };
    // 暫時開關縮合側欄 Menu (Hover)
    const expandMenu = (enter: boolean) => {
      if (!pin.value) {
        collapsed.value = !enter;
      }
    };
    // Main Layout Collapsed
    provide('Main:Collapsed', collapsed);

    const displayStore = useDisplayStore();

    // 主區塊重整機制
    const mainView = computed(() => {
      return displayStore.mainView;
    });
    // 切換 Router 時元件行為 (升降 loading)
    onBeforeRouteUpdate((to, from, next) => {
      // 先持續 Loading
      loadingStore.index = true;
      if (to.path === from.path) {
        if (isEmpty(to.query)) {
          // 再重新產生 iframe 製造重整效果
          displayStore.reloadMainViewWithPermission();
          next();
        } else {
          setTimeout(() => {
            loadingStore.index = false;
          }, 500);
          next();
        }
      } else {
        // Path 裡 ID 更換，且導到同一個 route 時
        if (to.name === from.name) {
          setTimeout(() => {
            loadingStore.index = false;
          }, 500);
        }
        setTimeout(() => {
          loadingStore.index = false;
        }, 500);
        next();
      }
    });

    const operatorStore = useOperatorStore();
    const webSocketStore = useWebSocketStore();
    const ws = useWs();

    // 連上 websocket
    const operatorId = computed(() => {
      return operatorStore.operator.id;
    });
    watch(
      () => operatorId.value,
      value => {
        const isConnected = webSocketStore.isConnected;
        if (!value && !isConnected) {
          ws.connect();
        } else if (isConnected) {
          ws.disconnect();
        }
      },
      { immediate: true },
    );

    return {
      layoutTest,
      t,
      elLocale,
      collapsed,
      pinMenu,
      loading,
      mainLoading,
      expandMenu,
      mainView,
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
    flex-direction: column;
  }
  &-aside {
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
