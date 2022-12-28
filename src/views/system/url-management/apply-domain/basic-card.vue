<template lang="pug">
rd-card(:title="t('basic_setting')")
  template(#content)
    rd-form(
      ref="basicFormRef"
      label-width="130px"
      :model="form"
      :rules="rules"
      :hide-required-asterisk="!hasModify"
    )
      //-  購買方式
      rd-form-item(:label="t('ways_to_purchase')" prop="buy")
        view-mode(component="RadioGroup" :has-modify="hasModify")
          rd-radio-group(v-model="form.buy" @change="changeBuy")
            rd-radio(v-for="(key, index) in buy" :key="index" :label="key") {{ t(priceListDict[key]) }}
      //- 管理權限
      rd-form-item(:label="t('management_permission')" prop="management")
        view-mode(component="RadioGroup" :has-modify="hasModify")
          rd-radio-group(v-model="form.management" @change="changeManagement")
            rd-radio(
              v-for="(key, index) in management"
              :key="index"
              :label="key"
            ) {{ t(priceListDict[key]) }}
      //- 域名類型
      rd-form-item(:label="t('domain_type')" prop="domainType")
        view-mode(component="RadioGroup" :has-modify="hasModify")
          rd-radio-group(v-model="form.domainType")
            rd-radio(
              v-for="(value, index) in domainType"
              :key="index"
              :label="value"
            ) {{ t(dictKey[value]) }}

      //- 高風險域名
      rd-form-item(prop="highRisk")
        template(#label)
          span {{ t('high_risk_domain') }}
          rd-tooltip(placement="top")
            template(#content)
              div {{ t('high_risk_msg1') }}
              div {{ t('high_risk_msg2') }}
              div {{ t('high_risk_msg3') }}
              div {{ t('high_risk_msg4') }}
            i.mdi.mdi-information
        view-mode(component="RadioGroup" :has-modify="hasModify")
          rd-radio-group(v-model="form.highRisk")
            rd-radio(
              v-for="(value, index) in highRisk"
              :key="index"
              :label="value"
            ) {{ t(dictKey[value]) }}
      //- 網址商權限
      rd-form-item(
        v-if="showWebsite"
        :label="t('domain_provider_perm')"
        prop="websiteProviderPerm"
      )
        view-mode(component="RadioGroup" :has-modify="hasModify")
          rd-radio-group(
            v-model="form.websiteProviderPerm"
            @change="changeWebsitePerm"
          )
            rd-radio(:label="false") {{ t('none') }}
            rd-radio(:label="true") {{ t('have') }}
      //- 網址商
      rd-form-item(
        v-if="showWebsiteDetail"
        :label="t('domain_provider')"
        prop="websiteProvider"
      )
        view-mode(:label="form.websiteProvider" :has-modify="hasModify")
          rd-input.input-width(
            v-model="form.websiteProvider"
            :placeholder="t('domain_provider_placeholder')"
            clearable
          )
      //- 帳號
      rd-form-item(
        v-if="showWebsiteDetail"
        :label="t('username')"
        prop="username"
      )
        view-mode(:label="form.username" :has-modify="hasModify")
          rd-input.input-width(
            v-model="form.username"
            :placeholder="t('please_enter_account')"
            clearable
          )
      //- 密碼
      rd-form-item(
        v-if="showWebsiteDetail"
        :label="t('password')"
        prop="password"
      )
        view-mode(:has-modify="hasModify")
          rd-input.input-width(
            v-model="form.password"
            type="password"
            :placeholder="t('please_enter_password')"
            show-password
            clearable
          )
          template(#view)
            password-text(
              :visible="passwordVisible"
              :password="form.password"
              @click="passwordVisible = !passwordVisible"
            )
      //- 檢查項目
      rd-form-item(
        v-if="checkItem.length"
        :label="t('check_item')"
        prop="checkItem"
      )
        view-mode(component="RadioGroup" :has-modify="hasModify")
          rd-radio-group(v-model="form.checkItem")
            rd-radio(
              v-for="(value, index) in checkItem"
              :key="index"
              :label="value"
            ) {{ t(dictKey[value]) }}
        //- 教學連結
        rd-button.teach-link(
          v-if="hasModify"
          size="icon"
          text
          @click="openTeaching"
        )
          i.mdi.mdi-open-in-new
          span {{ form.checkItem === 'txt' ? t('txt_teaching') : t('name_server_teaching') }}
      //- 細項模式時才出現
      template(v-if="mode === 'detail' && !hasModify")
        //- 申請日期
        rd-form-item(:label="t('application_date')")
          rd-format-timer(date-default="--" :date-time="form.applyTime")
        //- 完成日期
        rd-form-item(:label="t('finish_date')")
          rd-format-timer(date-default="--" :date-time="form.finishTime")
</template>

<script lang="ts">
import { defineComponent, computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { BasicSetting } from './apply';
import { priceListDict } from '../common/estimate';
import PasswordText from '@/components/custom/format-password/visible-text.vue';
import ViewMode from '@/components/custom/view-mode/index.vue';
import RdFormatTimer from '@/components/custom/format-timer/date-time.vue';

// expose出去的func type
export type BasicDataExpose = {
  validForm: () => { result: boolean; msg: string };
};

export default defineComponent({
  name: 'UrlManagementBasicCard',
  components: { ViewMode, RdFormatTimer, PasswordText },
  props: {
    // 模式(申請模式apply、細項模式detail) - 因模式不同會出現些微的欄位的不同
    mode: {
      type: String,
      default: 'detail',
    },
    // 是否可異動
    hasModify: { type: Boolean, default: false },
  },
  emits: ['changeBuy'],
  setup(props, { expose, emit }) {
    const { t } = useI18n({ useScope: 'parent' });
    // 字典對照
    const dictKey = {
      normal: 'normal_type',
      simple: 'simple_type',
      over: 'over_binding',
      binding: 'mandatory_binding',
      nameserver: 'Nameserser',
      txt: 'TXT',
    };

    const form = inject('UrlManagement:basicData') as BasicSetting;
    // 購買方式
    const buy: BasicSetting['buy'][] = ['bbin', 'domain'];

    // 管理權限(依照購買方式決定其選項)
    const managementOption: Record<
      BasicSetting['buy'],
      BasicSetting['management'][]
    > = {
      bbin: ['bbin'],
      domain: ['bbin', 'domain'],
    };
    const management = computed(() => managementOption[form.buy]);

    // 域名類型
    const domainType: BasicSetting['domainType'][] = ['normal', 'simple'];

    // 高風險域名綁定
    const highRisk: BasicSetting['highRisk'][] = ['over', 'binding'];

    // 是否顯示管理商權限
    const showWebsite = computed(
      () => form.buy === 'domain' && form.management === 'bbin',
    );

    // 是否顯示有關於管理商權限的細向
    const showWebsiteDetail = computed(
      () => showWebsite.value && form.websiteProviderPerm,
    );

    // 檢查項目(依照購買方式與管理權限決定其選項)
    const checkItem = computed(() => {
      const checkItemOption = {
        domain: {
          bbin: form.websiteProviderPerm
            ? []
            : (['txt', 'nameserver'] as const),
          domain: ['txt'] as const,
        },
      };

      const formBuy = form.buy as keyof typeof checkItemOption;

      return checkItemOption[formBuy]
        ? checkItemOption[formBuy][form.management]
        : [];
    });

    // 異動網址商權限時
    const changeWebsitePerm = () => {
      // 不論異動成什麼都將網址商與帳號密碼清空
      form.websiteProvider = '';
      form.username = '';
      form.password = '';
      // 將檢查項目回歸預設第一個
      form.checkItem = checkItem.value[0] ? checkItem.value[0] : '';
    };

    // 異動管理權限時
    const changeManagement = () => {
      // 將網址商預設改回無
      form.websiteProviderPerm = false;
      // 連帶觸發網址商權限
      changeWebsitePerm();
    };

    // 異動購買方式時
    const changeBuy = () => {
      // 將管理權限選項回歸預設第一個
      form.management = management.value[0];
      // 連帶觸發異動管理權限
      changeManagement();
      // 觸發上層驗證網址
      emit('changeBuy');
    };

    // 驗證
    const rules = {
      websiteProvider: [
        {
          // 當網址商權限為有時，為必填
          required: true,
          message: t('domain_provider_placeholder'),
          trigger: 'blur',
        },
      ],
      username: [
        {
          // 當網址商權限為有時，為必填
          required: true,
          // 有漢字時錯誤
          pattern: new RegExp(/^[^\u4E00-\u9FFF]+$/),
          message: t('please_enter_account'),
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: t('please_enter_password'),
          trigger: 'blur',
        },
        {
          // 有漢字時錯誤
          pattern: new RegExp(/^[^\u4E00-\u9FFF]+$/),
          message: t('format_error'),
          trigger: 'blur',
        },
      ],
    };

    // 封裝驗證，供外部使用
    const basicFormRef = ref();
    const validForm = () => {
      return basicFormRef.value
        .validate((valid: boolean) => valid)
        .then((valid: boolean) => ({
          result: valid,
          msg: valid ? '' : t('domain_provider_perm_error'),
        }));
    };
    expose({ validForm } as BasicDataExpose);

    // 密碼的影藏顯示
    const passwordVisible = ref(false);

    // 檢查項目對應教學連結
    const teachMap = {
      txt: 'txt',
      nameserver: 'name-server',
    };

    // 另開教學視窗
    const openTeaching = () => {
      if (form.checkItem !== '') {
        window.open(
          `/v3/system/url-management/teaching/${teachMap[form.checkItem]}`,
        );
      }
    };

    return {
      t,
      form,
      priceListDict,
      dictKey,
      buy,
      management,
      domainType,
      highRisk,
      checkItem,
      showWebsite,
      showWebsiteDetail,
      rules,
      basicFormRef,
      changeBuy,
      changeManagement,
      changeWebsitePerm,
      passwordVisible,
      openTeaching,
    };
  },
});
</script>

<style lang="scss" scoped>
.teach-link {
  @include btn-underline;
  margin-left: 30px;
}
.input-width {
  width: 200px;
}
</style>
