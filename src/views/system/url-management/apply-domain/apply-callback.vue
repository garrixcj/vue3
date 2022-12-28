<i18n src="@/languages/system_setting/url_management/apply.json"></i18n>
<template lang="pug">
//- 右方警示訊息
rd-information
  ul
    li {{ t('leave_warning') }}
rd-navbar-layout(
  no-pre-page
  :title="t('apply_url')"
  :sub-title="t(`${siteList[site].label} @${siteList[site].code}`)"
)
  template(#titleSuffix)
    //- 返回列表
    rd-button(type="secondary" @click="back") {{ t('back_to_list') }}
    //- 查看單號進度
    rd-button(v-if="type !== 'error'" type="gradient" @click="toDetail") {{ t('go_to_ticket_status') }}
  template(#body)
    rd-layout-content
      //- 結果Alert
      rd-alert(:type="type" :closable="false" :title="t(type)")
        div(v-for="(msg, index) in typeInfo" :key="index") {{ msg }}
      //- 基本設定
      basic-card(mode="apply")
      //- 域名設定
      url-setting-callback-card(:site="site")
      //- 預估費用
      estimate-card(:count="successCount")
      .button-group
        //- 返回列表
        rd-button(type="secondary" @click="back") {{ t('back_to_list') }}
        //- 查看單號進度(當有成功的域名時才顯示)
        rd-button(v-if="type !== 'error'" type="gradient" @click="toDetail") {{ t('go_to_ticket_status') }}
</template>

<script lang="ts">
import { defineComponent, computed, inject, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import EstimateCard from './estimate-card.vue';
import BasicCard from './basic-card.vue';
import UrlSettingCallbackCard from './url-setting-callback.vue';
import type { SiteOption } from '../common/list';
import type { CallbackUrlList } from './apply';
import { mapKeys } from 'lodash';

export default defineComponent({
  name: 'UrlManagementDetailApplyCallback',
  components: {
    EstimateCard,
    BasicCard,
    UrlSettingCallbackCard,
  },
  props: {
    // 現正使用的站別
    site: { type: String, required: true },
    // 站別列表
    sites: { type: Array as PropType<SiteOption[]>, required: true },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'local' });

    // 站別資料 - 轉換為用站別當key的資料
    const siteList = computed(() => mapKeys(props.sites, obj => obj.value));

    // 送出後得到的結果
    const result = inject('UrlManagement:applyResult', { id: 0, list: [] }) as {
      id: number;
      list: CallbackUrlList[];
    };

    // 正常域名數量
    const successCount = computed(
      () => result.list.filter(obj => obj.result).length,
    );
    // 失敗數量
    const errorCount = computed(() => result.list.length - successCount.value);

    // 結果的狀態
    const type = computed(() => {
      // 全成功
      let type = 'success';

      if (!successCount.value) {
        // 全失敗
        type = 'error';
      } else if (errorCount.value > 0) {
        // 部分成功
        type = 'warning';
      }

      return type;
    });

    // 狀態相關資訊
    const typeInfo = computed(() => {
      // 全成功
      let info = [
        t('add_domain_success_msg1', { id: result.id }),
        t('add_domain_success_msg2', {
          apply: result.list.length,
          success: successCount.value,
        }),
      ];

      if (!successCount.value) {
        // 全失敗
        info = [
          t('add_domain_error_msg1'),
          t('add_domain_error_msg2', {
            apply: result.list.length,
            error: errorCount.value,
          }),
        ];
      } else if (errorCount.value > 0) {
        // 部分成功
        info = [
          t('add_domain_warning_msg1', { id: result.id }),
          t('add_domain_warning_msg2', {
            apply: result.list.length,
            success: successCount.value,
            error: errorCount.value,
          }),
        ];
      }

      return info;
    });

    // 返回列表
    const back = () => {
      window.location.href = '/system_setting/url_management/index';
    };

    // 導向單號詳情
    const toDetail = () => {
      window.location.href = `/v3/system_setting/url_management/detail/${result.id}`;
    };

    return {
      t,
      siteList,
      successCount,
      type,
      typeInfo,
      back,
      toDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
.rd-layout-content {
  @include space-vertical;

  .button-group {
    @include flex-basic(flex-end);
  }
}
</style>
