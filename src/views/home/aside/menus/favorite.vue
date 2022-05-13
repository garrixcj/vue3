<template lang="pug">
//- 我的最愛功能導覽
.favorite-menu(v-if="!menuCollapsed")
  //- 排序功能組
  transition(name="el-fade-in-linear" mode="out-in")
    .sort-action(v-if="sorting")
      sd-button.act-btn(
        type="secondary"
        icon="mdi mdi-close"
        size="icon-small"
        @click="cancelSort"
      )
      sd-button.act-btn(
        type="primary"
        icon="mdi mdi-check"
        size="icon-small"
        @click="saveSort"
      )
    .sort-action(v-else)
      sd-button.act-btn(
        type="transparent"
        icon="mdi mdi-pencil"
        size="icon-small"
        @click="editSort"
      )
  //- 功能列表
  .favorite-menu-list(v-if="!sorting")
    menu-item(
      v-for="(item, id) in menuList"
      :key="id"
      type="node"
      :menu="item"
    )
  draggable.sort-menu-list(v-else item-key="id" :list="menuList")
    template(#item="{ element }")
      menu-item(type="node" sort :menu="element")
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed, watch } from 'vue';
import { useMenuStore } from '@/stores/menu';
import { usePermissionStore } from '@/stores/permission';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import MenuItem from './menu-item.vue';
import Draggable from 'vuedraggable';
// import { notify } from '@/components/utils/notification';
import type { MenuItem as MenuItemType } from './menu';

export default defineComponent({
  name: 'FavoriteMenu',
  components: { MenuItem, Draggable },
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
    const favoriteList = computed<(number | string)[]>(
      () => menuStore.favorite,
    );

    // INIT (取得我的最愛列表)
    const init = () => {
      menuList.value = originList.value
        .filter(menu => favoriteList.value.indexOf(menu.id) !== -1)
        .map(menu => ({
          ...menu,
          text: t(menu.dict),
          active: menu.route === router.currentRoute.value.path,
        }));
    };

    // 排序
    const sorting = ref(false);
    const sending = ref(false);
    const sortMenuTmp = ref<MenuItemType[]>([]);
    const editSort = () => {
      sorting.value = true;
      sortMenuTmp.value = [...menuList.value];
    };
    const cancelSort = () => {
      sorting.value = false;
      menuList.value = sortMenuTmp.value;
    };
    const saveSort = () => {
      if (sending.value || !sorting.value) {
        // in proccess dont save
        return;
      }

      // const list = menuList.value.map(menu => menu.id);
      sending.value = true;
      // menuStore.setFavorite(list).then(resp => {
      //   if (resp.data.result) {
      //     sorting.value = false;
      //     notify.success({
      //       message: t('edit_success'),
      //     });
      //   }
      //   sending.value = false;
      // });
    };

    // created 取得
    init();
    // favorite改變，重新取得
    watch(
      () => favoriteList.value,
      () => {
        init();
      },
      { deep: true },
    );
    // 權限有異動，資料重新取得
    watch(permissionStore.permissions, () => {
      // permissionStore.getFavorite();
      init();
    });

    return { sorting, menuList, menuCollapsed, editSort, cancelSort, saveSort };
  },
});
</script>

<style lang="scss" scoped>
// 側欄選單分頁 - 一般狀態
.favorite-menu {
  @include flex-basic(flex-start, flex-start) {
    flex-direction: column;
  }
  height: 100%;

  .sort-action {
    width: 100%;
    padding: 8px;
    @include flex-basic(flex-end);
    .act-btn + .act-btn {
      margin-left: 5px;
    }
  }

  .favorite-menu-list,
  .sort-menu-list {
    width: 100%;
    height: calc(100% - 40px);
    @include scrollbar() {
      overflow-x: hidden;
    }
  }
}
</style>
