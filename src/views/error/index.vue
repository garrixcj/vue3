<i18n src="@/languages/index/error_page.json"></i18n>
<template lang="pug">
.error-page
  component(:is="errorComponent" :svg-message="svgMessage")
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useLoadingStore } from '@/stores/loading';
import NotFound from './not-found.vue';
import Forbidden from './forbidden.vue';
import Maintenance from './maintenance.vue';
import { notify } from '@/components/utils/notification';
import { isMaintain } from '@/plugins/errorcode';
import type { SvgMessage } from './typings';

export default defineComponent({
  name: 'ErrorPage',
  components: {
    NotFound,
    Forbidden,
    Maintenance,
  },
  props: {
    message: { type: String, default: 'unable_show_page' },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'local' });
    const currentRoute = useRoute();
    const loadingStore = useLoadingStore();
    const errorComponent = ref('not-found');
    const svgMessage = reactive<SvgMessage>({
      title: t('page_not_found'),
      subtitle: t(props.message),
      secondSubtitle: {
        time: '',
        content: '',
        secondContent: '',
      },
    });
    /**
     * 檢查是否要跳出提示訊息
     */
    const checkNotify = () => {
      if (currentRoute.query.code && currentRoute.query.responsecode) {
        const errorCode = currentRoute.query.code as string;
        const response = encodeURI(currentRoute.query.responsecode as string);
        notify.error({
          dangerouslyUseHTMLString: true,
          title: t('error'),
          // html待測試
          message: `${t(errorCode)} (${errorCode})<br>#${response}`,
        });
      }
    };

    /**
     * 設定錯誤畫面類別
     */
    const setErrorType = () => {
      if (currentRoute.path === '/forbidden') {
        // 顯示沒有功能權限
        errorComponent.value = 'forbidden';
        svgMessage.title = t('no_permission');
      } else if (
        // 顯示功能單項維護/遊戲分項維護
        currentRoute.query.code &&
        isMaintain(+currentRoute.query.code)
      ) {
        const secondSubtitle = t('maintenance_sec_subtitle').split('{time}');
        errorComponent.value = 'maintenance';
        svgMessage.title = t((currentRoute.query.dict as string) || '');
        svgMessage.subtitle = t('maintenance_subtitle');
        svgMessage.secondSubtitle.time = currentRoute.query.date as string;
        svgMessage.secondSubtitle.content = secondSubtitle[0];
        svgMessage.secondSubtitle.secondContent = secondSubtitle[1];

        document.title = t('function_under_maintenance');
        loadingStore.index = false;
      }
      // 剩下全部預設導入 not-found
    };

    checkNotify();
    setErrorType();

    return {
      // svg 訊息物件
      svgMessage,
      // 使用元件
      errorComponent,
    };
  },
});
</script>

<style lang="scss" scoped>
.error-page {
  @include flex-basic(center);
}
</style>
