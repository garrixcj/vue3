<i18n src="@/languages/report/audit/index.json"></i18n>
<template lang="pug">
rd-layout(
  v-model:active-tab="activeTab"
  tab-type="link"
  :title="t('external_audit')"
  :menu="currentTabs"
)
  template(#auditOverview)
    audit-overview
</template>
<script lang="ts">
import { defineAsyncComponent, defineComponent, ref } from 'vue';
import { useTabAccess } from '@/plugins/access/view';
import { useI18n } from 'vue-i18n';
import { RouteWatch } from '@/components/utils/route-watch';

export default defineComponent({
  name: 'ExternalAudit',
  components: {
    // 核帳查詢總覽
    AuditOverview: defineAsyncComponent(() => import('./overview/index.vue')),
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });

    const activeTab = ref('auditOverview');
    const tabs = [
      // 核帳查詢總覽
      {
        name: 'auditOverview',
        label: t('audit_overview'),
        perm: 'AuditOverview',
        to: { query: { tab: 'auditOverview' } },
      },
    ];

    const watcher = new RouteWatch();
    const { currentTabs, setTabWatcher } = useTabAccess(tabs);

    setTabWatcher(activeTab);

    watcher.setWatcher((query: { tab: string }) => {
      if (query.tab === 'auditOverview') {
        activeTab.value = 'auditOverview';
      }
    });

    return { t, activeTab, currentTabs };
  },
});
</script>
