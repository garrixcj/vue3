<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
//- 申請憑證(包含批次操作)
rd-dialog(
  :title="isSingle ? t('go_to_apply_ssl_certificate') : t('go_to_batch_apply_ssl_certificate')"
  :close-on-click-modal="false"
  :model-value="visible"
  width="550px"
  @update:model-value="$emit('update:visible', $event)"
  @close="reset"
)
  rd-form.form-content(label-width="90px" size="small")
    //- 單一操作
    .single-option(v-if="isSingle")
      rd-form-item(:label="t('site')")
        span {{ data.siteName }}
      rd-form-item(:label="t('suffix')")
        span @{{ data.suffix }}
    rd-form-item(:label="t('domain_name')")
      .domain-name-list(
        v-for="(domainName, index) in domainNameData"
        :key="index"
      )
        rd-link(:href="`http://${domainName}`" target="_blank") {{ domainName }}
        span(v-if="index !== domainNameData.length - 1") 、
    rd-form-item(size="default")
      template(#label)
        span {{ t('automatic_renewal') }}
        rd-tooltip(
          effect="dark"
          placement="top"
          :content="t('automatic_renewal_info')"
        )
          i.mdi.mdi-information
      rd-switch(v-model="form.automaticExtension" :active="applySSLActive")
    //- 備註
    rd-form-item(:label="t('remark')" size="default")
      rd-input(v-model="form.remark" show-word-limit clearable :maxlength="30")
    rd-form-item
      span {{ t('go_to_old_ssl_msg', { function_name: t('domain_ssl') }) }}
  template(#footer)
    rd-button(type="secondary" @click="$emit('update:visible', false)") {{ t('cancel') }}
    rd-button(type="primary" @click="submit") {{ t('go_to') }}
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { type PropType, defineComponent, reactive, computed } from 'vue';
import { randomAlphanumeric } from '@/components/utils/random/index';
import type { RemarkDomainNameForm } from './type';
import urlAPI from '@/api/url';

type Data = {
  action: string;
  site: string;
  siteName: string;
  siteType: number;
  suffix: string;
  domainNameList: RemarkDomainNameForm[];
  remark: string;
};

export default defineComponent({
  name: 'UrlManagementApplySSL', // 網址管理 - 申請憑證
  props: {
    // 開關
    visible: {
      type: Boolean,
      default: false,
    },
    // 資料
    data: {
      type: Object as PropType<Data>,
      default: () => ({}),
    },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });

    // 表單資料
    const form = reactive({
      automaticExtension: true,
      remark: '', // 備註
    });

    const applySSLActive = {
      type: 'success',
      text: t('enable'),
      inverseText: t('disable'),
    } as const;

    // 單一操作
    const isSingle = computed(() => props.data.action === 'single');

    // 域名資料
    const domainNameData = computed(() => {
      return props.data.domainNameList
        .filter(item => item.applySSLEnable)
        .map(item => item.domainName);
    });

    // 送出
    const submit = () => {
      emit('update:visible', false);
      const token = randomAlphanumeric();
      return urlAPI.cacheApplySSL(domainNameData.value, token).then(resp => {
        if (resp.data.result) {
          window.console.log('111');
          // // 前往舊版SSL憑證管理的新增憑證頁面
          // window.open(`${hosts.rd3}/hall/ssl?add=1&token=${token}`);
        }
      });
    };

    // 還原
    const reset = () => {
      form.automaticExtension = true;
      form.remark = '';
    };

    return {
      t,
      form,
      isSingle,
      applySSLActive,
      domainNameData,
      submit,
      reset,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-content {
  @include space-vertical(15px);
}
</style>
