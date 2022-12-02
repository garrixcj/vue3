<template lang="pug">
rd-navbar-layout(
  v-loading="loading"
  no-pre-page
  :title="t('ticket_detail')"
  :sub-title="t(`${siteInfo.label} @${siteInfo.code}`)"
)
  template(#afterTitle)
    .title-space
      span {{ `${t('trans_number')}：${ticketInfo.id}` }}
      rd-tag.tag-pill(:type="ticketTagStyle.type" size="small") {{ t(ticketTagStyle.dict) }}
    //- 單據狀態
  template(#titleSuffix)
    //- 作廢
    rd-button(type="secondary" @click="abolishCheckVisible = true") {{ t('void') }}
  template(#body)
    rd-layout-content(v-if="!loading")
      //- 基本設定
      basic-card
      //- 域名設定
      url-setting-card(:data="ticketUrlList")
      //- 預估費用
      estimate-card(:url-count="valuableUrlLength")
      .button-group
        //- 作廢
        rd-button(type="secondary" @click="abolishCheckVisible = true") {{ t('void') }}
    //- 作廢確定 Dialog
    rd-dialog(v-model="abolishCheckVisible" :title="t('void')" width="430px")
      .dialog-content
        .msg {{ t('domain_abolish_check') }}
        rd-form(label-position="right" label-width="65px")
          rd-form-item(:label="t('trans_number')") {{ ticketInfo.id }}
          rd-form-item(:label="t('site')") {{ siteInfo.value }}
          rd-form-item(:label="t('suffix')") {{ siteInfo.code }}
      template(#footer)
        rd-button(type="secondary" @click="abolishCheckVisible = false") {{ t('cancel') }}
        //- TODO: 待補連結
        rd-button(type="primary" @click="abolish") {{ t('confirm') }}
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  provide,
  computed,
  nextTick,
  type Ref,
} from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useTicket } from './ticket';
import EstimateCard from './estimate-card.vue';
import BasicCard from './basic-card.vue';
import UrlSettingCard from './url-setting.vue';
import { notify } from '@/components/utils/notification';
import { useSiteList, type SiteOption } from '../common/list';

export default defineComponent({
  name: 'UrlManagementDetailApply',
  components: {
    EstimateCard,
    BasicCard,
    UrlSettingCard,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const route = useRoute();
    const loading = ref(true);

    // TODO:權限

    // 1:處理中、2:已完成、4:作廢中、5:已作廢
    // 單據狀態
    const ticketStatus = {
      1: {
        type: 'warning',
        dict: 'processing',
      },
      2: {
        type: 'success',
        dict: 'finished',
      },
      3: {
        type: 'warning',
        dict: 'abolishing',
      },
      4: {
        type: 'danger',
        dict: 'abolished',
      },
    };
    const ticketTagStyle = ref({ type: '', dict: '' });

    // 工單相關
    const {
      ticketInfo,
      ticketBasicData,
      ticketUrlList,
      getTicket,
      abolishTicket,
    } = useTicket();
    provide('UrlManagement:basicData', ticketBasicData);

    // 站別相關
    const { getSiteList, getSiteInfo } = useSiteList();
    const siteInfo = ref({
      label: '',
      value: '',
      code: '',
      domain: 0,
    }) as Ref<SiteOption>;

    const id = +route.params.id;
    getTicket(id).then(() => {
      // TODO:非法id要倒轉回列表

      ticketTagStyle.value =
        ticketStatus[ticketInfo.value.status as keyof typeof ticketStatus];

      getSiteList().then(() => {
        const info = getSiteInfo(ticketInfo.value.siteGroup);
        if (info) {
          siteInfo.value = info;
        }

        nextTick(() => {
          loading.value = false;
        });
      });
    });

    // 1:處理中、2:已完成、3:無法綁定、4:已作廢
    // 有算錢價值的狀態
    const valuableUrlType = [1, 2];
    // 有算錢價值的域名數量
    const valuableUrlLength = computed(
      () =>
        ticketUrlList.value.filter(obj =>
          valuableUrlType.includes(obj.progressRate),
        ).length,
    );

    // 作廢確定dialog顯示
    const abolishCheckVisible = ref(false);
    // 作廢
    const abolish = () => {
      abolishCheckVisible.value = false;
      loading.value = true;

      abolishTicket(id).then(result => {
        if (result) {
          // 跳成功訊息
          notify.success({
            title: t('success'),
            message: t('success_abolished_msg', { id }),
          });
          // 畫面重loading
          window.location.reload();
        }
        loading.value = false;
      });
    };

    // 作廢確認資料
    const abolishForm = ref({
      id,
      site: '',
      suffix: '',
    });

    return {
      t,
      ticketInfo,
      ticketBasicData,
      ticketUrlList,
      loading,
      valuableUrlLength,
      ticketTagStyle,
      abolish,
      abolishCheckVisible,
      abolishForm,
      siteInfo,
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
