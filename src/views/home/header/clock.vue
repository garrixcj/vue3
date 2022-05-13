<template lang="pug">
//- 美東時間時鐘
.clock {{ t('time_of_east_us') }}：{{ time }}
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export default defineComponent({
  // 美東時間時鐘
  name: 'RealTimeClock',
  setup() {
    const { t } = useI18n({ useScope: 'parent' });
    const time = ref('');
    // 定期執行
    const keepUpdate = ref<ReturnType<typeof setTimeout>>();
    // 時鐘計時功能
    const updateTime = () => {
      const now = dayjs().utcOffset(-4).format('YYYY-MM-DD HH:mm:ss');
      time.value = now;
      keepUpdate.value = setTimeout(updateTime, 1000);
    };
    // 元件起始綁定計時器
    onMounted(updateTime);
    onUnmounted(() => {
      if (keepUpdate.value) {
        clearTimeout(keepUpdate.value);
      }
    });

    return {
      time,
      t,
    };
  },
});
</script>
