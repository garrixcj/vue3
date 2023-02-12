<template lang="pug">
.rd-password-text
  span.password {{ show ? password : '••••••••' }}
  i.eye.mdi(
    v-if="!noIcon"
    :class="show ? 'mdi-eye-off' : 'mdi-eye'"
    @click="showPassword(!show)"
  )
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'RdPasswordText', // 密碼與可控制明暗碼的眼睛的icon
  props: {
    // 顯示明碼或暗碼
    visible: {
      type: Boolean,
      default: false,
    },
    // 密碼
    password: String,
    // 不顯示icon
    noIcon: { type: Boolean, default: false },
    // 同步數值
    sync: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const show = ref(props.visible);
    // 監聽 props 的 visible，可以透過改變 prop 手動打開
    watch(
      () => props.visible,
      (value: boolean) => {
        show.value = value;
      },
    );

    const showPassword = (flag: boolean) => {
      // 當 sync 打開後變為雙向溝通
      if (props.sync) {
        emit('update:visible', flag);
      } else {
        show.value = flag;
      }
    };

    return { show, showPassword };
  },
});
</script>

<style lang="scss" scoped>
.rd-password-text {
  @include flex-basic;
  @include space(5px);
  line-height: 30px;

  .eye {
    display: block;
    width: 20px;
    height: 20px;
    font-size: 16px;
    line-height: 20px;
    color: $background-2;
    cursor: pointer;

    &:hover {
      color: $info;
    }
  }
}
.el-form-item {
  @each $size, $height in $input-height {
    &--#{$size} {
      .rd-password-text {
        line-height: $height;
      }
    }
  }
}
</style>
