<i18n src="@/languages/system_setting/url_management/detail.json"></i18n>
<template lang="pug">
rd-navbar-layout(v-loading="loading" no-pre-page :title="t('ticket_detail')")
  template(#subTitle)
    span(v-if="siteList[ticketInfo.siteGroup]")
      | {{ t(`${siteList[ticketInfo.siteGroup].label} @${siteList[ticketInfo.siteGroup].code}`) }}
  template(#afterTitle)
    .title-space
      span {{ `${t('trans_number')}：${ticketInfo.id}` }}
      rd-tag.tag-pill(
        v-if="statusKeyMap[ticketInfo.status]"
        :type="statusListMap[statusKeyMap[ticketInfo.status]].type"
        size="small"
      ) {{ t(statusListMap[statusKeyMap[ticketInfo.status]].dict) }}
    //- 單據狀態
  template(#titleSuffix)
    //- 作廢
    rd-button(
      v-if="hasModify && abolishable(ticketInfo.status, ticketBasicData.buy, ticketUrlList)"
      type="secondary"
      @click="initAbolish"
    ) {{ t('void') }}
  template(#body)
    rd-layout-content(v-if="!loading")
      //- 基本設定
      basic-card
      //- 域名設定
      url-setting-card(:data="ticketUrlList")
      //- 預估費用
      estimate-card(:count="valuableUrlCount")
      .button-group
        //- 作廢
        rd-button(
          v-if="hasModify && abolishable(ticketInfo.status, ticketBasicData.buy, ticketUrlList)"
          type="secondary"
          @click="initAbolish"
        ) {{ t('void') }}
    //- 作廢確定 Dialog
    abolish-dialog(
      v-model="abolishVisible"
      action="single"
      :list="abolishList"
    )
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useTicket } from '../apply/ticket';
import EstimateCard from '../apply/estimate-card.vue';
import BasicCard from '../apply/basic-card.vue';
import UrlSettingCard from './url-setting.vue';
import { useSiteList } from '../common/list';
import {
  statusKeyMap,
  statusListMap,
  abolishable,
} from '../single-number-progress/status';
import AbolishDialog from '../single-number-progress/abolish-dialog.vue';
import type { AbolishList } from '../single-number-progress/single-number-progress';
import { useModifyAccess } from '@/plugins/access/modify';
import { mapKeys } from 'lodash';

export default defineComponent({
  name: 'UrlManagementDetailApply',
  components: {
    EstimateCard,
    BasicCard,
    UrlSettingCard,
    AbolishDialog,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const route = useRoute();
    const loading = ref(true);

    // 是否有修改權限
    const { hasModify } = useModifyAccess('ApplicationProgress');

    // 作廢確定dialog顯示
    const abolishVisible = ref(false);

    // 工單相關
    const { ticketInfo, ticketBasicData, ticketUrlList, getTicket } =
      useTicket();
    provide('UrlManagement:basicData', ticketBasicData);

    // 站別相關
    const { getSiteList, siteOptions } = useSiteList();

    // 作廢的資料
    const abolishList = ref<AbolishList[]>([]);

    // 取得工單id
    const id = +route.params.id;

    // 先載入站別列表與工單資料
    onMounted(() => {
      loading.value = true;
      return Promise.all([getSiteList(), getTicket(id)]).then(() => {
        loading.value = false;
      });
    });

    // 更新工單資料(用於作廢後資料更新)
    const updateTicket = () => {
      loading.value = true;

      getTicket(id).then(() => {
        loading.value = false;
      });
    };
    // 提供更新方法給作廢後的資料刷新
    provide('UrlManagement:abolishConfirmCallback', updateTicket);

    // 站別資料 - 轉換為用站別當key的資料
    const siteList = computed(() =>
      mapKeys(siteOptions.value, obj => obj.value),
    );

    // 1:處理中、2:已完成、3:無法綁定、4:已作廢
    // 有算錢價值的域名狀態
    const valuableProgress = [1, 2];
    // 有算錢價值的域名數量
    const valuableUrlCount = computed(
      () =>
        ticketUrlList.value.filter(obj =>
          valuableProgress.includes(obj.progress),
        ).length,
    );

    // 作廢
    const initAbolish = () => {
      abolishList.value = [
        {
          id: id,
          siteName: siteList.value[ticketInfo.siteGroup].label,
          suffix: `@${siteList.value[ticketInfo.siteGroup].code}`,
        },
      ];
      abolishVisible.value = true;
    };

    return {
      t,
      ticketInfo,
      ticketBasicData,
      ticketUrlList,
      loading,
      valuableUrlCount,
      initAbolish,
      abolishVisible,
      abolishList,
      siteList,
      statusKeyMap,
      statusListMap,
      hasModify,
      abolishable,
      updateTicket,
    };
  },
});
</script>

<style lang="scss" scoped>
.title-space {
  @include space;
}
.dialog-content {
  @include space-vertical(10px);
}
.tag-pill {
  @include tag-border(true, true);
}
.rd-layout-content {
  @include space-vertical;

  .button-group {
    @include flex-basic(flex-end);
  }
}
</style>
