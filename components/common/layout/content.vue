<template lang="pug">
//- 無標題純內文，包含mainframe-default的padding
//- 用於內置內容，或是子分頁
.rd-layout-content(:class="{ 'main-padding': needPadding }")
  slot
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'RdLayoutContent',
  setup() {
    // 接收上層 padding 設置(上層有就不需要，預設需要)
    const needPadding = !inject('UpLayer:hasPadding', false);

    return {
      needPadding,
    };
  },
});
</script>

<style lang="scss" scoped>
.rd-layout-content.main-padding {
  // 需要 padding
  @include mainframe(&, false);
}
</style>
