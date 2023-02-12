<template lang="pug">
transition(name="rd-loading-fade" @after-leave="handleAfterLeave")
  .rd-loading-mask(
    v-show="visible"
    :style="{ backgroundColor: background || '' }"
    :class="[customClass, { 'is-fullscreen': fullscreen }]"
  )
    .rd-loading-spinner
      span.ball-blue
      span.ball-red
      p.rd-loading-text(v-if="showText") {{ showText }}
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import loadingLang from '../rd/lang.json';

export default defineComponent({
  name: 'RdLoading',
  props: {
    visible: { type: Boolean, default: false }, // 關閉時的 v-show 渲染
    text: { type: String, default: '' }, // 加載文字
    background: { type: String, default: '' }, // 背景顏色
    fullscreen: { type: Boolean, default: false }, // 是否全螢幕
    customClass: { type: String, default: '' }, // 客製化 class
    locale: {
      type: String as () => keyof typeof loadingLang,
      default: 'zh-cn',
    }, // 語系
  },
  // todo 待測試是否需要用到及是否正常
  emits: ['after-leave'],
  setup(props, { emit }) {
    // 關閉後回調
    const handleAfterLeave = () => {
      emit('after-leave');
    };
    const showText = computed(() => {
      if (props.text === '') {
        return loadingLang[props.locale]['loading'] || 'Loading...';
      }
      return props.text;
    });

    return {
      handleAfterLeave,
      showText,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../../style/scss/options';
.rd-loading-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background-color: hsla(0, 0%, 100%, 0.9);
  @include flex-basic(center);
  &.is-fullscreen {
    position: fixed;
    width: 100vw;
    height: 100vh;
  }
}
.rd-loading-spinner {
  width: 100%;
  text-align: center;
  span {
    display: inline-block;
    padding: 8px;
    border-radius: 50%;
  }
  .ball-blue {
    background: $primary;
    animation: move-left 800ms ease-in-out infinite alternate;
  }
  .ball-red {
    background: $danger;
    animation: move-right 800ms ease-in-out infinite alternate;
  }
  .rd-loading-text {
    color: $text-1;
  }
}
@keyframes move-left {
  to {
    background: $primary;
    transform: translate(20px, 0);
  }
}
@keyframes move-right {
  to {
    background: $danger;
    transform: translate(-20px, 0);
  }
}
.rd-loading-fade-enter-from,
.rd-loading-fade-leave-to {
  opacity: 0;
}
</style>
<style lang="scss">
// Global Parent Class
.rd-loading-relative {
  position: relative !important;
  overflow: hidden !important;
}
</style>
