<template lang="pug">
.home
  //- el-button.test(type="primary") {{ 'test' }}
  //- el-button.test2(type="text") {{ 'test' }}
  sd-information
    ul
      li {{ typeof value1 }}
  rd-alert(
    type="success"
    title="success alert"
    description="more text description more text description more text description more text description"
    show-icon
  )
  sd-card(title="廳主" sub-title="厅主仅可检视签名方式(不含代签标记)")
    template(#content)
      | {{ 123 }}
  div(style="display: flex")
    sd-status-button(:value="10" label="儀表板A" disabled :min-width="100")
    sd-status-button(
      type="success"
      :value="20"
      label="儀表板B"
      :min-width="100"
      :active="testClick"
      @clickStatus="changeStatus()"
    )
    sd-status-button(
      type="warning"
      :value="30"
      label="儀表板123"
      :min-width="100"
      @click="visible = true"
    )
  rd-dialog(v-model="dialogFormVisible" custom-class="dialog-test")
    template(#title)
      | {{ "收货地址123" }}
    template(#footer)
      rd-button(type2="secondary" size="small") 取消
      rd-button(type="primary" size="small") 確定
    rd-form(label-width="130px")
      rd-form-item(label="Activity name")
        rd-time-picker(
          v-model="value3"
          placeholder="選擇時間"
          format="HH:mm:ss"
          clearable
          is-range
        )
      rd-form-item(label="Activity name")
        view-mode(:value="value3" component="timePicker" is-range)
      rd-form-item(label="Activity name" size="medium")
        rd-date-picker(
          v-model="value2"
          type="datetimerange"
          placeholder="選擇日期"
          value-format="YYYY-MM-DD"
          range-separator="至"
        )
      rd-form-item(label="Activity name" size="small")
        view-mode(type="range" :value="value2" component="datePicker")
        //- sd-date-picker(
        //-   v-model:model-value="value2"
        //-   type="datetimerange"
        //-   placeholder="Pick a day"
        //-   :disabled-date="disabledDate"
        //-   value-format="YYYY-MM-DD HH:mm:ss"
        //-   :has-modify="false"
        //- )
  sd-mini-card(title="test" content="test123" status="success")
  sd-panel-card(:dataSource="dataList")
  rd-badge.test12345(:value="12")
  //-   el-button.test(type="success") {{ "Success" }}
  sd-link(underline :href="`#`" target="_blank") {{ 123 }}
  rd-button(type="text" @click="dialogFormVisible = true")
    //- i.mdi.mdi-magnify
    | {{ "文字按鈕" }}
  sd-router-link(:to="`#`") {{ "text" }}
  rd-tag.rd-tag--casino(size="medium" closable)
    | {{ "電子遊戲" }}
  rd-tag.test123(size="medium" closable)
    //- i.mdi.mdi-check
    | {{ "電子遊戲" }}
  img(src="@/assets/logo.png" alt="Vue logo")
  drawer(:visible="visible" :scroll-bar="false" width="600px")
    template(#header)
      | {{ 123 }}
    template(#footer)
      | {{ 456 }}
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
    br
    | {{ 1234 }}
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SdInformation from '@/components/common/information/index.vue';
import SdLink from '@/components/common/link/index.vue';
import SdRouterLink from '@/components/common/link/router-link.vue';
import SdStatusButton from '@/components/custom/status-button/index.vue';
import SdCard from '@/components/common/card/card.vue';
import SdMiniCard from '@/components/common/card/mini-card.vue';
import SdPanelCard from '@/components/common/card/panel-card.vue';
import dayjs from 'dayjs';
import ViewMode from '@/components/custom/view-mode/index.vue';
import Drawer from '@/components/custom/drawer/index.vue';

type StatusType = 'default' | 'success' | 'warning' | 'danger';
type StatusSetting = {
  content?: StatusType;
  title?: StatusType;
};
type AlignType = 'left' | 'right';
type DataSet = {
  content: string;
  title: string;
  status?: StatusType | StatusSetting;
  align?: AlignType; // 只能對內容調整對其方式，標題固定在左
  href?: string;
  to?: unknown;
  [key: string]: unknown;
};

export default defineComponent({
  components: {
    SdInformation,
    SdLink,
    SdRouterLink,
    SdStatusButton,
    SdCard,
    SdMiniCard,
    SdPanelCard,
    ViewMode,
    Drawer,
  },
  setup() {
    const visible = ref(false);
    const dialogFormVisible = ref(false);
    const testClick = ref(false);
    const activeIndex = ref('1');
    const value1 = ref('');
    // const value2 = ref([
    //   dayjs('2020-01-01 00:00:00').toDate(),
    //   dayjs('2020-01-03 00:00:00').toDate(),
    // ]);
    const value2 = [dayjs('2020-01-01 00:00:00'), dayjs('2020-01-01 00:00:00')];
    const value3 = [dayjs('2020-01-01 00:00:00'), dayjs('2020-01-01 00:00:00')];
    const value4 = ref('');
    const handleSelect = (key: string, keyPath: []) => {
      console.log(key, keyPath);
    };
    const changeStatus = () => {
      console.log(2222);
      testClick.value = true;
    };

    const data = ref({
      type: 'datetimerange',
      value: ['2020-01-01 00:00:00', '2020-01-02 0:00:00'],
    });

    const disabledDate = (time: Date) => {
      return time.getTime() > Date.now();
    };

    const dataList: DataSet[] = [
      {
        title: '標題說明',
        content: '8,888,888.88',
        status: 'success',
      },
      {
        title: '標題說明',
        content: '8,888,888.88',
      },
      {
        title: '標題說明',
        content: '8,888,888.88',
      },
      {
        title: '標題說明',
        content: '8,888,888.88',
      },
      {
        title: '標題說明',
        content: '8,888,888.88',
      },
    ];

    return {
      activeIndex,
      handleSelect,
      testClick,
      changeStatus,
      dataList,
      value1,
      disabledDate,
      value2,
      data,
      value3,
      value4,
      dialogFormVisible,
      visible,
    };
  },
});
</script>
<style lang="scss" scoped>
.home {
  @include game-color();
  .test {
    color: map-get($text-colors, '1');
    background-color: map-get($primary-colors, '5');
    font-size: map-get($input-font, 'medium');
  }
  .test12345 {
    @include badge-theme($freeze);
  }
  .test123 {
    // @include tag-border(true, true);
    @include tag-color($freeze);
  }
  // .ttttt {
  //   // &.rd-tag--casino {
  //   //   @include tag-color($casino, null);
  //   // }
  //   @include game-color($casino);
  // }
  // @include dialogInputHeightChanged('dialog-test', 'medium');
  // .test2 {
  //   color: black;
  // }
  // :deep(.test) {
  //   color: black;
  //   background-color: burlywood;
  // }
}
</style>
