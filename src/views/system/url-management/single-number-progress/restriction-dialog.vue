<template lang="pug">
.restriction-dialog(v-loading="loading")
  rd-dialog(
    :model-value="modelValue"
    :title="t('restriction')"
    :close-on-click-modal="false"
    width="500px"
    @update:model-value="resetAndEmit($event)"
  )
    .msg {{ t('setting_limit_msg1') }}
    .msg {{ t('setting_limit_msg2') }}
    .msg {{ t('setting_limit_msg3') }}
    rd-divider.divider-text(content-position="left") {{ t('apply_domain_limit') }}
    rd-form(
      ref="formRef"
      v-loading="loading"
      label-position="right"
      label-width="130px"
      :model="restrictionNum"
      :rules="rules"
    )
      rd-form-item(prop="bbin")
        template(#label)
          span {{ t('bbin_buy_limit') }}
          rd-tooltip(
            placement="bottom"
            :content="t('member_limit_info', { minimum, maximum: bbinMaximum })"
          )
            i.mdi.mdi-information
        rd-input-number.default-theme.input-width(
          v-model.number="restrictionNum.bbin"
          :min="minimum"
          :max="bbinMaximum"
        )
      rd-form-item(prop="domain")
        template(#label)
          span {{ t('domain_buy_limit') }}
          rd-tooltip(
            placement="bottom"
            :content="t('member_limit_info', { minimum, maximum: domainMaximum })"
          )
            i.mdi.mdi-information
        rd-input-number.default-theme.input-width(
          v-model.number="restrictionNum.domain"
          :min="minimum"
          :max="domainMaximum"
        )
    rd-divider.divider-text(content-position="left") {{ t('preview_results') }}
    rd-alert.size-small(type="success" :closable="false")
      ul
        li {{ t('domain_limit_result1', { num: restrictionNum.bbin }) }}
        li {{ t('domain_limit_result2', { num: restrictionNum.domain }) }}
    template(#footer)
      rd-button(
        type="secondary"
        :disabled="loading"
        @click="resetAndEmit(false)"
      ) {{ t('cancel') }}
      rd-button(type="primary" :disabled="loading" @click="submit") {{ t('confirm') }}
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteRestriction } from './restriction';
import { notify } from '@/components/utils/notification';

export default defineComponent({
  name: 'UrlManagementLimitDialog',
  props: {
    modelValue: Boolean,
  },
  emits: ['update:model-value'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'parent' });
    // 站別限制相關
    const { restrictionNum, getRestriction, putRestriction } =
      useSiteRestriction();
    const loading = ref(false);
    const formRef = ref();
    // 最小預設值
    const minimum = 1;
    // 公司買最大預設值
    const bbinMaximum = 100;
    // 廳主買最大預設值
    const domainMaximum = 500;

    // 重新撈取現在的限定筆數
    const resetRestriction = () => {
      loading.value = true;
      getRestriction().then(() => {
        loading.value = false;
      });
    };

    watch(
      () => props.modelValue,
      value => {
        if (value) {
          // 當今天是要開啟時重新設定現在的限定筆數
          resetRestriction();
        }
      },
    );

    // 根據狀態進行重置並觸發上層值的更新
    const resetAndEmit = (visible: boolean) => {
      // 觸發上層更新
      emit('update:model-value', visible);

      if (!visible) {
        // 當今天是要關閉時清除驗證
        formRef.value.clearValidate();
      }
    };

    // 驗證規則
    const rules = {
      bbin: [
        { required: true, message: t('not_null'), trigger: 'change' },
        {
          type: 'number',
          min: minimum,
          max: bbinMaximum,
          message: t('input_error'),
          trigger: 'change',
        },
      ],
      domain: [
        { required: true, message: t('not_null'), trigger: 'change' },
        {
          type: 'number',
          min: minimum,
          max: domainMaximum,
          message: t('input_error'),
          trigger: 'change',
        },
      ],
    };

    // 確定送出
    const submit = () => {
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          loading.value = true;
          putRestriction(restrictionNum.bbin, restrictionNum.domain).then(
            result => {
              if (result) {
                notify.success({
                  title: t('success'),
                  message: t('save_success_setting_limit'),
                });
                resetAndEmit(false);
              }
            },
          );
        }
      });
    };

    return {
      t,
      formRef,
      minimum,
      bbinMaximum,
      domainMaximum,
      submit,
      rules,
      close,
      loading,
      restrictionNum,
      resetAndEmit,
    };
  },
});
</script>

<style lang="scss">
.input-width {
  width: 300px;
}
.divider-text {
  @include divider-text(#fff, $text-3);
}
</style>
