<i18n src="../../utils/rd/lang.json"></i18n>
<template lang="pug">
.confirm-switch(:class="$attrs.class")
  rd-popover(
    ref="popoverRef"
    placement="top"
    trigger="click"
    :effect="popover?.effect || 'dark'"
    :width="popover?.width || 'auto'"
    :disabled="!!$attrs.disabled"
  )
    //- Popover 標題文字
    slot(name="title")
      .popover-title
        i.mdi.mdi-alert-circle.popover-title__icon
        span {{ popover?.title || '' }}
    //- Popover 內容
    slot(name="content")
    //- Popover 的確認/取消按鈕
    slot(name="button")
      .popover-confirm
        rd-button(type="secondary" @click="cancel") {{ popover?.cancelText || t('cancel') }}
        rd-button(type="primary" @click="confirm") {{ popover?.confirmText || t('confirm') }}
    //- Switch 顯示
    template(#reference)
      slot(name="switch")
        rd-switch(v-bind="$attrs")
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

type PopoverSet = {
  // 標題
  title: string;
  // 效果
  effect?: 'dark' | 'light';
  // 確認按紐文字
  confirmText?: string;
  // 取消按鈕文字
  cancelText?: string;
  // 寬度
  width?: number | string;
};

export default defineComponent({
  // 以switch為底的確認對話框
  name: 'ConfirmSwitch',
  inheritAttrs: false,
  props: {
    popover: {
      type: Object as PropType<PopoverSet>,
    },
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });
    const popoverRef = ref();
    const cancel = () => {
      popoverRef.value.hide();
      emit('cancel');
    };
    const confirm = () => {
      popoverRef.value.hide();
      emit('confirm');
    };

    return {
      t,
      popoverRef,
      cancel,
      confirm,
    };
  },
});
</script>

<style lang="scss" scoped>
.popover {
  &-title {
    @include flex-basic(center);
    @include space(5px);
    &__icon {
      color: $warning;
    }
  }
  &-confirm {
    @include flex-basic(center);
    @include space(10px);
    margin-top: 15px;
  }
}
</style>
