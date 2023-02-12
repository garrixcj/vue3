<template lang="pug">
.rd-explain
  slot
  .rd-explain__text
    slot(name="explain")
      | {{ explainText }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RdExplain', // 用於元件額外補充說明
  props: {
    // 說明文字訊息
    explainText: {
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.rd-explain {
  width: 100%;
  &__message {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1;
    color: $danger;
    text-align: left;
  }
  &__text {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1;
    color: $text-3;
    text-align: left;
  }
}
// 驗證出現錯誤時說明文字消失
.el-form-item.is-error {
  .rd-explain__text {
    display: none;
  }
}
</style>
