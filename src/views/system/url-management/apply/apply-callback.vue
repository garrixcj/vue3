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
    rd-button(v-if="resultInfo().type !== 'error'" type="gradient") {{ t('go_to_ticket_status') }}
  template(#body)
    rd-layout-content
      //- 結果Alert
      rd-alert(:type="resultInfo().type" :title="t(resultInfo().type)")
        div(v-for="(msg, index) in resultInfo().msg" :key="index") {{ msg }}
      //- 基本設定
      basic-card(mode="apply")
      //- 域名設定
      url-setting-callback-card
      //- 預估費用
      estimate-card(:url-count="urlCount")
      .button-group
        //- 返回列表
        rd-button(type="secondary" @click="back") {{ t('back_to_list') }}
        //- 查看單號進度(當有成功的域名時才顯示)
        rd-button(v-if="resultInfo().type !== 'error'" type="gradient") {{ t('go_to_ticket_status') }}
</template>
<script lang="ts">
import {
  defineComponent,
  type Ref,
  computed,
  inject,
  type PropType,
} from 'vue';
import { useI18n } from 'vue-i18n';
import EstimateCard from './estimate-card.vue';
import BasicCard from './basic-card.vue';
import UrlSettingCallbackCard from './url-setting-callback.vue';
import type { SiteOption } from '../common/list';
import type { CallbackUrlList } from './apply';

export default defineComponent({
  name: 'UrlManagementDetailApplyCallback',
  components: {
    EstimateCard,
    BasicCard,
    UrlSettingCallbackCard,
  },
  props: {
    // 站別
    siteOptions: { type: Array as PropType<SiteOption[]>, required: true },
  },
  setup(props) {
    const { t } = useI18n({ useScope: 'local' });

    // 實際上使用的site
    const site = inject('UrlManagement:applySite') as Ref<string>;
    // 站別資料 - 轉換為用站別當key的資料
    const siteList = computed(() =>
      props.siteOptions.reduce((acc, obj) => {
        acc[obj.value] = obj;

        return acc;
      }, {} as Record<string, SiteOption>),
    );

    // 送出後得到的結果
    const result = inject('UrlManagement:applyResult') as {
      id: number;
      list: CallbackUrlList[];
    };

    // 正常域名的筆數
    const urlCount = computed(
      () => result.list.filter(obj => obj.result).length,
    );

    // 最終結果的資訊
    const resultInfo = () => {
      // 申請數量
      const applyNum = result.list.length;
      // 成功數量
      const successNum = urlCount.value;
      // 失敗數量
      const errorNum = applyNum - successNum;

      let type = '';
      let msg: string[] = [];

      if (!successNum) {
        // 全失敗
        type = 'error';
        msg = [
          t('add_domain_error_msg1'),
          t('add_domain_error_msg2', {
            apply: applyNum,
            error: errorNum,
          }),
        ];
      } else if (successNum !== applyNum) {
        // 部分成功
        type = 'warning';
        msg = [
          t('add_domain_success_msg1', { id: result.id }),
          t('add_domain_success_msg2', {
            apply: applyNum,
            success: successNum,
            error: errorNum,
          }),
        ];
      } else {
        // 全成功
        type = 'success';
        msg = [
          t('add_domain_warning_msg1', { id: result.id }),
          t('add_domain_warning_msg2', {
            apply: applyNum,
            success: successNum,
          }),
        ];
      }

      return { type, msg };
    };

    // 返回列表
    const back = () => {
      window.location.href =
        '/system_setting/url_management/index?tab=customerDomain';
    };

    return {
      t,
      site,
      siteList,
      urlCount,
      resultInfo,
      back,
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
