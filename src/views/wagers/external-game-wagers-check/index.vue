<i18n>
{
  "zh-tw": {
    "external_wagers_check": "外接遊戲注單核對"
  }
}
</i18n>

<template lang="pug">
rd-layout(
  v-model:active-tab="activeTab"
  tab-type="link"
  :title="t('external_wagers_check')"
  :menu="currentTabs"
)
  template(#wagersCheckList)
    wagers-check-list
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useWatcher } from '@/components/utils/route-watch';
import { useTabAccess } from '@/plugins/access/view';

export default defineComponent({
  name: 'ExternalGameWagersCheck', //外接遊戲注單核對
  components: {
    // 外接遊戲注單核對
    WagersCheckList: defineAsyncComponent(
      () => import('./wagers-check-list.vue'),
    ),
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const activeTab = ref('wagersCheckList');
    const tabs = [
      // 外接遊戲注單核對
      {
        name: 'wagersCheckList',
        label: t('external_wagers_check'),
        perm: 'WagersCheck',
        to: { query: { tab: 'wagersCheckList' } },
      },
    ];

    const watcher = useWatcher();
    const { currentTabs, tabPerms, setTabWatcher } = useTabAccess(tabs);
    setTabWatcher(activeTab);
    watcher.setWatcher((query: { tab: string }) => {
      if (query.tab === 'wagersCheckList') {
        activeTab.value = 'wagersCheckList';
      }
    });

    return {
      t,
      activeTab,
      currentTabs,
      tabPerms,
    };
  },
});
</script>
