<i18n src="@/languages/user/accounts_structure_grouping.json"></i18n>
<template lang="pug">
rd-layout(
  v-model:active-tab="activeTab"
  tab-type="link"
  :title="t('accounts_structure_grouping')"
  :menu="currentTabs"
)
  template(#notLoggedInList)
    not-logged-in-list
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouteWatch } from '@/components/utils/route-watch';
import { useTabAccess } from '@/plugins/access/view';
import { useLoadingStore } from '@/stores/loading';

export default defineComponent({
  name: 'AccountsStructureGrouping', // 帳號結構分群
  components: {
    // 未登入會員名單
    NotLoggedInList: defineAsyncComponent(
      () => import('./not-logged-in-list/index.vue'),
    ),
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const activeTab = ref('notLoggedInList');
    const tabs = [
      // 未登入會員名單
      {
        name: 'notLoggedInList',
        label: t('not_logged_in_list'),
        perm: 'NotLoggedInList',
        to: { query: { tab: 'notLoggedInList' } },
      },
    ];

    const watcher = new RouteWatch();
    const { currentTabs, tabPerms, setTabWatcher } = useTabAccess(tabs);
    setTabWatcher(activeTab);
    watcher.setWatcher((query: { tab: string }) => {
      if (query.tab === 'notLoggedInList') {
        activeTab.value = 'notLoggedInList';
      }
    });

    // 處理loading遮罩
    const loadingStore = useLoadingStore();
    const setLoading = (status: boolean) => {
      loadingStore.page = status;
    };
    provide('AccountsStructureGroup:setLoading', setLoading);

    return {
      t,
      activeTab,
      currentTabs,
      tabPerms,
    };
  },
});
</script>
