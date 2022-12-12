<i18n src="@/languages/system_setting/url_management/common.json"></i18n>
<template lang="pug">
rd-button(type="default" @click="visible = !visible") {{ t('setting_example') }}
rd-drawer(
  v-model:visible="visible"
  :title="t('setting_example')"
  :width="650"
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

  rd-card
    template(#content)
      rd-collapse-card(
        v-for="(row, index) in collapseDataSource"
        :key="index"
        v-model:collapse="row.collapse"
        type="card"
        :disabled="!row.teaching && beforeSearch"
      )
        template(#title)
          span {{ row.title }}
        template(#content)
          //- 教學連結
          rd-button.custom-text(
            v-if="row.teaching"
            size="icon"
            text
            @click="openTeachingWindow(row.type)"
          )
            i.mdi.mdi-open-in-new
            span {{ row.content }}
          div(v-else)
            //- 複製
            rd-button(
              type="default"
              size="default"
              @click="notifyCopy(row.content)"
            )
              i.mdi.mdi-content-copy
              span {{ t('copy') }}
            //- 範例內容
            pre(v-html="row.content")

      //- 複製 Textarea
      textarea(
        ref="inputRef"
        style="opacity: 0; position: fixed; left: -999999px; top: -999999px"
      )
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { replace } from 'lodash';
import { type Ref, defineComponent, inject, ref, reactive } from 'vue';
import RdDrawer from '@/components/custom/drawer/index.vue';
import RdGridTable from '@/components/custom/grid-table/index.vue';
import RdCollapseCard from '@/components/custom/collapse-card/index.vue';
import { useCopy } from '@/components/utils/copy';
import { notify } from '@/components/utils/notification';
import type { SiteOption } from '../common/list';
import { url as urlAPI } from '@/api/domain';

export default defineComponent({
  name: 'SettingExample', // 網址管理 - 設定範例
  components: {
    RdDrawer,
    RdGridTable,
    RdCollapseCard,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const loading = ref(false);
    // 站別資訊開關
    const visible = ref(false);
    // 搜尋前
    const beforeSearch = ref(true);
    // 自定義快搜
    const customSearch = inject<object>('UrlManagement:customSearch');

    // 站別列表
    const siteOptions = inject('UrlManagement:siteList') as Ref<SiteOption[]>;

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

    // Table 欄位
    const collapseColumns = [
      { dataIndex: 'collapse', customRender: { slot: 'collapse' }, width: 40 },
      { dataIndex: 'title', customRender: { slot: 'title' } },
    ];

    const collapseDataSource = ref([
      {
        id: 2,
        collapse: false,
        teaching: false,
        type: '',
        title: t('domain_manages_the_client'),
        content: '',
      },
      {
        id: 3,
        collapse: false,
        teaching: false,
        type: '',
        title: t('domain_manages_the_client_blocking'),
        content: '',
      },
      {
        id: 6,
        collapse: false,
        teaching: false,
        type: '',
        title: t('domain_manages_the_agent'),
        content: '',
      },
      {
        id: 7,
        collapse: false,
        teaching: false,
        type: '',
        title: t('domain_manages_the_domain'),
        content: '',
      },
      {
        id: 9,
        collapse: false,
        teaching: false,
        type: '',
        title: t('company_manages_dns'),
        content: '',
      },
      {
        id: 8,
        collapse: false,
        teaching: false,
        type: '',
        title: t('company_manages_special_domain_name'),
        content: '',
      },
      {
        id: 98,
        collapse: false,
        teaching: true,
        type: 'txt',
        title: t('txt_teaching'),
        content: t('txt_teaching'),
      },
      {
        id: 99,
        collapse: false,
        teaching: true,
        type: 'name-server',
        title: t('name_server_teaching'),
        content: t('name_server_teaching'),
      },
    ]);
    const collapse = ref(false);

    // 點擊搜尋按鈕
    const search = () => {
      drawerRef.value.validate((validate: boolean) => {
        if (validate) {
          loading.value = true;
          beforeSearch.value = false;
          closedCollapse();
          urlAPI
            .getSingleSettingExampleTemplate(drawerForm.site)
            .then(response => {
              if (response.data.result) {
                collapseDataSource.value.forEach(item => {
                  const result = item;
                  if (typeof response.data.data[item.id] !== 'undefined') {
                    result.content = response.data.data[item.id];

                    // 設定範例模板樣式
                    result.content = setExampleTemplateStyle(result.content);
                  }
                });
              }
              loading.value = false;
            });
        }
      });
    };
    // 還原搜尋
    const resetSearch = () => {
      drawerRef.value.resetFields();
      closedCollapse();
      beforeSearch.value = true;
    };
    // 關閉收合
    const closedCollapse = () => {
      collapseDataSource.value.forEach(item => {
        const result = item;
        result.collapse = false;
      });
    };
    // 設定範例模板樣式
    const setExampleTemplateStyle = (content: string) => {
      const replaceData: { value: string; replaceValue: string }[] = [
        {
          value: 'example.com',
          replaceValue: '<font color=#22c2dc>example.com</font>',
        },
        { value: '(<pre>)', replaceValue: '' },
        { value: '(</pre>)', replaceValue: '' },
      ];

      let result = content;
      Object.keys(replaceData).forEach((item: string, key: number) => {
        result = replace(
          result,
          new RegExp(replaceData[key].value, 'g'),
          replaceData[key].replaceValue,
        );
      });
      return result;
    };

    // 另開教學視窗
    const openTeachingWindow = (type: string) => {
      window.open(`/v3/system/url-management/teaching/${type}`);
    };

    // 複製模板內容
    const { copy, inputRef } = useCopy();
    const notifyCopy = (content: string) => {
      copy(content);
      notify.success({ title: t('copy_success') });
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
      collapseColumns,
      collapseDataSource,
      collapse,
      openTeachingWindow,
      inputRef,
      notifyCopy,
    };
  },
});
</script>

<style lang="scss" scoped>
.site-search {
  @include space-vertical(15px);
}

.rd-card {
  background-color: $background-5;

  pre {
    word-wrap: break-word;
    white-space: pre-wrap;
  }
}

.custom-text {
  @include btn-underline;
}
</style>
