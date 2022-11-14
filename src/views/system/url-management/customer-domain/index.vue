<!-- <i18n src="@/languages/system_setting/url_management/customer_url.json"></i18n> -->
<template lang="pug">
.customer-domain
  //- 設定範例
  setting-example
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SettingExample from './setting-example.vue';

export default defineComponent({
  name: 'CustomerDomain', // 網址管理 - 客端域名
  components: {
    SettingExample, // 設定範例
  },
  setup() {
    return {};
  },
});
</script>
