<i18n src="../../utils/rd/lang.json"></i18n>
<template lang="pug">
.rd-check-list
  //- 類別版型容器
  rd-row.panel-container(type="flex")
    //- 類別清單版型(第一層 - 大分類 category)
    rd-col.list-panel(
      v-for="(category, firstIndex) in list"
      :key="firstIndex"
      :xl="6"
      :lg="8"
      :md="12"
      :sm="12"
      :xs="24"
    )
      //- 類別標題
      .panel-header(v-if="showCheckItem(category)")
        //- 標題
        .panel-header__title
          span.label(:class="type") {{ category.name }}
          span.suffix
            slot(name="categoryFix" :row="category")
            slot(v-if="!$slots.categoryFix" name="allFix" :row="category")
        //- 檢視
        .panel-header__view-option
          .option-label(v-if="category.isViewEnabled") {{ t('view') }}
          //- 全選
          rd-button.select-all(
            v-if="category.isViewEnabled"
            text
            :disabled="category.viewDisabled"
            @click="selectAll('category', 'view', category)"
          ) {{ t('select-all') }}
        //- 修改
        .panel-header__modify-option
          .option-label(v-if="category.isModifyEnabled") {{ t('modify') }}
          //- 全選
          rd-button.select-all(
            v-if="category.isModifyEnabled"
            text
            :disabled="category.modifyDisabled"
            @click="selectAll('category', 'modify', category)"
          ) {{ t('select-all') }}
      //- 類別內容清單(第二層 - 單項)
      .panel-content
        .check-row__item(
          v-for="(item, secondIndex) in category.children"
          :key="secondIndex"
        )
          .item-self(
            v-if="showCheckItem(item)"
            :class="{ 'has-children': item.children.length > 0, 'hover-effect': hoverEffect }"
          )
            //- 標題
            .item-self__title
              span.label {{ item.name }}
              span.suffix
                slot(name="itemFix" :row="item")
                slot(v-if="!$slots.itemFix" name="allFix" :row="item")
            //- 檢視
            .item-self__view-option
              rd-checkbox(
                v-if="item.isViewEnabled && checkItemClickable(item)"
                v-model="item.viewChecked"
                :disabled="item.viewDisabled"
                @change="checkEvent('item', 'view', category, item)"
              )
              //- 全選
              rd-button.select-all(
                v-else-if="item.isViewEnabled && item.children.length > 0"
                text
                :disabled="item.viewDisabled"
                @click="selectAll('item', 'view', category, item)"
              ) {{ t('select-all') }}
            //- 修改
            .item-self__modify-option
              rd-checkbox(
                v-if="item.isModifyEnabled && checkItemClickable(item)"
                v-model="item.modifyChecked"
                :disabled="item.modifyDisabled"
                @change="checkEvent('item', 'modify', category, item)"
              )
              //- 全選
              rd-button.select-all(
                v-else-if="item.isModifyEnabled && item.children.length > 0"
                text
                :disabled="item.modifyDisabled"
                @click="selectAll('item', 'modify', category, item)"
              ) {{ t('select-all') }}

          //- 單項清單細項(第三層 - 子項)
          .check-row__child(
            v-for="(child, thirdIndex) in item.children"
            :key="thirdIndex"
          )
            .child-self(
              v-if="showCheckItem(child)"
              :class="{ 'has-children': child.children.length > 0, 'hover-effect': hoverEffect }"
            )
              //- 標題
              .child-self__title
                span.label {{ child.name }}
                span.suffix
                  slot(name="childFix" :row="child")
                  slot(v-if="!$slots.childFix" name="allFix" :row="child")
              //- 檢視
              .child-self__view-option(
                :class="{ 'has-specail-child': child.partialSync }"
              )
                rd-checkbox(
                  v-if="child.isViewEnabled"
                  v-model="child.viewChecked"
                  :disabled="child.viewDisabled"
                  @change="checkEvent('child', 'view', category, item, child)"
                )
              //- 修改
              .child-self__modify-option(
                :class="{ 'has-specail-child': child.partialSync }"
              )
                rd-checkbox(
                  v-if="child.isModifyEnabled"
                  v-model="child.modifyChecked"
                  :disabled="child.modifyDisabled"
                  @change="checkEvent('child', 'modify', category, item, child)"
                )

            //- 單項清單細項特殊備註(第四層 - 特殊備註)
            .check-row__special(
              v-for="(special, fourthIndex) in child.children"
              :key="fourthIndex"
            )
              .special-self(v-if="showCheckItem(special)")
                //- 標題
                .special-self__title
                  span.label {{ special.name }}
                  span.suffix
                    //- 第四層suffix不製作allFix
                    //- 原因: 可能會過長、第四層與前三層的樣式差別較大
                    slot(name="specialFix" :row="special")
                //- 檢視
                .special-self__view-option
                  rd-checkbox(
                    v-if="special.isViewEnabled"
                    v-model="special.viewChecked"
                    :disabled="special.viewDisabled"
                    @change="checkEvent('special', 'view', category, item, child, special)"
                  )
                //- 修改
                .special-self__modify-option
                  rd-checkbox(
                    v-if="special.isModifyEnabled"
                    v-model="special.modifyChecked"
                    :disabled="special.modifyDisabled"
                    @change="checkEvent('special', 'modify', category, item, child, special)"
                  )
</template>

<script lang="ts">
import { defineComponent, watchEffect, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { updateParent, CheckEvent, CheckKeys, EnableKeys } from './action';
import type { Action, ListItem } from './typing';

enum EventKeys {
  special = 'checkSpecial',
  child = 'checkChild',
  item = 'checkItem',
  category = 'checkCategory',
}

export default defineComponent({
  name: 'RdCheckList', // Checkbox 清單
  props: {
    //* 注意: 這個結構是利用 js 物件在 props 傳遞後可以對內部 property 調整。
    //* 但這是違反子元件可以修改父元件的原則，如果後續出問題還是得用emit比較保險。
    list: {
      type: Array as PropType<ListItem[]>,
      default: () => [],
    },
    type: {
      type: String,
      default: 'default',
      validator: (val: string) => ['warning', 'default'].indexOf(val) !== -1,
    },
    hoverEffect: {
      type: Boolean,
      default: false,
    }, // 滑入效果
    showCheckItem: {
      type: Function,
      default: () => {
        return true;
      },
    }, // 檢查權限是否遭最高管理者所影響
  },
  emits: [
    'checkSpecial',
    'checkChild',
    'checkItem',
    'checkCategory',
    'clickListChange',
  ],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });
    /**
     * 初始化第一次更新計算 / 再填入後更新計算
     */
    const init = () => {
      props.list.forEach((cate: ListItem) => {
        // 向下更新子結點
        cate.children.forEach((item: ListItem) => {
          if (item.children) {
            item.children.forEach((child: ListItem) => {
              if (child.children) {
                updateParent(child, 'view');
                updateParent(child, 'modify');
              }
            });
          }
          updateParent(item, 'view');
          updateParent(item, 'modify');
        });
        updateParent(cate, 'view');
        updateParent(cate, 'modify');
      });
    };
    // 監聽內容執行
    watchEffect(() => init);
    // 初始化執行
    init();

    /**
     * 所有 checkbox 的 hook
     * @param {"special" | "child" | "item"} depth 勾選的該層級
     * @param {Action} target 動作
     * @param {ListItem[]} condition 其他條件
     */
    // 所有 checkbox 的 hook
    const checkEvent = (
      depth: 'special' | 'child' | 'item',
      target: Action,
      ...condition: ListItem[]
    ) => {
      // eslint-disable-next-line
      // @ts-ignore
      CheckEvent[EventKeys[depth]](target, ...condition);
      emit(EventKeys[depth], target, ...condition);
      emit('clickListChange', depth, condition);
    };

    /**
     * 所有 selectAll 的 hook
     * @param {"category" | "item"} depth 全選的上層級
     * @param {Action} target 動作
     * @param {ListItem[]} condition 其他條件
     */
    const selectAll = (
      depth: 'category' | 'item',
      target: Action,
      ...condition: ListItem[]
    ) => {
      const current: ListItem = condition[condition.length - 1];
      if (depth === 'category') {
        current[CheckKeys[target]] = !current.children
          .filter(child => child[EnableKeys[target]])
          .reduce(
            (acc: ListItem[], node) => [
              ...acc,
              ...node.children.filter(
                child => child[EnableKeys[target]] && !child.partialSync,
              ),
              node,
            ],
            [],
          )
          .every(child => child[CheckKeys[target]]);
      } else if (depth === 'item') {
        current[CheckKeys[target]] = !current.children
          .filter(child => child[EnableKeys[target]])
          .every(child => child[CheckKeys[target]]);
      }

      // eslint-disable-next-line
      // @ts-ignore
      CheckEvent[EventKeys[depth]](target, ...condition);
      emit(EventKeys[depth], target, ...condition);
      emit('clickListChange', target, ...condition);
    };

    /**
     * 判斷第二層是否可點擊
     * @param {ListItem} item 第二層
     * @return {Boolean} 是否可點擊
     */
    const checkItemClickable = (item: ListItem): boolean =>
      item.children.length === 0 ||
      item.children.some(child => child.partialSync);

    return {
      init,
      checkEvent,
      selectAll,
      checkItemClickable,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../../style/scss/options';
@import '../../style/scss/themes';
$header-bg: #fafcfd;
$content-bg: $background-5;
$opt-label-color: #939dad;
// checkbox組基本寬度
$checkbox-width: 65px;
// panel兩側固定內距
$side-padding: 10px;

// 勾選項目基本樣式
@mixin checkitem-basic() {
  &__title {
    // 標題
    margin-right: auto;

    .label {
      margin-right: 5px;
    }

    .suffix {
      // 標題後綴
      white-space: nowrap;
      vertical-align: middle;
    }
  }
  &__view-option,
  &__modify-option {
    // checkbox組
    @include flex-basic(center);
    min-width: $checkbox-width;
  }
}

// 滑入效果
@mixin hover-effect() {
  &.hover-effect:hover {
    background-color: mix(#e3eeff, $white);
    border-radius: 4px;
  }
}

.rd-check-list {
  .panel-container {
    // 類別版型容器
    flex-wrap: wrap;

    .list-panel {
      // 類別清單版型(第一層 - 大分類 category)
      background: white;
      border: 1px solid $background-3;

      // RWD配置
      @media (min-width: 1920px) {
        &:nth-child(n + 5) {
          margin-top: 20px;
        }
      }
      @media (min-width: 1200px) and (max-width: 1919px) {
        &:nth-child(n + 4) {
          margin-top: 20px;
        }
      }
      @media (min-width: 768px) and (max-width: 1199px) {
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
        padding: 4px $side-padding;
        background: $header-bg;
        border-bottom: 1px solid $background-3;

        @include checkitem-basic();
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
        &__view-option,
        &__modify-option {
          flex-direction: column;

          .option-label {
            // 版面檢視修改標籤
            margin-bottom: 5px;
            font-size: 12px;
            color: $opt-label-color;
          }
        }
      }

      // 類別版面內容
      .panel-content {
        padding: 10px $side-padding;
        font-size: 14px;
        line-height: 18px;
        color: $text-1;

        // 勾選選項物件
        .check-row {
          &__item {
            // 單項內容清單(第二層 - item)
            .item-self {
              padding: 5px 0 5px 10px;
              font-weight: bold;
              @include flex-basic();
              @include checkitem-basic();
              @include hover-effect();
              &.has-children {
                background: $content-bg;
                border-radius: 4px;
              }
            }
          }
          &__child {
            // 子項內容清單(第三層 - child)
            padding-left: 10px;
            .child-self {
              // 子項
              padding: 5px 0 5px 10px;
              @include flex-basic();
              @include checkitem-basic();
              @include hover-effect();
              &.has-children {
                // 無特殊樣式，標注用
              }
              // 判斷第三層邏輯與第四層一樣，需套用特殊樣式
              .has-specail-child {
                @include checkbox-theme($warning);
              }
            }
          }
          &__special {
            // 子項特殊備註(第四層 - special)
            padding-left: 10px;
            .special-self {
              padding: 5px 0 5px 10px;
              @include flex-basic();
              @include checkitem-basic();
              // 特殊顏色
              &__view-option,
              &__modify-option {
                @include checkbox-theme($warning);
              }
            }
          }
        }
      }
    }
  }

  // 全選
  .select-all {
    @include text-button($success);
    font-size: 12px;
    font-weight: normal;
  }

  // 兄弟節點
  & + .rd-check-list {
    margin-top: 20px;
  }
}
</style>
