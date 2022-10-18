<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<i18n src="@/languages/system_setting/url_management/index.json"></i18n>
<template lang="pug">
rd-layout.url-management(
  v-model:active-tab="activeTab"
  tab-type="link"
  :menu="currentTabs"
)
  template(#title)
    h2 {{ t('url_management') }}
  template(#afterTitle)
    //- 站別資訊
    rd-button(
      type="default"
      size="small"
      @click="siteInfoVisible = !siteInfoVisible"
    ) {{ t('site_info') }}
    site-information

    //- 設定範例
    rd-button(
      type="default"
      size="small"
      @click="settingExampleVisible = !settingExampleVisible"
    ) {{ t('setting_example') }}
    setting-example(v-if="settingExampleVisible")

    //- 操作教學(todo: 代刻元件)
    //- teach(url-key='domain_management')
  //- 客端域名
  template(#customerDomain)
    customer-domain
  //- 管端域名
  template(#agentDomain)
    agent-domain
  //- IP服務
  template(#ipService)
    ip-service
  //- 單號進度
  template(#singleNumberProgress)
    single-number-progress
  //- SSL憑證
  template(#applySSL)
    rd-alert.custom-color(:title="t('new_window_prompt')" :closable="false")
  //- 活躍域名
  template(#activeDomain)
    active-domain
  //- 操作紀錄
  template(#record)
    record
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTabAccess } from '@/plugins/access/view';
import host from '@/plugins/url';
import { useLoadingStore } from '@/stores/loading';
import CustomerDomain from './customer-domain/index.vue';
import AgentDomain from './agent-domain/index.vue';
import IpService from './ip-service/index.vue';
import SingleNumberProgress from './single-number-progress/index.vue';
import ActiveDomain from './active-domain.vue';
import Record from './record.vue';
import SiteInformation from './site-information.vue';
import SettingExample from './setting-example.vue';

export default defineComponent({
  name: 'UrlManagement', // 網址管理
  components: {
    CustomerDomain, // 客端域名
    AgentDomain, // 管端域名
    IpService, // IP服務
    SingleNumberProgress, //單號進度
    ActiveDomain, // 活躍域名
    Record, // 操作紀錄
    SiteInformation, // 站別資訊
    SettingExample, // 設定範例
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const activeTab = ref('customerDomain');
    const tabs = [
      // 客端域名
      {
        name: 'customerDomain',
        label: t('customer_url'),
        perm: 'CustomerUrl',
        to: { query: { tab: 'customerDomain' } },
      },
      // 管端域名
      {
        name: 'agentDomain',
        label: t('agent_url'),
        perm: 'AgentUrl',
        to: { query: { tab: 'agentDomain' } },
      },
      // IP服務
      {
        name: 'ipService',
        label: t('ip_service'),
        perm: 'UrlIpService',
        to: { query: { tab: 'ipService' } },
      },
      // 單號進度
      {
        name: 'singleNumberProgress',
        label: t('single_number_progress'),
        perm: 'BindAlternateUrl', // todo: 待加新權限
        to: { query: { tab: 'singleNumberProgress' } },
      },
      // SSL憑證(舊頁面)
      {
        name: 'applySSL',
        label: t('domain_ssl'),
        perm: 'DomainSSL', // 後續要改回吃新權限
        href: `${host.rd3}/hall/ssl`,
        newWindow: true,
      },
      // 活躍域名
      {
        name: 'activeDomain',
        label: t('active_url'),
        perm: 'ActiveUrl',
        to: { query: { tab: 'activeDomain' } },
      },
      // 操作紀錄
      {
        name: 'record',
        label: t('operate_record'),
        // perm: 'UrlManagementRecord',
        perm: 'ActiveUrl', // todo: 待加新權限
        to: { query: { tab: 'record' } },
      },
    ];

    const { currentTabs, tabPerms, setTabWatcher } = useTabAccess(tabs);
    setTabWatcher(activeTab);

    // 處理loading遮罩
    const loadingStore = useLoadingStore();
    const setLoading = (status: boolean) => {
      loadingStore.page = status;
    };
    provide('UrlManagement:setLoading', setLoading);

    // 站別資訊
    const siteInfoVisible = ref(false);
    provide('Visible:siteInfo', siteInfoVisible);

    // 設定範例
    const settingExampleVisible = ref(false);
    provide('Visible:settingExample', settingExampleVisible);

    return {
      t,
      activeTab,
      currentTabs,
      tabPerms,
      siteInfoVisible,
      settingExampleVisible,
    };
  },
});
</script>

<style lang="scss" scoped>
.url-management {
  :deep(.after-title) {
    @include flex-basic(center);
    margin-left: 10px;

    .el-button {
      margin-right: 10px;
    }
  }

  .custom-color {
    @include alert-theme($text-1, $primary-4);
  }
}
</style>
