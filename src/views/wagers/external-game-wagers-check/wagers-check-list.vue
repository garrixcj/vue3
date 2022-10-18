<i18n>
  {
    "zh-tw": {
      "lobby": "遊戲平台",
      "check_interval": "核對區間",
      "check_result": "核對結果",
      "wagers_check_list_information_1": "警語1",
      "wagers_check_list_information_2": "警語2",
      "wagers_check_list_information_3": "警語3",
      "wagers_check_list_information_4": "警語4",
      "wagers_check_list_information_5": "無法即時",
    }
  }
  </i18n>

<template lang="pug">
.wagers-check-list
  rd-information
    ul
      li {{ t('wagers_check_list_information_1') }}
      li {{ t('wagers_check_list_information_2') }}
      li {{ t('wagers_check_list_information_3') }}
      li {{ t('wagers_check_list_information_4') }}
  .header
    .search-form
      rd-form(inline label-color="black-blue-2" :model="form" :rules="rules")
        rd-form-item(:label="t('lobby')" prop="lobby")
          rd-select(v-model:value="form.lobby" :options="form.selectOption")
        rd-form-item(prop="dateInfo")
          template(#label)
            span {{ t('check_interval') }}
            rd-tooltip(
              placement="top"
              :content="t('wagers_check_list_information_5')"
            )
              i.mdi.mdi-information
          rd-date-picker(
            v-model="form.dateInfo"
            type="date"
            placeholder="選擇日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          )
          rd-time-select(
            v-model="form.startHour"
            placeholder="開始時間"
            start="00:00:00"
            step="01:00:00"
            end="23:00:00"
            max-time="17:13:56"
            format="HH:mm:ss"
            :editable="false"
          )
          span
          rd-time-select(
            v-model="form.endHour"
            placeholder="結束時間"
            start="00:00:00"
            step="01:00:00"
            end="23:00:00"
            min-time="17:13:56"
            format="HH:mm:ss"
            :editable="false"
          )
        //- rd-form-item(prop="startHour")
        //-   rd-time-select(
        //-     v-model="form.startHour"
        //-     placeholder="開始時間"
        //-     start="00:00:00"
        //-     step="01:00:00"
        //-     end="23:00:00"
        //-     max-time="17:13:56"
        //-     format="HH:mm:ss"
        //-     :editable="false"
        //-   )
        //- rd-form-item(prop="endHour")
        //-   rd-time-select(
        //-     v-model="form.endHour"
        //-     placeholder="結束時間"
        //-     start="00:00:00"
        //-     step="01:00:00"
        //-     end="23:00:00"
        //-     min-time="17:13:56"
        //-     format="HH:mm:ss"
        //-     :editable="false"
        //-   )
          //- rd-time-picker(
          //-   v-model="form.timeInfo"
          //-   placeholder="開始時間"
          //-   format="HH:mm"
          //-   start="00:00"
          //-   step="01:00"
          //-   end="24:00"
          //- )
        rd-form-item
          rd-button(type="search") 搜尋
  //- .article
  //-   rd-card.card-table(type="basic" no-seprate-line no-padding)
  //-     template(#content)
  //-       rd-table(
  //-         border
  //-         :data="[]"
  //-         :default-sort="{ prop: 'checkInterval', order: 'descending' }"
  //-       )
  //-         //- 核對區間
  //-         rd-table-column(
  //-           :label="t('check_interval')"
  //-           sortable
  //-           prop="checkInterval"
  //-           header-align="center"
  //-           align="left"
  //-           :resizable="false"
  //-         )
  //-         //- 核對結果
  //-         rd-table-column(
  //-           :label="t('check_result')"
  //-           prop="checkResult"
  //-           header-align="center"
  //-           align="right"
  //-           :resizable="false"
  //-         )
  //-         template(v-if="!searched" #empty)
  //-           before-search-empty(label="開始搜尋吧")
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import BeforeSearchEmpty from '@/components/custom/before-search/empty.vue';

export default defineComponent({
  name: 'WagersCheckList', //外接遊戲注單核對
  components: {
    BeforeSearchEmpty,
  },
  setup() {
    const { t } = useI18n({ useScope: 'local' });
    const form = reactive({
      lobby: '',
      selectOption: [
        { value: 1, label: '我們是誰' },
        { value: 2, label: '選擇器' },
        { value: 3, label: '我們的目標是' },
        { value: 4, label: '世界和平' },
        { value: 5, label: '怎麼做' },
        { value: 6, label: '找碴挑事' },
      ],
      dateInfo: '2022-01-01',
      endHour: '',
      startHour: '',
      // timeInfo: '',
    });
    const rules = reactive({
      lobby: [
        { required: true, massage: t('must_not_null'), trigger: 'change'}
      ],
      dateInfo: [
        { required: true, massage: t('must_not_null'), trigger: 'change'}
      ],
    });
    // const tableDataList = [
    // { stringColumn: '文', intColumn: 1000 },
    // { stringColumn: '字', intColumn: 2000 },
    // { stringColumn: '燒', intColumn: 3000 },
    // ];
    const searched = false;
    return {
      t,
      form,
      rules,
      searched,
      // tableDataList,
    };
  },
});
</script>
