<template lang="pug">
//- 歷史紀錄功能導覽
.record-menu(v-if="!menuCollapsed")
  //- 功能列表
  .record-menu-list
    menu-item(
      v-for="(item, id) in menuList"
      :key="id"
      type="node"
      :menu="item"
    )
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed, watch } from 'vue';
import { useMenuStore } from '@/stores/menu';
import { usePermissionStore } from '@/stores/permission';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import MenuItem from './menu-item.vue';
import type { MenuItem as MenuItemType } from './menu';

export default defineComponent({
  name: 'RecordMenu',
  components: { MenuItem },
  setup() {
    const menuStore = useMenuStore();
    const permissionStore = usePermissionStore();
    const { t } = useI18n({ useScope: 'parent' });
    const router = useRouter();

    const menuCollapsed = inject('Main:Collapsed');

    const menuList = ref<MenuItemType[]>([]);

    const originList = computed<MenuItemType[]>(
      () => menuStore.menu as MenuItemType[],
    );
    const recordList = computed<(number | string)[]>(() => menuStore.visited);

    // INIT (取得我的最愛列表)
    const init = () => {
      menuList.value = originList.value
        .filter(menu => recordList.value.indexOf(menu.id) !== -1)
        .sort(
          (a, b) =>
            recordList.value.indexOf(a.id) - recordList.value.indexOf(b.id),
        )
        .map(menu => ({
          ...menu,
          text: t(menu.dict),
          active: menu.route === router.currentRoute.value.path,
        }));
    };

    // created 取得
    init();
    // record改變，重新取得
    watch(
      () => recordList.value,
      () => {
        init();
      },
      { deep: true },
    );
    // 權限有異動，資料重新取得
    watch(permissionStore.permissions, () => {
      // menuStore.getVisited();
      init();
    });

    return { menuList, menuCollapsed };
  },
});
</script>

<style lang="scss" scoped>
// 側欄選單分頁 - 一般狀態
.record-menu {
  height: 100%;
  margin: 14px 0;
  @include flex-basic(flex-start, flex-start) {
    flex-direction: column;
  }

  .record-menu-list {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    @include scrollbar() {
      overflow-x: hidden;
    }
  }
}
</style>
