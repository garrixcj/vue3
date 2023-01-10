<i18n src="@/languages/system_setting/url_management/apply.json"></i18n>
<template lang="pug">
//- 右方警示訊息
rd-information(v-show="isApplySite")
  ul
    li {{ t('apply_domain_information1') }}
    li {{ t('apply_domain_information2', { num: restrictionNum.bbin, money: 200 }) }}
    li {{ t('apply_domain_information3', { num: restrictionNum.domain }) }}
rd-navbar-layout(ref="layoutRef" no-pre-page :title="t('apply_url')")
  template(#afterTitle)
    //- 站別form
    .after-title
      span
        span.required-mark *
        span {{ ` ${t('site')}` }}
      rd-select(
        v-model:value="siteForm"
        size="small"
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
      rd-button(
        type="default"
        size="small"
        :disabled="!siteForm"
        @click="apply"
      ) {{ t('apply') }}
  template(#titleSuffix)
    //- 有套用域名才會出現
    template(v-if="isApplySite")
      //- 取消
      rd-button(type="secondary" :disabled="disabledBtn" @click="leaveConfirm") {{ t('cancel') }}
      //- 送出
      rd-button(type="gradient" :disabled="disabledBtn" @click="initSubmit") {{ t('validation_and_submit') }}
  template(#body)
    rd-layout-content
      //- 套用域名前 - 開始搜尋吧
      template(v-if="!isApplySite")
        before-search-empty(:label="t('start_search')")
      //- 套用域名後
      template(v-else)
        //- 基本設定
        basic-card(
          ref="basicFormRef"
          mode="apply"
          has-modify
          @changeBuy="updateRestrictionAndUrl"
        )
        //- 域名設定
        url-setting-edit-card(
          ref="urlFormRef"
          v-loading="urlLoading"
          :restriction-num="restrictionNum[basicData.buy]"
          :requestion-num="requestionNum"
          :can-apply-num="canApplyNum(basicData.buy)"
        )
        //- 預估費用
        estimate-card(:count="legalCount")
        .button-group
          //- 取消
          rd-button(
            type="secondary"
            :disabled="disabledBtn"
            @click="leaveConfirm"
          ) {{ t('cancel') }}
          //- 送出
          rd-button(
            type="gradient"
            :disabled="disabledBtn"
            @click="initSubmit"
          ) {{ t('validation_and_submit') }}
//- 送出前確定的dialog
rd-dialog(
  v-model="visible.submit"
  :close-on-click-modal="false"
  :title="t('validation_and_submit')"
  width="430px"
)
  i18n-t(keypath="validate_and_apply_num_info1" tag="div")
    template(#buy)
      span {{ t(priceListDict[basicData.buy]) }}
    template(#total)
      span.total-text {{ restrictionNum[basicData.buy] }}
  i18n-t(keypath="validate_and_apply_num_info2" tag="div")
    template(#rest)
      span.rest-text {{ canApplyNum(basicData.buy) }}
    template(#sub)
      span.sub-text {{ legalCount }}
  template(#footer)
    rd-button(type="secondary" @click="visible.submit = false") {{ t('cancel') }}
    rd-button(type="primary" @click="submit") {{ t('confirm') }}
//- 尚未儲存的 Dialog
rd-dialog(
  v-model="visible.leave"
  :close-on-click-modal="false"
  :title="t('not_saved')"
  width="300px"
)
  span {{ t('not_saved_check_info') }}
  template(#footer)
    rd-button(type="secondary" @click="visible.leave = false") {{ t('cancel') }}
    rd-button(type="primary" @click="back") {{ t('leave') }}
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  type Ref,
  computed,
  inject,
  reactive,
  type PropType,
  h,
} from 'vue';
import { useI18n } from 'vue-i18n';
import EstimateCard from './estimate-card.vue';
import BasicCard from './basic-card.vue';
import UrlSettingEditCard from './url-setting.vue';
import type { BasicSetting, ApplyDomain, CallbackUrlList } from './apply';
import type { SiteOption } from '../common/list';
import { useTicket } from './ticket';
import { match } from '@/components/utils/string-match/index';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import { priceListDict } from '../common/estimate';
import { useSiteRestriction } from '../single-number-progress/restriction';
import { notify } from '@/components/utils/notification';

export default defineComponent({
  name: 'UrlManagementDetailApply',
  components: {
    EstimateCard,
    BasicCard,
    UrlSettingEditCard,
    BeforeSearchEmpty,
  },
  props: {
    // 站別
    siteOptions: { type: Array as PropType<SiteOption[]>, required: true },
    // 基本資料是否異動
    basicDataChange: { type: Boolean, required: true },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'local' });
    // 域名form
    const siteForm = ref('');
    // 實際上使用的site
    const site = inject('UrlManagement:applySite') as Ref<string>;
    // 按鈕是否disable
    const disabledBtn = ref(true);
    // layout的ref
    const layoutRef = ref();
    // 基本設定的ref
    const basicFormRef = ref();
    // 編輯狀態的域名設定ref
    const urlFormRef = ref();
    // 域名設定卡片的loading
    const urlLoading = ref(false);
    // 處理loading遮罩
    const loading = inject('UrlManagement:applyLoading') as Ref<boolean>;
    const visible = reactive({
      // 離開前的確認dialog
      leave: false,
      // 送出前的確認dialog
      submit: false,
    });
    // 是否套用站別
    const isApplySite = ref(false);

    // 基本資料
    const basicData = inject('UrlManagement:basicData') as BasicSetting;
    // 網址
    const urlList = inject('UrlManagement:urlList') as Ref<ApplyDomain[]>;

    // 是否送出前
    const beforePost = inject('UrlManagement:beforePost') as Ref<boolean>;

    // 送出後得到的結果
    const result = inject('UrlManagement:applyResult') as {
      id: number;
      list: CallbackUrlList[];
    };

    // 申請筆數與還可申請的數量
    const {
      requestionNum,
      restrictionNum,
      canApplyNum,
      getRestriction,
      getRequestionNum,
    } = useSiteRestriction();

    // 更新申請筆數與還可申請的數量
    const updateRestriction = (showLoading = true) => {
      if (showLoading) {
        loading.value = true;
      }
      return Promise.all([
        getRequestionNum(site.value, basicData.buy === 'bbin' ? 1 : 0),
        getRestriction(),
      ]).then(() => {
        loading.value = false;
      });
    };

    // 按下套用站別才更新實際使用的site
    const apply = () => {
      if (siteForm.value) {
        disabledBtn.value = true;
        site.value = siteForm.value;
        isApplySite.value = true;
        updateRestriction().then(() => {
          disabledBtn.value = false;
        });
      }
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

    // 域名(僅取有填入的)
    const notEmptyUrl = computed(() => urlList.value.filter(obj => obj.domain));

    // 更新域名限制與格式檢查
    const updateRestrictionAndUrl = () => {
      // 將送出按鈕都disable
      disabledBtn.value = true;
      // 蓋上域名列表的loading
      urlLoading.value = true;
      // 格式驗證
      urlFormRef.value.validAllFormat();

      // 重新載入申請筆數與還可申請的數量(不顯示全版loading)
      updateRestriction(false).then(() => {
        urlLoading.value = false;
        disabledBtn.value = false;
      });
    };

    // 送出前
    const initSubmit = () => {
      Promise.all([
        // 驗證基本設定
        basicFormRef.value.validForm(),
        // 驗證網址設定
        urlFormRef.value.validForm(),
      ]).then(results => {
        // 當全部驗證成功時出現確定的dialog
        if (results.every(obj => obj.result)) {
          visible.submit = true;
        } else {
          notify.error({
            title: t('error'),
            message: h('div', {}, [
              h('div', t('please_fix_error')),
              ...results
                .filter((obj: { result: boolean; msg: string }) => obj.msg)
                .map(obj => h('div', obj.msg)),
            ]),
          });
        }
      });
    };

    // 工單相關
    const {
      ticketId,
      callbackUrlList,
      arrangeCustomerOption,
      postCompanyTicket,
      postCustomerTicket,
    } = useTicket();

    // 送出後要執行的動作
    const submitCallback = () => {
      // 塞入回傳資訊
      result.id = ticketId.value;
      result.list = callbackUrlList.value;

      // 改成已送出
      beforePost.value = false;

      // 將畫面回歸最上方
      layoutRef.value.scrollTo();

      // 降loading
      loading.value = false;
    };

    // 送單
    const submit = () => {
      // 隱藏dialog
      visible.submit = false;
      // 升loading
      loading.value = true;

      // 是否為高風險域名綁定
      const isHighRisk = basicData.highRisk === 'binding';
      const list = notEmptyUrl.value.map(obj => obj.domain);

      // 依照購買方式call不同api
      if (basicData.buy === 'bbin') {
        // 當今天是公司買
        postCompanyTicket(
          site.value,
          basicData.domainType,
          isHighRisk,
          list,
        ).then(result => {
          if (result) {
            submitCallback();
          } else {
            loading.value = false;
          }
        });
      } else {
        // 判定管理方式是否為bbin
        const managementIsBBin = basicData.management === 'bbin';
        // 選填資料
        const option = arrangeCustomerOption(basicData, managementIsBBin);

        // 當今天是廳主買
        postCustomerTicket(
          site.value,
          managementIsBBin,
          basicData.domainType,
          isHighRisk,
          basicData.websiteProviderPerm,
          list,
          option,
        ).then(result => {
          if (result) {
            submitCallback();
          } else {
            loading.value = false;
          }
        });
      }
    };

    // 正常域名的筆數
    const legalCount = computed(
      () => urlList.value.filter(obj => obj.legal).length,
    );

    // 顯示離開前的確定
    const leaveConfirm = () => {
      // 當今天有異動域名與基本資料時
      if (notEmptyUrl.value.length || props.basicDataChange) {
        // 顯示確認的Dialog
        visible.leave = true;
      } else {
        // 沒有異動的話直接離開
        back();
      }
    };

    // 返回列表
    const back = () => {
      window.location.href = '/system_setting/url_management/index';
    };

    return {
      t,
      basicFormRef,
      siteForm,
      updateRestrictionAndUrl,
      legalCount,
      urlFormRef,
      customSearch,
      apply,
      isApplySite,
      submit,
      loading,
      disabledBtn,
      initSubmit,
      basicData,
      priceListDict,
      requestionNum,
      restrictionNum,
      canApplyNum,
      urlList,
      leaveConfirm,
      visible,
      back,
      urlLoading,
      layoutRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.after-title {
  @include flex-basic;
  @include space(10px);
  .required-mark {
    color: $danger;
  }
}
.rd-layout-content {
  @include space-vertical;

  .button-group {
    @include flex-basic(flex-end);
  }
}
.total-text {
  font-weight: bold;
}
.rest-text {
  font-weight: bold;
}
.sub-text {
  font-weight: bold;
  color: $danger;
}
</style>
