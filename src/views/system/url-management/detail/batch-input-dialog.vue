<template lang="pug">
rd-dialog(
  :model-value="modelValue"
  :title="t('batch_add_domain_name')"
  :close-on-click-modal="false"
  width="480px"
  @close="close"
)
  .content
    //- 提示
    .msg
      div {{ t('batch_add_domain_name_msg1') }}
      div {{ t('batch_add_domain_name_msg2') }}
    //- 批次輸入框
    rd-form(ref="batchFormRef" :model="batchForm" :rules="rules")
      rd-form-item(prop="content")
        rd-input(
          v-model="batchValue"
          type="textarea"
          :placeholder="textreaPlaceholder"
          resize="none"
          :rows="9"
        )
    //- 顯示列數
    .amount
      span(:class="{ 'is-error': batchForm.content.length > maxRows }") {{ batchForm.content.length }}
      span {{ ` / ${maxRows}` }}
      span {{ t('result') }}
  template(#footer)
    //- 取消
    rd-button(type="secondary" @click="close") {{ t('cancel') }}
    //- 確定
    rd-button(type="primary" @click="confirm") {{ t('confirm') }}
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'UrlManagementBatchInputDialog',
  props: {
    modelValue: Boolean,
    // 最大輸入數量
    maxRows: {
      type: Number,
      required: true,
    },
  },
  emits: ['confirm', 'cancel', 'update:modelValue'],
  setup(props, { emit }) {
    // 字典
    const { t } = useI18n({ useScope: 'local' });

    // 批次輸入框內容 ref
    const batchValue = ref('');

    // 批次輸入框
    const batchFormRef = ref();

    // 批次輸入框表單
    const batchForm = computed(() =>
      // 將輸入值分割
      ({ content: batchValue.value ? batchValue.value.split('\n') : [] }),
    );

    const rules = {
      content: [
        {
          trigger: 'change',
          message: t('over_apply_domain_limit'),
          validator: (rule: object, domains: string[], callback: Function) => {
            if (domains.length > props.maxRows) {
              callback(new Error());
            }
            callback();
          },
        },
        { trigger: 'change', required: true, message: t('') },
      ],
    };

    // textrea的placeholder
    const textreaPlaceholder = [
      t('batch_add_placeholder_msg1'),
      t('batch_add_placeholder_msg2'),
      t('batch_add_placeholder_msg3'),
    ].join('\n');

    // 關閉
    const close = () => {
      // 觸發父層v-model值異動
      emit('update:modelValue', false);
      // input清空
      batchValue.value = '';
    };

    // 確定
    const confirm = () => {
      batchFormRef.value.validate((valid: boolean) => {
        if (valid) {
          // 觸發父層動作(傳遞有值的url)
          emit(
            'confirm',
            batchForm.value.content.filter(url => url),
          );
          // 關閉
          close();
        }
      });
    };

    return {
      t,
      batchValue,
      batchForm,
      rules,
      close,
      confirm,
      batchFormRef,
      textreaPlaceholder,
      emit,
    };
  },
});
</script>
<style lang="scss" scoped>
.content {
  @include space-vertical;
  .amount {
    @include flex-basic(flex-end);
    color: $background-1;
  }
  .is-error {
    color: $danger;
  }
}
</style>
