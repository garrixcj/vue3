<template lang="pug">
//- 搜尋提醒
rd-dialog.search-hint(
  :model-value="modelValue"
  :title="t('search_hint')"
  :close-on-click-modal="false"
  width="532px"
)
  .hint-text {{ t('binding_search_hint') }}
  .card
    .title {{ t('users_does_not_exist', { num: users.length }) }}
    rd-divider
    rd-scrollbar(max-height="80px")
      .users-list
        rd-tag.not-found(v-for="name in users" :key="name" size="small") {{ name }}
  template(#footer)
    rd-button(type="primary" @click="$emit('confirm')") {{ t('confirm') }}
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  //- 搜尋提示
  name: 'SearchHint',
  props: {
    modelValue: Boolean,
    // 帳號
    users: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['confirm'],
  setup() {
    const { t } = useI18n({ useScope: 'parent' });

    return {
      t,
    };
  },
});
</script>
<style lang="scss" scoped>
.search-hint {
  .hint-text {
    margin-bottom: 10px;
    color: $text-1;
  }

  .card {
    @include divider-margin(10px, 10px);
    padding: 10px;
    background-color: $background-5;
    border-radius: 4px;

    .title {
      color: $text-1;
    }
    .not-found {
      margin-bottom: 5px;
      @include space-multiline;
      @include tag-color($background-2);
    }
  }
}
</style>
