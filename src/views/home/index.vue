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
router-view
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed, watch } from 'vue';
// import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
// import { onBeforeRouteUpdate } from "vue-router";
// import { useWs } from '@/plugins/websocket';
// import isEmpty from "lodash/isEmpty";
// import NavBar from './nav/index.vue';
// import MenuTabs from './menu/index.vue';

export default defineComponent({
  name: 'Index',
  components: {
    // NavBar,
    // MenuTabs,
  },
  setup() {
    // const { t, locale } = useI18n();
    const store = useStore();
    // const ws = useWs();
    // // 按鈕縮合功能
    // const collapsed = ref(false);
    // const isOpen = ref(false);
    // const pin = ref(true);
    // Loading
    // const loading = ref(false);
    // const mainLoading = computed(() => {
    //   return store.getters['loading/mainLoading'];
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
    //   return store.getters['operator/operator']?.id;
    // });
    // watch(
    //   () => operatorId.value,
    //   value => {
    //     const isConnected = store.getters['websocket/isConnected'];
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
    //   return store.getters['display/mainView'];
    // });
    // // 切換Router時元件行為(升降loading)
    // onBeforeRouteUpdate((to, from, next) => {
    //   // 先持續Loading
    //   store.commit("loading/setIndexLoading", true);
    //   if (to.path === from.path) {
    //     if (isEmpty(to.query)) {
    //       // 再重新產生iframe製造重整效果
    //       store.dispatch("display/reloadMainViewWithPermission");
    //       next();
    //     } else {
    //       setTimeout(() => {
    //         store.commit("loading/setIndexLoading", false);
    //       }, 500);
    //       next();
    //     }
    //   } else {
    //     // Path裡ID更換，且導到同一個route時
    //     if (to.name === from.name) {
    //       setTimeout(() => {
    //         store.commit("loading/setIndexLoading", false);
    //       }, 500);
    //     }
    //     setTimeout(() => {
    //       store.commit("loading/setIndexLoading", false);
    //     }, 500);
    //     next();
    //   }
    // });

    return {
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

<style lang="scss" scoped></style>
