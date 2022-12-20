<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
rd-dialog(
  :title="isSingle ? t('edit_remark') : t('batch_remark')"
  :close-on-click-modal="false"
  :model-value="visible"
  width="520px"
  @update:model-value="$emit('update:visible', $event)"
  @close="reset"
)
  rd-form.form-content(label-width="65px" size="small")
    //- 單一操作
    .single-option(v-if="isSingle")
      rd-form-item(:label="t('site')")
        span {{ data.domainNameList[0].site }}
      rd-form-item(:label="t('suffix')")
        span @{{ data.domainNameList[0].suffix }}
      rd-form-item(:label="t('domain_name')")
        rd-link(
          :href="`http://${data.domainNameList[0].domainName}`"
          target="_blank"
        ) {{ data.domainNameList[0].domainName }}
    //- 批次操作
    .batch-option(v-else)
      .remark-illustrate {{ t('remark_illustrate', { num: data.domainNameList.length }) }}
      rd-form-item(:label="t('overwrite')" size="default")
        rd-radio-group(v-model="form.type")
          rd-radio(label="cover") {{ t('overwrite_remarks') }}
          rd-radio(label="noRemark") {{ t('only_modify_no_remark') }}
    //- 備註
    rd-form-item(:label="t('remark')")
      rd-input(
        type="textarea"
        :placeholder="t('please_enter_remarks')"
        show-word-limit
        :autosize="{ minRows: 4 }"
        :model-value="form.remark"
        :maxlength="200"
        @input="form.remark = $event"
      )
  template(#footer)
    rd-button(type="secondary" @click="$emit('update:visible', false)") {{ t('cancel') }}
    rd-button(type="primary" @click="save") {{ t('save') }}
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { isEmpty } from 'lodash';
import {
  type PropType,
  defineComponent,
  inject,
  reactive,
  computed,
  watch,
} from 'vue';
import { notify } from '@/components/utils/notification';
import type { RemarkDomainNameForm } from './type';
import { url as urlAPI } from '@/api/domain';

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
  name: 'EditRemark', // 網址管理 - 編輯備註
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
  emits: ['update:visible', 'update'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });
    // Loading
    const setLoading = inject('UrlManagement:setLoading') as Function;

    // 表單資料
    const form = reactive({
      type: 'cover', // 類型(覆蓋 cover、只修改無備註 noRemark)
      remark: '', // 備註
    });

    // 監聽 props 的 表單備註是否改變
    watch(
      () => props.data.remark,
      (value: string) => {
        form.remark = value;
      },
      { immediate: true },
    );

    // 單一操作
    const isSingle = computed(() => props.data.action === 'single');

    // 點擊儲存
    const save = () => {
      // 批次操作選擇只修改無備註，且域名資料全部都有備註時，需跳 Warning
      if (
        !isSingle.value &&
        form.type === 'noRemark' &&
        props.data.domainNameList.every(item => !isEmpty(item.remark))
      ) {
        notify.warning({ title: t('warning'), message: t('warning_msg') });
        emit('update:visible', false);
        return;
      }
      // 單一操作
      if (isSingle.value) {
        form.type = 'cover';
      }
      setLoading(true);
      return urlAPI
        .updateDomainNameRemark(
          getDomainName(),
          props.data.siteType,
          form.remark,
        )
        .then(resp => {
          if (resp.data.result) {
            notify.success({ title: t('success') });
          }
          setLoading(false);
          emit('update:visible', false);
          emit('update', true);
        });
    };

    // 取得需更改備註的域名
    const getDomainName = () => {
      if (typeof props.data.domainNameList !== 'undefined') {
        return props.data.domainNameList
          .filter(
            item =>
              form.type === 'cover' ||
              (form.type === 'noRemark' && isEmpty(item.remark)),
          )
          .map(item => {
            return { site_group: item.site, domain_name: item.domainName };
          });
      }
      return [];
    };

    // 還原
    const reset = () => {
      form.type = 'cover';
      form.remark = props.data.remark;
    };

    return {
      t,
      form,
      isSingle,
      save,
      reset,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-content {
  @include space-vertical(15px);
}
.remark-illustrate {
  margin-bottom: 15px;
  margin-left: 10px;
  color: $text-1;
}
</style>
