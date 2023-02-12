<i18n src="../../utils/rd/lang.json"></i18n>
<template lang="pug">
.batch-mode(:class="{ 'on-batch': switchStatus }")
  .title {{ t('batch_mode') }}
  rd-switch(v-model="switchStatus" :disabled="disabled" @change="changeSwitch")
  rd-divider(v-if="switchStatus" direction="vertical")
  //- 已選擇筆數
  .selected(v-if="switchStatus") {{ t('batch_selection_count', { num: count }) }}
  rd-divider(v-if="switchStatus" direction="vertical")
  //- 批次操作區
  .operate(v-if="switchStatus")
    slot(name="operate")
</template>

<script lang="ts">
import { defineComponent, ref, warn, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'RdBatchMode', // 批次模式
  props: {
    // switch 開關狀態
    visible: {
      type: Boolean,
      default: false,
    },
    // 禁能狀態
    disabled: {
      type: Boolean,
      default: false,
    },
    // 已選擇筆數
    count: {
      type: [Number, String],
      default: 0,
    },
  },
  emits: ['change', 'update:visible'],
  setup(props, { emit, slots }) {
    const { t } = useI18n({ useScope: 'local' });

    const switchStatus = ref(props.visible);

    // 監聽 visible 更動時
    watch(
      () => props.visible,
      (value: boolean) => {
        switchStatus.value = value;
      },
    );

    // 批次模式開啟 or 關閉
    const changeSwitch = (status: Event) => {
      emit('update:visible', status);
      emit('change', status);
    };

    // 未使用 operate slots 時跳 warn
    if (typeof slots.operate === 'undefined') {
      warn('Unused operate slots');
    }

    return {
      t,
      switchStatus,
      changeSwitch,
    };
  },
});
</script>

<style lang="scss" scoped>
$height: 24px;
.batch-mode {
  @include flex-basic();

  padding: 2px 10px;
  border: 1px solid $background-3;
  border-radius: 4px;

  > div {
    @include flex-basic();
    @include space();

    &:not(.el-divider) {
      height: $height;
    }
  }
  .operate {
    @include flex-basic();
    @include space();
    height: $height;
  }

  &.on-batch {
    border-color: $success;
  }
}
</style>
