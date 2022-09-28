<template lang="pug">
//- 自訂狀態
rd-dialog(
  custom-class="custom-status"
  show-close
  :model-value="modelValue"
  :title="t('custom_status')"
  width="600px"
  @update:model-value="$emit('update:model-value', $event)"
  @close="close"
)
  //- 圖示展開縮合
  .feature-bar-collapse
    .feature-bar-collapse__label {{ t('icon_display') }}
    rd-radio-group(v-model="statusForm.collapse")
      rd-radio-button.primary(:label="true")
        i.mdi.mdi-arrow-expand-all
        span {{ t('unfold') }}
      rd-radio-button.primary(:label="false")
        i.mdi.mdi-arrow-collapse-all
        span {{ t('collapse_icon') }}
  //- 資訊物件清單 (前半：線上人數、美東時間)
  .info-list
    rd-row.info-header
      rd-col.info-header__tr(:span="18") {{ t('item') }}
      rd-col.info-header__tr(:span="6") {{ t('display') }}
    rd-row.info-item(v-for="item in statusForm.info" :key="item.name")
      rd-col.info-item__td(:span="18") {{ t(item.dict) }}
      rd-col.info-item__td(:span="6")
        rd-switch(v-model="item.enable" :active="switchActiveTheme")
  //- 功能物件清單 (後半：擴充 Feature Bar)
  .info-list
    rd-row.info-header
      rd-col.info-header__tr(:span="18") {{ t('item') }}
      rd-col.info-header__tr(:span="6") {{ t('display') }}
    draggable(item-key="sort" :list="statusForm.feature")
      template(#item="{ element }")
        rd-row.info-item
          rd-col.info-item__td(:span="3")
            i.mdi.mdi-drag-vertical
          rd-col.info-item__td(:span="3")
            i.mdi(:class="element.icon")
          rd-col.info-item__td(:span="12") {{ t(element.dict) }}
          rd-col.info-item__td(:span="6")
            rd-switch(v-model="element.enable" :active="switchActiveTheme")
  template(#footer)
    //- 按鈕區塊
    .footer-btns
      rd-button.footer-btn.prefix(text @click="setDefault") {{ t('reset_to_defult_status') }}
      rd-button.footer-btn(type="secondary" size="large" @click="close") {{ t('cancel') }}
      rd-button.footer-btn(type="primary" size="large" @click="submit") {{ t('confirm') }}
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  reactive,
  ref,
  watchEffect,
  type Ref,
} from 'vue';
import adminApi from '@/api/admin';
import { useI18n } from 'vue-i18n';
import Draggable from 'vuedraggable';
import { notify } from '@/components/utils/notification';
import cloneDeep from 'lodash/cloneDeep';
import type { CustomStatus, CustomStatusForm } from './nav-info';

export default defineComponent({
  name: 'CustomStatus',
  components: {
    Draggable,
  },
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
  },
  emits: ['update:model-value'],
  setup(props, { emit }) {
    // INIT
    const { t } = useI18n({ useScope: 'parent' });

    const switchActiveTheme = {
      type: 'success' as const,
      text: `${t('display')}！`,
      inverseText: `${t('hide')}！`,
    };

    // Origin
    const customStatus = inject('Nav:customStatus') as CustomStatus;
    // 修改狀態表單
    const statusForm = reactive<CustomStatusForm>({
      collapse: true,
      feature: [],
      info: [],
    });

    // 帶入現在資料
    const init = () => {
      statusForm.collapse = customStatus.collapse.enable;
      statusForm.feature = cloneDeep(
        customStatus.feature.sort((a, b) => a.sort - b.sort),
      );
      statusForm.info = cloneDeep(customStatus.info);
    };
    // 自動更新
    watchEffect(() => {
      init();
    });

    // 還原成預設
    const setDefault = () => {
      statusForm.collapse = !!customStatus.collapse.default;
      statusForm.feature = statusForm.feature
        .sort((a, b) => a.sort - b.sort)
        .map(item => ({ ...item, enable: !!item.default_enable }));
      statusForm.info = statusForm.info
        .sort((a, b) => a.sort - b.sort)
        .map(item => ({ ...item, enable: !!item.default_enable }));
    };

    // 關閉表單
    const close = () => {
      // init();
      emit('update:model-value', false);
    };

    // Loading
    const onSetting = ref(false);
    const updateProfile = inject('Nav:updateProfile') as Function;
    // 全畫面 loading
    const fullLoading = inject('Main:Loading') as Ref<boolean>;
    // 表單送出
    const submit = () => {
      if (onSetting.value) {
        return;
      }
      onSetting.value = true;
      emit('update:model-value', false);
      fullLoading.value = true;

      const params: { [key: string]: unknown } = {};
      // 資訊
      const info = statusForm.info.map(item => ({
        name: item.name,
        enable: item.enable,
      }));
      if (info) {
        params.profile_infos = info;
      }
      // icon feature
      if (statusForm.feature.length > 0) {
        const feature = statusForm.feature.map((item, index) => ({
          name: item.name,
          enable: item.enable,
          sort: index + 1,
        }));

        params.profile_icon_collapse = statusForm.collapse;
        params.profile_icons = feature;
      }

      // 送出
      adminApi
        .putAdminProfile(params)
        .then(resp => {
          if (resp.data.result) {
            // 成功訊息
            notify.success({
              title: t('success'),
              message: t('apply_status_success'),
            });
            onSetting.value = false;
            fullLoading.value = false;
            // 更新 profile
            updateProfile();
          }
        })
        .catch(() => {
          onSetting.value = false;
          fullLoading.value = false;
        });
    };

    return {
      t,
      switchActiveTheme,
      statusForm,
      setDefault,
      close,
      submit,
    };
  },
});
</script>

<style lang="scss" scoped>
.custom-status {
  @include space-vertical;
  .feature-bar-collapse {
    @include flex-basic;
    @include space;
  }

  .info-list {
    .info-header {
      @include space-vertical(5px);
      height: 40px;
      margin-bottom: 5px;
      box-shadow: 0 3px 6px #404e6726;
      &__tr {
        color: $primary;
        @include flex-basic(center);
      }
    }
    .info-item {
      height: 40px;
      padding: 10px 20px;
      & + .info-item {
        border-top: 1px solid $background-3;
      }
      &__td {
        @include flex-basic;
        i {
          font-size: 18px;
        }
      }
    }
  }

  .footer-btns {
    @include flex-basic(flex-end);
    @include space;
    .prefix {
      margin-right: auto;
      font-weight: 500;
    }
  }
}
</style>
