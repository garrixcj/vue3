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
          i18n-t(keypath="txt_teaching_description_3" tag="span")
            template(#content)
              span.description-notice {{ t('domain_suffix') }}
          span {{ t('txt_teaching_description_4') }}
        .image(:class="[`image-${key}`]")
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent } from 'vue';
import { ElSteps, ElStep } from 'element-plus';

export default defineComponent({
  name: 'TXTTeaching', // 網址管理 - 設定範例 - txt教學
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
          'url(/v3/src/assets/images/teaching/url-management/txt-' +
          getLang +
          '-01.png)',
        height: '280px',
      },
      step3: {
        title: t('teaching_step_3'),
        url:
          'url(/v3/src/assets/images/teaching/url-management/txt-' +
          getLang +
          '-02.png)',
        height: '310px',
      },
      step4: {
        title: t('txt_teaching_step_4'),
        url:
          'url(/v3/src/assets/images/teaching/url-management/txt-' +
          getLang +
          '-03.png)',
        height: getLang == 'zh-tw' ? '460px' : '425px',
      },
      step5: {
        title: t('txt_teaching_step_5'),
        url:
          'url(/v3/src/assets/images/teaching/url-management/txt-' +
          getLang +
          '-04.png)',
        height: getLang == 'zh-tw' ? '720px' : '580px',
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
  min-width: 1180px;
  .description-group {
    @include flex-basic(flex-start, flex-start);

    flex-direction: column;
    .description-notice {
      color: $danger;
    }
  }
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
}
</style>
