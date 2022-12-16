<i18n src="@/languages/wagers/external_game_wagers_check/index.json"></i18n>

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
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useWatcher } from '@/components/utils/route-watch';
import { useTabAccess } from '@/plugins/access/view';
import WagersCheckList from './wagers-check-list.vue';

export default defineComponent({
  name: 'ExternalGameWagersCheck', //外接遊戲注單核對
  components: {
    // 外接遊戲注單核對
    WagersCheckList,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const activeTab = ref('wagersCheckList');
    const tabs = [
      // 外接遊戲注單核對
      {
        name: 'wagersCheckList',
        label: t('external_wagers_check'),
        perm: 'WagersCheckList',
        to: { query: { tab: 'wagersCheckList' } },
      },
    ];

    const watcher = useWatcher();
    const { currentTabs, setTabWatcher } = useTabAccess(tabs);
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
    };
  },
});
</script>
