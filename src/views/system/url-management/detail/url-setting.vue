<template lang="pug">
rd-card(
  :sub-title="t('total_result', { num: data.length })"
  :title="t('domain_name_setting')"
)
  template(#content)
    rd-table(border :data="urlList" :empty-text="t('no_data')")
      //- 序號
      rd-table-column(
        type="index"
        :label="t('increment_number')"
        align="center"
        :resizable="false"
        width="60"
      )
      //- 域名
      rd-table-column(
        :label="t('domain_name')"
        prop="domain"
        header-align="center"
        :resizable="false"
      )
      //- 進度
      rd-table-column(
        :label="t('processe')"
        prop="progressRate"
        align="center"
        :resizable="false"
      )
        template(#default="{ row }")
          rd-tag(
            :type="progressListMap[progressKeyMap[row.progress]].type"
            size="small"
          )
            | {{ t(progressListMap[progressKeyMap[row.progress]].dict) }}
      //- 進度詳細
      rd-table-column(
        :label="t('progress_detail')"
        prop="message"
        :resizable="false"
      )
        template(#default="{ row }")
          span {{ row.message ? row.message : '--' }}
  template(#headerSuffix)
    rd-switch(
      v-model="canNotBindFilter"
      :active="{ type: 'success', text: t('only_show_can_not_binding'), inverseText: t('only_show_can_not_binding') }"
    )
</template>

<script lang="ts">
import { defineComponent, computed, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TicketDetailUrl } from './detail';
import {
  progressListMap,
  progressKeyMap,
} from '../single-number-progress/progress';

export default defineComponent({
  name: 'UrlManagementUrlSettingCard',
  props: {
    data: { type: Object as PropType<TicketDetailUrl[]>, required: true },
  },
  setup(props) {
    // 字典
    const { t } = useI18n({ useScope: 'parent' });

    // 是否僅顯示「無法綁定的域名」
    const canNotBindFilter = ref(false);
    const urlList = computed(() => {
      let list = props.data;
      if (canNotBindFilter.value) {
        list = list.filter(obj => obj.progress === 3);
      }

      return list;
    });

    return {
      t,
      canNotBindFilter,
      urlList,
      progressListMap,
      progressKeyMap,
    };
  },
});
</script>
