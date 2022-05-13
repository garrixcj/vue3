<template lang="pug">
//- 下拉選單
rd-dropdown(v-if="type === 'dropdown'" trigger="click")
  i.mdi(v-bind="$attrs")
  template(#overlay)
    rd-dropdown-menu.trans-locale-menu
      rd-dropdown-item.trans-locale-option(
        v-for="locale in locales"
        :class="{ 'is-current-locale': locale.value === currentLocale }"
        @click="changeLocale(locale.value)"
      ) {{ locale.label }}
//- 對話框
rd-dialog(
  v-else-if="type === 'dialog'"
  v-bind="$attrs"
  custom-class="trans-locale"
  show-close
  :model-value="modelValue"
  @update:model-value="$emit('update:model-value', $event)"
  @close="close"
)
  span.trans-locale-selector__label {{ t('select_language') }}
  rd-select(v-model:value="selectedLocale" :options="locales")
  template(#footer)
    .trans-locale-footer
      rd-button(type="secondary" size="large" @click="close") {{ t('cancel') }}
      rd-button(
        type="primary"
        size="large"
        @click="changeLocale(selectedLocale)"
      ) {{ t('confirm') }}
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCookieStore } from '@/stores/cookie';

export default defineComponent({
  name: 'TransLocale',
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    type: { type: String as () => 'dropdown' | 'dialog', required: true },
  },
  emits: ['update:model-value'],
  setup(props, { emit }) {
    const cookieStore = useCookieStore();
    const { locale } = useI18n({ useScope: 'global' });
    const { t } = useI18n({ useScope: 'parent' });
    // 語系設定
    const locales = [
      { value: 'zh-tw', label: '繁體' },
      { value: 'zh-cn', label: '简体' },
      { value: 'en', label: 'English' },
    ];

    const selectedLocale = ref(locale.value);

    // 關閉 dialog
    const close = () => {
      selectedLocale.value = locale.value;
      emit('update:model-value', false);
    };

    // 改變語系
    const changeLocale = (lang: string) => {
      locale.value = lang;
      cookieStore.updateLang(lang);
      if (props.type === 'dialog') {
        close();
      }
    };

    return {
      locales,
      selectedLocale,
      close,
      changeLocale,
      currentLocale: locale,
      t,
    };
  },
});
</script>
<style lang="scss" scoped>
.trans-locale {
  &-menu {
    width: 190px;
    border-radius: 4px;
    :deep() {
      .trans-locale-option {
        padding: 0 20px;
        line-height: 32px;
        &.is-current-locale {
          color: $white;
          background-color: $primary;
        }
        &:not(.is-current-locale):hover {
          background-color: $primary-4;
        }
      }
    }
  }
  &-selector__label {
    margin: 0 10px 0 40px;
  }
}
</style>
