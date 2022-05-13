<template lang="pug">
//- 個人資料
.profile
  rd-dropdown(trigger="click")
    .profile-trigger
      span {{ username }}
      i.mdi.mdi-chevron-down.profile-trigger__icon
    .profile-trigger__mobile
      //- 小尺寸頁面
      i.mdi.mdi-dots-vertical
    template(#dropdown)
      rd-dropdown-menu.profile-menu
        //- 一般功能(修改密碼、登出)
        rd-dropdown-item.profile-option__title(disabled) {{ t('normal') }}
        //- rd-dropdown-item.profile-option(@click="openPasswdReset") {{ t('change_password') }}
        rd-dropdown-item.profile-option(@click="logout") {{ t('logout') }}
        //- 分隔線
        rd-dropdown-item(divided)
        //- 進階功能(自訂狀態列)
        rd-dropdown-item.profile-option__title(disabled) {{ t('advanced') }}
        rd-dropdown-item.profile-option(@click="openCustomStatus") {{ t('custom_status') }}
  //- //- 修改密碼(Dialog)
  //- //- Note: transition-name，mask-transition-name非官網設定
  //- passwd-reset(
  //-   v-model:visible="resetPasswd"
  //-   transition-name="none"
  //-   mask-transition-name="none"
  //- )
  //- //- 自訂欄位
  custom-status(v-model:modelValue="customDialog")
</template>

<script lang="ts">
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  inject,
  ref,
  type Ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
// import { useRouter } from 'vue-router';
import { useOperatorStore } from '@/stores/operator';

export default defineComponent({
  name: 'OperatorProfile',
  components: {
    // PasswdReset: defineAsyncComponent(
    //   () => import('@/pages/login/passwd-reset.vue'),
    // ),
    CustomStatus: defineAsyncComponent(() => import('./custom-status.vue')),
  },
  setup() {
    const { t } = useI18n({ useScope: 'parent' });
    const operatorStore = useOperatorStore();
    // const router = useRouter();

    // username
    const username = computed(() => {
      const operator = operatorStore.operator;
      if (operator) {
        if (operator.role) {
          const role = t(`role_${operator.role}`);
          return `${role}：${operator.username}`;
        }
        return operator.username;
      }
      return 'user';
    });
    // 修改密碼
    // const resetPasswd = ref(false);
    // const openPasswdReset = () => {
    //   resetPasswd.value = true;
    // };

    // 登出
    const fullLoading = inject('fullLoading') as Ref<boolean>;
    const logout = () => {
      fullLoading.value = true; // 覆蓋全版 Loading
      // operatorStore.logout().then(() => {
      //   router.push('/login');
      // });
    };

    // 自定義欄位
    const customDialog = ref(false);
    const openCustomStatus = () => {
      customDialog.value = true;
    };

    return {
      username,
      // resetPasswd,
      // openPasswdReset,
      logout,
      customDialog,
      openCustomStatus,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
$header-height: 56px;
// dropdown element
.profile {
  &-menu {
    width: 190px;
    :deep() {
      .profile-option {
        padding: 0 20px;
        line-height: 32px;
        &:hover {
          background-color: $primary-4;
        }
        &__title {
          padding: 0 20px;
          font-size: 12px;
          line-height: 30px;
          color: $text-3;
          cursor: default;
        }
      }
    }
  }
  &-trigger {
    height: $header-height;

    @include space(5px);
    @include flex-basic(center);
    padding: 0 10px;
    color: white;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
    &__mobile {
      @include flex-basic(center);
      width: $header-height;
      height: $header-height;
      font-size: 24px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
@media (max-width: 767px) {
  .profile-trigger {
    display: none;
    &__mobile {
      display: flex;
    }
  }
}
@media (min-width: 768px) {
  .profile-trigger {
    display: flex;
    &__mobile {
      display: none;
    }
  }
}
</style>
