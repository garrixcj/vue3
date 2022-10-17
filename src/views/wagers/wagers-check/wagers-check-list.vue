<i18n>
  {
    "zh-tw": {
      "hello_world": "嗨",
    }
  }
  </i18n>

<template lang="pug">
.wagers-check-list
  div {{ t('hello_world') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
export default defineComponent({
  name: 'WagersCheckList', //外接遊戲注單核對
  components: {},
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    return {
      t,
    };
  },
});
</script>
