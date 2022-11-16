<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
rd-dialog(
  v-model="editRemarkForm.visible"
  :title="isSingleOperation ? t('edit_remark') : t('batch_remark')"
  :close-on-click-modal="false"
  width="520px"
)
  rd-form(label-width="65px" size="small")
    //- 單一操作
    .single-option(v-if="isSingleOperation")
      rd-form-item(:label="t('site')")
        span {{ domainNameData[0].site }}
      rd-form-item(:label="t('suffix')")
        span @{{ domainNameData[0].suffix }}
      rd-form-item(:label="t('domain_name')")
        rd-link(
          :href="`http://${domainNameData[0].domainName}`"
          target="_blank"
        ) {{ domainNameData[0].domainName }}
    //- 批次操作
    .batch-option(v-else)
      .remark-illustrate {{ t('remark_illustrate_2', { num: domainNameData.length }) }}
      rd-form-item(:label="t('cover')")
        rd-radio-group(v-model="editRemarkForm.type")
          rd-radio(label="cover") {{ t('direct_coverage') }}
          rd-radio(label="noRemark") {{ t('only_modify_no_remark') }}
    //- 備註
    rd-form-item(:label="t('remark')")
      rd-input(
        v-model="editRemarkForm.remark"
        type="textarea"
        :placeholder="t('please_enter_remarks')"
        show-word-limit
        :maxlength="200"
      )
  template(#footer)
    rd-button(type="secondary" @click="editRemarkForm.visible = false") {{ t('cancel') }}
    rd-button(type="primary" @click="save") {{ t('save') }}
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { isEmpty } from 'lodash';
import { type Ref, defineComponent, inject, computed } from 'vue';
import { notify } from '@/components/utils/notification';

type domainNameData = 'site' | 'siteName' | 'suffix' | 'domainName' | 'remark';

type editRemarkForm = {
  visible: boolean;
  action: string;
  type: string;
  remark: string;
};

export default defineComponent({
  name: 'EditRemark', // 網址管理 - 編輯備註
  emits: ['save'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });
    // 域名資料
    const domainNameData = inject('CustomerDomain:domainNameData') as Ref;
    // Form 資料
    const editRemarkForm = inject(
      'CustomerDomain:editRemarkForm',
    ) as editRemarkForm;
    // 單一操作
    const isSingleOperation = computed(
      () => editRemarkForm.action === 'single',
    );
    // 點擊儲存
    const save = () => {
      // 批次操作選擇只修改無備註，且域名資料全部都有備註時，需跳 Warning
      if (!isSingleOperation.value && editRemarkForm.type === 'noRemark') {
        if (
          !domainNameData.value.some((item: Record<domainNameData, string>) =>
            isEmpty(item.remark),
          )
        ) {
          notify.warning({ title: t('warning'), message: t('warning_msg') });
          return emit('save', false);
        }
      }
      // 單一操作
      if (isSingleOperation.value) {
        editRemarkForm.type = 'cover';
      }
      return emit('save', true);
    };
    return {
      t,
      domainNameData,
      editRemarkForm,
      isSingleOperation,
      save,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-form {
  @include space-vertical(15px);
}
.remark-illustrate {
  margin-bottom: 15px;
  margin-left: 10px;
  color: $text-1;
}
</style>
