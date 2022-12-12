<i18n src="@/languages/common/beta_message.json"></i18n>
<template lang="pug">
rd-alert.beta-message(type="warning" title="warning alert" :closable="false")
  template(#title)
    i18n-t(keypath="beta_version_msg")
      template(#function)
        rd-button(type="warning" size="small" @click="clickMsgBtn") {{ t('msg_suggest') }}
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BetaMessage', // 公測 Beta 警示訊息
  setup() {
    const { t } = useI18n({ useScope: 'local' });

    // 點擊問題與建議按鈕，並另開功能頁面
    const clickMsgBtn = () => {
      window.open('/hall/qanda');
    };

    return {
      t,
      clickMsgBtn,
    };
  },
});
</script>

<style lang="scss" scoped>
.beta-message {
  margin-bottom: 10px;
}
</style>
