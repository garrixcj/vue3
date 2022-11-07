<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
rd-dialog(
  v-model="dialogVisible"
  :title="t('batch_remark')"
  :close-on-click-modal="false"
  :before-close="emitCancelEdit"
  width="520px"
)
  .remark-illustrate {{ t('remark_illustrate_2', { num: domainNameData.length }) }}
  rd-form(label-width="65px" size="small")
    rd-form-item(:label="t('cover')")
      rd-radio-group(v-model="formData.type")
        rd-radio(label="cover") {{ t('direct_coverage') }}
        rd-radio(label="noRemark") {{ t('only_modify_no_remark') }}
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
import { isEmpty } from 'lodash';
import { type PropType, defineComponent, computed, reactive } from 'vue';
import { notify } from '@/components/utils/notification';
import { url as urlAPI } from '@/api/domain';

type DomainNameData = {
  site: string;
  domainName: string;
  remark: string;
};

export default defineComponent({
  name: 'BatchEditRemark', // 網址管理 - 批次編輯備註
  props: {
    // 開關
    visible: {
      type: Boolean,
      default: false,
    },
    // 域名資料
    domainNameData: {
      type: Array as PropType<DomainNameData[]>,
      default: () => [],
    },
  },
  emits: ['update:visible', 'saved'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });

    // 表單資料
    const formData = reactive({
      type: 'cover',
      remark: '',
    });

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
      if (checkDomainNameData()) {
        return urlAPI
          .updateDomainNameRemark(setRemarks(), 1, formData.remark)
          .then(resp => {
            if (resp.data.result) {
              notify.success({ title: t('success') });
            }
            changeVisible(false);
          });
      }
      changeVisible(false);
    };
    // 設定備註資料
    const setRemarks = () => {
      if (typeof props.domainNameData !== 'undefined') {
        return props.domainNameData.reduce(
          (
            acc: { site_group: string; domain_name: string }[],
            item: DomainNameData,
          ) => {
            if (formData.type === 'cover' || isEmpty(item.remark)) {
              return [
                ...acc,
                { site_group: item.site, domain_name: item.domainName },
              ];
            }
            return acc;
          },
          [],
        );
      }
      return [];
    };
    // 檢查域名資料
    const checkDomainNameData = () => {
      // 選擇只修改無備註時，需檢查域名資料是否有無備註的資料
      if (formData.type === 'noRemark') {
        const noEmptyData = props.domainNameData?.some(item =>
          isEmpty(item.remark),
        );
        if (!noEmptyData) {
          notify.warning({ title: t('warning'), message: t('warning_msg') });
        }
        return noEmptyData;
      }
      return true;
    };

    return {
      t,
      formData,
      dialogVisible,
      emitCancelEdit,
      saveRemark,
    };
  },
});
</script>

<style lang="scss" scoped>
.remark-illustrate {
  margin-bottom: 15px;
}
</style>
