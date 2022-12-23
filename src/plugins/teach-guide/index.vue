<i18n src="./lang.json"></i18n>
<template lang="pug">
.teach-guide(v-if="show")
  .teach-link(@click="toURL") {{ showTitle }}
  .close-teach
    i.close-teach__icon.mdi.mdi-close-thick(@click="close")
</template>

<script lang="ts">
import { host, urlRoute } from './url';
import { type PropType, computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'TeachGuide',
  props: {
    title: {
      type: String,
      default: '',
    },
    // 網址參數
    featureKey: {
      type: String as PropType<keyof typeof urlRoute>,
      required: true,
    },
    // 網址
    hostKey: {
      type: String as PropType<keyof typeof host>,
      default: 'bbin',
    },
  },
  setup(props) {
    const { t, locale } = useI18n({ useScope: 'local' });

    const show = ref(true);

    // 顯示標題
    const showTitle = computed(() => {
      if (props.title == '') {
        return t('teach_guide');
      }
      return props.title;
    });

    // 完整URL
    const fullUrl = computed(() => {
      if (['zh-cn', 'zh-tw'].indexOf(`${locale.value}`) !== -1) {
        return `${host[props.hostKey]}lang_cn/${urlRoute[props.featureKey]}`;
      }
      return `${host[props.hostKey]}lang_en/${urlRoute[props.featureKey]}`;
    });

    // 前往教學連結
    const toURL = () => {
      window.open(fullUrl.value);
    };
    // 關閉
    const close = () => {
      show.value = false;
    };

    return {
      t,
      show,
      showTitle,
      toURL,
      close,
    };
  },
});
</script>

<style lang="scss" scoped>
$total-min-width: 155px;
$teach-guide-bg-color: #1b1b1b;
$teach-guide-bg-color-hover: #c12323;

.teach-guide {
  position: fixed;
  right: 30px;
  bottom: 0;
  z-index: 10;
  min-width: $total-min-width;
  height: 30px;
  background-color: $teach-guide-bg-color;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  @include flex-basic(flex-end);

  &:hover {
    background-color: $teach-guide-bg-color-hover;
  }
  .teach-link {
    flex-grow: 1;
    font-size: 14px;
    color: $white;
    text-align: center;
    cursor: pointer;
  }
  .close-teach {
    width: 14px;
    height: 14px;
    margin-right: 7px;
    background-color: $white;
    border-radius: 999em;
    @include flex-basic(center);
    &__icon {
      font-size: 14px;
      color: $teach-guide-bg-color;
      &:hover {
        color: $teach-guide-bg-color-hover;
      }
    }
  }
}
</style>
