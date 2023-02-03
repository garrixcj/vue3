<template lang="pug">
rd-layout(title="Playground")
  template(#body)
    rd-button(@click="click")
      i.mdi.mdi-pencil
      span 更新客端域名
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { testSync as syncAPI } from '@/api/url';

export default defineComponent({
  name: 'PlayGround',
  setup() {
    const click = () => {
      return syncAPI.syncDomainNamesByCustomers().then(resp => {
        window.console.log(resp);
      });
    };
    return {
      click,
    };
  },
});
</script>
