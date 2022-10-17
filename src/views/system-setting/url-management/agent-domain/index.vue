<!-- <i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<i18n src="@/languages/system_setting/url_management/agent_url.json"></i18n> -->
<template lang="pug">
.agent-domain
  div 管端域名
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AgentDomain', // 網址管理 - 管端端域名
  setup() {
    return {};
  },
});
</script>
