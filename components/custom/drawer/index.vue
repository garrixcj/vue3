<template lang="pug">
.rd-drawer
  //- 黑底遮罩
  transition(name="rd-drawer-mask-fade")
    .rd-drawer__mask(v-show="visible" @click="closeDrawerByMask")

  //- 抽屜包裝容器
  transition(
    name="rd-drawer-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  )
    .rd-drawer__wrapper(v-show="visible" :class="`${size}-size`")
      //- 抽屜內容
      .rd-drawer__container(v-loading="loading" :class="customClass")
        //- 標題
        .rd-drawer__header
          .rd-drawer__header-top(v-if="withHeader")
            span.rd-drawer__title-scope
              slot(name="title")
                span.title {{ title }}
              slot(v-if="$slots.subtitle || subtitle" name="subtitle")
                rd-divider.separate-line(direction="vertical")
                span.subtitle {{ subtitle }}
              //- 自訂標題
              span.custom-title(v-if="$slots['customTitle']")
                slot(name="customTitle")
            //- 關閉抽屜
            i.rd-drawer__close-icon.mdi.mdi-close(
              v-if="showClose"
              @click="closeDrawer"
            )
          slot(name="header")
            //- 標頭其他內容

        //- 主要內容
        .rd-drawer__section(
          :class="[sectionClass, { 'has-scrollbar': scrollBar }, { 'fade-content': !noFade, 'on-top': scrollHeight === 0 }]"
          @scroll="handleSectionScroll"
        )
          rd-scrollbar(v-if="scrollBar" @scroll="scroll")
            slot
          div(v-else)
            slot

        //- 置底內容
        .rd-drawer__footer(v-if="$slots.footer")
          slot(name="footer")
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, type PropType } from 'vue';

enum shadowClass {
  none = 'no-shadow',
  footer = 'footer-only',
  header = 'header-only',
  default = '',
}
type shadowType = 'none' | 'footer' | 'header' | 'default';

export default defineComponent({
  name: 'RdDrawer',
  props: {
    // 預設使用 el-scroll-bar，可關閉後自行客製
    scrollBar: {
      type: Boolean,
      default: true,
    },
    // 內容的 loading 遮罩
    loading: {
      type: Boolean,
      default: false,
    },
    // 是否顯示右上 X icon 關閉按鈕
    showClose: {
      type: Boolean,
      default: true,
    },
    // 抽屜尺寸
    size: {
      type: String,
      default: 'default',
      validator: (val: string) =>
        ['small', 'default', 'large'].indexOf(val) !== -1,
    },
    // 內容寬度
    width: {
      type: [Number, String],
      default: '',
    },
    // 副標題
    subtitle: {
      type: String,
      default: '',
    },
    // 標題內容
    title: {
      type: String,
      default: '',
    },
    // 抽屜開啟，v-model
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    // 主要區塊陰影：
    // none 不使用 / footer 只有置底區塊 / header 只有置頂區塊 / 預設有陰影
    sectionShadow: {
      type: String as PropType<shadowType>,
      default: 'default',
    },
    // 關閉前的 callback
    beforeClose: {
      type: Function,
    },
    // 控制標題列顯示，當此選項關閉時，將無法操作及顯示 title slot 與 x icon
    withHeader: {
      type: Boolean,
      default: true,
    },
    // 客製 class，將會設置在抽屜的 container 上
    customClass: {
      type: String,
      default: '',
    },
    // 可點擊黑底遮罩關閉抽屜，預設為不可關閉
    closeableMask: {
      type: Boolean,
      default: false,
    },
    // 內容是否要淡化效果
    noFade: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['open', 'close', 'update:visible', 'opened', 'closed'],
  setup(props, { emit }) {
    // 陰影 class
    const sectionClass = computed(() => shadowClass[props.sectionShadow]);

    // CSS Var Setting
    // 抽屜 inline-style
    const drawerWidth = computed(() => `${props.width || 550}px`);

    watch(
      () => props.visible,
      open => {
        open ? emit('open') : emit('close');
      },
    );
    // 抽屜打開動畫的結束點
    const afterEnter = () => {
      emit('opened');
    };
    // 抽屜關閉動畫的結束點
    const afterLeave = () => {
      emit('closed');
    };
    // 關閉
    const hide = () => {
      emit('update:visible', false);
    };
    // x icon / 取消按鈕 (自製) 使用之對外 function
    // 元件內的 close 無法觸發關閉前的動作，可以透過帶入 beforeClose 來執行
    const closeDrawer = () => {
      if (typeof props.beforeClose === 'function') {
        props.beforeClose(hide);
      } else {
        hide();
      }
    };

    const closeDrawerByMask = () => {
      if (props.closeableMask) {
        closeDrawer();
      }
    };

    // scrollbar 監聽
    const scrollHeight = ref(0);
    const scroll = ({ scrollTop }: { scrollTop: number }) => {
      scrollHeight.value = scrollTop;
    };
    const handleSectionScroll = (e: Event) => {
      scrollHeight.value = (e.target as HTMLElement).scrollTop;
    };

    return {
      // template use
      sectionClass,
      afterEnter,
      afterLeave,
      hide,
      closeDrawer,
      // style use
      drawerWidth,
      closeDrawerByMask,
      // scrollbar
      scrollHeight,
      scroll,
      handleSectionScroll,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../../style/scss/options';

// nav bar 高度
$bar-height: 56px;
// menu 寬度
$menu-width: 210px;
$menu-collapsed-width: 70px;
// 主頁面高度
$main-frame-height: calc(100vh - #{$bar-height});
// 主頁面寬度
$main-frame-width: 100vw;
// 內容容器寬度
$small-width: 300px;
$default-width: v-bind(drawerWidth);
$large-width: 990px;
// 預設寬度

.rd-drawer {
  // 遮罩
  &__mask {
    position: fixed; // 絕對浮動
    top: $bar-height; // 不擋住上方 bar
    left: 0;
    z-index: 50; // 低於 menu 的 101
    width: $main-frame-width;
    height: $main-frame-height; // 100% 頁面大小 (不包含 navbar)
    background: rgba(0, 0, 0, 0.3); // 黑色遮罩
  }

  // 包裝版面
  &__wrapper {
    position: fixed; // 絕對浮動
    top: $bar-height; // 不擋住上方 bar
    right: 0; // 靠右
    z-index: 75; // 高於遮罩的 50
    width: $default-width;
    height: $main-frame-height; // 100% 頁面大小 (不包含 navbar)
    background-color: white;
    &.small-size {
      width: $small-width;
    }
    &.default-size {
      width: $default-width;
    }
    &.large-size {
      width: $large-width;
    }
  }

  // 內容版面
  &__container {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: -8px 0 10px -6px rgba(33, 33, 33, 0.2);
  }

  // 標頭
  &__header {
    height: auto;
    padding: 20px;
    // 標頭置頂標題區塊
    &-top {
      @include flex-basic(space-between, center);
      :deep() {
        @include divider-width(2px);
        @include divider-margin-vertical(15px, 15px);
        .separate-line {
          align-self: center;
          @include divider-height(18px, true);
        }
      }
    }
  }

  // 標題預設樣式
  &__title-scope {
    @include flex-basic(flex-start, flex-end);
    font-size: 18px;
    font-weight: bold;
    color: $mark-3;
  }
  .custom-title {
    @include flex-basic;
    font-size: 14px;
    font-weight: 400;
    color: $text-3;
  }

  // 副標題
  :slotted(.subtitle) {
    font-size: 16px;
    font-weight: 400;
    color: $text-1;
  }

  // 標題備註
  :slotted(.title-suffix) {
    margin-left: 15px;
    font-size: 14px;
    font-weight: 400;
    color: $text-3;
  }

  // 客製化標題 (綠色大標)
  :slotted(.custom-title__main) {
    @extend .rd-drawer__title-scope;
  }

  // 標題預設樣式
  &__close-icon {
    font-size: 24px;
    color: $text-3;
    cursor: pointer;
    &:hover {
      color: $text-2;
    }
  }

  // 主要內容區塊
  &__section {
    flex-grow: 1;
    padding: 15px 20px 15px 20px;
    overflow-y: auto;
    $header-shadow: inset 0 3px 3px -3px rgba(0, 0, 0, 0.25);
    $footer-shadow: inset 0 -3px 3px -3px rgba(0, 0, 0, 0.25);
    box-shadow: $header-shadow, $footer-shadow;
    &.no-shadow {
      box-shadow: none;
    }
    &.footer-only {
      box-shadow: $footer-shadow;
    }
    &.header-only {
      box-shadow: $header-shadow;
    }
    &.has-scrollbar {
      &.fade-content {
        .el-scrollbar {
          mask: linear-gradient(
            to top,
            transparent 0,
            black 15px,
            black calc(100% - 15px),
            transparent 100%
          );
          mask-position: 0 0;
          mask-size: 100% 100%;
          :deep(.el-scrollbar__view) {
            padding-bottom: 15px;
          }
        }
        &.on-top .el-scrollbar {
          mask-position: 0 -15px;
          mask-size: 100% calc(100% + 15px);
          transition-duration: 0.3s;
        }
      }
      padding-right: 0px;
    }
    :deep(.el-scrollbar__wrap) {
      padding-right: 20px;
    }
  }
  // 底部區塊
  &__footer {
    flex-basis: 60px;
    height: auto;
    padding: 14px 20px;
  }
}

// 抽屜過場動畫
.rd-drawer-fade {
  &-enter-active {
    animation: slide-in 0.3s cubic-bezier(0, 0, 0.2, 1);
  }
  &-leave-active {
    animation: slide-out 0.3s cubic-bezier(0, 0, 0.2, 1);
  }
}
// 遮罩延遲過場
.rd-drawer-mask-fade {
  &-leave-active {
    // 等待 0.35 秒後消失
    transition: visibility 0.35s;
  }

  &-enter-active {
    transition: visibility 0s;
  }
}
// 滑入動畫
@keyframes slide-in {
  from {
    visibility: visible;
    transform: translate(100%, 0);
  }
  to {
    transform: translate(0, 0);
  }
}
// 滑出動畫
@keyframes slide-out {
  from {
    visibility: visible;
    transform: translate(0, 0);
  }
  to {
    transform: translate(100%, 0);
  }
}
// 大尺寸抽屜小板面會佔滿全版
@media (min-width: 768px) and (max-width: 1200px) {
  section.container {
    &,
    &.collapsed.expand {
      .rd-drawer__wrapper.large-size {
        width: calc(#{$main-frame-width} - #{$menu-width});
      }
    }
    &.collapsed {
      .rd-drawer__wrapper.large-size {
        width: calc(#{$main-frame-width} - #{$menu-collapsed-width});
      }
    }
  }
}
@media (max-width: 768px) {
  section.container {
    .rd-drawer__wrapper.large-size {
      width: calc(#{$main-frame-width} - #{$menu-width});
    }
    &.collapsed {
      .rd-drawer__wrapper.large-size {
        width: $main-frame-width;
      }
    }
  }
}
</style>
