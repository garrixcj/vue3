<i18n src="@/languages/system_setting/url_management/index.json"></i18n>
<template lang="pug">
rd-drawer.site-information(
  v-model:visible="visible"
  :title="t('site_info')"
  :class="{ 'custom-empty-drawer': isNoData }"
  :no-fade="isNoData"
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
      rd-form-item(
        :label="t('site')"
        prop="site"
        inline
        size="small"
        required="required"
      )
        rd-select(
          v-model:value="drawerForm.site"
          quickSearch
          :selected-setting="customSelectedSetting"
          :popper-setting="popperSetting"
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
            span {{ current.label }}
            span [{{ current.option.code }}]
      //- 查詢
      rd-form-item
        rd-button(size="small" @click="search") {{ t('search') }}

  //- 主內容
  before-search-empty(v-if="isBeforeSearch" :label="t('start_search')")
  .drawer-body(v-if="!isBeforeSearch")
    //- 基本資料
    .drawer-body__category(v-if="!isNoData")
      span {{ t('basic_information') }}
    rd-grid-table(
      no-header
      :class="{ 'no-data-table': isNoData }"
      :columns="basicInformationColumns"
      :row="{ background: !isNoData ? 'grey' : '' }"
      :data-source="basicInformationData"
    )
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { isEmpty, values } from 'lodash';
import { defineComponent, inject, ref, reactive } from 'vue';
import RdDrawer from '@/components/custom/drawer/index.vue';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import RdGridTable from '@/components/custom/grid-table/index.vue';
import { useGetSiteListApi, useGetSiteDetailApi } from './list';

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
    const visible = inject('Visible:siteInfo', false);
    // 搜尋前
    const isBeforeSearch = ref(true);

    // 站別相關
    const { getSiteList, siteOptions, siteQuickSearch } = useGetSiteListApi();
    // 取的站別列表
    getSiteList().finally(() => {
      loading.value = false;
    });
    // 下拉寬度
    const customSelectedSetting = {
      minWidth: 240,
      maxWidth: 240,
    };
    // 下拉 popper 寬度
    const popperSetting = {
      width: 240,
    };

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
    const basicInformationData = ref<{ title: string; info: string }[]>([]);
    // 搜尋無資料
    const isNoData = ref(false);
    // 站別詳細相關
    const { siteDetail, getSingleSiteInfo } = useGetSiteDetailApi();
    // 點擊搜尋按鈕
    const search = () => {
      drawerRef.value.validate((validate: boolean) => {
        if (validate) {
          loading.value = true;
          isBeforeSearch.value = false;
          getSingleSiteInfo(drawerForm.site)
            .then(() => {
              isNoData.value = values(siteDetail).every(item => isEmpty(item));
              if (!isNoData.value) {
                basicInformationData.value = [
                  {
                    title: t('site'),
                    info: !isEmpty(siteDetail.siteName)
                      ? siteDetail.siteName
                      : '--',
                  },
                  {
                    title: t('prefix'),
                    info: !isEmpty(siteDetail.prefix)
                      ? siteDetail.prefix
                      : '--',
                  },
                  {
                    title: t('suffix'),
                    info: !isEmpty(siteDetail.suffix)
                      ? siteDetail.suffix
                      : '--',
                  },
                  {
                    title: t('env'),
                    info: !isEmpty(siteDetail.env) ? siteDetail.env : '--',
                  },
                  {
                    title: t('primary_domain'),
                    info: !isEmpty(siteDetail.primaryDomain)
                      ? siteDetail.primaryDomain
                      : '--',
                  },
                  {
                    title: t('remark'),
                    info: !isEmpty(siteDetail.remark)
                      ? siteDetail.remark
                      : '--',
                  },
                ];
              }
            })
            .finally(() => {
              loading.value = false;
            });
        }
      });
    };
    // 還原搜尋
    const resetSearch = () => {
      drawerRef.value.resetFields();
      isBeforeSearch.value = true;
    };

    return {
      t,
      visible,
      loading,
      isBeforeSearch,
      customSelectedSetting,
      popperSetting,
      siteOptions,
      siteQuickSearch,
      drawerRef,
      drawerForm,
      drawerRules,
      search,
      resetSearch,
      basicInformationColumns,
      basicInformationData,
      isNoData,
    };
  },
});
</script>

<style lang="scss" scoped>
.site-information {
  .site-search {
    margin-top: 15px;
  }

  .rd-select {
    :deep(.single__item) {
      @include flex-basic(space-between);
      width: 100%;
    }
  }

  .drawer-body {
    &__category {
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-size: 16px;
      color: $text-3;
      border-bottom: 1px $background-3 solid;
    }
  }
}
// 無資料時擴大畫面
.custom-empty-drawer {
  :deep(.el-scrollbar__view) {
    height: inherit;
    .drawer-body {
      height: 100%;
    }
  }
}
.no-data-table {
  display: flex;
  flex-direction: column;
  height: inherit;

  :deep(.rd-grid-table-empty) {
    flex-grow: 1;
    @include flex-basic(center);
  }
}
</style>
