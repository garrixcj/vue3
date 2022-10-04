<i18n
  src="@/languages/user/accounts_structure_grouping/not_logged_in_list.json"
></i18n>
<template lang="pug">
.not-logged-in-list
  rd-information(is-open)
    ul
      li {{ t('not_logged_in_list_info_1') }}
      ul.none-node
        li {{ t('not_logged_in_list_info_6') }}
      li {{ t('not_logged_in_list_info_2') }}
      ul.none-node
        li {{ t('not_logged_in_list_info_7') }}
      li {{ t('not_logged_in_list_info_3') }}
      li {{ t('not_logged_in_list_info_4') }}
      li {{ t('not_logged_in_list_info_5') }}
  .search-bar
    rd-form(ref="formRef" inline :model="form" :rules="rules")
      rd-form-item(:label="t('hall')" prop="domain")
        domain-selector(v-model:value="form.domain" quick-search)
      rd-form-item(prop="startDateTime")
        template(#label)
          span {{ t('not_logged_in_range') }}
          .search-bar__tooltip
            rd-tooltip(placement="top")
              i.mdi.mdi-information
              template(#content)
                | {{ t('not_logged_in_range_info') }}
        rd-date-picker(
          v-model="form.startDateTime"
          type="datetime"
          :placeholder="t('select_datetime')"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        )
        span.form-item-date__info ~ {{ t('now_time') }}
      rd-form-item
        rd-button(type="search" size="large" @click="search")
          i.mdi.mdi-magnify
          span {{ t('search') }}
        rd-button(
          v-if="hasExportPerm"
          type="primary"
          size="large"
          @click="initExport"
        ) {{ t('export') }}
  table-list(v-show="showTable" :tableData="tableData" :dateRange="dateRange")
  export-note(
    v-model:visible="exportVisible"
    :params="exportParams"
    @confirm="exportFiled"
  )
</template>

<script lang="ts">
import { defineComponent, ref, reactive, inject, provide, readonly } from 'vue';
import { useI18n } from 'vue-i18n';
import { TabRouteWatch, QuerySetting } from '@/components/utils/route-watch';
import { notify } from '@/components/utils/notification';
import DomainSelector from '@/plugins/domain-selector/index.vue';
import ExportNote from '@/plugins/export-note/index.vue';
import TableList from './table.vue';
import type { DetailListFormType } from './type';
import { useGetDayCountGroupApi } from './table-data';
import { useExport } from './export';

export default defineComponent({
  name: 'NotLoggedInList', // 未登入會員名單
  components: {
    DomainSelector,
    TableList,
    ExportNote,
  },
  setup() {
    // 預設載入
    const setLoading = inject('AccountsStructureGroup:setLoading') as Function;
    const { t } = useI18n({ useScope: 'local' });

    // 匯出相關
    const {
      visible: exportVisible,
      params: exportParams,
      toggleDialog,
      initExport,
      hasExportPerm,
      exportMembersLastLoginGroup,
    } = useExport();

    // 執行匯出
    const exportFiled = (note: string) => {
      if (!checkDomain()) {
        return;
      }
      toggleDialog(false);
      setLoading(true);
      exportMembersLastLoginGroup(form, note).then(
        (resp: { data: { result: boolean } }) => {
          setLoading(false);
          if (resp.data.result) {
            notify.success({
              title: t('success'),
              message: t('generation_success'),
            });
          }
        },
      );
    };

    // 搜尋相關
    const { tableData, dateRange, getMembersLastLoginGroup } =
      useGetDayCountGroupApi();
    const showTable = ref(false);
    const form = reactive({
      domain: '',
      startDateTime: '',
    } as DetailListFormType);
    provide('AccountsStructureGroup:formSearchValue', readonly(form));

    // 驗證規則
    const rules = reactive({
      domain: [
        { required: true, message: t('must_not_null'), trigger: 'change' },
      ],
    });
    const formRef = ref();

    // 點擊觸發驗證與搜尋
    const search = () => {
      formRef.value.validate((validate: boolean) => {
        if (validate) {
          watcher.queryRoute(querySet.getQuery());
        }
      });
    };

    // 驗證必帶欄位
    const checkDomain = () => {
      if (!form.domain) {
        notify.error(t('select_domain'));
        return false;
      }

      return true;
    };

    //觸發搜尋
    const searchData = () => {
      if (!checkDomain()) {
        return;
      }
      setLoading(true);
      getMembersLastLoginGroup(form).then(() => {
        showTable.value = true;
        setLoading(false);
      });
    };

    // route相關
    const querySet = new QuerySetting([
      {
        key: 'domain',
        get: () => form.domain,
        set: (val: number) => {
          form.domain = val;
        },
        default: '',
        number: true,
      },
      // 未登入起始時間
      {
        key: 'start_date_time',
        get: () => form.startDateTime,
        set: (val: string) => {
          form.startDateTime = val;
        },
        filter: () => form.startDateTime !== '',
        optional: true,
      },
    ]);

    // 監聽路由異動觸發搜尋
    const watcher = new TabRouteWatch('notLoggedInList');
    watcher.setWatcher(() => {
      querySet.setField();
      searchData();
    });

    return {
      t,
      form,
      rules,
      formRef,
      tableData,
      dateRange,
      showTable,
      exportVisible,
      exportParams,
      search,
      initExport,
      exportFiled,
      hasExportPerm,
    };
  },
});
</script>

<style lang="scss" scoped>
.not-logged-in-list {
  .form-item-date__info {
    margin-left: 5px;
  }
  .search-bar__tooltip {
    margin: 0 5px;
    color: $text-3;
  }
}
</style>
