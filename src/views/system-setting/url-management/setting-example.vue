<i18n src="@/languages/system_setting/url_management/index.json"></i18n>
<template lang="pug">
.setting-example
  rd-button(type="default" size="small" @click="visible = !visible") {{ t('setting_example') }}
  div(v-if="visible") 設定範例
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SettingExample', // 網址管理 - 設定範例
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    // 開關
    const visible = ref(false);

    return {
      t,
      visible,
    };
  },
});
</script>
