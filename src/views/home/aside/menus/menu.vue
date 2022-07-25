<template lang="pug">
//- Menu 功能導覽
.menu(:class="{ 'is-collapsed': collapsed }")
  //- 關鍵字 (custom)
  .keywords(v-show="!collapsed")
    rd-input.keywords-input(v-model:value="search" placeholder="Search")
      template(#prefix)
        i.mdi.mdi-magnify.keywords-prefix-icon
  //- 功能列表
  .menu-list
    menu-item(
      v-for="(item, id) in menuList"
      :key="item.id"
      type="category"
      :menu="item"
    )
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed } from 'vue';
import MenuItem from './menu-item.vue';
import { useMenuStore } from '@/stores/menu';
import { usePermissionStore } from '@/stores/permission';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import strmatcher from '@/components/utils/string-match';
import type { MenuItem as MenuItemType } from './menu';

export default defineComponent({
  name: 'MenuTab',
  components: { MenuItem },
  setup() {
    const { t } = useI18n({ useScope: 'parent' });
    const router = useRouter();
    const collapsed = inject('Main:Collapsed');
    // 搜尋字串
    const search = ref('');
    const menuStore = useMenuStore();
    const permissionStore = usePermissionStore();

    // 取得 menu
    // menuStore.setMenu();
    // 首頁
    const home: MenuItemType = {
      dict: 'go_home',
      host: 'VI_HOST',
      icon: 'mdi-home',
      id: 0,
      name: 'home',
      note: '首頁',
      parent: 0,
      route: '/home',
      type: 'Menu',
    };

    const menuList = computed(() => {
      // 原生 menu
      const originMenu = (menuStore.menu as MenuItemType[]) || [];
      // 有權限的功能 id
      const permIds = permissionStore.permissionIds;

      // 過濾 menu
      let filteredMenu: MenuItemType[] = [
        home,
        ...originMenu.filter(menu => permIds.indexOf(+menu.id) !== -1),
      ].map(menu => ({
        route: '',
        ...menu,
        text: t(menu.dict),
        // open: false,
        active: menu.route === router.currentRoute.value.path,
      }));

      // 過濾字串
      if (search.value.length > 0) {
        filteredMenu = filteredMenu
          .filter(
            menu =>
              menu.route === '' ||
              (menu.text && strmatcher.match(menu.text, search.value)),
          )
          .map(menu => {
            // 可點擊功能將顯示高亮字串
            if (menu.id === 0 || menu.parent !== 0) {
              // eslint-disable-next-line no-param-reassign
              menu.text = t(menu.dict).replace(
                search.value,
                `<span class="search-highlight">${search.value}</span>`,
              );
            }
            return menu;
          });
        // 全部打開
        filteredMenu.forEach(menu => {
          // eslint-disable-next-line no-param-reassign
          menu.open = true;
        });
      }

      // 大類 Menu(首頁將被分類在此)
      let category: MenuItemType[] = filteredMenu.filter(
        menu => menu.parent === 0,
      );
      // 一般 Menu
      const feature: MenuItemType[] = filteredMenu.filter(
        menu => menu.parent !== 0,
      );
      // 組成樹狀選單資料
      category = category
        .map(cate => {
          // eslint-disable-next-line no-param-reassign
          cate.children = feature.filter(menu => menu.parent === cate.id);
          if (cate.route === '') {
            // eslint-disable-next-line no-param-reassign
            cate.active =
              cate.children &&
              cate.children.length > 0 &&
              cate.children.some(menu => menu.active);
            if (cate.active) {
              // eslint-disable-next-line no-param-reassign
              cate.open = true;
            }
          }
          return cate;
        })
        // 濾掉沒有子選單的母選單
        .filter(
          cate =>
            (cate.children && cate.children.length > 0) || cate.route !== '',
        );
      return category;
    });

    return { search, menuList, collapsed };
  },
});
</script>

<style lang="scss" scoped>
// 側欄選單分頁 - 一般狀態
.menu {
  @include flex-basic(flex-start, flex-start) {
    flex-direction: column;
  }
  height: 100%;
  // 客製
  .keywords {
    width: 100%;
    padding: 9px;
    &-prefix-icon {
      color: $text-1;
    }
    &-input {
      height: 28px;
      font-size: 12px;
      line-height: 1;
      :deep(.ant-input) {
        font-size: 12px;
        line-height: 1;
      }
    }
  }
  .menu-list {
    width: 100%;
    height: calc(100% - 46px);
    @include scrollbar() {
      overflow-x: hidden;
    }
    &-item {
      line-height: 20px;
    }
  }
}
</style>
