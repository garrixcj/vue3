<i18n src="./lang.json"></i18n>
<template lang="pug">
//- 匯出備註
rd-dialog(
  v-model="privateVisible"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  :show-close="false"
  :append-to-body="true"
  width="532px"
)
  //- 標題
  template(#title)
    .header
      .title {{ t('export') }}-{{ t('remark') }}
      .subtitle {{ t('export_memo') }}
  //- 輸入匡
  rd-input(
    v-model="note"
    type="textarea"
    :placeholder="t('memo_limit', { num: maxLength })"
    show-word-limit
    resize="none"
    :rows="5"
    :maxlength="maxLength"
  )
  //- 確認/取消
  template(#footer)
    rd-button(type="secondary" @click="cancel") {{ t('cancel_export') }}
    rd-button(type="primary" @click="confirm") {{ t('confirm_export') }}
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useCheckExport } from './check';
import { notify } from '@/components/utils/notification';
import { useI18n } from 'vue-i18n';

type ExportParams = {
  functionName: string;
  tabName: string;
};

export default defineComponent({
  name: 'ExportNote',
  props: {
    // 父層控制顯示參數
    visible: {
      type: Boolean,
      default: false,
    },
    // 備註最大字數限制
    maxLength: {
      type: Number,
      default: 60,
    },
    // 匯出用參數 functionName:功能名稱 tabName:頁籤名稱
    params: {
      type: Object as PropType<ExportParams>,
      required: true,
    },
  },
  emits: ['update:visible', 'confirm'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });
    const note = ref(''); // 備註
    const privateVisible = ref(false); // 元件中私有控制顯示參數

    const currentVisible = computed(() => props.visible);

    const { checkExport } = useCheckExport();

    watch(currentVisible, val => {
      if (val) {
        checkExport(props.params.functionName, props.params.tabName)
          .then(() => {
            privateVisible.value = true;
          })
          .catch(err => {
            emit('update:visible', false);
            if (err.type === 'mainten') {
              const message = `${t('downloads')} ${t('667077006', {
                time: err.time,
              })}`;
              // 下載專區維護中
              notify.error({
                title: t('error'),
                message,
              });
            } else if (err === 'busy') {
              // 五分鐘後再試
              notify.error({
                title: t('error'),
                message: t('667098002'),
              });
            }
          });
      } else {
        privateVisible.value = false;
      }
    });

    // 取消
    const cancel = () => {
      emit('update:visible', false);
    };

    // 確認匯出
    const confirm = () => {
      emit('confirm', note.value);
      note.value = '';
    };

    return {
      t,
      note,
      privateVisible,
      cancel,
      confirm,
    };
  },
});
</script>
<style lang="scss" scoped>
.header {
  @include flex-basic(flex-start, flex-end);
  @include space(15px);
  @include divider-margin-vertical(15px, 0);
  @include header-title-1;
  @include header-title-2;
}
</style>
