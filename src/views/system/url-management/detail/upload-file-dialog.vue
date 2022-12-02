<template lang="pug">
rd-dialog(
  :model-value="modelValue"
  :title="t('batch_add_domain_name')"
  :close-on-click-modal="false"
  width="750px"
  @close="close"
)
  .content
    //- 提示
    .msg
      div {{ t('upload_file_add_domain_name_msg1') }}
      div {{ t('upload_file_add_domain_name_msg2') }}
    el-upload.upload-demo(
      drag
      accept=".csv"
      action="#"
      :on-change="importFile"
      :auto-upload="false"
      :show-file-list="false"
    )
      i.mdi.mdi-cloud-upload.mdi-size
      .el-upload__text
        span {{ t('drag_msg') }}
        em {{ t('click_upload') }}
    //- 上傳的檢查結果
    .check(
      :class="{ 'is-success': afterUpload && fileValid, 'is-error': afterUpload && !fileValid }"
    )
      span {{ `${t('check_file')}：` }}
      template(v-if="afterUpload")
        i.mdi(:class="fileValid ? 'mdi-check-circle' : 'mdi-close-circle'")
        span {{ fileValidText }}
      template(v-else)
        span --
  template(#footer)
    //- 取消
    rd-button(type="secondary" @click="close") {{ t('cancel') }}
    //- 確定
    rd-button(type="primary" :disabled="!fileValid" @click="confirm") {{ t('confirm') }}
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElUpload, type UploadFile, type UploadProps } from 'element-plus';

export default defineComponent({
  name: 'UrlManagementBatchInputDialog',
  components: { ElUpload },
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
    // 是否傳了檔案
    const afterUpload = ref(false);
    // 檔案的內容的驗證結果
    const fileValid = ref(false);
    // 檔案的內容的驗證結果狀態
    const fileValidText = ref('');
    // 域名陣列
    const urlList: Ref<string[]> = ref([]);

    // 上傳域名
    const importFile: UploadProps['onChange'] = (file: UploadFile) => {
      if (!file.raw) {
        return;
      }

      afterUpload.value = true;
      fileValid.value = false;

      const fileReader = new FileReader();

      // 用txt的方式讀取檔案
      fileReader.readAsText(file.raw);

      // 當檔案被讀取時觸發
      fileReader.onload = () => {
        // 將資料分割成陣列並去除第一行且取有值的部分
        const data: string[] = (fileReader.result as string)
          .split(/\s+/)
          .splice(1)
          .filter(url => url);
        let result = '';

        if (!data.length) {
          // 如果匯入的是沒有資料的檔案
          result = 'error_no_domain';
        } else if (data.length > props.maxRows) {
          // 如果匯入的筆數超過上限
          result = 'error_over_limit';
        } else {
          fileValid.value = true;
          result = 'pass';
          // 塞入陣列暫存
          urlList.value = data;
        }
        fileValidText.value = t(result);
      };
    };

    // 關閉
    const close = () => {
      // 觸發父層v-model值異動
      emit('update:modelValue', false);
      // 驗證清空
      fileValid.value = false;
      fileValidText.value = '';
      // 暫存清空
      urlList.value = [];
      // 回歸為未上傳
      afterUpload.value = false;
    };

    // 確定
    const confirm = () => {
      if (fileValid.value) {
        // 觸發父層動作(傳遞有值的url)
        emit('confirm', urlList.value);
        // 關閉
        close();
      }
    };

    return {
      t,
      close,
      confirm,
      emit,
      fileValid,
      afterUpload,
      importFile,
      fileValidText,
    };
  },
});
</script>
<style lang="scss" scoped>
.content {
  @include space-vertical;
  .is-error {
    color: $danger;
  }
  .is-success {
    color: $success;
  }
  .mdi-size {
    font-size: 46px;
  }
  .check {
    @include flex-basic;
    @include space(2px);
  }
}
</style>
