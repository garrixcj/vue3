<template lang="pug">
.with-domain-list
  //- 總計
  rd-card(no-separateLine no-padding :title="t('total_count')")
    template(#content)
      ag-casino(:data="data.total")
  //- 廳主
  rd-card(
    v-for="(item, index) in data.report"
    :key="index"
    no-separateLine
    no-padding
    :title="item[0].name"
    :subTitle="`@${item[0].login_code}`"
  )
    template(#content)
      ag-casino(:data="item")
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { groupSeparator } from '@/components/utils/format/amount';
import AgCasino from './ag-casino.vue';

export default defineComponent({
  name: 'WithDomainList',
  components: { AgCasino },
  props: {
    data: { type: Object, required: true },
  },
  setup() {
    const { t } = useI18n({ useScope: 'parent' });

    return { t, groupSeparator };
  },
});
</script>
<style lang="scss" scoped>
.with-domain-list {
  @include space-vertical();
}
</style>
