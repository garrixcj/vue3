<template lang="pug">
rd-card(no-padding)
  template(#header)
    .header
      //- 批次
      batch-mode(
        v-if="hasModify"
        v-model:visible="visible.batchMode"
        :count="selected.length"
        :disabled="list.length === 0"
        @change="clickBatchMode"
      )
        template(#operate)
          rd-button(
            text
            :disabled="!abolishableSelected.length"
            @click="initAbolish('multi', abolishableSelected)"
          ) {{ `${t('void')}(${abolishableSelected.length})` }}
      rd-divider(v-if="hasModify" direction="vertical")
      //- 自訂欄位
      rd-field-filter(
        size="small"
        :fields="fieldsData"
        :default-value="customOptions"
        @confirm="confirm"
      )
      rd-divider(direction="vertical")
      span {{ t('search_result_common', { num: total }) }}
      //- 匯出
      rd-button.push(
        v-if="exportPerm"
        type="default"
        size="small"
        @click="visible.export = true"
      ) {{ t('export') }}
  template(#content)
    rd-table.selection-table(
      ref="tableRef"
      border
      :data="list"
      :default-sort="{ prop: sort, order }"
      :row-class-name="selectAct.getRowClass"
      @selection-change="selectAct.change"
      @sort-change="$emit('sortChange', $event)"
    )
      //- 多選
      rd-table-column(
        v-if="visible.batchMode"
        type="selection"
        align="center"
        :resizable="false"
        width="40"
      )
      //- 序號
      rd-table-column(
        v-if="isDisplayedColumns('index')"
        :label="t('increment_number')"
        align="center"
        :resizable="false"
        width="100"
      )
        template(#default="scope")
          div {{ scope.$index + 1 + (currentPage - 1) * pageSize }}
      //- 站別
      rd-table-column(
        v-if="isDisplayedColumns('site')"
        :label="t('site')"
        prop="site_group"
        header-align="center"
        sortable="custom"
        :resizable="false"
      )
        template(#default="{ row }")
          span {{ siteList[row.site]?.label }}
      //- 後置碼
      rd-table-column(
        v-if="isDisplayedColumns('suffix')"
        :label="t('suffix')"
        prop="suffix"
        header-align="center"
        :resizable:label="t('suffix')"
        width="100"
      )
        template(#default="{ row }")
          span {{ `@${siteList[row.site]?.code}` }}
      //- 單號
      rd-table-column(
        v-if="isDisplayedColumns('ticketId')"
        :label="t('trans_number')"
        prop="id"
        header-align="center"
        :resizable="false"
        width="100"
      )
        template(#default="{ row }")
          rd-link(
            :href="`/v3/system_setting/url_management/detail/${row.id}`"
            target="_blank"
          ) {{ row.id }}
      //- 已完成 / 申請筆數
      rd-table-column(
        v-if="isDisplayedColumns('count')"
        :label="`${t('finished')} / ${t('application_number')}`"
        header-align="center"
        align="center"
        :resizable="false"
        width="200"
      )
        template(#default="{ row }")
          span {{ row.finishCount }}
          span.slash ／
          span {{ row.domainList.length }}
      //- 購買方式
      rd-table-column(
        v-if="isDisplayedColumns('buy')"
        :label="t('ways_to_purchase')"
        prop="buy"
        header-align="center"
        :resizable="false"
        width="100"
      )
        template(#default="{ row }")
          span {{ t(priceListDict[row.buy]) }}
      //- 管理權限
      rd-table-column(
        v-if="isDisplayedColumns('management')"
        :label="t('management_permission')"
        prop="management"
        header-align="center"
        :resizable="false"
        width="100"
      )
        template(#default="{ row }")
          span {{ t(priceListDict[row.management]) }}
      //- 申請日期
      rd-table-column(
        v-if="isDisplayedColumns('applyDate')"
        :label="t('application_date')"
        prop="created_at"
        header-align="center"
        sortable="custom"
        :resizable="false"
        width="180"
      )
        template(#default="{ row }")
          rd-format-timer(date-default="--" :date-time="row.applyAt")
      //- 完成日期
      rd-table-column(
        v-if="isDisplayedColumns('finishDate')"
        :label="t('finished_date')"
        prop="finished_at"
        header-align="center"
        sortable="custom"
        :resizable="false"
        width="180"
      )
        template(#default="{ row }")
          rd-format-timer(date-default="--" :date-time="row.finishAt")
      //- 進度
      rd-table-column(
        v-if="isDisplayedColumns('processe')"
        :label="t('processe')"
        prop="processe"
        header-align="center"
        min-width="100"
        :resizable="false"
      )
        template(#default="{ row }")
          .processe-column
            template(v-for="(processe, countKey) in progressCountKey")
              rd-tag.tag-margin(
                v-if="row[countKey] > 0"
                :type="progressListMap[processe].type"
                size="small"
              ) {{ `${t(progressListMap[processe].dict)}：${row[countKey]}` }}
      //- 狀態
      rd-table-column(
        v-if="isDisplayedColumns('status')"
        :label="t('status')"
        prop="status"
        header-align="center"
        align="center"
        :resizable="false"
        width="100"
      )
        template(#default="{ row }")
          rd-tag.tag-pill(
            :type="statusListMap[statusKeyMap[row.status]].type"
            size="small"
          )
            | {{ t(statusListMap[statusKeyMap[row.status]].dict) }}
      //- 操作
      rd-table-column(
        v-if="isDisplayedColumns('operating') && hasModify"
        :label="t('operating')"
        header-align="center"
        :resizable="false"
        width="100"
      )
        template(#default="{ row }")
          rd-button(
            text
            :disabled="!abolishable(row.status, row.buy, row.domainList)"
            @click="initAbolish('single', [row])"
          ) {{ t('void') }}
  template(v-if="total" #footer)
    rd-pagination(
      background
      no-total
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[10, 30, 50]"
      @update:current-page="$emit('update:current-page', $event)"
      @update:page-size="$emit('update:page-size', $event)"
    )
export-note(
  v-model:visible="visible.export"
  :params="exportParams"
  @confirm="exportData"
)
//- 作廢
abolish-dialog(
  v-model="visible.abolish"
  :action="abolishAction"
  :list="abolishList"
  @updateData="updateQuery(false)"
)
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  type PropType,
  computed,
  reactive,
  watch,
  inject,
} from 'vue';
import { useI18n } from 'vue-i18n';
import BatchMode from '@/components/custom/batch-mode/index.vue';
import RdFormatTimer from '@/components/custom/format-timer/date-time.vue';
import RdFieldFilter from '@/components/custom/field-filter/index.vue';
import { useInitCustomField } from '@/plugins/custom-field/custom-field';
import { getFields } from './fields';
import ExportNote from '@/plugins/export-note/index.vue';
import type {
  List,
  AbolishList,
  AbolishAction,
  SearchOptions,
} from './single-number-progress';
import { priceListDict } from '../common/estimate';
import { statusKeyMap, statusListMap, abolishable } from './status';
import { progressListMap } from './progress';
import AbolishDialog from './abolish-dialog.vue';
import type { SiteOption } from '../common/list';
import { useModifyAccess } from '@/plugins/access/modify';
import { useAccesses } from '@/plugins/access/view';
import urlAPI from '@/api/url';
import { notify } from '@/components/utils/notification';
import { setExportPermName } from '../common/export';

export default defineComponent({
  name: 'UrlManagementProgressList',
  components: {
    BatchMode,
    RdFormatTimer,
    RdFieldFilter,
    ExportNote,
    AbolishDialog,
  },
  props: {
    // 搜尋條件
    searchOptions: { type: Object as PropType<SearchOptions>, required: true },
    // 列表資料
    list: { type: Array as PropType<List[]>, required: true },
    // 站別列表 - 用於顯示用，因外層已撈過一次故直接傳
    siteOptions: { type: Array as PropType<SiteOption[]>, required: true },
    // 資料總數
    total: { type: Number, required: true },
    // 當前頁數
    currentPage: { type: Number, required: true },
    // 每頁幾筆
    pageSize: { type: Number, required: true },
    // 排序欄位
    sort: { type: String, required: true },
    // 順序
    order: { type: String, required: true },
  },
  emits: [
    'sortChange',
    'update:current-page',
    'update:page-size',
    'updateData',
  ],
  setup(props) {
    const { t } = useI18n({ useScope: 'parent' });
    // 是否有修改權限
    const { hasModify } = useModifyAccess('ApplicationProgress');
    // 取得在作廢後要動作的function
    const updateQuery = inject('UrlManagement:updateQuery') as Function;
    // 顯示
    const visible = reactive({
      // 匯出dialog
      export: false,
      // 作廢的dialog
      abolish: false,
      // 批次模式
      batchMode: false,
    });
    // table的ref
    const tableRef = ref();
    // 被選的列
    const selected = ref<List[]>([]);
    // 作廢的動作
    const abolishAction = ref<AbolishAction>('single');
    // 作廢的資料
    const abolishList = ref<AbolishList[]>([]);
    // 被選取的列裡可作廢的列
    const abolishableSelected = computed(() => {
      return selected.value.filter(obj =>
        abolishable(obj.status, obj.buy, obj.domainList),
      );
    });
    // 表格被選取或是異動時相關動作
    const selectAct = {
      // 當有被選取時觸發
      change: (val: List[]) => {
        selected.value = val;
      },
      // 清除已經選取的表格行
      clear: () => {
        tableRef.value.clearSelection();
      },
      // 用於判定該行是否被選取，並回傳不同的樣式(選中的要亮不一樣的顏色)
      getRowClass: ({ row }: { row: List }) =>
        selected.value.find(selectedRow => selectedRow.id === row.id)
          ? 'selected-row'
          : '',
    };
    // 點擊批次模式時觸發的動作
    const clickBatchMode = (status: boolean) => {
      // 當今天是關時，清除已經選的表格行
      if (!status) {
        selectAct.clear();
      }
    };

    // 監聽搜尋條件異動，當異動時關閉批次
    watch(
      () => props.list,
      () => {
        visible.batchMode = false;
        clickBatchMode(false);
      },
      { deep: true },
    );

    // 站別資料 - 轉換為用站別當key的資料
    const siteList = computed(() =>
      props.siteOptions.reduce((acc, obj) => {
        const result = acc;
        result[obj.value] = obj;

        return result;
      }, {} as Record<string, SiteOption>),
    );

    // 自訂欄位
    const { customOptions, fieldsData, isDisplayedColumns, confirm } =
      useInitCustomField(getFields(t));

    // 需要顯示進度數量的後端key與前端狀態對照
    const progressCountKey: Record<string, string> = {
      progressCount: 'processing',
      canNotBindCount: 'canNotBind',
      abolishCount: 'abolished',
      finishCount: 'finished',
    };

    // 作廢
    const initAbolish = (action: AbolishAction, rows: List[]) => {
      abolishAction.value = action;
      abolishList.value = rows.map(obj => ({
        id: obj.id,
        siteName: siteList.value[obj.site].label,
        suffix: `@${siteList.value[obj.site].code}`,
      }));
      visible.abolish = true;
    };

    // 判斷是否有 匯出 權限
    const exportPerm = useAccesses(['Downloads', 'ApplicationProgressExport']);

    // 匯出用參數
    const exportParams = {
      functionName: 'single_number_progress',
      tabName: 'single_number_progress',
    };
    // 匯出
    const exportData = (note: string) => {
      visible.export = false;

      const params = note
        ? { export_remark: note, ...props.searchOptions }
        : props.searchOptions;

      setExportPermName('ApplicationProgressExport');

      urlAPI.exportTicketList(params).then(response => {
        if (response.data.result) {
          notify.success({
            title: t('success'),
            message: t('generation_success'),
          });
        }

        setExportPermName('ApplicationProgress');
      });
    };

    return {
      t,
      tableRef,
      selectAct,
      customOptions,
      fieldsData,
      isDisplayedColumns,
      confirm,
      selected,
      clickBatchMode,
      priceListDict,
      progressCountKey,
      abolishable,
      abolishList,
      initAbolish,
      abolishAction,
      abolishableSelected,
      siteList,
      hasModify,
      statusKeyMap,
      statusListMap,
      progressListMap,
      visible,
      exportPerm,
      exportParams,
      exportData,
      updateQuery,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  @include flex-basic;
  width: 100%;
  .push {
    margin-left: auto;
  }
}
.selection-table {
  @include table-selected-row;
  .tag-pill {
    @include tag-border(true, true);
  }
  .slash {
    color: $text-4;
  }
  .processe-column {
    @include flex-basic;
    flex-wrap: wrap;
    gap: 5px;
    .tag-margin {
      @include space-multiline;
    }
  }
}
</style>
