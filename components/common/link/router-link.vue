<template lang="pug">
router-link(
  v-if="!isText"
  v-slot="{ isActive, href, navigate }"
  v-bind="$props"
  custom
)
  rd-link(v-bind="$attrs" :href="href" @click="navigate")
    slot
rd-link(v-else v-bind="$attrs" isText)
  slot
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RdLink from './index.vue';

export default defineComponent({
  // router-link 版的 rd-link
  name: 'RdRouterLink',
  components: { RdLink },
  props: {
    isText: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
