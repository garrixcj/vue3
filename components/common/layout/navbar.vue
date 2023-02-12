<template lang="pug">
.rd-navbar-layout
  //- Nav Bar
  .rd-navbar__header(:class="{ 'no-pre-page': noPrePage }")
    //- 上一頁 icon
    .pre-page(v-if="!noPrePage" @click="prePage")
      i.mdi.mdi-chevron-left
    //- 標題
    slot(name="header" :title="title" :sub-title="subTitle")
      //- 大標題
      h2.title {{ title }}
      //- 分隔線
      rd-divider.separation-line(v-if="!noSeprateLine" direction="vertical")
      //- 副標題
      .sub-title(v-if="subTitle !== '' || $slots.subTitle")
        slot(name="subTitle" :label="subTitle") {{ subTitle }}
    //- 標題後內容區塊
    .after-title(v-show="$slots.afterTitle")
      slot(name="afterTitle")
    //- 標題後內容區塊 (完全置右)
    .title-suffix(v-if="$slots.titleSuffix")
      slot(name="titleSuffix")

  //- 內文
  .rd-navbar__body(
    ref="bodyContent"
    :class="{ 'has-menu': showMenu && !$slots.body }"
  )
    slot(name="body")
      //- 有分頁的
      rd-tabs.tab-menu(
        v-if="showMenu"
        :class="{ 'has-link': isLinkTab }"
        :model-value="activeTab"
        @update:model-value="changeTab"
      )
        rd-tab-pane.tab-menu-content(
          v-for="tab in menu"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        )
          //- tab label
          template(#label)
            //- common custom label
            slot(v-if="$slots.label" name="label" :option="tab")
            //- specific custom label
            slot(v-else :name="`${tab.name}Label`" :option="tab")
              template(v-if="isLinkTab")
                //- router
                router-link.link-label(:to="tab.to || '#'") {{ tab.label }}
              template(v-else)
                //- 一般 tab label
                span.text-label {{ tab.label }}
          //- tab content
          slot(:name="tab.name")
</template>

<script lang="ts">
import { computed, defineComponent, ref, type PropType } from 'vue';
import { type RouteLocationRaw } from 'vue-router';

type NavbarTabMenu = {
  name: string;
  label: string;
  to?: RouteLocationRaw;
  [key: string]: unknown;
};

export type RdLayoutExpose = {
  scrollTo: (height: number) => void;
};

export default defineComponent({
  name: 'RdNavbarLayout',
  props: {
    // 不顯示上一頁按鈕
    noPrePage: {
      type: Boolean,
      default: false,
    },
    // 標題
    title: {
      type: String,
    },
    // 不要 title 分隔線
    noSeprateLine: {
      type: Boolean,
      default: false,
    },
    // 副標題
    subTitle: {
      type: String,
      default: '',
    },
    // 選單 { name: 'activeTab', label: '分頁名稱' }
    menu: {
      type: Array as PropType<NavbarTabMenu[]>,
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
  emits: ['update:active-tab', 'pre-page'],
  setup(props, { emit, expose }) {
    // 該 layout 本身"不"提供內距，請使用 RdLayoutContent 包裝下層以獲得內距設定
    if (props.activeTab === '' && props.menu && props.menu[0]) {
      // 初始化 active-tab 防呆
      emit('update:active-tab', props.menu[0].name);
    }
    const bodyContent = ref<HTMLDivElement>(document.createElement('div'));

    // 上一頁
    const prePage = () => {
      emit('pre-page');
    };

    // 改頁籤
    const changeTab = (val: string | number) => {
      emit('update:active-tab', val);
    };
    // 是否為連結頁簽標題
    const isLinkTab = computed(() => props.tabType === 'link');
    const showMenu = computed(() => props.menu && props.menu.length > 0);

    // 重置捲軸高度
    const scrollTo = (height = 0) => {
      bodyContent.value.scrollTop = height;
    };

    expose({ scrollTo } as RdLayoutExpose); // 封裝外部使用功能

    return {
      bodyContent,
      showMenu,
      changeTab,
      prePage,
      isLinkTab,
    };
  },
});
</script>

<style lang="scss" scoped>
// 標題高度 (對齊側欄 Menu tab 高度)
$header-height: 50px;
$menu-height: 40px;

$header-border: #d9e0e7;

.rd-navbar {
  &-layout {
    // 整體高度 100%
    height: 100%;
  }
  &__header {
    @include flex-basic;
    // header 區域 divider 預設 2px 寬度
    @include divider-width(2px);
    @include divider-margin-vertical(0, 0);
    @include space(15px);
    height: $header-height;
    background: white;
    border-bottom: 1px solid $header-border;
    // 上一頁
    .pre-page {
      @include flex-basic(center);
      width: 52px;
      height: $header-height;
      font-size: 32px;
      color: $primary;
      cursor: pointer;
    }
    // 無上一頁推移標題
    &.no-pre-page {
      padding-left: 20px;
    }
    // 標題
    .title {
      font-size: 20px;
      font-weight: normal;
      white-space: nowrap;
    }
    // 分隔線
    .separation-line {
      @include divider-height(20px, true);
    }
    // 副標題
    .sub-title {
      font-size: 16px;
      white-space: nowrap;
    }

    // 標題後內容區塊
    .after-title {
      // 給予基礎 flex 排版
      @include flex-basic;
    }
    // 標題後內容區塊 (完全置右)
    .title-suffix {
      // 給予基礎置右 flex 排版
      @include flex-basic(flex-end);
      height: $header-height;
      margin-right: 20px;
      margin-left: auto;
    }
  }

  &__body {
    // 整體高度 100% 減去 header 高度
    height: calc(100vh - #{$header-height});
    //- 分頁
    .tab-menu {
      height: 100%;
      @include tab-no-line;
      // 特殊 tabs 樣式
      :deep(.el-tabs__header) {
        z-index: 20; // 為了超出底下的 content 的東西的高度的基本值，特殊狀況下可覆蓋
        height: $menu-height;
        padding-left: 20px;
        margin: 0;
        background: $white;
        box-shadow: 0px 3px 5px -2px rgba(0, 0, 0, 0.15);
      }
      :deep(.el-tabs__content) {
        // 分頁自身整體高度 100% 減去 menu 高度
        height: calc(100% - #{$menu-height});
      }
      // 分頁內容高度與 scrollbar
      &-content {
        height: 100%;
        overflow: auto;
        @include scrollbar;
      }
      // link 頁籤內距改外距
      &.has-link {
        :deep(.el-tabs__nav .el-tabs__item.is-top:nth-child(n)) {
          padding: 0;
          line-height: 40px;
        }
        .link-label,
        .text-label {
          padding: 12px 15px;
        }
        :slotted(.link-label) {
          padding: 12px 15px;
        }
      }
    }
    // 無分頁內容高度與 scrollbar
    &:not(.has-menu) {
      height: calc(100% - #{$header-height});
      overflow: auto;
      @include scrollbar;
    }
  }
}
</style>
