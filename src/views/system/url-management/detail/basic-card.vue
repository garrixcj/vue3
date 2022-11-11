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
            rd-radio(v-for="(key, index) in buy" :key="index" :label="key") {{ $t(priceListDict[key]) }}
      //- 管理權限
      rd-form-item(:label="t('management_permission')" prop="management")
        view-mode(component="RadioGroup" :has-modify="hasModify")
          rd-radio-group(v-model="form.management" @change="changeManagement")
            rd-radio(
              v-for="(key, index) in management"
              :key="index"
              :label="key"
            ) {{ $t(priceListDict[key]) }}
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
        v-if="showWebsiteProvider"
        :label="t('domain_provider_perm')"
        prop="websiteProviderPerm"
      )
        view-mode(component="RadioGroup" :has-modify="hasModify")
          rd-radio-group(
            v-model="form.websiteProviderPerm"
            @change="changeWebsiteProviderPerm"
          )
            rd-radio(:label="false") {{ t('none') }}
            rd-radio(:label="true") {{ t('have') }}
      //- 網址商
      rd-form-item(
        v-if="showWebsiteProviderDetail"
        :label="t('domain_provider')"
        prop="websiteProvider"
      )
        view-mode(:label="form.websiteProvider" :has-modify="hasModify")
          rd-input(
            v-model="form.websiteProvider"
            :placeholder="t('domain_provider_placeholder')"
            clearable
          )
      //- 帳號
      rd-form-item(
        v-if="showWebsiteProviderDetail"
        :label="t('username')"
        prop="username"
      )
        view-mode(:label="form.username" :has-modify="hasModify")
          rd-input(
            v-model="form.username"
            :placeholder="t('please_enter_account')"
            clearable
          )
      //- 密碼
      rd-form-item(
        v-if="showWebsiteProviderDetail"
        :label="t('password')"
        prop="password"
      )
        view-mode(:has-modify="hasModify")
          rd-input(
            v-model="form.password"
            type="password"
            :placeholder="t('please_enter_password')"
            show-password
            clearable
          )
          template(#view)
            password-eye(
              :on="passwordOn"
              :password="form.password"
              @click="passwordOn = !passwordOn"
            )
      //- 檢查項目
      rd-form-item(
        v-if="checkItem.length"
        :label="t('check_item')"
        prop="checkItem"
      )
        view-mode(:has-modify="hasModify")
          rd-radio-group(v-model="form.checkItem")
            rd-radio(
              v-for="(value, index) in checkItem"
              :key="index"
              :label="value"
            ) {{ t(dictKey[value]) }}
      //- 申請日期
      rd-form-item(v-if="!hasModify" :label="t('application_date')")
        template(v-if="form.applyTime")
          rd-format-timer(:date-time="form.applyTime")
        template(v-else) --
      //- 完成日期
      rd-form-item(v-if="!hasModify" :label="t('finish_date')")
        template(v-if="form.finishTime")
          rd-format-timer(:date-time="form.finishTime")
        template(v-else) --
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  inject,
  reactive,
  type Ref,
  ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import type { BasicSetting } from './detail';
import { priceListDict } from '../common/estimate';
import PasswordEye from './password-eye.vue';
import ViewMode from '@/components/custom/view-mode/index.vue';
import RdFormatTimer from '@/components/custom/format-timer/date-time.vue';

export default defineComponent({
  name: 'UrlManagementBasicCard',
  components: { ViewMode, RdFormatTimer, PasswordEye },
  props: {
    hasModify: { type: Boolean, default: false },
  },
  setup(props, { expose }) {
    const { t } = useI18n({ useScope: 'local' });
    // 字典對照
    const dictKey = {
      normal: 'normal_type',
      simple: 'simple_type',
      over: 'over_binding',
      binding: 'mandatory_binding',
      nameserver: 'Nameserser',
      txt: 'TXT',
    };

    const form = inject('UrlManagement:basicData') as Ref<BasicSetting>;

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
    const management = computed(() => managementOption[form.value.buy]);

    // 域名類型
    const domainType: BasicSetting['domainType'][] = ['normal', 'simple'];

    // 高風險域名綁定
    const highRisk: BasicSetting['highRisk'][] = ['over', 'binding'];

    // 是否顯示管理商權限
    const showWebsiteProvider = computed(
      () => form.value.buy === 'domain' && form.value.management === 'bbin',
    );

    // 是否顯示有關於管理商權限的細向
    const showWebsiteProviderDetail = computed(
      () => showWebsiteProvider.value && form.value.websiteProviderPerm,
    );

    // 檢查項目(依照購買方式與管理權限決定其選項)
    const checkItem = computed(() => {
      const checkItemOption = {
        domain: {
          bbin: form.value.websiteProviderPerm
            ? []
            : (['txt', 'nameserver'] as const),
          domain: ['txt'] as const,
        },
      };

      const formBuy = form.value.buy as keyof typeof checkItemOption;

      return checkItemOption[formBuy]
        ? checkItemOption[formBuy][form.value.management]
        : [];
    });

    // 異動購買方式時
    const changeBuy = () => {
      // 將管理權限選項回歸預設第一個
      form.value.management = management.value[0];
      // 連帶觸發異動管理權限
      changeManagement();
    };

    // 異動管理權限時
    const changeManagement = () => {
      // 將網址商預設改回無
      form.value.websiteProviderPerm = false;
      // 連帶觸發網址商權限
      changeWebsiteProviderPerm();
    };

    // 異動網址商權限時
    const changeWebsiteProviderPerm = () => {
      // 不論異動成什麼都將網址商與帳號密碼清空
      form.value.websiteProvider = '';
      form.value.username = '';
      form.value.password = '';
      // 將檢查項目回歸預設第一個
      form.value.checkItem = checkItem.value[0] ? checkItem.value[0] : '';
    };

    // 驗證
    const rules = reactive({
      websiteProvider: [
        {
          // 當網址商權限為有時，為必填
          required: form.value.websiteProviderPerm,
          message: t('format_error'),
        },
      ],
      username: [
        {
          // 當網址商權限為有時，為必填
          required: form.value.websiteProviderPerm,
          // 有漢字時錯誤
          pattern: new RegExp(/^[^\u4E00-\u9FFF]+$/),
          message: t('format_error'),
          trigger: 'change',
        },
      ],
      password: [
        {
          // 當網址商權限為有時，為必填
          required: form.value.websiteProviderPerm,
          // 有漢字時錯誤
          pattern: new RegExp(/^[^\u4E00-\u9FFF]+$/),
          message: t('format_error'),
          trigger: 'change',
        },
      ],
    });

    // 封裝驗證，供外部使用
    const basicFormRef = ref();
    const validatorbasicForm = () => {
      basicFormRef.value.validate();
    };
    expose({ validatorbasicForm });

    // 密碼的影藏顯示
    const passwordOn = ref(false);

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
      showWebsiteProvider,
      showWebsiteProviderDetail,
      rules,
      basicFormRef,
      changeBuy,
      changeManagement,
      changeWebsiteProviderPerm,
      passwordOn,
    };
  },
});
</script>
