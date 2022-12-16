<i18n src="@/languages/system_setting/url_management/batch_add.json"></i18n>
<template lang="pug">
rd-dialog(
  :model-value="modelValue"
  :title="t('batch_add_domain_name')"
  :close-on-click-modal="false"
  width="480px"
  @update:model-value="open($event)"
)
  .content
    //- 提示
    .msg
      div {{ t('batch_add_domain_name_msg1', { num: maxRows }) }}
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
    rd-button(type="secondary" @click="open(false)") {{ t('cancel') }}
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
  emits: ['confirm', 'update:model-value'],
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
          validator: (rule: object, domains: string[]) => {
            return new Promise<void>((resolve, reject) => {
              // 檢查數量是否超過最大值
              if (domains.length > props.maxRows) {
                reject(t('over_apply_domain_limit'));
              } else {
                resolve();
              }
            });
          },
        },
        { trigger: 'change', required: true, message: t('not_null') },
      ],
    };

    // textrea的placeholder
    const textreaPlaceholder = [
      t('batch_add_placeholder_msg1'),
      t('batch_add_placeholder_msg2'),
      t('batch_add_placeholder_msg3'),
    ].join('\n');

    // 觸發父層值的異動
    const open = (value: boolean) => {
      if (!value) {
        // input清空
        batchValue.value = '';
        // 清空驗證
        batchFormRef.value.resetFields();
      }

      emit('update:model-value', value);
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
          open(false);
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
      open,
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
