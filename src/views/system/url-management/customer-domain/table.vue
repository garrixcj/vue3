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
    span.suffix {{ t('search_result_common', { num: groupSeparator(`${listCondition.total}`) }) }}

    //- 列表角度
    rd-status-button(
      v-for="(item, key) in listAnglesOptions"
      :key="key"
      :type="item.type"
      :value="listAngleTotalData[item.key]"
      :label="item.label"
      min-width="140"
      :active="item.value === listCondition.formAngle"
      @click="setListAngle(item.key, item.value)"
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
        :value="listAngleTotalData[item.key]"
        :label="item.label"
        min-width="140"
        :active="item.value === listCondition.formAngle"
        @click="setListAngle(item.key, item.value)"
      )
    //- 匯出
    .export(
      v-if="(hasExportPerm && listData.length > 0) || unknownDomainNameList.length > 0"
    )
      rd-divider(direction="vertical")
      rd-button(type="default" size="small" @click="exportVisible = true") {{ t('export') }}

  template(#content)
    //- 查無域名列表
    rd-table(
      v-if="isNoDomainNameAngle"
      border
      :data="unknownDomainNameList"
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
        template(#default="{ row }")
          span {{ row.id + 1 }}
      //- 域名
      rd-table-column(
        :label="t('domain_name')"
        header-align="center"
        prop="domainName"
        :resizable="false"
      )

    //- 列表資料
    og-table(
      v-else
      ref="listRef"
      scrollBar
      header-align="center"
      :noData="listCondition.total === 0"
      :max-height="800"
    )
      template(#header)
        //- Header
        og-table-column(
          v-model:visible="listCondition.selectAll"
          background="none"
          :slot-names="Object.keys(titleList)"
          :field-width="tableField.width()"
          :field-min-width="tableField.minWidth()"
          :show-selection="batchModuleData.visible"
          :indeterminate="!listCondition.selectAll && batchModuleData.selected.length > 0"
          @selection-change="selectAct.selectAll"
        )
          template(v-if="isDisplayedColumns('id')" #id)
            th {{ titleList.id }}
          template(v-if="isDisplayedColumns('site')" #site)
            th {{ titleList.site }}
          template(v-if="isDisplayedColumns('suffix')" #suffix)
            th {{ titleList.suffix }}
          template(v-if="isDisplayedColumns('domainName')" #domainName)
            th {{ titleList.domainName }}
          template(v-if="isDisplayedColumns('urlStatus')" #urlStatus)
            th {{ titleList.urlStatus }}
          template(v-if="isDisplayedColumns('abnormalState')" #abnormalState)
            th {{ titleList.abnormalState }}
          template(v-if="isDisplayedColumns('abnormalDate')" #abnormalDate)
            th
              span {{ titleList.abnormalDate }}
              sort-btn(
                :default-order="getDefaultSort('abnormalDate')"
                @order-change="tableAct.sort('abnormalDate', $event)"
              )

          template(v-if="isDisplayedColumns('service')" #service)
            th {{ titleList.service }}
          template(
            v-if="isDisplayedColumns('domainNameStatus')"
            #domainNameStatus
          )
            th {{ titleList.domainNameStatus }}
          template(v-if="isDisplayedColumns('sslStatus')" #sslStatus)
            th {{ titleList.sslStatus }}
          template(v-if="isDisplayedColumns('ip')" #ip)
            th {{ titleList.ip }}
          template(
            v-if="isDisplayedColumns('automaticRenewalDate')"
            #automaticRenewalDate
          )
            th
              span {{ titleList.automaticRenewalDate }}
              sort-btn(
                :default-order="getDefaultSort('automaticRenewalDate')"
                @order-change="tableAct.sort('automaticRenewalDate', $event)"
              )
          template(
            v-if="isDisplayedColumns('systemDetection')"
            #systemDetection
          )
            th {{ titleList.systemDetection }}
          template(v-if="isDisplayedColumns('abnormalArea')" #abnormalArea)
            th {{ titleList.abnormalArea }}
          template(v-if="isDisplayedColumns('manage')" #manage)
            th {{ titleList.manage }}
          template(v-if="isDisplayedColumns('previousNode')" #previousNode)
            th {{ titleList.previousNode }}
          template(v-if="isDisplayedColumns('remark')" #remark)
            th {{ titleList.remark }}
          template(
            v-if="isDisplayedColumns('operating') && hasApplySSLModifyPerm"
            #operating
          )
            th {{ titleList.operating }}
      //- 內容
      div(v-for="(row, index) in listData" :key="index")
        og-table-column(
          v-model:visible="row.selected"
          background="white"
          :slot-names="Object.keys(titleList)"
          :field-width="tableField.width()"
          :field-min-width="tableField.minWidth()"
          :show-selection="batchModuleData.visible"
          @selection-change="selectAct.select"
        )
          //- 序號
          template(v-if="isDisplayedColumns('id')" #id)
            td(:style="{ 'justify-content': 'center', width: '100%' }") {{ row.id + 1 }}
          //- 站別名稱
          template(v-if="isDisplayedColumns('site')" #site)
            td {{ row.site.name }}
          //- 後置碼
          template(v-if="isDisplayedColumns('suffix')" #suffix)
            td @{{ row.suffix }}
          //- 域名
          template(v-if="isDisplayedColumns('domainName')" #domainName)
            td
              rd-link(:href="`http://${row.domainName}`" target="_blank") {{ row.domainName }}
          //- 網址狀態
          template(v-if="isDisplayedColumns('urlStatus')" #urlStatus)
            td
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
                      span.dropdown-span(
                        :class="{ 'url-color': item.url !== '' }"
                      ) {{ item.label }}
          //- 異常狀態
          template(v-if="isDisplayedColumns('abnormalState')" #abnormalState)
            td
              span(v-if="row.abnormalState.length > 0")
                rd-tag.tag-container(
                  v-for="(item, index) in row.abnormalState"
                  :key="index"
                  :type="getAbnormalStateColor(item)"
                  size="small"
                ) {{ t(`url_abnormal_state_tag_${item}`) }}
              span(v-else) --
          //- 最近異常日
          template(v-if="isDisplayedColumns('abnormalDate')" #abnormalDate)
            td
              rd-format-timer(
                :date-default="row.abnormalDate !== '' ? row.abnormalDate : '--'"
              )
          //- 服務項目
          template(v-if="isDisplayedColumns('service')" #service)
            td
              span(v-if="row.service.length > 0")
                div(v-for="(item, index) in row.service" :key="index") {{ t(`url_service_items_tag_${item}`) }}
              span(v-else) --
          //- 域名狀態
          template(
            v-if="isDisplayedColumns('domainNameStatus')"
            #domainNameStatus
          )
            td
              span(v-if="row.domainNameStatus.length > 0")
                div(v-for="(item, index) in row.domainNameStatus" :key="index") {{ t(`domain_name_status_tag_${item}`) }}
              span(v-else) --
          //- 憑證狀態
          template(v-if="isDisplayedColumns('sslStatus')" #sslStatus)
            td
              span(v-if="row.sslStatus > 0") {{ t(`ssl_status_tag_${row.sslStatus}`) }}
              span(v-else) --
          //- IP
          template(v-if="isDisplayedColumns('ip')" #ip)
            td
              span(v-if="row.ip !== ''") {{ row.ip }}
              span(v-else) --
          //- 域名到期日
          template(
            v-if="isDisplayedColumns('automaticRenewalDate')"
            #automaticRenewalDate
          )
            td
              rd-format-timer(
                wrap
                date-default="--"
                :date-time="row.automaticRenewalDate"
              )
          //- 系統檢測
          template(
            v-if="isDisplayedColumns('systemDetection')"
            #systemDetection
          )
            td
              span(v-if="row.systemDetection !== ''") {{ row.systemDetection }}
              span(v-else) --
          //- 異常地區
          template(v-if="isDisplayedColumns('abnormalArea')" #abnormalArea)
            td
              span(
                v-if="typeof row.abnormalArea !== 'undefined' && row.abnormalArea.length > 0"
              )
                div(v-for="(item, index) in row.abnormalArea" :key="index") {{ item }}
              span(v-else) --
          //- 管理
          template(v-if="isDisplayedColumns('manage')" #manage)
            td
              span(v-if="row.manage !== null") {{ t(`manage_tag_${row.manage}`) }}
              span(v-else) --
          //- 上層指向
          template(v-if="isDisplayedColumns('previousNode')" #previousNode)
            td
              span(v-if="row.previousNode") {{ t(`url_service_items_tag_${row.previousNode}`) }}
              span(v-else) --
          //- 備註
          template(v-if="isDisplayedColumns('remark')" #remark)
            td.remark-content
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
          template(
            v-if="isDisplayedColumns('operating') && hasApplySSLModifyPerm"
            #operating
          )
            td
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
import RdStatusButton from '@/components/custom/status-button/index.vue';
import RdFormatTimer from '@/components/custom/format-timer/date-time.vue';
import BatchMode from '@/components/custom/batch-mode/index.vue';
import RdFieldFilter from '@/components/custom/field-filter/index.vue';
import ExportNote from '@/plugins/export-note/index.vue';
import EditRemark from '../common/edit-remark.vue';
import ApplySsl from '../common/apply-ssl.vue';
import OgTable from '@/plugins/table/index.vue';
import OgTableColumn from '@/plugins/table/table-column.vue';
import SortBtn from '@/plugins/sort/index.vue';
import { groupSeparator } from '@/components/utils/format/amount';
import { notify } from '@/components/utils/notification';
import { useInitCustomField } from '@/plugins/custom-field/custom-field';
import { useModifyAccess } from '@/plugins/access/modify';
import { initialCustomerDomainFields } from '../common/custom-fields';
import { useExportAccesses } from '../common/export';
import type { FormType } from '../common/search';
import type {
  ListData,
  BatchModule,
  RemarkDomainNameForm,
} from '../common/type';
import type { ListCondition } from './list';
import { url as urlAPI } from '@/api/domain';

type ListAngles = 'all' | 'normal' | 'abnormal' | 'noDomainName';
type ListAnglesValue = 'all' | 1 | 2 | 3;

type ListAnglesOptions = {
  label: string;
  value: ListAnglesValue;
  key: ListAngles;
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
    // 原生Table
    OgTable,
    OgTableColumn,
    SortBtn,
  },
  emits: ['openDialog', 'change', 'export', 'sortChange', 'update'],
  setup(props, { emit, expose }) {
    const { t } = useI18n({ useScope: 'parent' });
    // Loading
    const setLoading = inject('UrlManagement:setLoading') as Function;

    // 判斷是否客端域名修改權限
    const { hasModify: hasModifyPerm } = useModifyAccess('CustomerUrl');
    // 判斷是否申請憑證修改權限
    const { hasModify: hasApplySSLModifyPerm } =
      useModifyAccess('ApplyCertificate');

    const listRef = ref();

    // 基本搜尋條件
    const basicSearchForm = inject(
      'CustomerDomain:basicSearchForm',
    ) as FormType;
    // 原始列表資料
    const listData = inject('CustomerDomain:listData') as Ref<ListData[]>;
    // 查無域名資料
    const unknownDomainNameList = inject(
      'CustomerDomain:unknownDomainNameList',
    ) as Ref<
      {
        id: number;
        domainName: string;
      }[]
    >;

    // 取得異常狀態色系
    const getAbnormalStateColor = inject(
      'UrlManagement:getAbnormalStateColor',
    ) as Function;

    // table 標題
    const titleList = computed(() => {
      return {
        id: t('increment_number'), // 序號
        site: t('site'), // 站別名稱
        suffix: t('suffix'), // 後置碼
        domainName: t('domain_name'), // 域名
        urlStatus: t('url_status'), // 網址狀態
        abnormalState: t('abnormal_state'), // 異常狀態
        abnormalDate: t('recent_abnormal_date'), // 最近異常日期
        service: t('service_items'), // 服務項目
        domainNameStatus: t('domain_name_status'), // 域名狀態
        sslStatus: t('ssl_status'), // 憑證狀態
        ip: 'IP', // IP
        automaticRenewalDate: t('domain_name_expiration_date'), // 域名到期日
        systemDetection: t('system_detection'), // 系統檢測
        abnormalArea: t('abnormal_area'), // 異常地區
        manage: t('manage'), // 管理
        previousNode: t('previous_node'), // 上層指向
        remark: t('remark'), // 備註
        operating: t('operating'), // 操作
      };
    });
    const tableField = {
      width: () => {
        return {
          id: 60, // 序號
          suffix: 80, // 後置碼
          urlStatus: 90, // 網址狀態
          abnormalDate: 120, // 最近異常日期
          service: 105, // 服務項目
          domainNameStatus: 140, // 域名狀態
          sslStatus: 90, // 憑證狀態
          ip: 150, // IP
          automaticRenewalDate: 120, // 域名到期日
          systemDetection: 170, // 系統檢測
          abnormalArea: 200, // 異常地區
          manage: 95, // 管理
          previousNode: 90, // 上層指向
          remark: 120, // 備註
          operating: 90, // 操作
        };
      },
      minWidth: () => {
        return {
          site: 140, // 站別
          domainName: 185, // 域名
          abnormalState: 140, // 異常狀態
        };
      },
    };
    // 取得預設排序欄位
    const getDefaultSort = (field: 'abnormalDate' | 'automaticRenewalDate') => {
      const order = {
        asc: 'ascending',
        desc: 'descending',
      } as const;
      if (listCondition.sort === field && listCondition.order !== null) {
        return order[listCondition.order];
      }
      return null;
    };

    // 批次模組資料
    const batchModuleData: BatchModule = reactive({
      visible: false,
      selected: [],
    });

    const selectAct = {
      change: (val: ListData[]) => {
        batchModuleData.selected = val;
      },
      clear: () => {
        batchModuleData.visible = false;
        batchModuleData.selected = [];
        listCondition.selectAll = false;
        listData.value.forEach(item => {
          const result = item;
          result.selected = false;
        });
      },
      getRowClass: ({ row }: { row: ListData }) =>
        batchModuleData.selected.find(selectedRow => selectedRow.id === row.id)
          ? 'selected-row'
          : '',
      // 單選
      select: () => {
        batchModuleData.selected = listData.value.filter(item => item.selected);
        listCondition.selectAll =
          batchModuleData.selected.length === listData.value.length;
      },
      // 全選
      selectAll: (val: boolean) => {
        listCondition.selectAll = val;
        // 判斷已勾選資料(預設清空)
        batchModuleData.selected = [];
        if (val && batchModuleData.selected.length !== listData.value.length) {
          batchModuleData.selected = listData.value;
        }
        // 更改列表單一項目被選中狀態
        listData.value.forEach(item => {
          const result = item;
          result.selected = val;
        });
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
      {
        label: t('all_domain_name'),
        value: 'all',
        key: 'all',
        type: 'default',
      },
      { label: t('normal'), value: 1, key: 'normal', type: 'default' },
      { label: t('abnormal'), value: 2, key: 'abnormal', type: 'danger' },
    ]);
    // 列表角度其他選項
    const listAnglesOtherOptions = ref<ListAnglesOptions[]>([
      {
        label: t('check_no_domain_name'),
        value: 3,
        key: 'noDomainName',
        type: 'default',
      },
    ]);

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
      sort: (
        prop: 'abnormalDate' | 'automaticRenewalDate',
        order: 'ascending' | 'descending' | null,
      ) => {
        emit('sortChange', prop, order);
      },
      clear: () => {
        listCondition.sort = 'id';
        listCondition.order = 'asc';
      },
      updateApi: () => {
        emit('update', true);
      },
    };

    // 設定列表角度
    const setListAngle = (key: ListAngles, value: ListAnglesValue) => {
      listCondition.page = 1;
      tableAct.clear();
      listCondition.total = listAngleTotalData[key];
      listCondition.formAngle = value;
      emit('change');
    };
    // 顯示查無域名
    const isNoDomainNameAngle = computed(() => {
      return (
        listCondition.formAngle === 3 && unknownDomainNameList.value.length > 0
      );
    });
    // 顯示查無域名角度的按鈕
    const showCheckNoDomainNameAngleBtn = computed(() => {
      return (
        basicSearchForm.type === 'domainName' &&
        basicSearchForm.domain !== 'all' &&
        basicSearchForm.multipleDomains.length > 1
      );
    });

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
        hasModifyPerm.value &&
        !isNoDomainNameAngle.value &&
        basicSearchForm.type === 'site'
      );
    });
    // 更新 DNS 資料
    const updateDNS = () => {
      dialogSwitch.updateDNS = false;
      setLoading(true);
      return urlAPI.updateDNS(basicSearchForm.site).then(resp => {
        if (resp.data.result) {
          notify.success({ title: t('success') });
        }
        setLoading(false);
      });
    };

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
        (hasModifyPerm.value || hasApplySSLModifyPerm.value) &&
        !isNoDomainNameAngle.value
      );
    });
    // 取得批次模組最小寬度
    const getBatchModuleWidth = computed(() => {
      if (batchModuleData.visible) {
        return { 'min-width': hasApplySSLModifyPerm.value ? '440px' : '305px' };
      }
      return {};
    });

    // 自訂欄位
    const { customOptions, fieldsData, isDisplayedColumns, confirm } =
      useInitCustomField(
        initialCustomerDomainFields(t, hasApplySSLModifyPerm.value),
      );

    // 匯出相關
    const hasExportPerm = useExportAccesses('CustomerUrlExport');
    const exportVisible = ref(false);
    const exportParams = {
      functionName: 'url_management',
      tabName: 'customer_url',
    } as const;
    // 執行匯出
    const exportFiled = (note: string) => {
      exportVisible.value = false;
      emit('export', note);
    };

    // 重置捲軸高度
    const scrollTo = () => {
      listRef.value?.scrollTo();
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
      unknownDomainNameList,
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
      tableAct,
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
      // Table 相關
      titleList,
      tableField,
      getDefaultSort,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  @include flex-basic();
  .suffix {
    margin-right: auto;
  }
}
.tag-container {
  @include space-multiline(5px);
  margin-bottom: 5px;
}
.remark-content {
  @include flex-basic();
  width: 100%;
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
