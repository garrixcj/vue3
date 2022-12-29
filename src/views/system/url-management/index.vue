<template lang="pug">
rd-layout.url-management(
  ref="layoutRef"
  v-model:active-tab="activeTab"
  tab-type="link"
  :menu="currentTabs"
  :title="t('url_management')"
)
  template(#afterTitle)
    //- 站別資訊
    site-information
    //- 操作教學
    teach(feature-key="domain_management")
  //- 客端域名
  template(#customerDomain)
    beta-message
    customer-domain
  //- 管端域名
  template(#agentDomain)
    beta-message
    agent-domain
  //- IP服務
  template(#ipService)
    beta-message
    ip-service
  //- 單號進度
  template(#singleNumberProgress)
    beta-message
    single-number-progress
  //- SSL憑證
  template(#applySSL)
    rd-alert.custom-color(:title="t('new_window_prompt')" :closable="false")
  //- 活躍域名
  template(#activeDomain)
    beta-message
    active-domain
  //- 操作紀錄
  template(#record)
    beta-message
    record
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import dict from '@/languages/system_setting/url_management/index.json';
import { useTrans } from '@/plugins/i18n/replace';
import {
  defineComponent,
  defineAsyncComponent,
  onMounted,
  ref,
  provide,
  type Ref,
  type ComponentPublicInstance,
} from 'vue';
import { isEmpty } from 'lodash';
import { useTabAccess } from '@/plugins/access/view';
import { useHosts } from '@/plugins/url/index';
import { useLoadingStore } from '@/stores/loading';
import { match } from '@/components/utils/string-match/index';
import { RouteWatch } from '@/components/utils/route-watch';
import { useSiteList } from './common/list';

export default defineComponent({
  name: 'UrlManagement', // 網址管理
  components: {
    // 客端域名
    CustomerDomain: defineAsyncComponent(
      () => import('./customer-domain/index.vue'),
    ),
    // 管端域名
    AgentDomain: defineAsyncComponent(() => import('./agent-domain/index.vue')),
    // IP服務
    IpService: defineAsyncComponent(() => import('./ip-service/index.vue')),
    // 單號進度
    SingleNumberProgress: defineAsyncComponent(
      () => import('./single-number-progress/index.vue'),
    ),
    // 活躍域名
    ActiveDomain: defineAsyncComponent(
      () => import('./active-domain/index.vue'),
    ),
    // 操作紀錄
    Record: defineAsyncComponent(() => import('./record/index.vue')),
    // 站別資訊
    SiteInformation: defineAsyncComponent(
      () => import('./common/site-information.vue'),
    ),
    // Beta警示訊息
    BetaMessage: defineAsyncComponent(
      () => import('./common/beta-message.vue'),
    ),
    // 教學連結
    Teach: defineAsyncComponent(
      () => import('@/plugins/teach-guide/index.vue'),
    ),
  },
  setup() {
    const { locale } = useI18n({ useScope: 'local' });
    const { t } = useTrans(dict, locale.value);
    const { hosts } = useHosts();
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
        perm: 'ApplicationProgress',
        to: { query: { tab: 'singleNumberProgress' } },
      },
      // SSL憑證(舊頁面)
      {
        name: 'applySSL',
        label: t('domain_ssl'),
        perm: 'DomainSSL', // 後續要改回吃新權限
        href: `${hosts.rd3}/hall/ssl`,
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
        perm: 'URLManagementRecord',
        to: { query: { tab: 'record' } },
      },
    ];

    const watcher = new RouteWatch();
    const { currentTabs, setTabWatcher } = useTabAccess(tabs);
    setTabWatcher(activeTab);
    watcher.setWatcher((query: { tab: string }) => {
      const currentTab = tabs.find(item => item.name === query.tab);
      if (typeof currentTab !== 'undefined') {
        activeTab.value = currentTab.name;
      }

      if (isEmpty(query)) {
        activeTab.value = currentTabs.value[0].name;
      }
    });

    // 處理loading遮罩
    const loadingStore = useLoadingStore();
    const setLoading = (status: boolean) => {
      loadingStore.page = status;
    };
    provide('UrlManagement:setLoading', setLoading);

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
    provide('UrlManagement:customSearch', customSearch);

    // 處理頁面置頂
    const layoutRef = ref(document.createElement('div')) as Ref<
      ComponentPublicInstance<HTMLDivElement>
    >;
    const scrollToTop = () => {
      layoutRef.value.$el.scrollTop = 0;
    };
    provide('UrlManagement:scrollToTop', scrollToTop);

    // 站別相關
    const { getSiteList, siteOptions } = useSiteList();
    provide('UrlManagement:siteList', siteOptions);

    onMounted(() => {
      loadingStore.page = true;
      Promise.all([getSiteList()]).then(() => {
        loadingStore.page = false;
      });
    });

    return {
      t,
      activeTab,
      currentTabs,
      layoutRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.url-management {
  :deep(.after-title) {
    @include flex-basic(center);
    margin-left: 10px;
  }

  .custom-color {
    @include alert-theme($text-1, $primary-4);
  }
}
</style>
