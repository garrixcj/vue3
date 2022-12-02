<template lang="pug">
.url-management-apply(v-loading="loading")
  //- 送出前
  template(v-if="beforePostTicket")
    //- 右方警示訊息
    rd-information(v-show="isApplySite")
      ul
        li {{ t('apply_domain_information1') }}
        li {{ t('apply_domain_information2', { num: restrictionNumByBuy.bbin }) }}
        li {{ t('apply_domain_information3', { num: restrictionNumByBuy.domain }) }}
    rd-navbar-layout(:title="t('apply_url')")
      //- TODO: 站別form沒有置中問題
      template(#afterTitle)
        //- 站別form
        rd-form(
          ref="siteFormRef"
          inline
          size="small"
          :model="siteForm"
          :rules="siteForm.rules"
        )
          rd-form-item(:label="t('site')" prop="site")
            rd-select(
              v-model:value="siteForm.site"
              :quick-search="customSearch"
              :popper-setting="{ width: 'auto' }"
            )
              rd-option(
                v-for="(option, index) in siteOptions"
                :key="index"
                :value="option.value"
                :label="option.label"
                :option="option"
              )
                template(#suffix)
                  | {{ `[ ${option.code} ]` }}
              template(#selected="{ current }")
                | {{ `${current.label} [${current.option.code}]` }}
          rd-form-item
            rd-button(type="default" size="small" @click="apply") {{ t('apply') }}
      template(#titleSuffix)
        //- 有套用域名才會出現
        template(v-if="isApplySite")
          //- 取消
          rd-button(
            type="secondary"
            :disabled="disabledBtn"
            @click="leaveCheck"
          ) {{ t('cancel') }}
          //- 送出
          rd-button(
            type="gradient"
            :disabled="disabledBtn"
            @click="validBeforeSubmit"
          ) {{ t('validation_and_submit') }}
      template(#body)
        rd-layout-content
          //- 套用域名前 - 開始搜尋吧
          template(v-if="!isApplySite")
            before-search-empty(:label="t('start_search')")
          //- 套用域名後
          template(v-else)
            //- 基本設定
            basic-card(
              ref="basicRef"
              mode="apply"
              has-modify
              @changeBuy="reLoadRestrictionAndValidUrl"
            )
            //- 域名設定
            url-setting-edit-card(ref="urlSettingEditRef")
            //- 預估費用
            estimate-card(:url-count="urlCount")
            .button-group
              //- 取消
              rd-button(
                type="secondary"
                :disabled="disabledBtn"
                @click="leaveCheck"
              ) {{ t('cancel') }}
              //- 送出
              rd-button(
                type="gradient"
                :disabled="disabledBtn"
                @click="validBeforeSubmit"
              ) {{ t('validation_and_submit') }}
    //- 送出前確定的dialog
    rd-dialog(
      v-model="submitCheckDialogVisible"
      :title="t('validate_and_apply_num')"
      width="430px"
    )
      i18n-t(keypath="validate_and_apply_num_info1" tag="div")
        template(#buy)
          span {{ t(priceListDict[basicDataDefaultValue.buy]) }}
        template(#total)
          span.is-bold {{ restrictionNumByBuy[basicDataDefaultValue.buy] }}
      i18n-t(keypath="validate_and_apply_num_info2" tag="div")
        template(#rest)
          span.is-bold {{ todayCanApplyNum }}
        template(#sub)
          span.is-error.is-bold {{ urlCount }}
      template(#footer)
        rd-button(type="secondary" @click="submitCheckDialogVisible = false") {{ t('cancel') }}
        rd-button(type="primary" @click="submit") {{ t('comfirm') }}
    //- 尚未儲存 Dialog
    rd-dialog(
      v-model="leaveCheckDialogVisible"
      :title="t('not_saved')"
      width="430px"
    )
      span {{ t('not_saved_check_info') }}
      template(#footer)
        rd-button(type="secondary" @click="leaveCheckDialogVisible = false") {{ t('cancel') }}
        //- TODO: 待補連結
        rd-button(type="primary" @click="") {{ t('confirm') }}
  //- 送出後
  template(v-else)
    //- 右方警示訊息
    rd-information
      ul
        li {{ t('leave_warning') }}
    rd-navbar-layout(
      no-pre-page
      :title="t('apply_url')"
      :sub-title="t(`${siteInfo.label} @${siteInfo.code}`)"
    )
      template(#titleSuffix)
        //- TODO: 待補連結
        //- 返回列表
        rd-button(type="secondary") {{ t('back_to_list') }}
        //- 查看單號進度
        rd-button(v-if="resultStatus.type !== 'error'" type="gradient") {{ t('go_to_ticket_status') }}
      template(#body)
        rd-layout-content
          //- 結果Alert
          rd-alert(:type="resultStatus.type" :title="t(resultStatus.type)")
            div(v-for="(msg, index) in resultStatus.msg" :key="index") {{ msg }}
          //- 基本設定
          basic-card(mode="apply")
          //- 域名設定
          url-setting-callback-card
          //- 預估費用
          estimate-card(:url-count="urlCount")
          //- TODO: 待補連結
          .button-group
            //- 返回列表
            rd-button(type="secondary") {{ t('back_to_list') }}
            //- 查看單號進度(當有成功的域名時才顯示)
            rd-button(v-if="resultStatus.type !== 'error'" type="gradient") {{ t('go_to_ticket_status') }}
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  provide,
  type Ref,
  nextTick,
  computed,
  // watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import EstimateCard from './estimate-card.vue';
import BasicCard from './basic-card.vue';
import UrlSettingEditCard from './url-setting-edit.vue';
import UrlSettingCallbackCard from './url-setting-callback.vue';
import type { BasicSetting, ApplyDomain } from './detail';
import { useSiteList, type SiteOption } from '../common/list';
import { useTicket } from './ticket';
import { match } from '@/components/utils/string-match/index';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import { priceListDict } from '../common/estimate';
import { useSiteRestriction } from './restriction';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

export default defineComponent({
  name: 'UrlManagementDetailApply',
  components: {
    EstimateCard,
    BasicCard,
    UrlSettingEditCard,
    BeforeSearchEmpty,
    UrlSettingCallbackCard,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });

    // TODO:權限

    // 域名form與規則
    const siteForm = ref({
      site: '',
      rules: {
        site: {
          required: true,
          message: t('please_select_site'),
          trigger: 'change',
        },
      },
    });
    // 實際上使用的site
    const site = ref('');
    provide('UrlManagement:applySite', site);

    // 按鈕是否disable
    const disabledBtn = ref(false);

    // 域名設定的ref
    const siteFormRef = ref();
    // 是否套用站別
    const isApplySite = ref(false);
    // 按下套用站別才更新實際使用的site
    const apply = () => {
      disabledBtn.value = true;
      siteFormRef.value.validate((valid: boolean) => {
        if (valid) {
          site.value = siteForm.value.site;
          isApplySite.value = true;
          nextTick(() => {
            getRestriction().then(() => {
              disabledBtn.value = false;
            });
          });
        }
      });
    };

    // 自定義快搜
    const customSearch = {
      filter: (
        searchedValue: string,
        options: { label: string; option: { code: string } },
      ) => {
        const escapeRegexpString = (value = '') =>
          value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        const re = new RegExp(escapeRegexpString(searchedValue), 'i');

        // 過濾功能 (可過濾 label 及 code)
        return (
          re.test(options.label) ||
          match(options.label, searchedValue) ||
          re.test(options.option.code)
        );
      },
    };

    // 處理loading遮罩
    const loading = ref(false);
    loading.value = true;
    // 站別相關
    const { getSiteList, siteOptions, getSiteInfo } = useSiteList();
    // 取的站別列表
    getSiteList().then(() => {
      loading.value = false;
    });

    // 基本設定(預設值)
    const basicDataDefaultValue: Ref<BasicSetting> = ref({
      buy: 'bbin',
      management: 'bbin',
      domainType: 'normal',
      highRisk: 'over',
      checkItem: '',
      websiteProviderPerm: false,
      websiteProvider: '',
      username: '',
      password: '',
      applyTime: '',
      finishTime: '',
    } as const);
    // 先clone下來，拿來當有沒有異動的比對基準
    const copyBasicData = cloneDeep(basicDataDefaultValue.value);
    provide('UrlManagement:basicData', basicDataDefaultValue);

    // 域名設定(預設值)
    const urlListDefaultValue: Ref<ApplyDomain[]> = ref([]);
    provide('UrlManagement:urlList', urlListDefaultValue);

    // 編輯狀態的域名設定ref
    const urlSettingEditRef = ref();
    // 載入域名限制與格式檢查
    const reLoadRestrictionAndValidUrl = () => {
      disabledBtn.value = true;
      // 蓋上域名列表的遮罩
      urlSettingEditRef.value.showLoading();

      urlSettingEditRef.value.checkAllDataFormatAndValid(false);
      getRestriction().then(() => {
        disabledBtn.value = false;
        urlSettingEditRef.value.showLoading(false);
      });
    };

    // 申請筆數與還可申請的數量
    const {
      requestionNum,
      restrictionNumByBuy,
      getTicketsRestriction,
      getSingleRequestionNum,
    } = useSiteRestriction();

    // 載入申請筆數與還可申請的數量
    const getRestriction = () => {
      loading.value = true;
      return Promise.all([
        getSingleRequestionNum(
          site.value,
          basicDataDefaultValue.value.buy === 'bbin' ? 1 : 0,
        ),
        getTicketsRestriction(),
      ]).then(() => {
        loading.value = false;
      });
    };
    // 今日還可申請的總筆數
    const todayCanApplyNum = computed(
      () =>
        restrictionNumByBuy[basicDataDefaultValue.value.buy] -
        requestionNum.value,
    );

    // 工單相關
    const { ticketId, callbackUrlList, postCompanyTicket, postCustomerTicket } =
      useTicket();

    // 整理「廳主買」時需帶的參數
    const arrangeCustomerTicketOption = (
      basicData: BasicSetting,
      managementIsBBin: boolean,
    ) => {
      let option = {};
      // 當bbin管且有網址商權限時，帶網址商相關細項，其餘的帶檢查項目
      if (managementIsBBin && basicDataDefaultValue.value.websiteProviderPerm) {
        option = {
          domain_provider: basicData.websiteProvider,
          provider_account: basicData.username,
          provider_password: basicData.password,
        };
      } else {
        let checkItem = '';
        // 轉換要帶到後端的值
        switch (basicData.checkItem) {
          case 'txt':
            checkItem = 'TXT';
            break;
          case 'nameserver':
            checkItem = 'name server';
            break;
        }
        option = {
          verify_mode: checkItem,
        };
      }

      return option;
    };

    // 基本設定的ref
    const basicRef = ref();
    // 送出前的確認dialog
    const submitCheckDialogVisible = ref(false);
    // 送出前的驗證
    const validBeforeSubmit = () => {
      Promise.all([
        // 驗證基本設定
        basicRef.value.validatorbasicForm(),
        // 驗證網址設定
        urlSettingEditRef.value.validatorurlListForm(),
      ]).then(results => {
        // 當全部驗證成功時出現確定的dialog
        if (results.every(result => result)) {
          submitCheckDialogVisible.value = true;
        }
      });
    };

    // 送出申請前
    const beforePostTicket = ref(true);
    // 送單
    const submit = () => {
      // 隱藏dialog
      submitCheckDialogVisible.value = false;
      // 升loading
      loading.value = true;
      // 基本資料
      const basicData = basicDataDefaultValue.value;
      // 域名(僅取有填入的)
      const urlList = urlListDefaultValue.value
        .filter(obj => obj.domain)
        .map(obj => obj.domain);
      // 是否為高風險域名綁定
      const isForceBinding = basicData.highRisk === 'binding';

      // 依照購買方式call不同api
      if (basicDataDefaultValue.value.buy === 'bbin') {
        // 當今天是公司買
        postCompanyTicket(
          site.value,
          basicData.domainType,
          isForceBinding,
          urlList,
        ).then(result => {
          if (result) {
            submitCallback();
          }
        });
      } else {
        // 判定購買方式是否為bbin
        const managementIsBBin = basicData.management === 'bbin';
        // 選填資料
        const option = arrangeCustomerTicketOption(basicData, managementIsBBin);

        // 當今天是廳主買
        postCustomerTicket(
          site.value,
          managementIsBBin,
          basicData.domainType,
          isForceBinding,
          basicData.websiteProviderPerm,
          urlList,
          option,
        ).then(result => {
          if (result) {
            submitCallback();
          }
        });
      }
    };

    const siteInfo = ref({
      label: '',
      value: '',
      code: '',
      domain: 0,
    }) as Ref<SiteOption>;

    // 送出後要執行的動作
    const submitCallback = () => {
      // 將狀態改為已送出
      beforePostTicket.value = false;

      // 準備現行的站別資訊供顯示用
      const info = getSiteInfo(site.value);
      if (info) {
        siteInfo.value = info;
      }

      // 降loading
      loading.value = false;
    };

    // 離開前的確認dialog
    const leaveCheckDialogVisible = ref(false);
    // 正常域名的筆數(送出前取得正在編輯的列表來計算，送出後取得回傳的列表結果計算)
    const urlCount = computed(() =>
      beforePostTicket.value
        ? urlListDefaultValue.value.filter(obj => obj.legal).length
        : callbackUrlList.value.filter(obj => obj.result).length,
    );

    // 最終結果的狀態
    const resultStatus = computed(() => {
      // 申請數量
      const applyNum = callbackUrlList.value.length;
      // 成功數量
      const successNum = urlCount.value;
      // 失敗數量
      const errorNum = applyNum - successNum;

      if (!successNum) {
        // 全失敗
        return {
          type: 'error',
          msg: [
            t('add_domain_error_msg1'),
            t('add_domain_error_msg2', {
              apply: applyNum,
              error: errorNum,
            }),
          ],
        };
      } else if (successNum !== applyNum) {
        // 部分成功
        return {
          type: 'warning',
          msg: [
            t('add_domain_success_msg1', { id: ticketId.value }),
            t('add_domain_success_msg2', {
              apply: applyNum,
              success: successNum,
              error: errorNum,
            }),
          ],
        };
      }
      // 全成功
      return {
        type: 'success',
        msg: [
          t('add_domain_warning_msg1', { id: ticketId.value }),
          t('add_domain_warning_msg2', {
            apply: applyNum,
            success: successNum,
          }),
        ],
      };
    });

    // 顯示離開前的確定
    const leaveCheck = () => {
      // 有輸入域名的數量
      const haveUrlLength = urlListDefaultValue.value.filter(
        obj => obj.domain,
      ).length;

      // 是否有異動基本資料
      const changeBasicData = !isEqual(
        copyBasicData,
        cloneDeep(basicDataDefaultValue.value),
      );

      // 當今天有異動域名與基本資料時
      if (haveUrlLength || changeBasicData) {
        // 顯示確認的Dialog
        leaveCheckDialogVisible.value = true;
      } else {
        // TODO:待補連結
        // 沒有異動的話直接離開
        window.open();
      }
    };

    return {
      t,
      basicRef,
      reLoadRestrictionAndValidUrl,
      beforePostTicket,
      urlCount,
      siteForm,
      siteFormRef,
      urlSettingEditRef,
      customSearch,
      siteOptions,
      apply,
      isApplySite,
      submit,
      loading,
      disabledBtn,
      resultStatus,
      validBeforeSubmit,
      submitCheckDialogVisible,
      basicDataDefaultValue,
      priceListDict,
      requestionNum,
      restrictionNumByBuy,
      todayCanApplyNum,
      urlListDefaultValue,
      leaveCheckDialogVisible,
      leaveCheck,
      siteInfo,
    };
  },
});
</script>

<style lang="scss" scoped>
.site-form {
  @include flex-basic;
}
.rd-layout-content {
  @include space-vertical;

  .button-group {
    @include flex-basic(flex-end);
  }
}
.is-error {
  color: $danger;
}
.is-bold {
  font-weight: bold;
}
</style>
