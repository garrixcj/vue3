<i18n src="@/languages/wagers/external_game_wagers_check/index.json"></i18n>

<template lang="pug">
rd-layout(
  ref="layoutRef"
  v-model:active-tab="activeTab"
  tab-type="link"
  :title="t('external_wagers_check')"
  :menu="currentTabs"
)
  template(#wagersCheckList)
    wagers-check-list
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTabAccess } from '@/plugins/access/view';
import WagersCheckList from './wagers-check-list.vue';
import RdLayout from '@/components/common/layout/normal.vue';

export default defineComponent({
  name: 'ExternalGameWagersCheck', //外接遊戲注單核對
  components: {
    // 外接遊戲注單核對
    WagersCheckList,
  },
  setup() {
    const layoutRef = ref<InstanceType<typeof RdLayout>>();
    const scrollToTop = () => {
      if (layoutRef.value) {
        layoutRef.value.$el.scrollTop = 0;
      }
    };
    provide('ExternalGameWagersCheck:scrollToTop', scrollToTop);

    const { t } = useI18n({ useScope: 'local' });
    const activeTab = 'wagersCheckList';
    let tabs = [
      // 外接遊戲注單核對
      {
        name: 'wagersCheckList',
        label: t('external_wagers_check'),
        perm: 'WagersCheckList',
        to: { query: { tab: 'wagersCheckList' } },
      },
    ];

    const { currentTabs } = useTabAccess(tabs);

    return {
      t,
      activeTab,
      currentTabs,
      layoutRef,
    };
  },
});
</script>
