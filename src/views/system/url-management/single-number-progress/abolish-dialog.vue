<i18n src="@/languages/system_setting/url_management/abolish.json"></i18n>
<template lang="pug">
.abolish-dialog(v-loading="loading")
  rd-dialog(
    :model-value="modelValue"
    :title="t('void')"
    :close-on-click-modal="false"
    width="430px"
    @update:model-value="open($event)"
  )
    .dialog-content
      template(v-if="action === 'single'")
        .msg {{ t('domain_abolish_check_single') }}
        rd-form(label-position="right" label-width="65px")
          rd-form-item(:label="t('trans_number')") {{ list[0].id }}
          rd-form-item(:label="t('site')") {{ list[0].siteName }}
          rd-form-item(:label="t('suffix')") {{ list[0].suffix }}
      template(v-else)
        .msg {{ t('domain_abolish_check_multi') }}
        rd-collapse-card(v-model:collapse="collapse" type="small-card")
          template(#title)
            span {{ t('change_trans_number') }}
          template(#content)
            rd-scrollbar(max-height="100px" always)
              .tag-container
                rd-tag.tag-item(v-for="(data, index) in list" :key="index") {{ data.id }}
    template(#footer)
      rd-button(type="secondary" @click="open(false)") {{ t('cancel') }}
      rd-button(type="primary" @click="confirm") {{ t('void') }}
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { notify } from '@/components/utils/notification';
import type { AbolishAction, AbolishList } from './single-number-progress';
import RdCollapseCard from '@/components/custom/collapse-card/index.vue';
import { url as urlAPI } from '@/api/domain';

export default defineComponent({
  name: 'UrlManagementAbolishDialog',
  components: { RdCollapseCard },
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    // 要作廢的方式(single單筆、multi多筆)
    action: { type: String as PropType<AbolishAction>, required: true },
    // 要作廢的資料
    list: {
      type: Array as PropType<AbolishList[]>,
      required: true,
    },
  },
  emits: ['update:model-value'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });
    const loading = ref(false);
    const collapse = ref(true);

    const confirm = () => {
      urlAPI.abolishTicket(props.list.map(obj => obj.id)).then(response => {
        if (response.data.result) {
          notify.success({
            title: t('success'),
            message:
              props.action === 'single'
                ? t('change_trans_number_success_single', {
                    id: props.list[0].id,
                  })
                : t('change_trans_number_success_multi', {
                    num: props.list.length,
                  }),
          });
        }
        open(false);
      });
    };

    // 觸發父層值的異動
    const open = (value: boolean) => {
      emit('update:model-value', value);
    };

    return { t, loading, confirm, collapse, open };
  },
});
</script>

<style lang="scss" scoped>
.dialog-content {
  @include space-vertical(10px);

  .tag-container {
    @include flex-basic;
    flex-wrap: wrap;
    gap: 5px;

    .tag-item {
      @include tag-border(false, true);
    }
  }
}
</style>
