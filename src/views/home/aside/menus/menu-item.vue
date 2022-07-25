<template lang="pug">
.menu-item
  //- Theme 0 首頁
  template(v-if="type === 'category' && menu.route !== ''")
    .menu-item-category(
      :class="{ 'is-active': menu.active, 'menu-collapsed': menuCollapsed, 'is-collapsed': !collapse }"
    )
      //- 功能大類 icon
      i.category-icon.mdi(:class="menu.icon")
      //- 功能大類 name
      menu-link.feature-link(v-show="!menuCollapsed" :menu="menu")
  //- Theme 1 功能大類
  template(v-else-if="type === 'category'")
    .menu-item-category(
      :class="{ 'is-active': menu.active, 'menu-collapsed': menuCollapsed, 'is-collapsed': !collapse, 'has-sub-item': !!menu.children?.length }"
      @click="collapseSubmenu"
    )
      //- 功能大類 icon
      i.category-icon.mdi(:class="menu.icon")
      //- 功能大類 name
      span.category-name(v-show="!menuCollapsed") {{ menu.text }}
      //- 功能大類 collapsed icon
      i.collapsed-icon.mdi.mdi-chevron-down(
        v-if="!!menu.children?.length"
        v-show="!menuCollapsed"
        :class="{ 'is-reverse': !collapse }"
      )
    //- 子項目
    .sub-menu(v-if="!!menu.children?.length" v-show="!menuCollapsed")
      //- 縮合功能
      rd-collapse-transition
        .sub-menu-items(v-show="!collapse")
          //- 備註：元件預設載入自身
          menu-item(
            v-for="(item, id) in menu.children"
            :key="id"
            type="feature"
            :menu="item"
          )

  //- Theme 2 功能子項
  template(v-else-if="type === 'feature'")
    .menu-item-feature(:class="{ 'is-active': menu.active }")
      menu-link.feature-link(:menu="menu")
      .favorite-icon(
        :class="{ 'is-favorite': favorite }"
        @click="setFavorite(!favorite)"
      )

  //- Theme 3 無大類純功能節點
  template(v-else-if="type === 'node'")
    .menu-item-node(:class="{ 'is-active': menu.active }")
      //- 非排序節點
      template(v-if="!sort")
        menu-link.feature-link(:menu="menu")
        .favorite-icon(
          :class="{ 'is-favorite': favorite }"
          @click="setFavorite(!favorite)"
        )
      template(v-else)
        span.feature-link {{ menu.text }}
        i.mdi.mdi-drag-vertical.sorting-icon
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  ref,
  watch,
  type PropType,
} from 'vue';
// import { useI18n } from 'vue-i18n';
import MenuLink from './menu-link.vue';
// import { notify } from '@/components/utils/notification';
import type { MenuItem } from './menu';
import { useMenuStore } from '@/stores/menu';

export default defineComponent({
  name: 'MenuItem',
  components: { MenuLink },
  props: {
    // 功能物件
    menu: { type: Object as PropType<MenuItem>, required: true },
    // 功能樣式
    type: {
      type: String,
      default: '',
      validator: (val: string) => {
        return ['category', 'feature', 'node'].indexOf(val) !== -1;
      },
    },
    // 啟用排序
    sort: { type: Boolean, default: false },
  },
  setup(props) {
    const menuStore = useMenuStore();
    // const { t } = useI18n({ useScope: 'parent' });
    const menuCollapsed = inject('Main:Collapsed');

    const collapse = ref(!props.menu.open);

    const collapseSubmenu = () => {
      collapse.value = !collapse.value;
    };
    // 有子項目才 watch
    if (props.menu?.children && props.menu?.children.length > 0) {
      watch(
        () => props.menu.open,
        value => {
          // 已打開的不需要關閉
          if (collapse.value) {
            collapse.value = !value;
          }
        },
      );
    }

    const favorite = computed(
      () => menuStore.favorite.indexOf(+props.menu.id) !== -1,
    );

    const inSetting = ref(false);
    const setFavorite = (isAdd: boolean) => {
      if (inSetting.value) {
        return;
      }
      inSetting.value = true;
      const menuId = +props.menu.id;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = isAdd
        ? [menuId, ...menuStore.favorite]
        : menuStore.favorite.filter((id: number) => id !== menuId);
      // menuStore.setFavorite(data).then(resp => {
      //   if (resp.data.result) {
      //     notify.success({
      //       message: isAdd ? t('add_my_favorites') : t('remove_my_favorites'),
      //     });
      //   }
      //   inSetting.value = false;
      // });
    };

    return {
      favorite,
      setFavorite,
      collapse,
      menuCollapsed,
      collapseSubmenu,
    };
  },
});
</script>

<style lang="scss" scoped>
$icon-width: 20px;
$icon-text-padding: 5px;
$item-height: 42px;
$suffix-width: 36px;

// 置右 icon 對齊
%suffix-icon {
  @include flex-basic(center);
  width: $suffix-width;
  height: $item-height;
}

// 我的最愛功能基本樣式
@mixin my-favorite {
  .favorite-icon {
    @extend %suffix-icon;
    background-image: url('~@/assets/image/favorite/dislike.png');
    background-repeat: no-repeat;
    opacity: 0;
    &.is-favorite {
      background-image: url('~@/assets/image/favorite/favorite_hover.png');
      opacity: 1;
    }
    &:not(.is-favorite):hover {
      background-image: url('~@/assets/image/favorite/dislike_hover.png');
    }
  }
  &:hover .favorite-icon {
    opacity: 1;
  }
}

// 可點擊功能基本樣式
@mixin feature {
  &.is-active {
    .feature-link {
      &,
      &:hover {
        :deep(.menu-link) {
          color: $focus-1;
        }
      }
    }
  }
  .feature-link {
    @include flex-basic;
    position: relative;
    flex-grow: 1;
    height: $item-height;
    padding-left: $icon-width;
    line-height: 1;
    color: $text-1;
    @content;
    :deep(.menu-link) {
      width: 100%;
      height: 100%;
      @include flex-basic;
    }

    &:hover :deep(.menu-link) {
      color: $text-1;
    }
  }
}

// menu item basic
@mixin menu-basic {
  @include flex-basic; // flex 結構
  height: $item-height; // 固定高度
  &:hover {
    background-color: $background-5; // 統一 hover 效果
  }
}

.menu-item {
  cursor: pointer;
  //- 功能大類
  &-category {
    @include feature() {
      padding-left: 0px;
    }
    @include menu-basic;
    padding-left: $icon-text-padding;

    .category-icon {
      width: $icon-width;
    }
    .category-name {
      flex-grow: 1;
    }
    // 子項目縮合
    .collapsed-icon {
      @extend %suffix-icon;
      @include rotate-icon-animation;
    }
    // 含有子項時樣式
    &.has-sub-item {
      &.is-collapsed {
        font-weight: 700;
      }
      &.is-active .category-icon {
        color: $focus-1;
      }
    }
    &:not(.has-sub-item).is-active {
      color: $focus-1;
    }
    // menu 縮合
    &.menu-collapsed {
      justify-content: center;
    }
  }

  // 子項目
  .sub-menu {
    padding-left: $icon-text-padding;
  }

  //- 功能子項
  &-feature {
    @include menu-basic;
    @include feature;
    @include my-favorite;
    position: relative;

    // 當前功能原點標記
    &.is-active {
      .feature-link {
        color: $focus-1;
      }
      // 圓點
      &:after {
        position: absolute;
        top: 50%;
        left: 2px;
        z-index: 1;
        width: 8px;
        height: 8px;
        content: '';
        background: $focus-1;
        border-radius: 8px;
        transform: translateY(-4px);
      }
    }
    // 子項功能邊線
    &:before {
      position: absolute;
      left: 5px;
      width: 10px;
      height: 100%;
      content: '';
      border-left: 2px solid $background-4;
    }
  }

  //- 無層級功能節點
  &-node {
    @include menu-basic;
    @include feature;
    @include my-favorite;
    .sorting-icon {
      @extend %suffix-icon;
    }
  }
}
</style>
