<template lang="pug">
router-view
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { debounce } from 'lodash';

export default defineComponent({
  setup() {
    const store = useStore();
    // 監聽畫面大小
    const handleResize = debounce(() => {
      store.dispatch('display/resizeWindow');
    }, 20);
    window.addEventListener('resize', handleResize);
    store.dispatch('display/resizeWindow');
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
    });
  },
});
</script>
