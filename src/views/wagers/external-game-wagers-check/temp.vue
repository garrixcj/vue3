<template lang="pug">
  //- TODO 自行命名
  .main-page-class-name
    rd-information
      ul
        li 看
        li 三
        li \|/
    .header
      .search-form
        rd-form(
          :model="form"
          inline
          size="medium"
          label-color="black-blue-2"
        )
          rd-form-item(
            prop="selected"
            label="下拉選單"
          )
            rd-select(
              :option="form.selectOption"
              v-model="form.select"
            )
          rd-form-item(
            label="時間區間"
            prop="dateInfo"
          )
            template(#tooltip-content)
              div |＿ﾊ;
              div |･д･)
              div |⊂ﾉ′
              div |-Ｊ
            rd-date-picker(
              v-model="form.dateInfo"
              type="daterange"
              range-separator="至"
              start-placeholder="開始時間"
              end-placeholder="結束時間"
              value-format="yyyy-MM-dd"
            )
          rd-form-item
            rd-button(
              type="search"
              icon="mdi mdi-magnify"
            ) 搜尋
    .article
      rd-card.card-table(
        type="basic"
        no-seprate-line
        no-padding
      )
        template(#content)
          rd-table(
            :data="tableDataList"
            border
          )
            el-table-column(
              type="selection"
              header-align="center"
              align="center"
              width="40"
            )
            //- 文字
            el-table-column(
              prop="stringColumn"
              label="文字"
              header-align="center"
              align="left"
              :resizable="false"
            )
            //- 數字
            el-table-column(
              prop="intColumn"
              label="數字"
              header-align="center"
              align="right"
              :resizable="false"
            )
    // v-show請自行改為需判斷的條件，"開始搜尋吧"請換成i18n字典檔key。若不需要請移除此段程式。
    div(v-show="false")
      before-search(:start-search-text="'開始搜尋吧'")
</template>

<script>
export default {
  name: 'MainPageName', // TODO 自行命名
  data() {
    return {
      // form
      form: {
        selected: '',
        selectOption: [
          { value: 1, label: '我們是誰' },
          { value: 2, label: '選擇器' },
          { value: 3, label: '我們的目標是' },
          { value: 4, label: '世界和平' },
          { value: 5, label: '怎麼做' },
          { value: 6, label: '找碴挑事' },
        ],
        dateInfo: [],
      },
      tableDataList: [
        { stringColumn: '文', intColumn: 1000 },
        { stringColumn: '字', intColumn: 2000 },
        { stringColumn: '燒', intColumn: 3000 },
      ],
    };
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.main-page-class-name { // TODO 自行命名
  .header {
    color: $grey-1;
    display: flex;

  }
  .article {
    .rd-card.card-table {
    }
  }
}
</style>
