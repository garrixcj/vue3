<template lang="pug">
.url-management-apply(v-loading="loading")
  apply(v-if="beforePost" :site-options="siteOptions")
  apply-callback(v-else :site-options="siteOptions")
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  provide,
  type Ref,
  reactive,
  onMounted,
} from 'vue';
import { useI18n } from 'vue-i18n';
import type { BasicSetting, ApplyDomain, CallbackUrlList } from './apply';
import { useSiteList } from '../common/list';
import Apply from './apply.vue';
import ApplyCallback from './apply-callback.vue';

export default defineComponent({
  name: 'UrlManagementDetailApplyIndex',
  components: {
    Apply,
    ApplyCallback,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });

    // 實際上使用的site
    const site = ref('');
    provide('UrlManagement:applySite', site);

    // 處理loading遮罩
    const loading = ref(true);
    provide('UrlManagement:applyLoading', loading);

    // 是否送出前
    const beforePost = ref(true);
    provide('UrlManagement:beforePost', beforePost);

    // 站別相關
    const { getSiteList, siteOptions } = useSiteList();
    // 取站別列表
    onMounted(() => {
      getSiteList().then(() => {
        loading.value = false;
      });
    });

    // 基本設定(預設值)
    const basicDataDefault: BasicSetting = {
      buy: 'bbin',
      management: 'bbin',
      domainType: 'normal',
      highRisk: 'over',
      checkItem: '',
      websiteProviderPerm: false,
      websiteProvider: '',
      username: '',
      password: '',
      applyTime: '',
      finishTime: '',
    };
    const basicData = reactive(basicDataDefault);
    provide('UrlManagement:basicDataDefault', basicDataDefault);
    provide('UrlManagement:basicData', basicData);

    // 域名設定
    const urlList: Ref<ApplyDomain[]> = ref<ApplyDomain[]>([]);
    provide('UrlManagement:urlList', urlList);

    // 送出結果
    const result = reactive({
      id: 0,
      list: [] as CallbackUrlList[],
    });
    provide('UrlManagement:applyResult', result);

    return { t, loading, beforePost, siteOptions };
  },
});
</script>
