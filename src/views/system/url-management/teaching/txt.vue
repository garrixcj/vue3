<i18n src="@/languages/system_setting/url_management/index.json"></i18n>
<template lang="pug">
rd-layout-content.txt-teaching
  h2 {{ t('txt_teaching_title') }}
  el-steps(direction="vertical")
    el-step(
      v-for="(item, key) in images"
      :key="key"
      status="process"
      :title="item"
    )
      template(#description)
        .description-group(v-if="key === 'step5'")
          span {{ t('txt_teaching_description_1') }}
          span {{ t('txt_teaching_description_2') }}
          i18n-t(keypath="txt_teaching_description_3" tag="span")
            template(#content)
              span.description-notice {{ t('domain_suffix') }}
          span {{ t('txt_teaching_description_4') }}
        .image(:class="[`image-${key}-${getLang}`]")
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
      step1: t('teaching_step_1'),
      step2: t('teaching_step_2'),
      step3: t('teaching_step_3'),
      step4: t('txt_teaching_step_4'),
      step5: t('txt_teaching_step_5'),
    };

    return {
      t,
      images,
      getLang,
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
    &-zh-tw {
      height: 280px;
      background-image: url('@/assets/images/teaching/url-management/txt-zh-tw-01.png');
    }
    &-zh-cn {
      height: 280px;
      background-image: url('@/assets/images/teaching/url-management/txt-zh-cn-01.png');
    }
  }
  .image-step3 {
    &-zh-tw {
      height: 310px;
      background-image: url('@/assets/images/teaching/url-management/txt-zh-tw-02.png');
    }
    &-zh-cn {
      height: 310px;
      background-image: url('@/assets/images/teaching/url-management/txt-zh-cn-02.png');
    }
  }
  .image-step4 {
    &-zh-tw {
      height: 460px;
      background-image: url('@/assets/images/teaching/url-management/txt-zh-tw-03.png');
    }
    &-zh-cn {
      height: 425px;
      background-image: url('@/assets/images/teaching/url-management/txt-zh-cn-03.png');
    }
  }
  .image-step5 {
    &-zh-tw {
      height: 720px;
      background-image: url('@/assets/images/teaching/url-management/txt-zh-tw-04.png');
    }
    &-zh-cn {
      height: 580px;
      background-image: url('@/assets/images/teaching/url-management/txt-zh-cn-04.png');
    }
  }
}
</style>
