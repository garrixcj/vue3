<i18n src="@/languages/module/lobby.json"></i18n>
<i18n
  src="@/languages/wagers/external_game_wagers_check/wagers_check_list.json"
></i18n>

<template lang="pug">
//- 右上角提示訊息
rd-information(:is-open="false")
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
  rd-form-item.label-color(:label="t('lobby')" prop="lobby")
    rd-select(
      v-model:value="form.lobby"
      :options="lobbyOptions"
      :selected-setting="selectSetting"
      @change="lobbyChange"
    )
  //- 核對時間
  rd-form-item.label-color.time-item(prop="date")
    template(#label)
      span {{ t('check_time') }}
      rd-tooltip(
        placement="top"
        :content="t('wagers_check_list_information_5')"
      )
        i.mdi.mdi-information
    //- 核對區間 - 日期選擇
    rd-date-picker(
      v-model="form.date"
      type="date"
      placeholder="選擇日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      :disabled-date="disabledDate"
      @change="dateChange"
    )
  rd-form-item.label-color.time-item(prop="startHour")
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
  span.time-item__span ~
  rd-form-item.label-color.time-item(prop="endHour")
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
      span {{ t('search') }}
//- 特定Lobby會有提示訊息
.lobby-alert(v-if="showLobbyInfo")
  rd-alert.alert-size(
    type="warning"
    :title="t(`wagers_check_lobby${form.lobby}_info`)"
    :closable="false"
  )
//- 搜尋結果
.table
  rd-card(type="basic" no-seprate-line no-padding)
    template(#content)
      //- 搜尋結果表格
      rd-table(
        border
        :data="checkList"
        :default-sort="{ prop: 'checkInterval', order: 'ascending' }"
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
          template(#default="{ row: { result } }")
            rd-tag(v-if="result.showTag" :type="result.type" size="small") {{ t(result.message) }}
            span.error-msg(v-else) {{ t(result.message) }}
        //- 開始搜尋吧
        template(v-if="!searched" #empty)
          before-search-empty(label="開始搜尋吧")
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { TabRouteWatch, QuerySetting } from '@/components/utils/route-watch';
import { useLoadingStore } from '@/stores/loading';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import gameAPI from '@/api/game';
import dayjs from 'dayjs';

//- Type定義
//- 搜尋欄位
type SearchForm = {
  lobby: string;
  date: string;
  startHour: string;
  endHour: string;
};

//- LobbySelect選項
type Lobby = {
  value: string;
  label: string;
};

type ListItem = {
  time: string;
  result: {
    message: string;
    showTag: boolean;
    type: string;
  };
};

type searchItem = {
  lobby: number;
  start_date_time: string;
  end_date_time: string;
};

export default defineComponent({
  name: 'WagersCheckList', // 外接遊戲注單核對
  components: {
    BeforeSearchEmpty,
  },
  setup() {
    //- i18n
    const { t } = useI18n({ useScope: 'local' });

    const loadingStore = useLoadingStore();

    const searched = ref(false);

    const formRef = ref();

    //- 查詢表單
    const form = reactive<SearchForm>({
      lobby: '',
      date: '',
      startHour: '',
      endHour: '',
    });

    //- 驗證開始時間是否有小於結束時間
    const checkHour = () => {
      return new Promise<void>((resolve, reject) => {
        if (!compareHour(form.startHour, form.endHour)) {
          reject(t('start_time_can_not_after_end_time'));
        }
        resolve();
      });
    };

    //- 表單驗證
    const rules = reactive({
      lobby: [
        {
          required: true,
          message: t('please_select_game_lobby'),
          trigger: 'summit',
        },
      ],
      date: [
        {
          required: true,
          message: t('please_select_date'),
          trigger: 'summit',
        },
      ],
      startHour: [
        {
          required: true,
          message: t('please_select_start_time'),
          trigger: 'summit',
        },
        { validator: checkHour, trigger: 'summit' },
      ],
      endHour: [
        {
          required: true,
          message: t('please_select_end_time'),
          trigger: 'summit',
        },
        { validator: checkHour, trigger: 'summit' },
      ],
    });

    //- LobbySelection設定
    const selectSetting = {
      minWidth: 200,
    };

    //- Lobby清單
    const lobbyOptions = ref<Lobby[]>([]);

    //- 取得目前可提供核對的Lobby清單
    const getWagersLobby = () => {
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
    };

    //- Html渲染前取得可搜尋Lobby資料
    onBeforeMount(() => {
      getWagersLobby();
    });

    //- 特定Lobby顯示對應提示
    let showLobbyInfo = computed(() => {
      //- 有提示的Lobby
      const hasLobbyInfo = [19, 37, 46, 49, 52, 135, 143];
      return hasLobbyInfo.includes(Number(form.lobby));
    });

    //- Lobby改變時清空核對時間
    const lobbyChange = () => {
      form.date = '';
      form.startHour = '';
      form.endHour = '';
    };

    //- 取得目前可搜尋時間(轉美東時間後再往前1.5小時)
    const searchableDateTime = () => {
      return dayjs(new Date()).utcOffset(-4).subtract(1.5, 'hour');
    };

    //- 設定核對區間可選日期;
    const disabledDate = (time: Date) => {
      const date = searchableDateTime().startOf('date');
      return dayjs(time.getTime()) > date;
    };

    //- 比較小時
    const compareHour = (start: string, end: string) => {
      const startHour = parseInt(start.split(':')[0]);
      const endHour = parseInt(end.split(':')[0]);
      const diffHour = endHour - startHour;
      //- isNaN = 其中一個時間沒選
      const result = isNaN(diffHour) || diffHour >= 0;

      return result;
    };

    //- 日期變動時重置開始及結束時間
    const dateChange = () => {
      //- date-picker清空時會把值設成null
      if (form.date === null) {
        form.date = '';
      }
      form.startHour = '';
      form.endHour = '';
    };

    //- 計算結束時間的起始小時
    let startHourLimit = computed(() => {
      return form.startHour === '' ? '00:00:00' : form.startHour;
    });

    //- 開始時間變動時重置結束時間
    const startHourChange = () => {
      form.endHour = '';
    };

    //- 計算開始與結束時間的結束小時
    let endHourLimit = computed(() => {
      let limit = '00:00:00';
      const today = searchableDateTime().startOf('date');
      if (dayjs(form.date).isValid()) {
        limit = dayjs(form.date).isSame(today, 'day')
          ? searchableDateTime().format('HH:mm:ss')
          : '23:00:00';
      }
      return limit;
    });

    const checkList = ref<ListItem[]>([]);

    //- 搜尋及路由設定
    //- 點擊搜尋後觸發驗證
    const startSearch = () => {
      formRef.value.validate((validate: boolean) => {
        if (validate) {
          watcher.queryRoute(querySet.getQuery());
        }
      });
    };

    //- 路由設定，lobby, date, startHour, endHour四項
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

    //- 搜尋
    const searchData = () => {
      if (
        !form.lobby ||
        !form.date ||
        !form.startHour ||
        !form.endHour ||
        !compareHour(form.startHour, form.endHour)
      ) {
        return;
      }

      const lobby = form.lobby;
      // 取得總小時數
      let startDateTime = dayjs(`${form.date} ${form.startHour}`);
      const endDateTime = dayjs(`${form.date} ${form.endHour}`);
      const totalHours = endDateTime.diff(startDateTime, 'h');

      // 將要查詢的時間以每小時做區間整理
      const searchSet = ref<searchItem[]>([]);
      for (let i = 0; i <= totalHours; i++) {
        const dataEndDateTime = startDateTime
          .endOf('h')
          .endOf('m')
          .format('YYYY-MM-DD HH:mm:ss');

        searchSet.value.push({
          lobby: parseInt(lobby),
          start_date_time: startDateTime.format('YYYY-MM-DD HH:mm:ss'),
          end_date_time: dataEndDateTime,
        });
        startDateTime = startDateTime.add(1, 'hour');
      }

      const codeMap: Record<string, number> = {
        // 核對失敗
        matchFail: 68010004,
        // 核對失敗，請稍後嘗試
        invalidResponse: 68010025,
      };

      loadingStore.page = true;
      Promise.all(
        searchSet.value.map(value => gameAPI.getWagersCheckReport(value)),
      ).then(resp => {
        checkList.value = resp.map((value, key) => {
          const time = `${dayjs(searchSet.value[key].start_date_time).format(
            'HH:mm:ss',
          )}`;

          let resultData: ListItem['result'] = {
            message: '',
            showTag: false,
            type: '',
          };

          const {
            result,
            code,
            data: { data: { check = false } = {} } = {},
          } = value.data;
          // 核對動作成功 結果為符合或不符合
          if (result) {
            resultData = {
              showTag: true,
              type: check ? 'success' : 'danger',
              message: check ? 'match' : 'not_match',
            };
            // 核對動作失敗
          } else if (code === codeMap.matchFail) {
            resultData = {
              showTag: true,
              type: 'info',
              message: 'match_fail',
            };
            // 核對動作失敗 請稍後嘗試
          } else if (code === codeMap.invalidResponse) {
            resultData.message = 'try_again_later_hour';
            // 其餘錯誤情況歸類為系統錯誤
          } else {
            resultData.message = 'system_error';
          }
          return { time, result: resultData };
        });
        searched.value = true;
        loadingStore.page = false;
      });
    };

    //- 初始狀態
    const init = () => {
      form.lobby = '';
      form.date = '';
      form.startHour = '';
      form.endHour = '';
      checkList.value = [];
      searched.value = false;
    };

    //- 設定監聽及觸發搜尋
    const watcher = new TabRouteWatch('wagersCheckList');
    watcher.setWatcher((query: {}) => {
      if (Object.keys(query).length === 1 && Object.keys(query)[0] === 'tab') {
        init();
      } else {
        formRef.value?.resetFields();
        querySet.setField();
        searchData();
      }
    });

    return {
      t,
      searched,
      formRef,
      form,
      rules,
      selectSetting,
      lobbyOptions,
      getWagersLobby,
      showLobbyInfo,
      lobbyChange,
      disabledDate,
      dateChange,
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
  @include flex-basic($align: flex-start);
  .time-item {
    margin-right: 10px;
    &__span {
      margin-right: 10px;
      line-height: 34px;
    }
  }
}

.label-color {
  @include form-label-color($text-3);
}

.lobby-alert {
  margin-bottom: 10px;
  .alert-size {
    padding: 7px 15px;
  }
}
.error-msg {
  color: $danger;
}
</style>
