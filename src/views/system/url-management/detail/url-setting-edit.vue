<template lang="pug">
rd-card(v-loading="loading" :title="t('domain_name_setting')")
  template(#subTitle)
    //- 申請已達上限
    template(v-if="!todayCanApplyNum")
      .is-error
        i18n-t(keypath="apply_domain_info_error" tag="span")
          template(#listNum) {{ urlList.length }}
          template(#listTotal) {{ listLimit }}
          template(#buyMethod) {{ t(priceListDict[basicForm.buy]) }}
          template(#already) {{ requestionNum }}
    //- 申請未達上限
    template(v-else)
      div(:class="{ 'is-error': urlList.length > listLimit }")
        i18n-t(keypath="apply_domain_info" tag="span")
          template(#listNum) {{ urlList.length }}
          template(#listTotal) {{ listLimit }}
          template(#buyMethod) {{ t(priceListDict[basicForm.buy]) }}
          template(#already) {{ requestionNum }}
          template(#rest) {{ todayCanApplyNum }}
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
        :disabled="!todayCanApplyNum"
        @click="visibleFileDialog = true"
      ) {{ t('upload_domain') }}
      //- 批次新增域名
      rd-button(
        type="primary"
        size="small"
        :disabled="!todayCanApplyNum"
        @click="visible = true"
      ) {{ t('multiple_add_domain') }}
  template(#content)
    rd-form(ref="urlListFormRef" :model="urlList")
      rd-table(ref="urlTableRef" border :data="urlList")
        //- 序號
        rd-table-column(
          type="index"
          :label="t('increment_number')"
          header-align="center"
          width="60"
        )
        //- 域名
        rd-table-column(
          prop="domain"
          header-align="center"
          label-class-name="format-class-label"
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
          template(#default="scope")
            rd-form-item(
              :key="scope.row.key"
              :prop="`${scope.$index}.domain`"
              :rules="{ trigger: 'blur', asyncValidator: urlValidatePass }"
              :show-message="false"
            )
              rd-input.can-focus(
                v-model="scope.row.domain"
                :placeholder="t('please_enter_domain_name')"
                clearable
                error="error"
                @input="autoAddRow"
                @blur="checkAllDataFormatAndValid"
                @clear="checkAllDataFormatAndValid"
              )
                template(#suffix)
                  rd-text-counter(
                    :text="scope.row.domain"
                    :maxlength="inputLimit"
                  )
        //- 格式檢查
        rd-table-column(
          prop="format"
          header-align="center"
          class-name="format-class"
          label-class-name="format-class-label"
        )
          template(#header)
            .header-space
              span {{ t('check_format') }}
              rd-tooltip(placement="top")
                template(#content)
                  div {{ t('check_format_msg1') }}
                  div {{ t('check_format_msg2') }}
                  div {{ t('check_format_msg3') }}
                  div {{ t('check_format_msg4') }}
                  div {{ t('check_format_msg5') }}
                  div {{ t('check_format_msg6') }}
                i.mdi.mdi-information
          template(#default="scope")
            template(v-if="scope.row.format")
              .format
                i.mdi.mdi-alert-circle.is-warning(
                  v-if="showWarningIcon(scope.row.format)"
                )
                span(:class="{ 'is-error': !scope.row.legal }") {{ t(`format_msg_${snakeCase(scope.row.format)}`) }}
            template(v-else)
              span --
        //- 操作
        rd-table-column(
          :label="t('operating')"
          prop="operate"
          header-align="center"
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
      v-model="visibleFileDialog"
      :maxRows="listLimit"
      @confirm="batchAddUrl"
    )
    //- 批次新增域名的dialog
    batch-input-dialog(
      v-model="visible"
      :maxRows="listLimit"
      @confirm="batchAddUrl"
    )
  template(#footer)
    //- 新增
    rd-button(
      type="default"
      size="small"
      :disabled="urlList.length >= listLimit || !todayCanApplyNum"
      @click="addNewRow()"
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
  nextTick,
} from 'vue';
import { useI18n } from 'vue-i18n';
import type { ApplyDomain, BasicSetting } from './detail';
import { findIndex, snakeCase } from 'lodash';
import RdTextCounter from '@/components/custom/text-counter/index.vue';
import { notify } from '@/components/utils/notification';
import batchInputDialog from './batch-input-dialog.vue';
import uploadFileDialog from './upload-file-dialog.vue';
import { priceListDict } from '../common/estimate';

export default defineComponent({
  name: 'UrlManagementUrlSettingEditCard',
  components: { RdTextCounter, batchInputDialog, uploadFileDialog },
  setup(props, { expose }) {
    // 字典
    const { t } = useI18n({ useScope: 'local' });
    // 網址
    const urlList = inject('UrlManagement:urlList') as Ref<ApplyDomain[]>;
    // 基本資料
    const basicForm = inject('UrlManagement:basicData') as Ref<BasicSetting>;
    // 申請筆數
    const requestionNum = inject('UrlManagement:requestionNum') as Ref<number>;
    // 還可申請的數量
    const restrictionNumByBuy = inject(
      'UrlManagement:restrictionNumByBuy',
    ) as Record<BasicSetting['buy'], number>;
    // 拿來當作不重複key使用，避免新增刪除時造成混亂
    let key = ref(0);
    const urlTableRef = ref();
    const urlListFormRef = ref();
    // 域名長度上限
    const inputLimit = 62;
    // 批次新增域名dialog
    const visible = ref(false);
    // 上傳域名dialog(檔案)
    const visibleFileDialog = ref(false);
    // 取得真的有填資料的網址數量
    const haveUrlLength = computed(
      () => urlList.value.filter(obj => obj.domain).length,
    );
    // 封裝驗證，供外部使用
    const validatorurlListForm = () => {
      // 超過今日可申請上限 || 列表的數量大於今日可申請上限(已超過可申請域名數量)
      if (
        !todayCanApplyNum.value ||
        urlList.value.length > todayCanApplyNum.value
      ) {
        notify.error({
          title: t('error'),
          message: t('over_apply_limit'),
        });

        return false;
      }

      // 空單時(未輸入域名)
      if (!haveUrlLength.value) {
        notify.error({
          title: t('error'),
          message: t('format_msg_empty'),
        });

        return false;
      }

      // 網址本身驗證有誤(請先修改N筆格式錯誤域名)
      return urlListFormRef.value.validate((valid: boolean) => {
        if (!valid) {
          notify.error({
            title: t('error'),
            message: t('please_edit_error_domain', {
              num: urlList.value.filter(obj => !obj.legal).length,
            }),
          });
        }

        return valid && todayCanApplyNum.value;
      });
    };
    // 是否顯示loading
    const loading = ref(false);

    // 今日還可申請的總筆數
    const todayCanApplyNum = computed(
      () => restrictionNumByBuy[basicForm.value.buy] - requestionNum.value,
    );

    // 單張單據可填入的網址上限(最大100)
    const listLimit = computed(() =>
      todayCanApplyNum.value > 100 ? 100 : todayCanApplyNum.value,
    );

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
      const format = getFormat(+index, domain);
      return new Promise<void>((resolve, reject) => {
        // 當域名為空時視為正常、判定格式是否合法
        if (!domain || checkFormatLegal(format)) {
          resolve();
        } else {
          reject('');
        }
      });
    };

    // 新增一行
    const addNewRow = (domain?: string) => {
      urlList.value.push({
        key: key.value,
        domain: domain || '',
        format: '',
        legal: false,
      });
      key.value += 1;
    };

    // 初始時預設先新增一行
    addNewRow();

    // 自動新增一行
    const autoAddRow = () => {
      const emptyRow = urlList.value.filter(obj => !obj.domain).length;
      // 當沒有空行且未到達今日申請上限時新增一行
      if (!emptyRow && urlList.value.length < todayCanApplyNum.value) {
        addNewRow();
      }
    };

    //- TODO: 有bug，為附屬功能故先行註解，待其餘主要功能完成再回來修
    // @keydown.tab="tabNextRow(scope.$index, $event)
    // focus到下一行input
    // const tabNextRow = (index: number, event: KeyboardEvent) => {
    //   const nextIndex = index + 1;
    //   const inputDomGroup =
    //     urlTableRef.value.$el.getElementsByClassName('can-focus');
    //   if (nextIndex < inputDomGroup.length) {
    //     event.preventDefault();
    //     inputDomGroup.value[nextIndex].focus();
    //   }
    // };

    // 判定是否顯示僅告的icon(指定格式的域名會需要顯示)
    const showWarningIcon = (format: string) => {
      // 「特殊頂級域名，不好解析」格式的域名需要顯示
      return ['specialDomain'].includes(format);
    };

    // 取得格式
    const getFormat = (index: number, domain: string) => {
      // 當今天域名是空的
      if (!domain) {
        return '';
      }

      // 域名重複輸入(列表裡有重複的域名，第一個以外的才被視為重複)
      if (
        urlList.value.filter(obj => obj.domain === domain).length > 1 &&
        findIndex(urlList.value, ['domain', domain]) !== index
      ) {
        return 'double';
      }

      // 非二級域名不可使用
      const secondLevelRegex = /^[^\\.]+(\.[^\\.]+){1}$/;
      if (!secondLevelRegex.test(domain)) {
        return 'notSecondLevel';
      }

      // 域名格式錯誤(僅可輸入大小寫英文字母及數字，及「-」、「.」符號、字數不可超過一定的上限)
      const formatRegex = /^[a-zA-Z\d-]+(\.[a-zA-Z\d-]+){1}$/;
      if (!formatRegex.test(domain) || domain.length > inputLimit) {
        return 'formatError';
      }

      // 域名不可包含的字串
      const illegalTextRegex = /(bbin|bb-in|bbos|bb-os|bbgp|bbp|xbb|nbb)/;
      // 無法綁定，請洽專員(當字串裡有包含不可包含的字串時)
      if (illegalTextRegex.test(domain)) {
        return 'notBindingFindContact';
      }

      // 需要特殊判斷的頂級域名part1(完全不可用)
      const notUseDomain = /\.(ki)$/;
      // 無法綁定，請洽專員(當今天為特殊頂級域名，且購買方式為「bbin」時)
      if (notUseDomain.test(domain)) {
        return 'notBindingFindContact';
      }

      // 需要特殊判斷的頂級域名part2(依照購買方式決定是否不可用)
      const specialDomain = /\.(cn|us)$/;
      // 無法綁定，請洽專員(當今天為特殊頂級域名，且購買方式為「bbin」時)
      if (specialDomain.test(domain) && basicForm.value.buy === 'bbin') {
        return 'notBindingFindContact';
      }

      // 一般的域名
      const normalDomain = /\.(com|net)$/;
      // 特殊頂級域名，不好解析
      if (!normalDomain.test(domain)) {
        return 'specialDomain';
      }

      // 域名格式正確
      return 'success';
    };

    // 判斷格式是否合法
    const checkFormatLegal = (format: string) => {
      // 網址是正常的格式(成功、特殊頂級域名，不好解析)
      const correctFormat = ['success', 'specialDomain'];

      return correctFormat.includes(format);
    };

    // 塞入判斷出來的格式與是否合法
    const setFormatAndLegal = (index: number, domain: string) => {
      const resultFormat = getFormat(index, domain);
      // 塞入判斷出來的格式
      urlList.value[index].format = resultFormat;
      // 塞入是否合法的判斷
      urlList.value[index].legal = checkFormatLegal(resultFormat);
    };

    // 檢查所有域名的格式
    const checkAllDataFormatAndValid = () => {
      urlList.value.forEach((obj, index) => {
        // 重新塞入判斷出來的格式與是否合法
        setFormatAndLegal(index, obj.domain);
        // 驗證
        nextTick(() => urlListFormRef.value.validate());
      });
    };

    // 移除一行
    const removeRow = (index: number) => {
      // 當有時才移除
      if (urlList.value[index]) {
        urlList.value.splice(index, 1);
      }
      // 移除時重新驗證剩下的網址格式
      checkAllDataFormatAndValid();
    };

    // 將格式錯誤的域名都刪除
    const removeErrorRow = () => {
      // 因splice的index會重置，故不使用forEach搭配removeRow
      const correctUrl = urlList.value.filter(obj => obj.legal);

      // 僅留下格式正確的域名
      urlList.value = correctUrl;
      // 當沒有任何域名時，新增一行回列表
      if (!correctUrl.length) {
        addNewRow();
      }
      // 重置驗證
      urlListFormRef.value.clearValidate();
    };

    // 範例下載
    const downloadExample = () => {
      // TODO: 待後端確定之後填入網址
      window.open('');
    };

    // 批次新增域名
    const batchAddUrl = (batchUrl: string[]) => {
      // 清空原本全部的資料
      urlList.value = [];
      // 批次塞入
      batchUrl.forEach(url => {
        // 新增一筆
        addNewRow(url);
      });
      // 格式檢查
      checkAllDataFormatAndValid();
    };

    // 封裝loading顯示，供上層使用(因切換個買方式時只想把遮罩蓋在域名列表，其他地方不蓋)
    const showLoading = (showLoading = true) => {
      loading.value = showLoading;
    };

    // 提供「重新載入申請筆數與還可申請的數量」、「驗證form」、「格式檢查」給外部使用
    expose({
      showLoading,
      validatorurlListForm,
      checkAllDataFormatAndValid,
    });

    return {
      t,
      urlList,
      listLimit,
      inputLimit,
      requestionNum,
      todayCanApplyNum,
      addNewRow,
      removeRow,
      batchAddUrl,
      downloadExample,
      autoAddRow,
      snakeCase,
      showWarningIcon,
      removeErrorRow,
      checkAllDataFormatAndValid,
      urlValidatePass,
      urlTableRef,
      urlListFormRef,
      loading,
      visible,
      visibleFileDialog,
      priceListDict,
      basicForm,
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
