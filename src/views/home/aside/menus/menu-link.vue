<template lang="pug">
//- Old version qstr window open
a.menu-link(
  v-if="windowOpen"
  href="javascript:void(0)"
  :class="$attrs.class"
  :onclick="menu.qstr"
  v-html="menu.text"
)
//- 另開
a.menu-link(
  v-else-if="menu.open_new"
  :class="$attrs.class"
  :href="`${menu.route}${menu.qstr}`"
  target="_blank"
  @click.exact="menuClick()"
  v-html="menu.text"
)
//- 不另開
router-link.menu-link(v-else v-slot="{ href }" :to="menu.route")
  span(@click.native.exact="menuClick()" v-html="menu.text")
</template>

<script lang="ts">
import { computed, defineComponent, type PropType } from 'vue';
// router
import { useRouter } from 'vue-router';
// store
import { useLoadingStore } from '@/stores/loading';
import { useDisplayStore } from '@/stores/display';
import { useOperatorStore } from '@/stores/operator';
// import { useMenuStore } from '@/stores/menu';

// api
import systemApi from '@/api/system';
// component
import type { MenuItem } from './menu';
// lib
import { codeMap } from '@/plugins/errorcode';

export default defineComponent({
  name: 'MenuLink',
  props: {
    menu: {
      type: Object as PropType<MenuItem>,
      required: true,
    },
  },
  setup(props) {
    const loadingStore = useLoadingStore();
    const displayStore = useDisplayStore();
    const operatorStore = useOperatorStore();
    // const menuStore = useMenuStore();
    const router = useRouter();

    // 另開新分頁 (qstr 參數 window.open)
    const windowOpen = computed(() => {
      return props.menu.qstr && props.menu.qstr.indexOf('window.open') !== -1;
    });

    // 主區塊 reload
    const mainReload = () => {
      // 點選同一個選項製造重整效果
      if (
        !(props.menu.open_new || windowOpen.value) &&
        props.menu.route === router.currentRoute.value.fullPath
      ) {
        loadingStore.index = true;
        displayStore.reloadMainView();
        // 重整後取消 index loading
        setTimeout(() => {
          loadingStore.index = false;
        }, 500);
      }
    };

    // 檢查選單權限
    const checkPermission = () => {
      operatorStore.checkSession().then(resp => {
        if (resp.data.result) {
          const permissions = Object.values(
            resp.data.data.permissions as () => MenuItem[],
          );
          // 取得所有權限資料 (ID)
          const ids = permissions.map(item => item.id);

          // 沒有權限
          if (ids.indexOf(props.menu.id) === -1) {
            // 原本就在沒權限的頁面，將 loading 取消
            if (router.currentRoute.value.path === '/forbidden') {
              loadingStore.index = false;
            }
            router.replace('/forbidden');
            // menuStore.setMenu();
          } else {
            // 有權限時檢查是否在維護狀態
            return systemApi
              .getFeatureEntranceMaintenanceStatus(props.menu.name)
              .then(resp => {
                if (resp.data.result && resp.data.data.status) {
                  router.replace(
                    `/error_page?date=${resp.data.data.end_time}&dict=${resp.data.data.dict}&code=${codeMap.featureMaintain}&name=${resp.data.data.perm_name}`,
                  );
                }
              });
          }
        }
      });
    };

    // 點擊選單
    const menuClick = () => {
      // 是否為另開分頁
      if (props.menu.open_new) {
        // 加入瀏覽記錄
        // menuStore.setVisited(props.menu.id);
      } else {
        // 顯示 loading
        mainReload();
        // 檢查選單權限 (首頁不檢查)
        if (props.menu.id !== 0) {
          checkPermission();
        }
      }
    };

    return { menuClick, windowOpen };
  },
});
</script>

<style lang="scss" scoped>
.menu-link {
  color: $text-1;
  text-decoration: none;
  &:hover {
    color: $focus-1;
  }
  // 搜尋後關鍵字語法高亮
  :deep(.search-highlight) {
    background-color: yellow;
  }
}
</style>
