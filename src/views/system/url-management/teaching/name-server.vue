<template lang="pug">
rd-layout-content.name-server-teaching
  h2 {{ t('name_server_teaching_title') }}
  el-steps(direction="vertical")
    el-step(
      v-for="(item, key) in images"
      :key="key"
      status="process"
      :title="item"
    )
      template(#description)
        .image(:class="[`image-${key}-${getLang}`]")
</template>

<script lang="ts">
import dict from '@/languages/system_setting/url_management/index.json';
import { useI18nTrans } from '@/plugins/i18n/replace';
import { defineComponent } from 'vue';
import { ElSteps, ElStep } from 'element-plus';

export default defineComponent({
  name: 'NameServerTeaching', // 網址管理 - 設定範例 - Name Server教學
  components: {
    ElSteps,
    ElStep,
  },
  setup() {
    const { t, locale } = useI18nTrans(dict, { useScope: 'local' });

    // 取得語系
    const getLang = locale.value === 'zh-tw' ? 'zh-tw' : 'zh-cn';

    const images = {
      step1: t('teaching_step_1'),
      step2: t('teaching_step_2'),
      step3: t('teaching_step_3'),
      step4: t('name_server_teaching_step_4'),
      step5: t('name_server_teaching_step_5'),
      step6: t('name_server_teaching_step_6'),
      step7: t('name_server_teaching_step_7'),
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
.name-server-teaching {
  min-width: 1180px;
  .image {
    background-repeat: no-repeat;
  }

  .image-step2 {
    &-zh-tw {
      height: 280px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-tw-01.png');
    }
    &-zh-cn {
      height: 280px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-cn-01.png');
    }
  }
  .image-step3 {
    &-zh-tw {
      height: 310px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-tw-02.png');
    }
    &-zh-cn {
      height: 310px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-cn-02.png');
    }
  }
  .image-step4 {
    &-zh-tw {
      height: 270px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-tw-03.png');
    }
    &-zh-cn {
      height: 220px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-cn-03.png');
    }
  }
  .image-step5 {
    &-zh-tw {
      height: 270px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-tw-04.png');
    }
    &-zh-cn {
      height: 220px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-cn-04.png');
    }
  }
  .image-step6 {
    &-zh-tw {
      height: 570px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-tw-05.png');
    }
    &-zh-cn {
      height: 450px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-cn-05.png');
    }
  }
  .image-step7 {
    &-zh-tw {
      height: 470px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-tw-06.png');
    }
    &-zh-cn {
      height: 400px;
      background-image: url('@/assets/images/teaching/url-management/nameserver-zh-cn-06.png');
    }
  }
}
</style>
