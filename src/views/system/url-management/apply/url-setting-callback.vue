<template lang="pug">
rd-card(v-loading="loading" :title="t('domain_name_setting')")
  template(#subTitle)
    i18n-t(keypath="apply_domain_info1" tag="span")
      template(#buyMethod) {{ t(priceListDict[basicData.buy]) }}
      template(#already) {{ requestionNum }}
      template(#rest) {{ canApplyNum(basicData.buy) }}
  template(#content)
    rd-table(
      border
      :data="result.list"
      :default-sort="{ prop: 'result', order: 'descending' }"
    )
      //- 序號
      rd-table-column(
        type="index"
        :label="t('increment_number')"
        align="center"
        :resizable="false"
        width="60"
      )
      //- 域名
      rd-table-column(
        :label="t('domain_name')"
        prop="domain"
        header-align="center"
        :resizable="false"
      )
      //- 格式檢查
      rd-table-column(
        prop="format"
        align="center"
        label-class-name="format-class-label"
        :resizable="false"
      )
        template(#header)
          .header-space
            span {{ t('check_format') }}
            rd-tooltip(placement="top")
              template(#content)
                div {{ t('check_format_msg1') }}
                div {{ t('check_format_msg2') }}
                div {{ t('check_format_msg3') }}
                div {{ t('check_format_msg4') }}
                div {{ t('check_format_msg5') }}
                div {{ t('check_format_msg7') }}
                div {{ t('check_format_msg6') }}
              i.mdi.mdi-information
        template(#default="scope")
          //- 因api特殊所以直接使用文字轉成字典檔的key
          span {{ scope.row.format ? t('format_msg_success') : t(snakeCase(scope.row.formatMsg)) }}
      //- dns檢查
      rd-table-column(
        prop="dns"
        align="center"
        label-class-name="format-class-label"
        :resizable="false"
      )
        template(#header)
          .header-space
            span {{ t('dns_check') }}
            rd-tooltip(placement="top")
              template(#content)
                div {{ t('dns_title_info1') }}
                div {{ t('dns_title_info2') }}
                div {{ t('dns_title_info3') }}
                div {{ t('dns_title_info4') }}
              i.mdi.mdi-information
        template(#default="scope")
          //- 因api特殊所以直接使用文字轉成字典檔的key
          span {{ scope.row.dns ? t('pass') : t(snakeCase(scope.row.dnsMsg)) }}
      //- 驗證狀態
      //- TODO: 排序按鈕跑版問題
      rd-table-column(
        :label="t('check_format')"
        prop="result"
        align="center"
        label-class-name="format-class-label"
        sortable
        :resizable="false"
      )
        template(#header)
          .header-space
            span {{ t('validator_status') }}
            rd-tooltip(placement="top")
              template(#content)
                div {{ t('validator_status_info') }}
              i.mdi.mdi-information
        template(#default="scope")
          rd-tag.tag-pill(v-if="scope.row.result" type="success" size="small") {{ t('success') }}
          rd-tag.tag-pill(v-else type="danger" size="small") {{ t('fail2') }}
</template>
<script lang="ts">
import { defineComponent, type Ref, inject, onMounted } from 'vue';
import { priceListDict } from '../common/estimate';
import { useI18n } from 'vue-i18n';
import type { BasicSetting, CallbackUrlList } from './apply';
import { snakeCase } from 'lodash';
import { useSiteRestriction } from '../single-number-progress/restriction';

export default defineComponent({
  name: 'UrlManagementUrlSettingCallbackCard',
  setup() {
    // 字典
    const { t } = useI18n({ useScope: 'local' });
    // 站別
    const site = inject('UrlManagement:applySite') as Ref<string>;
    // 基本資料
    const basicData = inject('UrlManagement:basicData') as BasicSetting;
    // 送出後得到的結果
    const result = inject('UrlManagement:applyResult') as {
      id: number;
      list: CallbackUrlList[];
    };
    // 處理loading遮罩
    const loading = inject('UrlManagement:applyLoading') as Ref<boolean>;

    // 申請筆數與還可申請的數量
    const { requestionNum, canApplyNum, getRestriction, getRequestionNum } =
      useSiteRestriction();

    // 載入申請筆數與還可申請的數量
    onMounted(() => {
      loading.value = true;
      return Promise.all([
        getRequestionNum(site.value, basicData.buy === 'bbin' ? 1 : 0),
        getRestriction(),
      ]).then(() => {
        loading.value = false;
      });
    });

    return {
      t,
      requestionNum,
      canApplyNum,
      result,
      basicData,
      loading,
      snakeCase,
      priceListDict,
    };
  },
});
</script>
<style lang="scss" scoped>
.format-class-label {
  .header-space {
    @include space(3px);
  }
  .mdi {
    color: $text-3;
  }
}
.tag-pill {
  @include tag-border(true, true);
}
</style>
