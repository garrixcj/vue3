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
        width="60"
      )
      //- 域名
      rd-table-column(
        :label="t('domain_name')"
        prop="domain"
        header-align="center"
      )
      //- 進度
      rd-table-column(
        :label="t('processe')"
        prop="progressRate"
        align="center"
      )
        template(#default="scope")
          rd-tag(
            :type="getProgressTagStyle(scope.row.progressRate).type"
            size="small"
          )
            | {{ t(getProgressTagStyle(scope.row.progressRate).dict) }}
      //- //- 進度詳細
      //- rd-table-column(:label="t('processe')" prop="progressRate")
  template(#headerSuffix)
    rd-switch(
      v-model="onlyShowCanBingingUrl"
      :active="{ type: 'success', text: t('only_show_can_not_binding'), inverseText: t('only_show_can_not_binding') }"
    )
</template>
<script lang="ts">
import { defineComponent, computed, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TicketDetailUrl } from './detail';

export default defineComponent({
  name: 'UrlManagementUrlSettingCard',
  props: {
    data: { type: Object as PropType<TicketDetailUrl[]>, required: true },
  },
  setup(props) {
    // 字典
    const { t } = useI18n({ useScope: 'local' });

    // 是否僅顯示「無法綁定的域名」
    const onlyShowCanBingingUrl = ref(false);
    const urlList = computed(() => {
      let list = props.data;
      if (onlyShowCanBingingUrl.value) {
        list = list.filter(obj => obj.progressRate === 3);
      }

      return list;
    });

    // 1:處理中、2:已完成、3:無法綁定、4:已作廢
    // 域名狀態
    const progressStyle = {
      1: {
        type: 'warning',
        dict: 'processing',
      },
      2: {
        type: 'success',
        dict: 'finished',
      },
      3: {
        type: 'danger',
        dict: 'can_not_bind',
      },
      4: {
        type: 'danger',
        dict: 'abolished',
      },
    };
    const getProgressTagStyle = (progress: keyof typeof progressStyle) => {
      return progressStyle[progress]
        ? progressStyle[progress]
        : { type: '', dict: '' };
    };

    return {
      t,
      onlyShowCanBingingUrl,
      urlList,
      getProgressTagStyle,
    };
  },
});
</script>
<style lang="scss" scoped>
.format-class-label {
  .header-space {
    @include space(3px);
  }
  .mdi {
    color: $text-3;
  }
}
.tag-pill {
  @include tag-border(true, true);
}
</style>
