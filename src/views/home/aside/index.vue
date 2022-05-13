<template lang="pug">
el-aside#main-aside(:class="{ 'is-collapsed': collapsed }")
  logo(:collapse="collapsed")
  menu-tabs
</template>

<script lang="ts">
import { defineComponent, inject, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Logo from './logo.vue';
import MenuTabs from './menus/index.vue';
import { ElAside } from 'element-plus';

export default defineComponent({
  name: 'AppIndex',
  components: {
    ElAside,
    Logo,
    MenuTabs,
  },
  setup() {
    const { t } = useI18n();
    // 按鈕縮合功能
    const collapsed = inject('Main:Collapsed') as Ref<boolean>;

    return {
      t,
      collapsed,
    };
  },
});
</script>

<style lang="scss" scoped>
$menu-width: 210px;
$collapsed-width: 70px;
$header-height: 56px;

#main-aside {
  width: $menu-width;
  &.is-collapsed {
    width: $collapsed-width;
  }
}
</style>
