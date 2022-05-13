<template lang="pug">
//- 美東時間時鐘
.online-member {{ t('online_member') }}：{{ onlineNum }}
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import adminApi from '@/api/admin';

export default defineComponent({
  // 線上會員人數
  name: 'OnlineMember',
  setup() {
    const { t } = useI18n({ useScope: 'parent' });
    const onlineNum = ref(0);
    // 定期執行
    const keepUpdate = ref<ReturnType<typeof setTimeout>>();

    // 更新線上會員人數
    const updateOnlineMember = () => {
      adminApi.getOnlineMember().then(resp => {
        if (resp.data.result) {
          onlineNum.value = resp.data.data;
          keepUpdate.value = setTimeout(() => {
            updateOnlineMember();
          }, 60000);
          // 清除定期更新
        }
      });
    };
    // 元件起始更新人數
    onMounted(updateOnlineMember);
    onUnmounted(() => {
      if (keepUpdate.value) {
        clearTimeout(keepUpdate.value);
      }
    });

    return {
      onlineNum,
      t,
    };
  },
});
</script>
