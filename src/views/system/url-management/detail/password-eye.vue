<template lang="pug">
.password-eye
  span.password {{ passwordTxt }}
  i.eye.mdi(:class="on ? 'mdi-eye' : 'mdi-eye-off'")
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'PasswordEye', // 密碼與其控制顯示的眼睛
  props: {
    // 顯示
    on: {
      type: Boolean,
      default: false,
    },
    // 密碼
    password: String,
  },
  setup(props) {
    const passwordTxt = computed(() =>
      props.on ? props.password : '••••••••',
    );

    return { passwordTxt };
  },
});
</script>

<style lang="scss" scoped>
.password-eye {
  @include inline-flex-basic;

  .eye {
    box-sizing: border-box;
    display: block;
    width: 30px;
    height: 30px;
    padding: 6px;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
  }
  .mdi-eye {
    color: $primary;

    &-off {
      color: $offline;
    }
  }
}
</style>
