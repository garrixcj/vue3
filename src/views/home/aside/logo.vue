<template lang="pug">
.logo {{ collapse ? t('control_system').substring(0, 1) : t('control_system') }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'HeaderLogo',
  props: {
    collapse: Boolean,
  },
  setup() {
    const { t } = useI18n();

    return {
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
$header-height: 56px;
.logo {
  height: $header-height;
  @include flex-basic(center);
}
</style>
