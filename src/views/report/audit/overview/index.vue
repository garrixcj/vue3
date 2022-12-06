<template lang="pug">
rd-information
  ul
    li {{ t('audit_info1') }}
    li {{ t('audit_info2') }}
//- search-bar
rd-form(ref="formRef" size="large" inline :model="form" :rules="rules")
  //- 遊戲平台
  rd-form-item(:label="t('lobby')" prop="lobby")
    rd-select(
      v-model:value="form.lobby"
      :placeholder="t('please_select')"
      quickSearch
      :options="lobbyList"
    )
  //- 時間區間
  rd-form-item(:label="timeDescription" prop="date")
    rd-date-picker(
      v-model="form.date"
      type="daterange"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      size="default"
      :disabled-date="disabledDates"
      :range-separator="t('to')"
      :start-placeholder="t('start_date')"
      :end-placeholder="t('end_date')"
      :prevent-disable-date-selection="true"
    )
  //- 廳主
  rd-form-item(v-if="showSearchBarDomain" :label="t('domain')" prop="domain")
    domain-selector(v-model:value="form.domain" allOpt)
  //- 幣別
  rd-form-item(
    v-if="showSearchBarDomain"
    :label="t('currency')"
    prop="currency"
  )
    rd-radio-group(v-model="form.currency")
      rd-radio-button(label="original") {{ t('origin_currency') }}
      rd-radio-button(label="cny") {{ t('currency_CNY') }}
  //- 搜尋
  rd-form-item
    rd-button(type="search" @click="search")
      i.mdi.mdi-magnify
      span {{ t('search') }}
with-domain-list(v-if="showDomain" :data="list")
total-list(v-else :data="list")
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DomainSelector from '@/plugins/domain-selector/index.vue';
import { audit as auditApi } from '@/api/report';
import type { FormInstance } from 'element-plus';
import type { SearchBarItem } from './type';
import dayjs from 'dayjs';
import TotalList from './list.vue';
import WithDomainList from './with-domain/list.vue';
import { useLoadingStore } from '@/stores/loading';
import { QuerySetting, TabRouteWatch } from '@/components/utils/route-watch';

export default defineComponent({
  name: 'AuditOverview',
  components: { DomainSelector, TotalList, WithDomainList },
  setup() {
    const { t } = useI18n({ useScope: 'parent' });
    const loadingStore = useLoadingStore();
    const watcher = new TabRouteWatch('auditOverview');

    const formRef = ref<FormInstance>();
    const now = dayjs().format('YYYY-MM-DD');
    const form = reactive<SearchBarItem>({
      date: [now, now],
      domain: 'all',
      lobby: '',
      currency: 'original',
    });

    const list = ref([]);

    // TODO: 改call API
    const lobbyList = [
      { value: 37, label: 'PP電子' },
      { value: 40, label: 'AG電子' },
      { value: 149, label: 'CC棋牌' },
    ];
    // 需要顯示廳主資料的特例遊戲(目前只有AG電子)
    const showDomainLobbies = [40];
    const showDomain = ref(false);
    const showSearchBarDomain = computed(() => {
      return showDomainLobbies.includes(+form.lobby);
    });

    // Lobby對應時區，預設為GMT+8，非GMT+8才需要加
    const lobbyTimezone = [
      { timezone: 'UTC+0', lobbies: [47, 120, 132, 143] },
      { timezone: 'GMT+0', lobbies: [37] },
      { timezone: t('est_time'), lobbies: [40, 55] }, // 美東時間
      { timezone: t('cet_time'), lobbies: [72, 82] }, // 巴黎時間
    ];
    const getLobbyTimezone = (lobby: number) => {
      const timezone = lobbyTimezone.find(timezone =>
        timezone.lobbies.includes(lobby),
      );
      return timezone === undefined ? 'GMT+8' : timezone.timezone;
    };
    // 計算時區
    const timeDescription = computed(() => {
      return `${t('date_interval')} (${getLobbyTimezone(+form.lobby)})`;
    });
    // 不能設未來時間
    const disabledDates = (time: Date) => {
      return dayjs(time.getTime()) > dayjs().startOf('date');
    };
    // 日期驗證規則
    const dateValidate = (rule: never, value: [string, string]) => {
      return new Promise<void>((resolve, reject) => {
        // 搜尋日期必填
        if (value === null || value[0] === '' || value[1] === '') {
          reject(t('please_select_time'));
        }
        // 搜尋日期不能大於60天
        if (dayjs(value[1]).diff(value[0], 'd', true) >= 60) {
          reject(t('date_limit_60'));
        }
        resolve();
      });
    };
    // 驗證規則
    const rules = {
      lobby: [
        {
          required: true,
          type: 'number',
          message: t('please_select_game_lobby'),
          trigger: 'change',
        },
      ],
      date: [{ required: true, validator: dateValidate, trigger: 'blur' }],
    };

    const search = () => {
      if (!formRef.value) {
        return;
      }
      formRef.value.validate(valid => {
        if (valid) {
          watcher.queryRoute(querySet.getQuery());
        }
      });
    };

    const getAuditData = () => {
      loadingStore.page = true;
      auditApi
        .getAuditData(
          form.lobby as number,
          form.date[0],
          form.date[1],
          querySet.getParam(),
        )
        .then(resp => {
          list.value = resp.data.data;
          showDomain.value = showDomainLobbies.includes(+form.lobby);
          loadingStore.page = false;
        });
    };

    // 回上一頁 query
    const querySet = new QuerySetting([
      // 遊戲平台
      {
        key: 'lobby',
        get: () => form.lobby,
        set: (lobby: number) => {
          form.lobby = lobby;
        },
        default: '',
        number: true,
      },
      // 開始日期
      {
        key: 'start_date',
        get: () => form.date[0],
        set: (startDate: string) => {
          form.date[0] = startDate;
        },
        default: now,
        filter: () => form.date.length > 0,
      },
      // 結束日期
      {
        key: 'end_date',
        get: () => form.date[1],
        set: (endDate: string) => {
          form.date[1] = endDate;
        },
        default: now,
        filter: () => form.date.length > 0,
      },
      // 廳主
      {
        key: 'domain',
        get: () => form.domain,
        set: (domain: number) => {
          form.domain = domain;
        },
        default: 'all',
        filter: () => showSearchBarDomain.value && form.domain !== 'all',
        number: true,
        optional: true,
      },
      // 轉換幣別
      {
        key: 'exchange',
        get: () => 1,
        set: (exchange: number) => {
          form.currency = exchange === 1 ? 'cny' : 'original';
        },
        default: 'original',
        filter: () => showSearchBarDomain.value && form.currency === 'cny',
        number: true,
        optional: true,
      },
    ]);

    watcher.setWatcher((query: { lobby: number }) => {
      formRef.value?.resetFields();
      querySet.setField();
      if (query.lobby) {
        getAuditData();
      }
    });

    return {
      t,
      form,
      formRef,
      rules,
      disabledDates,
      search,
      lobbyList,
      list,
      timeDescription,
      showDomain,
      showSearchBarDomain,
    };
  },
});
</script>
