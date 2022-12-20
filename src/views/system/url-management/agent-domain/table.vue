<template lang="pug">
rd-card(no-padding)
  template(#header)
    batch-mode(
      v-if="showBatchMode"
      v-model:visible="batchModuleData.visible"
      :count="batchModuleData.selected.length"
      :style="getBatchModuleWidth"
      :disabled="listData.length === 0"
      @change="clickBatchModule"
    )
      template(#operate)
        //- 申請憑證
        rd-button(
          v-if="hasApplySSLModifyPerm"
          type="default"
          size="small"
          text
          :disabled="batchApplySSLValue === 0"
          @click="openDialog(batchModuleData.selected, 'batchApplySSL')"
        )
          | {{ t('go_to_apply_ssl_certificate') }}({{ batchApplySSLValue }})
        //- 編輯備註
        rd-button(
          v-if="hasModifyPerm"
          type="default"
          size="small"
          text
          :disabled="batchModuleData.selected.length === 0"
          @click="openDialog(batchModuleData.selected, 'batchRemark')"
        )
          div {{ t('edit_remark') }}({{ batchModuleData.selected.length }})
    rd-divider(v-if="showBatchMode" direction="vertical")
    //- 自訂欄位
    rd-field-filter(
      size="small"
      :fields="fieldsData"
      :default-value="customOptions"
      @confirm="confirm"
    )
    rd-divider(direction="vertical")
    //- 搜尋結果
    span {{ t('search_result_common', { num: groupSeparator(`${listCondition.total}`) }) }}

    //- 匯出
    .export(v-if="hasExportPerm && listData.length > 0")
      rd-button(type="default" size="small" @click="exportVisible = true") {{ t('export') }}

  template(#content)
    //- 列表資料
    rd-table(
      ref="listRef"
      border
      :data="listData"
      :row-class-name="selectAct.getRowClass"
      :default-sort="{ prop: 'id', order: 'ascending' }"
      :max-height="800"
      :min-width="1248"
      @selection-change="selectAct.change"
      @sort-change="tableAct.sort"
    )
      rd-table-column(
        v-if="batchModuleData.visible"
        type="selection"
        align="center"
        :resizable="false"
        width="40"
      )
      //- 序號
      rd-table-column(
        v-if="isDisplayedColumns('id')"
        :label="t('increment_number')"
        header-align="center"
        align="center"
        prop="id"
        :resizable="false"
        width="60"
      )
        template(#default="{ row }")
          span {{ row.id + 1 }}
      //- 站別名稱
      rd-table-column(
        v-if="isDisplayedColumns('site')"
        :label="t('site')"
        header-align="center"
        prop="site"
        min-width="120"
        :resizable="false"
      )
        template(#default="{ row }")
          span {{ row.site.name }}
      //- 後置碼
      rd-table-column(
        v-if="isDisplayedColumns('suffix')"
        :label="t('suffix')"
        header-align="center"
        prop="suffix"
        :resizable="false"
        width="80"
      )
        template(#default="{ row }")
          span @{{ row.suffix }}
      //- 域名
      rd-table-column(
        v-if="isDisplayedColumns('domainName')"
        :label="t('domain_name')"
        header-align="center"
        prop="domainName"
        :resizable="false"
        width="185"
      )
      //- URL
      rd-table-column(
        v-if="isDisplayedColumns('url')"
        label="URL"
        header-align="center"
        prop="url"
        :resizable="false"
        width="185"
      )
        template(#default="{ row }")
          rd-link(:href="`http://${row.url}`" target="_blank") {{ row.url }}
      //- 網址狀態
      rd-table-column(
        v-if="isDisplayedColumns('urlStatus')"
        :label="t('url_status')"
        header-align="center"
        align="center"
        prop="urlStatus"
        :resizable="false"
        width="90"
      )
        template(#default="{ row }")
          rd-dropdown(
            :label="row.urlStatus.status ? t('normal') : t('abnormal')"
            size="small"
            :button-type="row.urlStatus.status ? 'success' : 'danger'"
          )
            template(#dropdown)
              rd-dropdown-menu
                rd-dropdown-item(
                  v-for="(item, key) in row.urlStatus.options"
                  :key="key"
                  new-window
                  command
                  :link="item.url"
                )
                  rd-badge(:type="item.type" is-dot)
                  span.dropdown-span(:class="{ 'url-color': item.url !== '' }") {{ item.label }}
      //- 異常狀態
      rd-table-column(
        v-if="isDisplayedColumns('abnormalState')"
        :label="t('abnormal_state')"
        header-align="center"
        prop="abnormalState"
        min-width="140"
        :resizable="false"
      )
        template(#default="{ row }")
          span(v-if="row.abnormalState.length > 0")
            rd-tag.tag-container(
              v-for="(item, index) in row.abnormalState"
              :key="index"
              :type="getAbnormalStateColor(item)"
              size="small"
            ) {{ t(`url_abnormal_state_tag_${item}`) }}
          span(v-else) --
      //- 服務項目
      rd-table-column(
        v-if="isDisplayedColumns('service')"
        :label="t('service_items')"
        header-align="center"
        prop="service"
        :resizable="false"
        width="105"
      )
        template(#default="{ row }")
          span(v-if="row.service.length > 0")
            div(v-for="(item, index) in row.service" :key="index") {{ t(`url_service_items_tag_${item}`) }}
          span(v-else) --
      //- 域名狀態
      rd-table-column(
        v-if="isDisplayedColumns('domainNameStatus')"
        :label="t('domain_name_status')"
        header-align="center"
        prop="domainNameStatus"
        :resizable="false"
        width="140"
      )
        template(#default="{ row }")
          span(v-if="row.domainNameStatus.length > 0")
            div(v-for="(item, index) in row.domainNameStatus" :key="index") {{ t(`domain_name_status_tag_${item}`) }}
          span(v-else) --
      //- 憑證狀態
      rd-table-column(
        v-if="isDisplayedColumns('sslStatus')"
        :label="t('ssl_status')"
        header-align="center"
        prop="sslStatus"
        :resizable="false"
        width="90"
      )
        template(#default="{ row }")
          span(v-if="row.sslStatus > 0") {{ t(`ssl_status_tag_${row.sslStatus}`) }}
          span(v-else) --
      //- IP
      rd-table-column(
        v-if="isDisplayedColumns('ip')"
        label="IP"
        header-align="center"
        prop="ip"
        :resizable="false"
        width="150"
      )
        template(#default="{ row }")
          span(v-if="row.ip !== ''") {{ row.ip }}
          span(v-else) --
      //- 域名到期日
      rd-table-column(
        v-if="isDisplayedColumns('automaticRenewalDate')"
        :label="t('domain_name_expiration_date')"
        header-align="center"
        prop="automaticRenewalDate"
        sortable
        :resizable="false"
        width="120"
      )
        template(#default="{ row }")
          rd-format-timer(
            wrap
            date-default="--"
            :date-time="row.automaticRenewalDate"
          )
      //- 系統檢測
      rd-table-column(
        v-if="isDisplayedColumns('systemDetection')"
        :label="t('system_detection')"
        header-align="center"
        prop="systemDetection"
        :resizable="false"
        width="170"
      )
        template(#default="{ row }")
          span(v-if="row.systemDetection !== ''") {{ row.systemDetection }}
          span(v-else) --
      //- 管理
      rd-table-column(
        v-if="isDisplayedColumns('manage')"
        :label="t('manage')"
        header-align="center"
        prop="manage"
        :resizable="false"
        width="95"
      )
        template(#default="{ row }")
          span(v-if="row.manage !== ''") {{ t(`manage_tag_${row.manage}`) }}
          span(v-else) --
      //- 上層指向
      rd-table-column(
        v-if="isDisplayedColumns('previousNode')"
        :label="t('previous_node')"
        header-align="center"
        prop="previousNode"
        :resizable="false"
        width="90"
      )
        template(#default="{ row }")
          span(v-if="row.previousNode") {{ t(`url_service_items_tag_${row.previousNode}`) }}
          span(v-else) --
      //- 備註
      rd-table-column(
        v-if="isDisplayedColumns('remark')"
        :label="t('remark')"
        header-align="center"
        prop="remark"
        :resizable="false"
        width="120"
      )
        template(#default="{ row }")
          .remark-content
            span(v-if="row.remark !== ''") {{ row.remark }}
            span(v-else) --
            //- 單一備註
            rd-button(
              v-if="hasModifyPerm"
              type=""
              size="small"
              text
              @click="openDialog([row], 'remark')"
            )
              i.mdi.mdi-pencil
      //- 操作
      rd-table-column(
        v-if="isDisplayedColumns('operating') && hasApplySSLModifyPerm"
        :label="t('operating')"
        header-align="center"
        prop="operating"
        :resizable="false"
        width="90"
      )
        template(#default="{ row }")
          //- 申請憑證
          rd-button(
            type="default"
            text
            :disabled="!row.applySSLEnable"
            @click="openDialog([row], 'applySSL')"
          ) {{ t('apply_certificate') }}
  template(#footer)
    rd-pagination(
      v-model:current-page="listCondition.page"
      background
      no-total
      :page-size="listCondition.size"
      :page-sizes="[1000, 1500, 2000]"
      :total="listCondition.total"
      @update:page-size="tableAct.size"
      @current-change="tableAct.page"
    )
//- 匯出
export-note(
  v-model:visible="exportVisible"
  :params="exportParams"
  @confirm="exportFiled"
)
//- 編輯備註(含批次操作)
edit-remark(
  v-model:visible="dialogSwitch.remark"
  :data="dialogForm"
  @update="tableAct.updateApi()"
)
//- 申請憑證
apply-ssl(v-model:visible="dialogSwitch.applySSL" :data="dialogForm")
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent, inject, ref, reactive, computed } from 'vue';
import RdFormatTimer from '@/components/custom/format-timer/date-time.vue';
import BatchMode from '@/components/custom/batch-mode/index.vue';
import RdFieldFilter from '@/components/custom/field-filter/index.vue';
import EditRemark from '../common/edit-remark.vue';
import ApplySsl from '../common/apply-ssl.vue';
import ExportNote from '@/plugins/export-note/index.vue';
import { ElTable } from 'element-plus';
import { groupSeparator } from '@/components/utils/format/amount';
import { useInitCustomField } from '@/plugins/custom-field/custom-field';
import { useModifyAccess } from '@/plugins/access/modify';
import { agentDomainNameFieldsInitial } from '../common/custom-fields';
import { useExportAccesses } from '../common/export';
import type {
  ListData,
  BatchModule,
  RemarkDomainNameForm,
} from '../common/type';
import type { ListCondition } from './list';

export default defineComponent({
  name: 'AgentDomainNameTable', // 網址管理 - 管端域名列表
  components: {
    RdFormatTimer,
    BatchMode,
    RdFieldFilter,
    ExportNote,
    EditRemark,
    ApplySsl,
  },
  emits: ['openDialog', 'change', 'export', 'sortChange', 'update'],
  setup(props, { emit, expose }) {
    const { t } = useI18n({ useScope: 'parent' });

    // 判斷是否有修改權限
    const { hasModify: hasModifyPerm } = useModifyAccess('AgentUrl');
    // 判斷是否申請憑證修改權限
    const { hasModify: hasApplySSLModifyPerm } =
      useModifyAccess('ApplyCertificate');

    // 原始列表資料
    const listData = inject('AgentDomainName:listData') as ListData[];
    const listRef = ref<InstanceType<typeof ElTable>>();
    // 取得異常狀態色系
    const getAbnormalStateColor = inject(
      'UrlManagement:getAbnormalStateColor',
    ) as Function;
    const listCondition = inject(
      'AgentDomainName:listCondition',
    ) as ListCondition;

    // 批次模組資料
    const batchModuleData: BatchModule = reactive({
      visible: false,
      selected: [],
    });
    // 批次可申請憑證數量
    const batchApplySSLValue = computed(() => {
      return batchModuleData.selected.filter(item => item.applySSLEnable)
        .length;
    });
    // 顯示批次模組
    const showBatchMode = computed(() => {
      return hasModifyPerm.value || hasApplySSLModifyPerm.value;
    });
    // 取得批次模組最小寬度
    const getBatchModuleWidth = computed(() => {
      if (batchModuleData.visible) {
        return { 'min-width': hasApplySSLModifyPerm.value ? '440px' : '305px' };
      }
      return {};
    });

    const selectAct = {
      change: (val: ListData[]) => {
        batchModuleData.selected = val;
      },
      clear: () => {
        listRef.value?.clearSelection();
        batchModuleData.visible = false;
        batchModuleData.selected = [];
      },
      getRowClass: ({ row }: { row: ListData }) =>
        batchModuleData.selected.find(selectedRow => selectedRow.id === row.id)
          ? 'selected-row'
          : '',
    };
    // 監聽批次模式開啟 or 關閉
    const clickBatchModule = (status: boolean) => {
      if (!status) {
        selectAct.clear();
      }
    };

    // table 動作
    const tableAct = {
      page: (value: number) => {
        listCondition.page = value;
        emit('change');
      },
      size: (value: number) => {
        listCondition.page = 1;
        listCondition.size = value;
        emit('change');
      },
      sort: ({
        prop,
        order,
      }: {
        order: 'ascending' | 'descending' | null;
        prop: 'automaticRenewalDate';
      }) => {
        emit('sortChange', prop, order);
      },
      clear: () => {
        listCondition.sort = 'id';
        listCondition.order = 'asc';
        listRef.value?.clearSort();
      },
      updateApi: () => {
        emit('update', true);
      },
    };

    // 開關
    const dialogSwitch = reactive({
      applySSL: false,
      remark: false,
    });
    // 表單資料
    const dialogForm = reactive({
      action: 'single', // 操作模式
      site: '', // 站別
      siteName: '', // 站別名稱
      siteType: 2, // 域名端口(1[客端域名]、2[管端域名])
      suffix: '', // 後置碼
      domainNameList: [] as RemarkDomainNameForm[], // 域名列表
      remark: '', // 備註
    });
    // 開啟 Dialog
    const openDialog = (data: ListData[], action: string) => {
      // 編輯備註
      if (action === 'remark') {
        dialogSwitch.remark = true;
        dialogForm.action = 'single';
        dialogForm.remark = data[0].remark;
      }
      // 批次編輯備註
      if (action === 'batchRemark') {
        dialogSwitch.remark = true;
        dialogForm.action = 'batch';
        dialogForm.remark = '';
      }
      // 申請憑證
      if (action === 'applySSL') {
        dialogForm.action = 'single';
        dialogSwitch.applySSL = true;
        dialogForm.siteName = data[0].site.name;
        dialogForm.suffix = data[0].suffix;
      }
      // 批次申請憑證
      if (action === 'batchApplySSL') {
        dialogForm.action = 'batch';
        dialogSwitch.applySSL = true;
      }
      // 取得域名列表
      dialogForm.domainNameList = data.map(item => {
        const result = {
          site: item.site.group,
          siteName: item.site.name,
          suffix: item.suffix,
          domainName: item.domainName,
          applySSLEnable: item.applySSLEnable,
          remark: item.remark,
        };
        return result;
      });
    };

    // 自訂欄位
    const { customOptions, fieldsData, isDisplayedColumns, confirm } =
      useInitCustomField(
        agentDomainNameFieldsInitial(t, hasApplySSLModifyPerm.value),
      );

    // 匯出相關
    const hasExportPerm = useExportAccesses('AgentUrlExport');
    const exportVisible = ref(false);
    const exportParams = {
      functionName: 'url_management',
      tabName: 'agent_url',
    } as const;
    // 執行匯出
    const exportFiled = (note: string) => {
      exportVisible.value = false;
      emit('export', note);
    };

    // 重置捲軸高度
    const scrollTo = () => {
      listRef.value?.setScrollTop(0);
      listRef.value?.setScrollLeft(0);
    };
    // 封裝外部使用功能
    expose({
      scrollTo,
      sortClear: tableAct.clear,
      selectClear: selectAct.clear,
    });

    return {
      t,
      // API 資料
      listRef,
      listData,
      listCondition,
      selectAct,
      groupSeparator,
      getAbnormalStateColor,
      tableAct,
      // Dialog 共用
      openDialog,
      dialogForm,
      dialogSwitch,
      // 批次模式
      batchModuleData,
      clickBatchModule,
      batchApplySSLValue,
      showBatchMode,
      getBatchModuleWidth,
      // 自訂欄位
      customOptions,
      fieldsData,
      isDisplayedColumns,
      confirm,
      // 匯出
      exportVisible,
      exportParams,
      hasExportPerm,
      exportFiled,
      // 權限
      hasModifyPerm,
      hasApplySSLModifyPerm,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  @include flex-basic();
  .export {
    margin-left: auto;
  }
}
.tag-container {
  @include space-multiline(5px);
  margin-bottom: 5px;
}
.remark-content {
  @include flex-basic();
  span {
    margin-right: auto;
  }
}
.dropdown-span {
  margin-left: 5px;
}
.url-color {
  color: $primary-2;
}
</style>
