<template lang="pug">
//- Nav Bar
el-header#main-header
  //- 縮合
  i.mdi.mdi-menu.trigger(@click="collapseMenu")
  //- 線上會員人數
  online-member(v-if="memberStatus" :key="`online-update-${renderKey}`")
  //- 美東時間時鐘
  clock(v-if="clockStatus")
  //- 置右區塊
  .suffix
    //- 功能列
    feature-bar
      //- 特例：切換語系
      template(#language="{ feature }")
        trans-locale(
          type="dropdown"
          :title="t(feature.dict)"
          :class="[feature.icon, feature.class]"
        )
    //- 個人資料
    profile
//- 特例：切換語系
trans-locale(v-model="langDialogVisible" type="dialog")
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  provide,
  reactive,
  ref,
  // getCurrentInstance,
  // ComponentInternalInstance,
  // watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
// import { useRouter } from 'vue-router';
// import { codeMap } from '@/plugins/errorcode';
// api
import adminApi from '@/api/admin';
// import gameApi from '@/api/game';
// import systemApi from '@/api/system';
// components
import { ElHeader } from 'element-plus';
import Clock from './clock.vue';
import OnlineMember from './online-member.vue';
import FeatureBar from './feature-bar/index.vue';
import Profile from './profile/index.vue';
import TransLocale from './feature-bar/trans-locale.vue';
import type { SlotSet, CustomStatus, CustomSwitch } from './profile/nav-info';

export default defineComponent({
  name: 'HeaderNavbar',
  components: {
    ElHeader,
    Clock,
    OnlineMember,
    FeatureBar,
    Profile,
    TransLocale,
  },
  emits: ['collapse'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'parent' });
    // // const store = useStore();
    // const router = useRouter();
    // 開關縮合側欄 Menu (固定)
    const collapseMenu = () => {
      emit('collapse');
    };
    const langDialogVisible = ref(false);
    // 特定客製化 icon feature
    const slotFeatures: Record<string, SlotSet> = {
      language: {
        slot: 'language',
        hook: () => {
          langDialogVisible.value = true;
        },
      },
    };
    // 線上人數更新
    const renderKey = ref<0 | 1>(0);
    const updateOnlineMember = () => {
      renderKey.value = renderKey.value ? 0 : 1;
    };
    // 取得狀態列資料 (origin)
    const customStatus = reactive<CustomStatus>({
      // 圖示開關
      collapse: { enable: true, default: true },
      // 預設 nav bar 功能
      info: [] as CustomSwitch[],
      // 功能 (icon)
      feature: [] as CustomSwitch[],
    });
    // // 更新維護遊戲快捷
    // const updateGamePlatCounter = () => {
    //   const gamePlatformStatus = customStatus.feature.find(
    //     fea => fea.name === 'gamelobbyPlatform',
    //   );
    //   if (gamePlatformStatus && gamePlatformStatus.enable) {
    //     gameApi.getMaintainAmount().then(resp => {
    //       gamePlatformStatus.count = resp.data.data;
    //     });
    //   }
    // };
    // 更新資訊 (會同時更新遊戲維護數量)
    const getProfile = () => {
      return adminApi.getAdminProfile().then(resp => {
        const data: CustomSwitch[] = resp.data.data;
        // 縮合
        const collapse = data.find(item => item.name === 'iconCollapse');
        if (collapse) {
          customStatus.collapse = {
            enable: collapse.enable as boolean,
            default: collapse.default_enable as boolean,
          };
        }
        // todo remove name refuse
        // icon 功能
        customStatus.feature = data
          .filter(item => item.type === 'icon')
          .map(item => ({
            ...item,
            default_enable: item.defult_enable,
            sort: item.defult_sort as number,
            count: 0,
            // 補入 slot set
            ...(slotFeatures[item.name] || {}),
          }))
          .sort((a, b) => a.sort - b.sort);
        // 預設功能
        customStatus.info = data
          .filter(item => item.type === 'info')
          .map(item => ({ ...item, default_enable: item.defult_enable }));
        // 更新線上人數
        updateOnlineMember();
        // updateGamePlatCounter();
      });
    };
    getProfile().then(() => {
      // 更新下載專區數量
      // store.dispatch('navbar/updateDownloadCounter');
    });
    provide('Nav:customStatus', customStatus);
    provide('Nav:updateProfile', getProfile);
    // 線上會員人數功能開關
    const memberStatus = computed(() => {
      const memberInfoStatus = customStatus.info.find(
        item => item.name === 'onlineMember',
      );
      if (memberInfoStatus) {
        return memberInfoStatus.enable;
      }
      return false;
    });
    // 美東時間功能開關
    const clockStatus = computed(() => {
      const clockInfoStatus = customStatus.info.find(
        item => item.name === 'clock',
      );
      if (clockInfoStatus) {
        return clockInfoStatus.enable;
      }
      return false;
    });
    // // 下載專區數量
    // const downloadCounter = computed(() => {
    //   return store.getters['navbar/downloadCounter'];
    // });
    // watch(downloadCounter, value => {
    //   const downloadStatus = customStatus.feature.find(
    //     fea => fea.name === 'download',
    //   );
    //   if (downloadStatus && downloadStatus.enable) {
    //     downloadStatus.count = value;
    //   }
    // });
    // // Bind Websocket
    // const currentInstance = getCurrentInstance() as ComponentInternalInstance;
    // const isWsConnected = computed(() => {
    //   return store.getters['websocket/isConnected'];
    // });
    // watch(
    //   isWsConnected,
    //   connect => {
    //     const operatorId = store.getters['operator/operator']?.id;
    //     if (connect && operatorId) {
    //       currentInstance.appContext.config.globalProperties.$socket.sendObj({
    //         action: 0,
    //         group: `GM:${operatorId}`,
    //         type: 'bind',
    //       });
    //     }
    //   },
    //   { immediate: true },
    // );
    // // websocket onmessage
    // (currentInstance?.appContext.config.globalProperties.sockets).onmessage =
    //   (evt: { data: string }) => {
    //     const msg = JSON.parse(evt.data);
    //     if (msg.type) {
    //       if (msg.type === 'RefreshPermission') {
    //         // 刷新權限
    //         store.dispatch('checkSession').then(resp => {
    //           if (resp.data.result) {
    //             // 當前頁面如果沒有權限就 reload
    //             if (
    //               router.currentRoute.value.meta.perm &&
    //               !store.getters['permission/checkPerm'](
    //                 router.currentRoute.value.meta.perm,
    //               )
    //             ) {
    //               router.replace('/forbidden');
    //             }
    //             // 取得狀態列資料
    //             getProfile();
    //           } else {
    //             router.replace('/login');
    //           }
    //         });
    //       } else if (msg.type === 'MaintainLobby') {
    //         // 更新維護中的 Lobby 數量
    //         const gamePlatformStatus = customStatus.feature.find(
    //           fea => fea.name === 'gamelobbyPlatform',
    //         );
    //         if (gamePlatformStatus && gamePlatformStatus.enable) {
    //           gamePlatformStatus.count = msg.maintain_lobby.length;
    //         }
    //       } else if (msg.type === 'RefreshExport') {
    //         // 刷新下載專區
    //         store.dispatch('navbar/updateDownloadCounter');
    //       } else if (
    //         msg.type === 'RefreshFeatureMaintenance' &&
    //         router.currentRoute.value.meta.perm !== undefined
    //       ) {
    //         // 刷新維護狀態
    //         systemApi
    //           .getFeatureEntranceMaintenanceStatus(
    //             router.currentRoute.value.meta.perm as string,
    //           )
    //           .then(resp => {
    //             if (resp.data.result && resp.data.data.status) {
    //               router.replace(
    //                 `/error_page?date=${resp.data.data.end_at}&dict=${resp.data.data.dict}&code=${codeMap.featureMaintain}&name=${resp.data.data.perm_name}`,
    //               );
    //             }
    //           });
    //       }
    //     }
    //   };
    return {
      collapseMenu,
      renderKey,
      //   updateOnlineMember,
      langDialogVisible,
      memberStatus,
      clockStatus,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
// 導覽列樣式
$nav-bgcolor: linear-gradient(90deg, #465570 0, #758eb0);
$nav-color: white;
$collapsed-width: 70px;
$header-height: 56px;

#main-header {
  @include flex-basic;
  @include space(30px);
  height: $header-height;
  color: $nav-color;
  background: $nav-bgcolor;
  .trigger {
    @include flex-basic(center);
    width: $header-height;
    height: 100%;
    font-size: 24px;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .suffix {
    @include flex-basic(center);
    margin-right: 20px;
    margin-left: auto;
  }
}
</style>
