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
        .image(:class="[`image-${key}`]")
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent } from 'vue';
import { ElSteps, ElStep } from 'element-plus';

export default defineComponent({
  name: 'NameServerTeaching', // 網址管理 - 設定範例 - Name Server教學
  components: {
    ElSteps,
    ElStep,
  },
  setup() {
    const { t, locale } = useI18n({ useScope: 'local' });

    // 取得語系
    const getLang = locale.value === 'zh-tw' ? 'zh-tw' : 'zh-cn';

    const images = {
      step1: {
        title: t('teaching_step_1'),
      },
      step2: {
        title: t('teaching_step_2'),
        url:
          'url(/v3/src/assets/images/teaching/url-management/nameserver-' +
          getLang +
          '-01.png)',
        height: '280px',
      },
      step3: {
        title: t('teaching_step_3'),
        url:
          'url(/v3/src/assets/images/teaching/url-management/nameserver-' +
          getLang +
          '-02.png)',
        height: '310px',
      },
      step4: {
        title: t('name_server_teaching_step_4'),
        url:
          'url(/v3/src/assets/images/teaching/url-management/nameserver-' +
          getLang +
          '-03.png)',
        height: getLang == 'zh-tw' ? '270px' : '220px',
      },
      step5: {
        title: t('name_server_teaching_step_5'),
        url:
          'url(/v3/src/assets/images/teaching/url-management/nameserver-' +
          getLang +
          '-04.png)',
        height: getLang == 'zh-tw' ? '270px' : '220px',
      },
      step6: {
        title: t('name_server_teaching_step_6'),
        url:
          'url(/v3/src/assets/images/teaching/url-management/nameserver-' +
          getLang +
          '-05.png)',
        height: getLang == 'zh-tw' ? '570px' : '450px',
      },
      step7: {
        title: t('name_server_teaching_step_7'),
        url:
          'url(/v3/src/assets/images/teaching/url-management/nameserver-' +
          getLang +
          '-06.png)',
        height: getLang == 'zh-tw' ? '470px' : '400px',
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
  min-width: 1180px;
  .image {
    background-repeat: no-repeat;
  }

  .image-step2 {
    height: v-bind('images.step2.height');
    background-image: v-bind('images.step2.url');
  }
  .image-step3 {
    height: v-bind('images.step3.height');
    background-image: v-bind('images.step3.url');
  }
  .image-step4 {
    height: v-bind('images.step4.height');
    background-image: v-bind('images.step4.url');
  }
  .image-step5 {
    height: v-bind('images.step5.height');
    background-image: v-bind('images.step5.url');
  }
  .image-step6 {
    height: v-bind('images.step6.height');
    background-image: v-bind('images.step6.url');
  }
  .image-step7 {
    height: v-bind('images.step7.height');
    background-image: v-bind('images.step7.url');
  }
}
</style>
