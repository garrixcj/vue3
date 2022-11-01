<i18n src="@/languages/system_setting/url_management/index.json"></i18n>
<template lang="pug">
.site-information
  rd-button(type="default" size="small" @click="visible = !visible") {{ t('site_info') }}
  rd-drawer(
    v-model:visible="visible"
    :title="t('site_info')"
    :loading="loading"
    @closed="resetSearch"
  )
    template(#header)
      rd-form.site-search(
        ref="drawerRef"
        inline
        :model="drawerForm"
        :rules="drawerRules"
      )
        //- 站別
        rd-form-item(:label="t('site')" prop="site" inline size="small")
          rd-select(
            v-model:value="drawerForm.site"
            :quick-search="customSearch"
            :selected-setting="{ maxWidth: 240 }"
            :popper-setting="{ width: 'auto' }"
          )
            rd-option(
              v-for="(option, index) in siteOptions"
              :key="index"
              :value="option.value"
              :label="option.label"
              :option="option"
            )
              template(#suffix)
                | {{ `[ ${option.code} ]` }}
            template(#selected="{ current }")
              | {{ `${current.label} [${current.option.code}]` }}
        //- 查詢
        rd-form-item
          rd-button(size="small" @click="search") {{ t('search') }}

    //- 主內容
    before-search-empty(v-if="beforeSearch" :label="t('start_search')")
    .drawer-body(v-else)
      //- 基本資料
      .drawer-body__category
        span {{ t('basic_information') }}
      rd-divider
      rd-grid-table(
        no-header
        :columns="basicInformationColumns"
        :row="{ size: 'small' }"
        :data-source="basicInformationData"
      )
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { isEmpty, keys } from 'lodash';
import { defineComponent, inject, ref, reactive } from 'vue';
import RdDrawer from '@/components/custom/drawer/index.vue';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import RdGridTable from '@/components/custom/grid-table/index.vue';
import { useSiteList } from './list';
import { type SiteDetail, useSiteDetail } from './detail';

export default defineComponent({
  name: 'SiteInformation', // 網址管理 - 站別資訊
  components: {
    RdDrawer,
    BeforeSearchEmpty,
    RdGridTable,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const loading = ref(true);
    // 站別資訊開關
    const visible = ref(false);
    // 搜尋前
    const beforeSearch = ref(true);
    // 自定義快搜
    const customSearch = inject('UrlManagement:customSearch') as Function;

    // 站別相關
    const { getSiteList, siteOptions } = useSiteList();
    // 取的站別列表
    getSiteList().then(() => {
      loading.value = false;
    });

    // 表單 Ref
    const drawerRef = ref();
    // 表單
    const drawerForm = reactive({
      site: '',
    });
    // 驗證規則
    const drawerRules = reactive({
      site: [{ required: true, message: t('not_null'), trigger: 'change' }],
    });

    // 基本設定 - Table 欄位
    const basicInformationColumns = [
      { dataIndex: 'title', width: 120 },
      { dataIndex: 'info' },
    ];
    const basicInformationData = ref<
      { title: string | unknown; info: string | unknown }[]
    >([]);
    // 站別詳細相關
    const { siteDetail, getSingleSiteInfo } = useSiteDetail();
    const basicInformationField: Record<SiteDetail, string> = {
      siteName: t('site'),
      prefix: t('prefix'),
      suffix: t('suffix'),
      env: t('env'),
      primaryDomain: t('primary_domain'),
      remark: t('remark'),
    };
    // 點擊搜尋按鈕
    const search = () => {
      drawerRef.value.validate((validate: boolean) => {
        if (validate) {
          loading.value = true;
          beforeSearch.value = false;
          getSingleSiteInfo(drawerForm.site).then(() => {
            basicInformationData.value = (
              keys(basicInformationField) as SiteDetail[]
            ).map((key: SiteDetail) => {
              const result = {
                title: basicInformationField[key],
                info: !isEmpty(siteDetail[key]) ? siteDetail[key] : '--',
              };
              return result;
            });
            loading.value = false;
          });
        }
      });
    };
    // 還原搜尋
    const resetSearch = () => {
      drawerRef.value.resetFields();
      beforeSearch.value = true;
    };

    return {
      t,
      visible,
      loading,
      beforeSearch,
      siteOptions,
      customSearch,
      drawerRef,
      drawerForm,
      drawerRules,
      search,
      resetSearch,
      basicInformationColumns,
      basicInformationData,
    };
  },
});
</script>

<style lang="scss" scoped>
.site-information {
  .site-search {
    @include space-vertical(15px);
  }

  .drawer-body {
    @include divider-margin(10px, 10px);

    &__category {
      font-size: 16px;
      color: $text-3;
    }
  }
}
</style>
