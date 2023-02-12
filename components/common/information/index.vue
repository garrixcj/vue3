<template lang="pug">
.rd-information(:class="{ show }")
  .rd-information-trigger(@click="showHint(!show)")
    i.mdi(:class="show ? 'mdi-chevron-right' : 'mdi-information-variant'")
  .rd-information-content(ref="textarea")
    slot
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'RdInformation',
  // ToDo vue3轉為新架構後要把topHeight default改回111
  props: {
    topHeight: {
      type: Number,
      default: 55,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 100,
    },
    // 同步數值
    sync: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:is-open'],
  setup(props, { emit }) {
    // 預設自行運作
    const show = ref(props.isOpen);

    // 監聽 props 的 isOpen，可以透過改變 prop 手動打開
    watch(
      () => props.isOpen,
      (value: boolean) => {
        show.value = value;
      },
    );

    // 提示框 DOM 物件
    const textarea = ref<HTMLElement>(document.createElement('div'));

    /**
     * 點擊提示時調整提示框寬度
     */
    const showHint = (flag: boolean) => {
      // 當 sync 打開後變為雙向溝通
      if (props.sync) {
        emit('update:is-open', flag);
      } else {
        show.value = flag;
      }
    };

    /**
     * 因加入編輯按鈕 故須取得當下變動的寬度
     */
    const reloadContentWidth = () => {
      // todo 因 resize 不常用 用到再有問題再說 (Case: 負數現金)
      // data.contentWidth = textarea.value.clientWidth;
      // data.infoReloadCount += 1;
    };

    // CSS Var Setting
    const infoTopHeight = computed(() => `${props.topHeight}px`);
    const infoZIndex = computed(() => `${props.zIndex}`);

    return {
      // template use
      show,
      textarea,
      showHint,
      reloadContentWidth,
      // style use
      infoTopHeight,
      infoZIndex,
    };
  },
});
</script>

<style lang="scss" scoped>
.rd-information {
  position: fixed;
  top: v-bind(infoTopHeight);
  right: 0px;
  z-index: v-bind(infoZIndex);
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
  transition: transform 1s;
  transform: translateX(calc(100% - 30px));
  &.show {
    transform: translateX(0);
  }
  &-trigger {
    z-index: 100;
    display: flex;
    justify-content: center;
    width: 30px;
    height: 40px;
    font-size: 28px;
    line-height: 40px;
    color: #fff;
    cursor: pointer;
    background-color: $primary;
    border-radius: 2px 0 0 2px;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.15);
  }
  &-content {
    max-width: 430px;
    min-height: 40px;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 20px;
    color: $text-1;
    white-space: normal;
    background-color: #ffffff;
    box-shadow: 0 0 3px 0 rgba(64, 78, 103, 0.1);
    // todo 再調整
    :slotted(ul) {
      margin: 10px 15px 10px -5px;
      li {
        font-size: 14px;
        line-height: 20px;
        color: $text-1;
        white-space: normal;
      }
      // 有間距的話，下層每個 li會有 15px 的間距
      &.spacing,
      ul.spacing {
        > li:not(:nth-of-type(1)) {
          margin-top: 15px;
        }
      }
      > ul.sub-list {
        padding-inline-start: 0;
        padding-left: 6px;
        margin: 0;
        list-style-type: '-';
        li {
          padding-left: 10px;
        }
      }
      > ul.none-node {
        padding-inline-start: 0;
        margin: 0;
        list-style-type: none;
      }
      > ol {
        padding-left: 16px;
      }
    }
  }
}
</style>
