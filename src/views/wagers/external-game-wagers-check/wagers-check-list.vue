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
  size="default"
  :model="form"
  :rules="rules"
)
  //- 遊戲平台
  rd-form-item.label-color.asterisk-left(:label="t('lobby')" prop="lobby")
    rd-select(
      v-model:value="form.lobby"
      :options="lobbySelectOption"
      :selected-setting="customSelectedSetting"
    )
  //- 核對區間
  rd-form-item.label-color.time-item.asterisk-left(prop="date")
    template(#label)
      span {{ t('check_interval') }}
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
    )
  rd-form-item.label-color.time-item(prop="startHour")
    //- 核對區間 - 開始時間選擇
    rd-time-select(
      v-model="form.startHour"
      placeholder="開始時間"
      format="HH:mm:ss"
      start="00:00"
      step="01:00"
      :end="timeLimitSet.startHourEndLimit"
      :editable="false"
    )
  span.time-item__span ~
  rd-form-item.label-color.time-item(prop="endHour")
    //- 核對區間 - 結束時間選擇
    rd-time-select(
      v-model="form.endHour"
      placeholder="結束時間"
      step="01:00"
      format="HH:mm:ss"
      :start="timeLimitSet.endHourStartLimit"
      :end="timeLimitSet.endHourEndLimit"
      :editable="false"
    )
  //- 搜尋按鈕
  rd-form-item
    rd-button(type="search" @click="startSearch()")
      i.mdi.mdi-magnify
      span {{ t('search') }}
//- 特定Lobby會有提示訊息
.lobby-alert(v-if="showLobbyInfo")
  rd-alert(
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
        :data="tableDataList"
        :default-sort="{ prop: 'checkInterval', order: 'ascending' }"
      )
        //- 核對區間
        rd-table-column(
          :label="t('check_interval')"
          sortable
          prop="checkInterval"
          header-align="center"
          align="center"
          :resizable="false"
        )
        //- 核對結果
        rd-table-column(
          :label="t('wagers_check_result')"
          prop="checkResult"
          header-align="center"
          align="center"
          :resizable="false"
        )
          //- 根據結果不同會有tag及message形式
          template(#default="scope")
            rd-tag(
              v-if="scope.row.checkResult.showTag"
              :type="scope.row.checkResult.type"
              size="small"
            ) {{ t(scope.row.checkResult.key) }}
            span.error_msg(v-else) {{ t(scope.row.checkResult.message) }}
        //- 開始搜尋吧
        template(v-if="!searched" #empty)
          before-search-empty(label="開始搜尋吧")
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { TabRouteWatch, QuerySetting } from '@/components/utils/route-watch';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';
import gameAPI from '@/api/game';
import dayjs from 'dayjs';
import { notify } from '@/components/utils/notification';

export default defineComponent({
  name: 'WagersCheckList', // 外接遊戲注單核對
  components: {
    BeforeSearchEmpty,
  },
  setup() {
    //- i18n
    const { t } = useI18n({ useScope: 'local' });

    const searched = ref(false);

    const formRef = ref();

    // 初始值
    const timeLimitSet = reactive({
      startHourEndLimit: '00:00:00',
      endHourStartLimit: '00:00:00',
      endHourEndLimit: '00:00:00',
    });

    type SearchFormType = {
      lobby: string;
      date: string | null;
      startHour: string;
      endHour: string;
    };

    // 查詢表單
    const form = reactive<SearchFormType>({
      lobby: '',
      date: null,
      startHour: '',
      endHour: '',
    });

    const checkTime = () => {
      return new Promise<void>((resolve, reject) => {
        const startDateTime = dayjs(`${form.date} ${form.startHour}`);
        const endDateTime = dayjs(`${form.date} ${form.endHour}`);
        const totalHours = endDateTime.diff(startDateTime, 'h');
        if (totalHours < 0) {
          reject(new Error(t('start_time_can_not_after_end_time')));
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
        { required: true, message: t('please_select_date'), trigger: 'summit' },
      ],
      startHour: [
        {
          required: true,
          message: t('please_select_start_time'),
          trigger: 'summit',
        },
        { validator: checkTime, trigger: 'summit' },
      ],
      endHour: [
        {
          required: true,
          message: t('please_select_end_time'),
          trigger: 'summit',
        },
        { validator: checkTime, trigger: 'summit' },
      ],
    });

    //- 有顯示提示訊息的Lobby
    const hasLobbyInfo = [19, 37, 46, 49, 52, 135, 143];

    // 特定Lobby需要顯示提示訊息
    const showLobbyInfo = ref(false);

    //- 取得目前可搜尋時間(轉美東時間後再往前1.5小時)
    const today = dayjs(new Date()).utcOffset(-5.5);

    //- 設定核對區間可選日期，只能搜美東時間今天以前(-12)，且無法即時核對當前注單，需往前1.5小時(共-13.5)
    const disabledDate = (time: Date) => {
      return dayjs(time).diff(today, 'hour', true) > -13.5;
    };

    //- 設定核對區間可選時間 hourLimit
    const timeLimit = today.format('HH:mm:ss');

    watch(form, val => {
      //- Lobby欄位
      //- 判斷選了Lobby後 是否要顯示Lobby提示
      showLobbyInfo.value = hasLobbyInfo.includes(Number(val.lobby));

      //- date欄位
      //- 如果選了今天 將開始及結束的最後可選區間都設定成最後可選時間
      if (dayjs(val.date).isSame(today, 'day')) {
        timeLimitSet.startHourEndLimit = timeLimitSet.endHourEndLimit =
          timeLimit;
        //- 如果有選日期 但不是今天，將開始時間跟結束時間的最後可選時間都設定成23:00;00
      } else if (val.date !== null) {
        timeLimitSet.startHourEndLimit = timeLimitSet.endHourEndLimit =
          '23:00:00';
        //- 其他情況 設定成00:00:00
      } else {
        form.startHour = '';
        form.endHour = '';
        timeLimitSet.startHourEndLimit = timeLimitSet.endHourEndLimit =
          '00:00:00';
      }

      //- endHour欄位
      //- 如果有選開始時間 將結束時間的start設定成選擇的開始時間
      timeLimitSet.endHourStartLimit =
        val.startHour === '' ? '00:00:00' : val.startHour;
    });

    //- LobbySelection設定
    const customSelectedSetting = {
      minWidth: 200,
    };

    //- Lobby清單
    const lobbySelectOption: { value: string; label: string }[] = reactive([]);

    //- 取得目前可提供核對的Lobby清單
    const getWagersLobby = () => {
      gameAPI.getWagersCheckLobby().then(resp => {
        if (resp.data.result) {
          const wagersLobbyData = resp.data.data;
          wagersLobbyData.forEach((lobby: string) => {
            lobbySelectOption.push({
              value: `${lobby}`,
              label: t(`lobby${lobby}`),
            });
          });
        }
      });
    };

    type tableItem = {
      checkInterval: string;
      checkResult: object;
    };

    const tableDataList = ref<tableItem[]>([]);

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
      {
        key: 're',
        set: (val: string) => {
          searched.value = typeof val !== 'undefined';
        },
      },
    ]);

    //- 搜尋
    const searchData = () => {
      if (!form.lobby || !form.date || !form.startHour || !form.endHour) {
        return;
      }

      tableDataList.value = [];

      const lobby = form.lobby;
      // 取得總小時數
      let startDateTime = dayjs(`${form.date} ${form.startHour}`);
      const endDateTime = dayjs(`${form.date} ${form.endHour}`);
      const totalHours = endDateTime.diff(startDateTime, 'h');

      // 將要查詢的時間以每小時做區間整理
      const dataSet = [];
      for (let i = 0; i <= totalHours; i++) {
        const timeInterval: tableItem = {
          checkInterval: startDateTime.format('HH:mm:ss'),
          checkResult: { check: false, message: '' },
        };
        tableDataList.value.push(timeInterval);
        const dataEndDateTime = startDateTime
          .endOf('h')
          .endOf('m')
          .format('YYYY-MM-DD HH:mm:ss');
        dataSet.push({
          lobby: parseInt(lobby),
          start_date_time: startDateTime.format('YYYY-MM-DD HH:mm:ss'),
          end_date_time: dataEndDateTime,
        });
        startDateTime = startDateTime.add(1, 'hour');
      }

      // 針對每小時呼叫核對api
      dataSet.forEach((value, key) => {
        gameAPI.getWagersCheckReport(value).then(resp => {
          const data = resp.data.data;
          // 核對動作成功 結果為符合或不符合
          if (data.result) {
            tableDataList.value[key].checkResult = {
              showTag: true,
              type: data.check ? 'success' : 'danger',
              key: data.check ? 'match' : 'not_match',
            };
            // 核對動作失敗
          } else if (data.code === 68010004) {
            tableDataList.value[key].checkResult = {
              showTag: true,
              type: 'info',
              key: 'match_fail',
            };
            // 核對動作失敗 請稍後嘗試
          } else if (data.code === 68010025) {
            tableDataList.value[key].checkResult = {
              showTag: false,
              message: 'try_again_later_hour',
            };
            // 其餘錯誤情況歸類為系統錯誤
          } else {
            const responseCode = resp.data.response_code;
            const code = data.code;
            const hErrorMsg = h('div', null, t('system_error'));
            const hErrorCode = h('div', null, `(${code})#${responseCode}`);
            tableDataList.value[key].checkResult = {
              showTag: false,
              message: 'system_error',
            };
            notify.error({
              title: t('error'),
              dangerouslyUseHTMLString: true,
              message: h('div', null, [hErrorMsg, hErrorCode]),
            });
          }
        });
      });
    };

    //- 設定監聽及觸發搜尋
    const watcher = new TabRouteWatch('WagersCheckList');
    watcher.setWatcher(() => {
      formRef.value?.resetFields();
      querySet.setField();
      searchData();
    });

    return {
      t,
      customSelectedSetting,
      lobbySelectOption,
      form,
      formRef,
      timeLimitSet,
      showLobbyInfo,
      rules,
      timeLimit,
      disabledDate,
      searched,
      tableDataList,
      startSearch,
      getWagersLobby,
    };
  },
  mounted() {
    //- 開啟頁面時先撈可以核對的Lobby
    this.getWagersLobby();
  },
});
</script>

<style lang="scss" scoped>
.search-form {
  @include inline-flex-basic($align: flex-start);
  .time-item {
    margin-right: 10px;
    &__span {
      margin-top: 7px;
      margin-right: 10px;
    }
  }
}

.label-color {
  @include form-label-color($text-3);
}
.el-select {
  width: 140px;
}

.lobby-alert {
  margin-bottom: 10px;
  .el-alert {
    padding: 7px 15px;
  }
}
.table {
  .error_msg {
    color: $danger;
  }
}
</style>
