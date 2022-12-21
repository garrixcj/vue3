<template lang="pug">
rd-card(:title="t('domain_name_setting')")
  template(#subTitle)
    //- 申請已達上限
    template(v-if="!canApplyNum")
      .is-error
        i18n-t(keypath="apply_domain_info_error" tag="span")
          template(#listNum) {{ urlList.length }}
          template(#listTotal) {{ listLimit }}
          template(#buyMethod) {{ t(priceListDict[basicData.buy]) }}
          template(#already) {{ requestionNum }}
    //- 申請未達上限
    template(v-else)
      div(:class="{ 'is-error': urlList.length > listLimit }")
        i18n-t(keypath="apply_domain_info" tag="span")
          template(#listNum) {{ urlList.length }}
          template(#listTotal) {{ listLimit }}
          template(#buyMethod) {{ t(priceListDict[basicData.buy]) }}
          template(#already) {{ requestionNum }}
          template(#rest) {{ canApplyNum }}
  template(#headerSuffix)
    .flex-container
      //- 一鍵刪除錯誤域名
      rd-button(type="secondary" size="small" @click="removeErrorRow") {{ t('one_click_delete_error_domain') }}
      //- 分割線
      rd-divider(direction="vertical")
      //- 範例下載
      rd-button(text @click="downloadExample") {{ t('sample_download') }}
      //- 範例下載tooltip
      rd-tooltip(placement="top")
        template(#content)
          div {{ t('sample_download_msg1') }}
          div {{ t('sample_download_msg2') }}
          div {{ t('sample_download_msg3') }}
          .empty-row
          div {{ t('sample_download_msg4') }}
          div {{ t('sample_download_msg5', { total: listLimit }) }}
        i.mdi.mdi-information
      //- 檔案上傳域名
      rd-button(
        type="default"
        size="small"
        :disabled="!canApplyNum"
        @click="visible.file = true"
      ) {{ t('upload_domain') }}
      //- 批次新增域名
      rd-button(
        type="primary"
        size="small"
        :disabled="!canApplyNum"
        @click="visible.add = true"
      ) {{ t('multiple_add_domain') }}
  template(#content)
    rd-form(ref="urlFormRef" :model="urlList")
      rd-table(ref="urlTableRef" border :data="urlList")
        //- 序號
        rd-table-column(
          type="index"
          :label="t('increment_number')"
          header-align="center"
          :resizable="false"
          width="60"
        )
        //- 域名
        rd-table-column(
          prop="domain"
          header-align="center"
          label-class-name="format-class-label"
          :resizable="false"
        )
          template(#header)
            .header-space
              span {{ t('domain_name') }}
              rd-tooltip(placement="top")
                template(#content)
                  div {{ t('domain_name_info1') }}
                  div {{ t('domain_name_info2') }}
                  div {{ t('domain_name_info3') }}
                i.mdi.mdi-information
          template(#default="{ row, $index }")
            rd-form-item(
              :key="row.key"
              :prop="`${$index}.domain`"
              :rules="{ trigger: 'blur', asyncValidator: urlValidatePass }"
              :show-message="false"
            )
              rd-input.can-focus(
                v-model="row.domain"
                :placeholder="t('please_enter_domain_name')"
                clearable
                error="error"
                @input="autoAdd(canApplyNum)"
                @blur="validAllFormat"
                @clear="validAllFormat"
                @keydown.tab="tabNext($index, $event)"
              )
                template(#suffix)
                  rd-text-counter(:text="row.domain" :maxlength="inputLimit")
        //- 格式檢查
        rd-table-column(
          prop="format"
          header-align="center"
          class-name="format-class"
          label-class-name="format-class-label"
          :resizable="false"
        )
          template(#header)
            .header-space
              span {{ t('check_format') }}
              rd-tooltip(placement="top")
                template(#content)
                  div(v-for="n in 7" :key="n") {{ t(`check_format_msg${n}`) }}
                i.mdi.mdi-information
          template(#default="scope")
            template(v-if="scope.row.format")
              .format
                i.mdi.mdi-alert-circle.is-warning(
                  v-if="showWarning(scope.row.format)"
                )
                span(:class="{ 'is-error': !scope.row.legal }") {{ t(`format_msg_${snakeCase(scope.row.format)}`) }}
            template(v-else)
              span --
        //- 操作
        rd-table-column(
          :label="t('operating')"
          prop="operate"
          header-align="center"
          :resizable="false"
        )
          template(#default="scope")
            //- 刪除
            rd-button(
              text
              :disabled="urlList.length === 1"
              @click="removeRow(scope.$index)"
            ) {{ t('delete') }}
    //- 上傳域名dialog
    upload-file-dialog(
      v-model="visible.file"
      :maxRows="listLimit"
      @confirm="batchAdd"
    )
    //- 批次新增域名的dialog
    batch-input-dialog(
      v-model="visible.add"
      :maxRows="listLimit"
      @confirm="batchAdd"
    )
  template(#footer)
    //- 新增
    rd-button(
      type="default"
      size="small"
      :disabled="urlList.length >= listLimit || !canApplyNum"
      @click="addNew()"
    )
      i.mdi.mdi-plus
      span {{ t('add') }}
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  type Ref,
  inject,
  computed,
  reactive,
} from 'vue';
import { useI18n } from 'vue-i18n';
import type { ApplyDomain, BasicSetting } from './apply';
import { snakeCase } from 'lodash';
import RdTextCounter from '@/components/custom/text-counter/index.vue';
import { notify } from '@/components/utils/notification';
import BatchInputDialog from './batch-input-dialog.vue';
import UploadFileDialog from './upload-file-dialog.vue';
import { priceListDict } from '../common/estimate';
import { getState, checkFormatLegal, getListState } from './url';
import { useRow } from './row';

// expose出去的func type
export type UrlSettingExpose = {
  validForm: () => boolean;
  validAllFormat: () => void;
};

export default defineComponent({
  name: 'UrlManagementUrlSettingEditCard',
  components: { RdTextCounter, BatchInputDialog, UploadFileDialog },
  props: {
    // 可以申請的筆數總數
    restrictionNum: { type: Number, required: true },
    // 今日已申請數量
    requestionNum: { type: Number, required: true },
    // 今日還可申請的數量
    canApplyNum: { type: Number, required: true },
  },
  setup(props, { expose }) {
    // 字典
    const { t } = useI18n({ useScope: 'parent' });
    // 基本資料
    const basicData = inject('UrlManagement:basicData') as BasicSetting;
    // 網址
    const urlList = inject('UrlManagement:urlList') as Ref<ApplyDomain[]>;
    // 表格的ref
    const urlTableRef = ref();
    // 表單的ref
    const urlFormRef = ref();

    // 域名長度上限
    const inputLimit = 62;
    // dialog顯示
    const visible = reactive({
      // 批次新增域名dialog
      add: false,
      // 上傳域名dialog(檔案)
      file: false,
    });
    // 是否顯示loading
    const loading = ref(false);
    // 單張單據可填入的網址上限(最大100)
    const listLimit = computed(() =>
      props.canApplyNum > 100 ? 100 : props.canApplyNum,
    );

    // 域名table row相關
    const row = useRow();

    // 初始時預設先新增一行
    row.addNew();

    // 移除
    const removeRow = (index: number) => {
      // 移除一行
      row.remove(index);
      // 移除時重新驗證剩下的網址格式
      validAllFormat();
    };

    // 移除錯誤
    const removeErrorRow = () => {
      // 移除錯誤的行
      row.removeError();
      // 重置驗證
      urlFormRef.value.clearValidate();
    };

    // 檢查所有域名的格式
    const validAllFormat = () => {
      urlList.value = getListState(urlList.value, basicData, inputLimit);
      // 驗證
      urlFormRef.value.validate();
    };

    // 批次新增域名
    const batchAdd = (batchUrl: string[]) => {
      // 清空原本全部的資料
      urlList.value = [];
      // 批次塞入
      batchUrl.forEach(url => {
        // 新增一筆
        row.addNew(url);
      });
      // 格式檢查
      validAllFormat();
    };

    // 取得真的有填資料的網址數量
    const urlCount = computed(
      () => urlList.value.filter(obj => obj.domain).length,
    );
    // 封裝驗證，供外部使用
    const validForm = () => {
      // 超過今日可申請上限 || 列表的數量大於今日可申請上限(已超過可申請域名數量)
      if (!props.canApplyNum || urlList.value.length > props.canApplyNum) {
        notify.error({
          title: t('error'),
          message: t('over_apply_limit'),
        });

        return false;
      }

      // 空單時(未輸入域名)
      if (!urlCount.value) {
        notify.error({
          title: t('error'),
          message: t('format_msg_empty'),
        });

        return false;
      }

      // 網址本身驗證有誤(請先修改N筆格式錯誤域名)
      return urlFormRef.value.validate((valid: boolean) => {
        if (!valid) {
          notify.error({
            title: t('error'),
            message: t('please_edit_error_domain', {
              num: urlList.value.filter(obj => !obj.legal && obj.domain).length,
            }),
          });
        }

        return valid;
      });
    };

    // url input 驗證
    const urlValidatePass = (
      rule: object,
      domain: string,
      callback: Function,
      source: string,
    ) => {
      // 使用source來取得index(source key會是 index.domain)
      const index = Object.keys(source)[0].split('.')[0];
      // 取得格式
      const format = getState(domain, {
        urlList: urlList.value,
        basicData,
        idx: +index,
        inputLimit,
      });
      return new Promise<void>((resolve, reject) => {
        // 當域名為空時視為正常、判定格式是否合法
        if (!domain || checkFormatLegal(format)) {
          resolve();
        } else {
          // 當今天錯誤的時候只有框框亮起來，不要顯示錯誤
          reject('');
        }
      });
    };

    // 判定是否顯示僅告的icon(指定格式的域名會需要顯示)
    const showWarning = (format: string) => {
      // 「特殊頂級域名，不好解析」格式的域名需要顯示
      return ['specialDomain'].includes(format);
    };

    // 範例下載
    const downloadExample = () => {
      window.open('/hex/domain/domain_name/application_example/export');
    };

    // 提供「重新載入申請筆數與還可申請的數量」、「驗證form」、「格式檢查」給外部使用
    expose({
      validForm,
      validAllFormat,
    } as UrlSettingExpose);

    return {
      t,
      urlList,
      listLimit,
      inputLimit,
      addNew: row.addNew,
      batchAdd,
      downloadExample,
      autoAdd: row.autoAdd,
      tabNext: row.tabNext,
      snakeCase,
      showWarning,
      removeErrorRow,
      validAllFormat,
      urlValidatePass,
      urlTableRef,
      urlFormRef,
      loading,
      visible,
      priceListDict,
      removeRow,
      basicData,
    };
  },
});
</script>

<style lang="scss" scoped>
.flex-container {
  @include flex-basic;
  @include space;
}
.empty-row {
  height: 20px;
}
.is-warning {
  color: $warning;
}
.is-error {
  color: $danger;
}
.format-class-label {
  .header-space {
    @include space(3px);
  }
  .mdi {
    color: $text-3;
  }
}
.format-class {
  .format {
    @include space(5px);
  }
}
</style>
