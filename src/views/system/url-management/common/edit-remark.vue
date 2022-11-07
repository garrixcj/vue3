<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
rd-dialog(
  v-model="dialogVisible"
  :title="t('edit_remark')"
  :close-on-click-modal="false"
  :before-close="emitCancelEdit"
  width="520px"
)
  rd-form(label-width="65px" size="small")
    rd-form-item(:label="t('site')")
      span {{ formData.site }}
    rd-form-item(:label="t('suffix')")
      span @{{ formData.suffix }}
    rd-form-item(:label="t('domain_name')")
      .url-color {{ formData.domainName }}
    rd-form-item(:label="t('remark')")
      rd-input(
        v-model="formData.remark"
        type="textarea"
        :placeholder="t('please_enter_remarks')"
        show-word-limit
        :maxlength="200"
      )
  template(#footer)
    rd-button(type="secondary" @click="emitCancelEdit") {{ t('cancel') }}
    rd-button(type="primary" @click="saveRemark") {{ t('save') }}
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { type PropType, defineComponent, computed } from 'vue';
import { notify } from '@/components/utils/notification';
import { url as urlAPI } from '@/api/domain';

type FormDataType = 'site' | 'siteName' | 'suffix' | 'domainName' | 'remark';

export default defineComponent({
  name: 'EditRemark', // 網址管理 - 編輯備註
  props: {
    // 開關
    visible: {
      type: Boolean,
      default: false,
    },
    // 編輯資料
    formData: {
      type: Object as PropType<Record<FormDataType, string>>,
      default: () => ({}),
    },
  },
  emits: ['update:visible', 'saved'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });

    // 更新上層的開關
    const changeVisible = (value: boolean | unknown) => {
      emit('update:visible', value);
    };

    // Dialog 開關
    const dialogVisible = computed({
      get() {
        return props.visible;
      },
      set(val) {
        changeVisible(val);
      },
    });

    // 取消備註
    const emitCancelEdit = () => {
      changeVisible(false);
    };

    // 儲存備註
    const saveRemark = () => {
      if (typeof props.formData !== 'undefined') {
        return urlAPI
          .updateDomainNameRemark(
            [
              {
                site_group: props.formData.site,
                domain_name: props.formData.domainName,
              },
            ],
            1,
            props.formData.remark,
          )
          .then(resp => {
            if (resp.data.result) {
              notify.success({ title: t('success') });
            }
            changeVisible(false);
          });
      }
    };

    return {
      t,
      dialogVisible,
      emitCancelEdit,
      saveRemark,
    };
  },
});
</script>

<style lang="scss" scoped>
.url-color {
  color: $primary-2;
}
</style>
