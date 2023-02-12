<template lang="pug">
.rd-collapse-card(:class="modifyClass")
  .card-header(@click.self="collapseEvent")
    .card-header__collapse(@click="collapseEvent")
      rd-arrow-up(:collapse="collapse")
    .card-header__icon(@click="collapseEvent")
      slot(name="icon")
    .card-header__title(@click="collapseEvent")
      slot(name="title") {{ title }}
    .card-header__suffix
      slot(name="suffix")
  rd-collapse-transition
    .card-content(v-show="collapse && !disabled")
      .card-content__main
        slot(name="content")
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'RdCollapseCard',
  props: {
    // 卡片型態: card(default) / sub-card
    type: {
      type: String,
      default: 'card',
    },
    // 標題
    title: {
      type: String,
      default: 'title',
    },
    // v-model 縮合狀態
    collapse: {
      type: Boolean,
      default: true,
    },
    // 禁能狀態
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:collapse'],
  setup(props, { emit }) {
    // 縮合事件
    const collapseEvent = () => {
      emit('update:collapse', props.disabled ? false : !props.collapse);
    };

    // 根據傳入的type調整class
    const modifyClass = computed(() => {
      const classSet = ref<string[]>([]);
      if (props.type === 'sub-card') {
        classSet.value = [...classSet.value, 'sub-card'];
      } else if (props.type === 'small-card') {
        classSet.value = [...classSet.value, 'small-card'];
      } else {
        classSet.value = [...classSet.value, 'card'];
      }

      // 禁能
      if (props.disabled) {
        classSet.value = [...classSet.value, 'is-disabled'];
      }
      return classSet.value.join(' ');
    });

    return {
      collapseEvent,
      modifyClass,
    };
  },
});
</script>

<style lang="scss" scoped>
$card-grey: $background-5;
$title-grey: $text-1;
.rd-collapse-card {
  // 預設卡片白底
  padding: 10px 15px;
  background-color: $white;
  border-radius: 4px;

  // 下張卡片向上間距
  & + .rd-collapse-card {
    margin-top: 15px;
  }

  // 卡片標頭
  .card-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    cursor: pointer;

    // 標題
    &__title {
      margin-left: 5px;
      font-size: 18px;
      line-height: 24px;
    }
    // collapse
    &__collapse :deep(i) {
      box-sizing: border-box;
    }
    // icon
    &__icon {
      display: flex;
      align-items: center;
      margin-left: 2px;
    }
    // 後綴物件
    &__suffix {
      margin-left: auto;
    }
  }
  // 卡片內容
  .card-content {
    box-sizing: border-box;
    width: 100%;
    margin-top: 10px;
    border-top: 1px solid #becad3;

    &__main {
      margin: 15px 0;
    }
  }

  // 次要縮合卡片 sub-card
  &.sub-card {
    background-color: $card-grey;
  }

  // 小卡片 small-card(目前用於批次)
  &.small-card {
    padding: 0px;
    border: 1px solid $background-4;

    // 卡片標頭
    .card-header {
      padding: 0 10px;
      // 標題
      &__title {
        font-size: 12px;
        color: $text-3;
      }
    }

    // 卡片內容
    .card-content {
      padding: 10px;
      margin-top: 0px;
      border-top: 1px solid $background-4;

      &__main {
        margin: 0;
      }
    }
  }

  // 禁能樣式
  &.is-disabled {
    color: get-color-disabled($text-1);

    .card-header {
      cursor: not-allowed;
      // collapse
      &__collapse :deep(i) {
        color: get-color-disabled($primary-2);
        cursor: not-allowed;
      }
    }
  }
}
</style>
