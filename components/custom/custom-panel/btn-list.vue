<template lang="pug">
.rd-btn-list
  //- 類別版型容器
  rd-row.panel-container(type="flex")
    //- 類別清單版型 (第一層 - 大分類 category)
    rd-col.list-panel(
      v-for="(category, firstIndex) in list"
      :key="firstIndex"
      :xl="4"
      :lg="6"
      :md="8"
      :sm="12"
      :xs="24"
    )
      //- 類別標題
      .panel-header
        //- 標題
        .panel-header__title
          span.label(:class="type") {{ category.name }}
          span.suffix
            slot(name="categoryFix" :row="category")
            slot(v-if="!$slots.categoryFix" name="allFix" :row="category")
      //- 類別內容清單 (第二層 - 單項)
      .panel-content
        .btn-row__item(
          v-for="(item, secondIndex) in category.children"
          :key="secondIndex"
        )
          .item-self(
            :class="getItemClass(item)"
            @click="checkItemClickable(item) && clickHook(item, category)"
          )
            //- 標題
            .item-self__title
              span.label {{ item.name }}
              span.suffix
                slot(name="itemFix" :row="item")
                slot(v-if="!$slots.itemFix" name="allFix" :row="item")
          //- 單項清單細項 (第三層 - 子項)
          .btn-row__child(
            v-for="(child, thirdIndex) in item.children"
            :key="thirdIndex"
          )
            .child-self(
              :class="{ 'has-children': child.children.length > 0 }"
              @click="clickHook(child, item, category)"
            )
              //- 標題
              .child-self__title
                span.label {{ child.name }}
                span.suffix
                  slot(name="childFix" :row="child")
                  slot(v-if="!$slots.childFix" name="allFix" :row="child")
            //- 單項清單細項特殊備註 (第四層 - 特殊備註)
            .btn-row__special(
              v-for="(special, fourthIndex) in child.children"
              :key="fourthIndex"
            )
              .special-self(@click="clickHook(special, child, item, category)")
                //- 標題
                .special-self__title
                  span.label {{ special.name }}
                  span.suffix
                    //- 第四層 suffix 不製作 allFix
                    //- 原因：可能會過長、第四層與前三層的樣式差別較大
                    slot(name="specialFix" :row="special")
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { BtnListItem } from './typing';

export default defineComponent({
  name: 'RdBtnList', // button 清單
  props: {
    //* 注意：這個結構是利用 js 物件在 props 傳遞後可以對內部 property 調整。
    //* 但這是違反子元件可以修改父元件的原則，如果後續出問題還是得用 emit 比較保險。
    list: {
      type: Array as PropType<BtnListItem[]>,
      default: () => [],
    },
    type: {
      type: String,
      default: 'default',
      validator: (val: string) => ['warning', 'default'].indexOf(val) !== -1,
    },
  },
  emits: ['clickBtn'],
  setup(props, { emit }) {
    /** 點擊各按鈕事件
     * @param {BtnListItem[]} condition 由下至上的所有物件
     * @return {$emit} clickBtn
     */
    const clickHook = (...condition: BtnListItem[]) => {
      emit('clickBtn', condition);
    };

    /**
     * 判斷第二層是否可點擊
     * @param {BtnListItem} item 第二層
     * @return {Boolean} 是否可點擊
     */
    const checkItemClickable = (item: BtnListItem): boolean =>
      item.children.length === 0 ||
      item.children.some((child: BtnListItem) => child.partialSync);

    /**
     * 取得第二層對子層的 class
     * @param {BtnListItem} item 第二層
     * @return {string} class
     */
    const getItemClass = (item: BtnListItem) => {
      if (item.children.length > 0) {
        return item.children.some((child: BtnListItem) => child.partialSync)
          ? 'has-special-child'
          : 'has-children';
      }
      return '';
    };

    return {
      clickHook,
      checkItemClickable,
      getItemClass,
    };
  },
});
</script>

<style lang="scss" scoped>
$header-bg: #fafcfd;
$btn-text: $primary; // #4890F7
$btn-hover: rgba(227, 238, 255, 0.6);
// checkbox 組基本寬度
$checkbox-width: 65px;
// panel 兩側固定內距
$side-padding: 10px;

// 點擊項目基本樣式
@mixin btn-basic() {
  box-sizing: border-box;
  min-height: 30px;
  cursor: pointer;
  &__title {
    // 標題
    @include flex-basic;
    margin-right: auto;
    color: $btn-text;

    .suffix {
      // 標題後綴
      margin-left: 5px;
      white-space: nowrap;
    }
  }
}

.rd-btn-list {
  .panel-container {
    // 類別版型容器
    flex-wrap: wrap;

    .list-panel {
      // 類別清單版型 (第一層 - 大分類 category)
      background: white;
      border: 1px solid $background-3;

      // RWD 配置
      @media (min-width: 1920px) {
        &:nth-child(n + 7) {
          margin-top: 20px;
        }
      }
      @media (min-width: 1200px) and (max-width: 1919px) {
        &:nth-child(n + 5) {
          margin-top: 20px;
        }
      }
      @media (min-width: 992px) and (max-width: 1199px) {
        &:nth-child(n + 4) {
          margin-top: 20px;
        }
      }
      @media (min-width: 768px) and (max-width: 991px) {
        &:nth-child(n + 3) {
          margin-top: 20px;
        }
      }
      @media (max-width: 767px) {
        &:nth-child(n + 2) {
          margin-top: 20px;
        }
      }

      // 類別標題
      .panel-header {
        @include flex-basic;
        padding: 12px $side-padding;

        @include btn-basic();
        cursor: default;
        background: $header-bg;
        border-bottom: 1px solid $background-3;
        &__title .label {
          font-size: 16px;
          font-weight: bold;
          line-height: 22px;
          &.default {
            color: $mark-3;
          }
          &.warning {
            color: $warning;
          }
        }
      }

      // 類別版面內容
      .panel-content {
        padding: 10px $side-padding;
        font-size: 14px;
        line-height: 18px;
        color: $text-1;

        // 點擊選項物件
        .btn-row {
          &__item {
            // 單項內容清單 (第二層 - item)
            .item-self {
              padding: 5px 0 5px 10px;
              font-weight: bold;
              @include flex-basic;
              @include btn-basic();
              &.has-children {
                cursor: default;
                .item-self__title {
                  // 標題
                  color: $text-1;
                }
              }
              &:not(.has-children),
              &.has-special-child {
                &:hover {
                  background: $btn-hover;
                  border-radius: 4px;
                }
              }
            }
          }
          &__child {
            // 子項內容清單 (第三層 - child)
            .child-self {
              // 子項
              padding: 5px 0 5px 20px;
              @include flex-basic;
              @include btn-basic();
              &:hover {
                background: $btn-hover;
                border-radius: 4px;
              }
            }
          }
          &__special {
            // 子項特殊備註 (第四層 - special)
            .special-self {
              padding: 5px 0 5px 40px;
              @include flex-basic;
              @include btn-basic();
              &:hover {
                background: $btn-hover;
                border-radius: 4px;
              }
            }
          }
        }
      }
    }
  }

  // 兄弟節點
  & + .rd-btn-list {
    margin-top: 20px;
  }
}
</style>
