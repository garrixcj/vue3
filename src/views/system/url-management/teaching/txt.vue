<i18n src="@/languages/system_setting/url_management/index.json"></i18n>
<template lang="pug">
rd-layout-content.txt-teaching
  h2 {{ t('txt_teaching_title') }}
  el-steps(direction="vertical")
    el-step(
      v-for="(item, key) in images"
      :key="key"
      status="process"
      :title="item.title"
    )
      template(#description)
        .description-group(v-if="key === 'step5'")
          span {{ t('txt_teaching_description_1') }}
          span {{ t('txt_teaching_description_2') }}
          span(v-html="t('txt_teaching_description_3')")
          span {{ t('txt_teaching_description_4') }}
        .image(
          :style="{ 'background-image': 'url(' + item.url + ')', height: item.height }"
        )
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent } from 'vue';
import { ElSteps, ElStep } from 'element-plus';
import { useCookieStore } from '@/stores/cookie';

export default defineComponent({
  name: 'TXTTeaching', // 網址管理 - 設定範例 - txt教學
  components: {
    ElSteps,
    ElStep,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });

    const cookieStore = useCookieStore();
    const getLang = cookieStore.lang === 'zh-tw' ? 'zh-tw' : 'zh-cn';
    const images = {
      step1: { title: t('teaching_step_1'), height: '', url: '' },
      step2: {
        title: t('teaching_step_2'),
        height: '280px',
        url: `/v3/src/assets/images/url-management/txt-${getLang}-01.png`,
      },
      step3: {
        title: t('teaching_step_3'),
        height: '310px',
        url: `/v3/src/assets/images/url-management/txt-${getLang}-02.png`,
      },
      step4: {
        title: t('txt_teaching_step_4'),
        height: '460px',
        url: `/v3/src/assets/images/url-management/txt-${getLang}-03.png`,
      },
      step5: {
        title: t('txt_teaching_step_5'),
        height: '720px',
        url: `/v3/src/assets/images/url-management/txt-${getLang}-04.png`,
      },
    };

    return {
      t,
      images,
    };
  },
});
</script>

<style lang="scss" scoped>
.txt-teaching {
  .description-group {
    @include flex-basic(flex-start, flex-start);

    flex-direction: column;
    :deep(.description-notice) {
      color: $danger;
    }
  }
  .image {
    background-repeat: no-repeat;
  }
}
</style>
