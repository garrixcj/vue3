<template lang="pug">
rd-card(v-loading="listCondition.loading" no-padding)
  template(#header)
    .header
      .header__prefix
        batch-mode(
          v-if="showBatchMode"
          v-model:visible="batchModuleData.visible"
          :count="batchModuleData.selected.length"
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
              v-if="hasCustomerUrlModifyPerm"
              type="default"
              size="small"
              text
              :disabled="batchModuleData.selected.length === 0"
              @click="openDialog(batchModuleData.selected, 'batchRemark')"
            )
              div {{ t('edit_remark') }}({{ batchModuleData.selected.length }})
        rd-divider(v-if="showUpdateDNS" direction="vertical")
        //- 更新DNS資訊
        rd-button(
          v-if="showUpdateDNS"
          type="default"
          size="small"
          @click="dialogSwitch.updateDNS = true"
        )
          span {{ t('update_dns_info') }}
          //- ｉ提示訊息
          rd-tooltip(effect="dark" placement="top")
            template(#content)
              div {{ t('update_dns_info_msg_1') }}
              div {{ t('update_dns_info_msg_2') }}
            i.mdi.mdi-information.tooltip-info
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

      .header__suffix
        //- 列表角度
        rd-status-button(
          v-for="(item, key) in listAnglesOptions"
          :key="key"
          :type="item.type"
          :value="listAngleTotalData[item.value]"
          :label="item.label"
          min-width="140"
          :active="item.value === listCondition.formAngle"
          @click="setListAngle(item.value)"
        )
          //- 全部域名
          template(v-if="item.value === 'all'" #label)
            span.status-span {{ t('all_domain_name') }}
            rd-tooltip(effect="dark" placement="top")
              template(#content)
                div {{ t('all_domain_name_tooltip_info') }}
              i.mdi.mdi-information.tooltip-info
        //- 其他列表角度
        .other-options(v-if="showCheckNoDomainNameAngleBtn")
          rd-divider(direction="vertical")
          rd-status-button(
            v-for="(item, key) in listAnglesOtherOptions"
            :key="key"
            :type="item.type"
            :value="listAngleTotalData[item.value]"
            :label="item.label"
            min-width="140"
            :active="item.value === listCondition.formAngle"
            @click="setListAngle(item.value)"
          )
        //- 匯出
        .export(v-if="hasExportPerm && listData.length > 0")
          rd-divider(direction="vertical")
          rd-button(type="default" size="small" @click="checkExport") {{ t('export') }}

  template(#content)
    //- 查無域名列表
    rd-table(
      v-if="isNoDomainNameAngle"
      border
      :data="checkNoDomainNameList"
      :max-height="800"
    )
      //- 序號
      rd-table-column(
        :label="t('increment_number')"
        header-align="center"
        align="center"
        prop="id"
        :resizable="false"
        width="60"
      )
      //- 域名
      rd-table-column(
        :label="t('domain_name')"
        header-align="center"
        prop="domainName"
        :resizable="false"
      )

    //- 列表資料
    rd-table(
      v-else
      ref="listRef"
      border
      :data="listData"
      :row-class-name="selectAct.getRowClass"
      :default-sort="{ prop: 'id', order: 'ascending' }"
      :max-height="800"
      :min-width="1248"
      @selection-change="selectAct.change"
      @sort-change="sortAct.change"
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
        template(#default="{ row }")
          rd-link(:href="`http://${row.domainName}`" target="_blank") {{ row.domainName }}
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
      //- 最近異常日
      rd-table-column(
        v-if="isDisplayedColumns('abnormalDate')"
        :label="t('recent_abnormal_date')"
        header-align="center"
        prop="abnormalDate"
        sortable
        :resizable="false"
        width="120"
      )
        template(#default="{ row }")
          rd-format-timer(
            v-if="row.abnormalDate !== ''"
            :date-default="row.abnormalDate"
          )
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
            v-if="row.automaticRenewalDate !== ''"
            wrap
            :date-time="row.automaticRenewalDate"
          )
          span(v-else) --
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
              v-if="hasCustomerUrlModifyPerm"
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
      @update:page-size="paginationAct.pageSizeChange"
      @current-change="paginationAct.pageChange"
    )
//- 匯出
export-note(
  v-model:visible="exportVisible"
  :params="exportParams"
  @confirm="exportFiled"
)
//- 編輯備註(含批次操作)
edit-remark(v-model:visible="dialogSwitch.remark" :data="dialogForm")
//- 申請憑證
apply-ssl(v-model:visible="dialogSwitch.applySSL" :data="dialogForm")
//- 更新DNS資訊
rd-dialog(
  v-model="dialogSwitch.updateDNS"
  :title="t('update_dns_info')"
  :close-on-click-modal="false"
  width="480px"
)
  div {{ t('update_dns_tip_1', { num: 5 }) }}
  div {{ t('update_dns_tip_2') }}
  template(#footer)
    rd-button(type="secondary" @click="dialogSwitch.updateDNS = false") {{ t('cancel') }}
    rd-button(type="primary" @click="updateDNS") {{ t('confirm') }}
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import {
  type Ref,
  defineComponent,
  inject,
  ref,
  reactive,
  computed,
} from 'vue';
import { useLoadingStore } from '@/stores/loading';
import RdStatusButton from '@/components/custom/status-button/index.vue';
import RdFormatTimer from '@/components/custom/format-timer/date-time.vue';
import BatchMode from '@/components/custom/batch-mode/index.vue';
import RdFieldFilter from '@/components/custom/field-filter/index.vue';
import ExportNote from '@/plugins/export-note/index.vue';
import EditRemark from '../common/edit-remark.vue';
import ApplySsl from '../common/apply-ssl.vue';
import { ElTable } from 'element-plus';
import amount from '@/components/utils/format/amount';
import { notify } from '@/components/utils/notification';
import { useInitCustomField } from '@/plugins/custom-field/custom-field';
import { useModifyAccess } from '@/plugins/access/modify';
import { customerDomainFieldsInitial } from '../common/custom-fields';
import { useExport, getExportPerm } from '../common/export';
import type { FormType } from '../common/search';
import type {
  ListData,
  BatchModule,
  RemarkDomainNameForm,
} from '../common/type';
import type { CheckNoDomainNameList, ListCondition } from './list';
import { url as urlAPI } from '@/api/domain';

type ListAngles = 'all' | 'normal' | 'abnormal' | 'noDomainName';

type ListAnglesOptions = {
  label: string;
  value: ListAngles;
  type: 'default' | 'danger';
};

export default defineComponent({
  name: 'CustomerDomainTable', // 網址管理 - 客端域名列表
  components: {
    RdStatusButton,
    RdFormatTimer,
    BatchMode,
    RdFieldFilter,
    ExportNote,
    EditRemark,
    ApplySsl,
  },
  emits: ['openDialog', 'change', 'export', 'sortChange'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'parent' });
    const loadingStore = useLoadingStore();
    // 數值相關格式轉換
    const { groupSeparator } = amount;

    // 判斷是否客端域名修改權限
    const hasCustomerUrlModifyPerm = useModifyAccess('CustomerUrl').hasModify;
    // 判斷是否申請憑證修改權限
    const hasApplySSLModifyPerm = useModifyAccess('ApplyCertificate').hasModify;

    // 基本搜尋條件
    const basicSearchForm = inject(
      'CustomerDomain:basicSearchForm',
    ) as FormType;
    // 原始列表資料
    const listData = inject('CustomerDomain:listData') as ListData[];
    // 查無域名資料
    const checkNoDomainNameList = inject(
      'CustomerDomain:checkNoDomainNameList',
    ) as Ref<CheckNoDomainNameList[]>;
    // 取得異常狀態色系
    const getAbnormalStateColor = inject(
      'UrlManagement:getAbnormalStateColor',
    ) as Function;

    const listRef = ref<InstanceType<typeof ElTable>>();
    const selectAct = {
      change: (val: ListData[]) => {
        batchModuleData.selected = val;
      },
      clear: () => {
        listRef.value?.clearSelection();
      },
      getRowClass: ({ row }: { row: ListData }) =>
        batchModuleData.selected.find(selectedRow => selectedRow.id === row.id)
          ? 'selected-row'
          : '',
    };
    const sortAct = {
      change: ({
        prop,
        order,
      }: {
        order: 'ascending' | 'descending' | null;
        prop: 'abnormalDate' | 'automaticRenewalDate';
      }) => {
        emit('sortChange', prop, order);
      },
      clear: () => {
        listCondition.sort = 'id';
        listCondition.order = 'asc';
        listRef.value?.clearSort();
      },
    };

    const listCondition = inject(
      'CustomerDomain:listCondition',
    ) as ListCondition;
    // 列表角度總數資料
    const listAngleTotalData = inject(
      'CustomerDomain:listAngleTotalData',
    ) as Record<ListAngles, number>;
    // 列表角度選項
    const listAnglesOptions = ref<ListAnglesOptions[]>([
      { label: t('all_domain_name'), value: 'all', type: 'default' },
      { label: t('normal'), value: 'normal', type: 'default' },
      { label: t('abnormal'), value: 'abnormal', type: 'danger' },
    ]);
    // 列表角度其他選項
    const listAnglesOtherOptions = ref<ListAnglesOptions[]>([
      {
        label: t('check_no_domain_name'),
        value: 'noDomainName',
        type: 'default',
      },
    ]);
    // 設定列表角度
    const setListAngle = (value: ListAngles) => {
      listCondition.page = 1;
      sortAct.clear();
      listCondition.total = listAngleTotalData[value];
      listCondition.formAngle = value;
      change();
    };
    // 顯示查無域名
    const isNoDomainNameAngle = computed(() => {
      return (
        listCondition.formAngle === 'noDomainName' &&
        checkNoDomainNameList.value.length > 0
      );
    });
    // 顯示查無域名角度的按鈕
    const showCheckNoDomainNameAngleBtn = computed(() => {
      return (
        basicSearchForm.type === 'domainName' &&
        basicSearchForm.domain > 0 &&
        basicSearchForm.multipleDomains.length > 1
      );
    });

    // 分頁
    const paginationAct = {
      pageChange: (value: number) => {
        listCondition.page = value;
        change();
      },
      pageSizeChange: (value: number) => {
        listCondition.page = 1;
        listCondition.size = value;
        change();
      },
    };

    // 更動 Table 資料
    const change = () => {
      emit('change');
    };

    // 開關
    const dialogSwitch = reactive({
      applySSL: false,
      updateDNS: false,
      remark: false,
    });
    // 表單資料
    const dialogForm = reactive({
      action: 'single', // 操作模式
      site: '', // 站別
      siteName: '', // 站別名稱
      siteType: 1, // 域名端口(1[客端域名]、2[管端域名])
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
    // 顯示更新DNS資訊Btn
    const showUpdateDNS = computed(() => {
      return (
        hasCustomerUrlModifyPerm.value &&
        !isNoDomainNameAngle.value &&
        basicSearchForm.type === 'site'
      );
    });
    // 更新 DNS 資料
    const updateDNS = () => {
      dialogSwitch.updateDNS = false;
      loadingStore.axios = true;
      return urlAPI.updateDNS(basicSearchForm.site).then(resp => {
        if (resp.data.result) {
          notify.success();
        }
        loadingStore.axios = false;
      });
    };

    // 批次模組資料
    const batchModuleData: BatchModule = reactive({
      visible: false,
      selected: [],
    });
    // 監聽批次模式開啟 or 關閉
    const clickBatchModule = (status: boolean) => {
      if (!status) {
        selectAct.clear();
      }
    };
    // 批次可申請憑證數量
    const batchApplySSLValue = computed(() => {
      return batchModuleData.selected.filter(item => item.applySSLEnable)
        .length;
    });
    // 顯示批次模組
    const showBatchMode = computed(() => {
      return (
        (hasCustomerUrlModifyPerm.value || hasApplySSLModifyPerm.value) &&
        !isNoDomainNameAngle.value
      );
    });

    // 自訂欄位
    const { customOptions, fieldsData, isDisplayedColumns, confirm } =
      useInitCustomField(customerDomainFieldsInitial(t));

    // 匯出相關
    const hasExportPerm = getExportPerm('CustomerUrlExport');
    const {
      visible: exportVisible,
      params: exportParams,
      toggleDialog,
      initExport,
    } = useExport();
    // 點擊觸發匯出初始設定
    const checkExport = () => {
      initExport();
    };
    // 執行匯出
    const exportFiled = (note: string) => {
      toggleDialog(false);
      emit('export', note);
    };

    return {
      t,
      // API 資料
      listRef,
      listData,
      listCondition,
      checkNoDomainNameList,
      selectAct,
      groupSeparator,
      getAbnormalStateColor,
      // 切換角度
      listAngleTotalData,
      isNoDomainNameAngle,
      listAnglesOptions,
      listAnglesOtherOptions,
      setListAngle,
      showCheckNoDomainNameAngleBtn,
      paginationAct,
      sortAct,
      // Dialog 共用
      openDialog,
      dialogForm,
      dialogSwitch,
      updateDNS,
      showUpdateDNS,
      // 批次模式
      batchModuleData,
      clickBatchModule,
      batchApplySSLValue,
      showBatchMode,
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
      checkExport,
      // 權限
      hasCustomerUrlModifyPerm,
      hasApplySSLModifyPerm,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  @include flex-basic(space-between);
  width: 100%;

  &__prefix {
    @include flex-basic;
  }

  &__suffix {
    @include flex-basic;

    .status-span {
      margin-right: 5px;
    }
    .other-options {
      min-width: 160px;
    }
    .export {
      min-width: 65px;
    }
  }
}
.tag-container {
  margin-bottom: 5px;

  &:not(:last-child) {
    margin-right: 5px;
  }
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
