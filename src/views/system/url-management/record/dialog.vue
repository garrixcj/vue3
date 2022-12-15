<template lang="pug">
rd-dialog(
  v-bind="$attrs"
  :title="t('domain_name')"
  :close-on-click-modal="false"
  width="509px"
  @close="close"
)
  .top-bar
    .top-bar__label {{ t('domain_name') }}
    .top-bar__item
      rd-input(v-model="keyword" :placeholder="t('input_keyword')" clearable)
  .content
    rd-card(no-padding)
      template(#content)
        rd-table(border :data="domainNamesFilter")
          rd-table-column(
            :label="t('increment_number')"
            header-align="center"
            align="center"
            prop="serial_number"
            width="80"
          )
          rd-table-column(
            :label="t('domain_name')"
            header-align="center"
            prop="domain_name"
          )
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DomainNamesType } from './type';

export default defineComponent({
  name: 'RecordDialog',
  emits: ['update:visible'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'parent' });
    const domainNames = inject('UrlManagementRecord:domainNames') as Ref<
      DomainNamesType[]
    >;
    // 域名關鍵字
    const keyword = ref('');
    // 域名過濾後的資料列
    const domainNamesFilter = computed(() => {
      return domainNames.value.filter(item => {
        const escapeRegexpString = (value = '') =>
          value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        const re = new RegExp(escapeRegexpString(keyword.value), 'i');
        return re.test(item.domain_name);
      });
    });

    const close = () => {
      keyword.value = '';
      emit('update:visible', false);
    };

    return {
      t,
      keyword,
      domainNamesFilter,
      close,
    };
  },
});
</script>

<style lang="scss" scoped>
.top-bar {
  @include flex-basic(space-multiline);
  @include space;
  margin-bottom: 10px;

  .top-bar__item {
    width: 207px;
  }
}
.content {
  margin-bottom: 10px;
}
</style>
