<template lang="pug">
.record-content
  .content(v-if="type === 6")
    span {{ t('apply_url_restriction') }}
    .content__item(v-for="(item, index) in content" :key="index")
      span(v-if="index === 'company_verify'") {{ t('bbin_purchase') }}({{ t('result') }})：
      span(v-else) {{ t('domain_purchase') }}({{ t('result') }})：
      span {{ item.before }} →
      span.after {{ item.after }}
  .content(v-else-if="type === 5")
    .content__item(v-if="content?.entrance === 1") {{ t('customer_url') }}
    .content__item(v-else) {{ t('agent_url') }}
    .content__item {{ t('domain_name') }}：{{ content?.domain_name }}
    .content__item
      span {{ t('remark') }}：{{ content?.remark.before }} →
      span.after {{ content?.remark.after }}
  .content(v-else)
    .content__item {{ t('trans_number') }}：{{ content?.ticket_id }}
    .content__item {{ t('domain_name_amount') }}：
      rd-button(text @click="showDomainNames(content?.domain_names)") {{ content?.total }}
    .content__item {{ t('status') }}：
      template(v-if="type === 1")
        | {{ t('processing') }}
      template(v-if="type === 2")
        span {{ t('processing') }} →
        span.after {{ t('finished') }}
      template(v-if="type === 3")
        span {{ t('processing') }} →
        span.after {{ t('abolishment') }}
      template(v-if="type === 4")
        span {{ t('abolishment') }} →
        span.after {{ t('abolished') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'RecordDetail',
  props: {
    type: {
      type: Number,
      require: true,
    },
    // 因爲回傳內容過於複雜且根據不同type內容不一樣，所以不定義Type
    content: {
      type: Object,
      require: true,
    },
  },
  emits: ['showDomainNames'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'parent' });
    const showDomainNames = (domains: string[]) => {
      emit('showDomainNames', domains);
    };
    return {
      t,
      showDomainNames,
    };
  },
});
</script>

<style lang="scss" scoped>
.record-content {
  .after {
    margin-left: 5px;
    color: $search;
  }
}
</style>
