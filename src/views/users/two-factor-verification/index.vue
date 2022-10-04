<i18n src="@/languages/user/member_two_factor_auth.json"></i18n>
<template lang="pug">
rd-layout(
  v-model:active-tab="activeTab"
  tab-type="link"
  :title="t('member_two_factor_auth')"
  :menu="currentTabs"
)
  template(#bindingDataSummary)
    binding-data-summary
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouteWatch } from '@/components/utils/route-watch';
import { useTabAccess } from '@/plugins/access/view';

export default defineComponent({
  name: 'MemberTwoFactorVerification', // 會員雙重驗證
  components: {
    // 綁定資料匯總
    bindingDataSummary: defineAsyncComponent(
      () => import('./binding-data-summary/index.vue'),
    ),
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const activeTab = ref('bindingDataSummary');
    const tabs = [
      // 綁定資料匯總
      {
        name: 'bindingDataSummary',
        label: t('binding_data_summary'),
        perm: 'BindingDataSummary',
        to: { query: { tab: 'bindingDataSummary' } },
      },
    ];

    const watcher = new RouteWatch();
    const { currentTabs, setTabWatcher } = useTabAccess(tabs);
    setTabWatcher(activeTab);
    watcher.setWatcher((query: { tab: string }) => {
      if (query.tab === 'bindingDataSummary') {
        activeTab.value = 'bindingDataSummary';
      }
    });

    return {
      t,
      activeTab,
      currentTabs,
    };
  },
});
</script>
