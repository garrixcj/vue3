<i18n src="@/languages/module/lobby.json"></i18n>
<i18n
  src="@/languages/wagers/external_game_wagers_check/wagers_check_list.json"
></i18n>

<template lang="pug">
//- 右上角提示訊息
rd-information
  ul
    li {{ t('wagers_check_list_information_1') }}
    li {{ t('wagers_check_list_information_2') }}
    li {{ t('wagers_check_list_information_3') }}
    li {{ t('wagers_check_list_information_4') }}
//- 搜尋欄位
rd-form.search-form(
  ref="formRef"
  inline
  size="large"
  :model="form"
  :rules="rules"
)
  //- 遊戲平台
  rd-form-item(:label="t('lobby')" prop="lobby")
    rd-select(
      v-model:value="form.lobby"
      quick-search
      size="default"
      :options="lobbyOptions"
      :selected-setting="selectSetting"
      :popper-setting="popperSetting"
      @change="lobbyChange"
    )
  //- 核對時間
  rd-form-item.time-group(prop="date")
    template(#label)
      span {{ t('check_time') }}
      rd-tooltip(
        placement="top"
        :offset=0
        :content="t('wagers_check_list_information_5')"
      )
        i.mdi.mdi-information
    //- 核對區間 - 日期選擇
    rd-date-picker.datetime-width(
      v-model="form.date"
      type="date"
      placeholder="選擇日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      :disabled-date="disabledDate"
      @change="checkDateTime"
    )
  rd-form-item.time-group.hour(prop="startHour")
    //- 核對區間 - 開始時間選擇
    rd-time-select(
      v-model="form.startHour"
      placeholder="開始時間"
      format="HH:mm:ss"
      start="00:00"
      step="01:00"
      :end="endHourLimit"
      :editable="false"
      @change="startHourChange"
    )
  span.time-group__sperator ~
  rd-form-item.hour(prop="endHour")
    //- 核對區間 - 結束時間選擇
    rd-time-select(
      v-model="form.endHour"
      placeholder="結束時間"
      step="01:00"
      format="HH:mm:ss"
      :start="startHourLimit"
      :end="endHourLimit"
      :editable="false"
    )
  //- 搜尋按鈕
  rd-form-item
    rd-button(
      type="search"
      size="large"
      i.mdi.mdi-magnify
      @click="startSearch()"
    )
      i.mdi.mdi-magnify
      span {{ t('search') }}
//- 特定Lobby會有提示訊息
rd-alert.alert-size(
  v-if="showLobbyInfo"
  type="warning"
  :description="t(lobbyInfo[form.lobby])"
  :closable="false"
)
//- 搜尋結果
//- 搜尋結果表格
rd-table(
  border
  :data="checkList"
  :default-sort="{ prop: 'time', order: 'ascending' }"
)
  //- 核對時間
  rd-table-column(
    :label="t('check_time')"
    sortable
    prop="time"
    header-align="center"
    align="center"
    :resizable="false"
  )
  //- 核對結果
  rd-table-column(
    :label="t('wagers_check_result')"
    prop="result"
    header-align="center"
    align="center"
    :resizable="false"
  )
    //- 根據結果不同會有tag及message形式
    template(#default="{ row: { showTag, type, message } }")
      rd-tag(v-if="showTag" :type="type" size="small") {{ t(message) }}
      span.error-msg(v-else) {{ t(message) }}
  //- 開始搜尋吧
  template(v-if="!searched" #empty)
    before-search-empty(label="開始搜尋吧")
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { TabRouteWatch, QuerySetting } from '@/components/utils/route-watch';
import { useLoadingStore } from '@/stores/loading';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import gameAPI from '@/api/game';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// Type定義
// 搜尋欄位
type SearchForm = {
  lobby: string;
  date: string;
  startHour: string;
  endHour: string;
};

// LobbySelect選項
type Lobby = {
  value: string;
  label: string;
};

type ListItem = {
  time: string;
  message: string;
  showTag: boolean;
  type: string;
};

type TimeSet = {
  start_date_time: string;
  end_date_time: string;
};

export default defineComponent({
  name: 'WagersCheckList', // 外接遊戲注單核對
  components: {
    BeforeSearchEmpty,
  },
  setup() {
    // i18n
    const { t } = useI18n({ useScope: 'local' });

    const loadingStore = useLoadingStore();

    const searched = ref(false);

    const formRef = ref();

    // 需對應的外接api錯誤情況
    const codeMap = {
      // 核對失敗
      matchFail: 68010004,
      // 核對失敗，請稍後嘗試
      invalidResponse: 68010025,
    };

    dayjs.extend(isSameOrAfter);

    // 有提示訊息的Lobby
    const lobbyInfo: { [key: string]: string } = {
      '19': 'wagers_check_lobby19_info',
      '37': 'wagers_check_lobby37_info',
      '46': 'wagers_check_lobby46_info',
      '49': 'wagers_check_lobby49_info',
      '52': 'wagers_check_lobby52_info',
      '135': 'wagers_check_lobby135_info',
      '143': 'wagers_check_lobby143_info',
    };

    const scrollToTop = inject(
      'ExternalGameWagersCheck:scrollToTop',
    ) as Function;

    // 查詢表單
    const form = reactive<SearchForm>({
      lobby: '',
      date: '',
      startHour: '',
      endHour: '',
    });

    // 驗證開始時間是否有小於結束時間
    const validHour = () => {
      return new Promise<void>((resolve, reject) => {
        if (!compareHour(form.startHour, form.endHour)) {
          reject(t('start_time_can_not_after_end_time'));
        }
        resolve();
      });
    };

    // 表單驗證
    const rules = reactive({
      lobby: [
        {
          required: true,
          message: t('please_select_game_lobby'),
          trigger: 'change',
        },
      ],
      date: [
        {
          required: true,
          message: t('please_select_date'),
          trigger: 'change',
        },
      ],
      startHour: [
        {
          required: true,
          message: t('please_select_start_time'),
          trigger: 'change',
        },
        { validator: validHour, trigger: 'change' },
      ],
      endHour: [
        {
          required: true,
          message: t('please_select_end_time'),
          trigger: 'change',
        },
        { validator: validHour, trigger: 'change' },
      ],
    });

    // LobbySelection設定
    const selectSetting = {
      minWidth: 200,
    };

    const popperSetting = {
      maxHeight: 205,
    };

    // Lobby清單
    const lobbyOptions = ref<Lobby[]>([]);

    // 取得目前可提供核對的Lobby清單
    gameAPI.getWagersCheckLobby().then(resp => {
      if (resp.data.result) {
        const lobbyData = resp.data.data;
        lobbyOptions.value = lobbyData.map((lobby: string) => {
          let option = {
            value: `${lobby}`,
            label: t(`lobby${lobby}`),
          };
          return option;
        });
      }
    });

    // 特定Lobby顯示對應提示
    const showLobbyInfo = computed(() => {
      return Object.keys(lobbyInfo).includes(form.lobby);
    });

    // Lobby改變時，如果時間不合法，清空不合法的核對時間
    const lobbyChange = () => {
      //確認日期是否有超過可選範圍
      if (disabledDate(new Date(form.date))) {
        form.date = '';
      }
      checkDateTime();
    };

    // 取得目前可搜尋時間(轉美東時間後再往前1.5小時) 開元棋牌及KX棋牌為往前12小時
    const searchableDateTime = () => {
      let datetime = dayjs(new Date()).utcOffset(-4).subtract(1.5, 'day');
      if (form.lobby === '49' || form.lobby === '135') {
        datetime = dayjs(new Date()).utcOffset(-4).subtract(12, 'hour');
      }
      return datetime;
    };

    // 設定核對區間可選日期;
    const disabledDate = (time: Date) => {
      const date = searchableDateTime().startOf('date');
      return dayjs(time.getTime()) > date;
    };

    // 比較結束小時是否等於或大於開始小時
    const compareHour = (start: string, end: string) => {
      let result = true;
      if (start !== '' && end !== '') {
        const startTime = dayjs().format(`YYYY-MM-DD ${start}`);
        const endTime = dayjs().format(`YYYY-MM-DD ${end}`);
        result = dayjs(endTime).isSameOrAfter(startTime, 'h');
      }
      return result;
    };

    // 日期變動時重置不可選的開始及結束時間
    const checkDateTime = () => {
      // date-picker清空時會把值設成null
      if (form.date === null) {
        form.date = '';
      }
      // 判斷開始時間是否有超過可選時間限制
      if (!compareHour(form.startHour, endHourLimit.value)) {
        form.startHour = '';
      }
      // 判斷結束時間是否有超過可選時間限制
      if (!compareHour(form.endHour, endHourLimit.value)) {
        form.endHour = '';
      }
    };

    // 計算結束時間的起始小時
    const startHourLimit = computed(() => {
      return form.startHour === '' ? '00:00:00' : form.startHour;
    });

    // 開始時間變動時，如果結束時間不合法，重置結束時間
    const startHourChange = () => {
      if (!compareHour(form.startHour, form.endHour)) {
        form.endHour = '';
      }
    };

    // 計算開始與結束時間的結束小時
    const endHourLimit = computed(() => {
      let limit = '23:00:00';
      const today = searchableDateTime().startOf('date');
      if (dayjs(form.date).isValid() && dayjs(form.date).isSame(today, 'day')) {
        limit = searchableDateTime().format('HH:mm:ss');
      }
      return limit;
    });

    // 搜尋及路由設定
    // 點擊搜尋後觸發驗證
    const startSearch = () => {
      formRef.value.validate((validate: boolean) => {
        if (validate) {
          watcher.queryRoute(querySet.getQuery());
        }
      });
    };

    // 路由設定，lobby, date, startHour, endHour四項
    const querySet = new QuerySetting([
      {
        key: 'lobby',
        get: () => form.lobby,
        set: (val: string) => {
          form.lobby = val;
        },
        default: '',
      },
      {
        key: 'date',
        get: () => form.date,
        set: (val: string) => {
          form.date = val;
        },
        default: '',
      },
      {
        key: 'startHour',
        get: () => form.startHour,
        set: (val: string) => {
          form.startHour = val;
        },
        default: '',
      },
      {
        key: 'endHour',
        get: () => form.endHour,
        set: (val: string) => {
          form.endHour = val;
        },
        default: '',
      },
    ]);

    //取得核對資料
    const getCheckList = (lobby: string, timeSet: TimeSet) => {
      const listItem = gameAPI
        .getWagersCheckReport(lobby, timeSet)
        .then(resp => {
          const result = resp.data.result;

          const time = `${dayjs(timeSet.start_date_time).format('HH:mm:ss')}`;

          let message = '';
          let showTag = false;
          let type = '';

          // 核對動作成功 結果為符合或不符合
          if (result) {
            showTag = true;
            type = resp.data.data.data.check ? 'success' : 'danger';
            message = resp.data.data.data.check ? 'match' : 'not_match';
            // 核對動作失敗
          } else if (resp.data.code === codeMap.matchFail) {
            showTag = true;
            type = 'info';
            message = 'match_fail';
            // 核對動作失敗 請稍後嘗試
          } else if (resp.data.code === codeMap.invalidResponse) {
            message = 'try_again_later_hour';
            // 其餘錯誤情況歸類為系統錯誤
          } else {
            message = 'system_error';
          }
          return { time, showTag, type, message };
        });
      return listItem;
    };

    const checkList = ref<ListItem[]>([]);

    // 搜尋
    const searchData = () => {
      if (
        !form.lobby ||
        !form.date ||
        !form.startHour ||
        !form.endHour ||
        !compareHour(form.startHour, form.endHour)
      ) {
        checkList.value = [];
        searched.value = false;
        return;
      }
      loadingStore.page = true;
      scrollToTop();
      const lobby = form.lobby;
      // 取得總小時數
      const startDateTime = dayjs(`${form.date} ${form.startHour}`);
      const endDateTime = dayjs(`${form.date} ${form.endHour}`);
      const totalHours = endDateTime.diff(startDateTime, 'h');

      // 將要查詢的時間以每小時做區間整理
      const searchSet: TimeSet[] = [];
      for (let i = 0; i <= totalHours; i++) {
        const dateTime = startDateTime.add(i, 'hour');
        searchSet[i] = {
          start_date_time: dateTime.format('YYYY-MM-DD HH:00:00'),
          end_date_time: dateTime.format('YYYY-MM-DD HH:59:59'),
        };
      }

      Promise.all(searchSet.map(value => getCheckList(lobby, value))).then(
        resp => {
          checkList.value = resp;
          searched.value = true;
          loadingStore.page = false;
        },
      );
    };

    // 設定監聽及觸發搜尋
    const watcher = new TabRouteWatch('wagersCheckList');
    watcher.setWatcher(() => {
      formRef.value?.resetFields();
      querySet.setField();
      searchData();
    });

    return {
      t,
      searched,
      formRef,
      form,
      rules,
      selectSetting,
      popperSetting,
      lobbyOptions,
      showLobbyInfo,
      lobbyInfo,
      lobbyChange,
      disabledDate,
      checkDateTime,
      startHourLimit,
      startHourChange,
      endHourLimit,
      checkList,
      startSearch,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-form {
  @include flex-basic(flex-start, flex-start);
  flex-wrap: wrap;
  .hour {
    width: 140px;
  }
  .time-group {
    :deep(.datetime-width) {
      width: 140px;
    }
    margin-right: 10px;
    &__sperator {
      margin-right: 10px;
      line-height: 34px;
    }
  }
}

.alert-size {
  padding: 7px 15px;
  margin-bottom: 10px;
  line-height: 18px;
}

.error-msg {
  color: $danger;
}
</style>
