<i18n src="@/languages/system_setting/url_management/index.json"></i18n>
<template lang="pug">
rd-layout-content.name-server-teaching
  h2 {{ t('name_server_teaching_title') }}
  el-steps(direction="vertical")
    el-step(
      v-for="(item, key) in images"
      :key="key"
      status="process"
      :title="item.title"
    )
      template(#description)
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
  name: 'NameServerTeaching', // 網址管理 - 設定範例 - Name Server教學
  components: {
    ElSteps,
    ElStep,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });

    const cookieStore = useCookieStore();
    const isTraditionalChinese = cookieStore.lang === 'zh-tw';
    const getLang = isTraditionalChinese ? 'zh-tw' : 'zh-cn';
    const images = {
      step1: { title: t('teaching_step_1'), height: '', url: '' },
      step2: {
        title: t('teaching_step_2'),
        height: '280px',
        url: `/v3/src/assets/images/url-management/nameserver-${getLang}-01.png`,
      },
      step3: {
        title: t('teaching_step_3'),
        height: '310px',
        url: `/v3/src/assets/images/url-management/nameserver-${getLang}-02.png`,
      },
      step4: {
        title: t('name_server_teaching_step_4'),
        height: isTraditionalChinese ? '270px' : '220px',
        url: `/v3/src/assets/images/url-management/nameserver-${getLang}-03.png`,
      },
      step5: {
        title: t('name_server_teaching_step_5'),
        height: isTraditionalChinese ? '270px' : '220px',
        url: `/v3/src/assets/images/url-management/nameserver-${getLang}-04.png`,
      },
      step6: {
        title: t('name_server_teaching_step_6'),
        height: isTraditionalChinese ? '570px' : '450px',
        url: `/v3/src/assets/images/url-management/nameserver-${getLang}-05.png`,
      },
      step7: {
        title: t('name_server_teaching_step_7'),
        height: isTraditionalChinese ? '470px' : '400px',
        url: `/v3/src/assets/images/url-management/nameserver-${getLang}-06.png`,
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
.name-server-teaching {
  .image {
    background-repeat: no-repeat;
  }
}
</style>
