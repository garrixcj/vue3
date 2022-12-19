<template lang="pug">
router-view
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount } from 'vue';
import { useDisplayStore } from '@/stores/display';
import { debounce } from 'lodash';
import { logAppEvent } from '@/plugins/firebase';
import { useWs } from './plugins/websocket';

export default defineComponent({
  setup() {
    const displayStore = useDisplayStore();
    // Websocket
    const wsStore = useWs();
    // 監聽畫面大小
    const handleResize = debounce(() => {
      displayStore.resizeWindow();
    }, 20);
    window.addEventListener('resize', handleResize);
    displayStore.resizeWindow();
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      wsStore.disconnect();
    });

    // Firebase log event
    logAppEvent();
  },
});
</script>
