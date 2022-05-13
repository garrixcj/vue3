<template lang="pug">
//- Feature Bar 功能列
.feature-bar
  //- dropdown功能集合
  template(v-if="!expand && features.length > 1")
    rd-dropdown(trigger="click")
      .feature.collapse-icon-trigger
        rd-badge(
          :value="hasFeatureAmount ? 'N' : ''"
          :hidden="!hasFeatureAmount"
        )
          i.mdi.mdi-apps
      template(#dropdown)
        rd-dropdown-menu.feature-menu
          rd-dropdown-item.feature-menu-option(
            v-for="(feature, index) in features"
            :key="index"
            @click="!!feature.link ? openNewLink(feature.link) : feature.hook()"
          )
            .feature-menu-item
              i.mdi(:class="[feature.icon, feature.class]")
              span {{ t(feature.dict) }}
              rd-badge.counter(
                :value="feature.count || 0"
                :max="feature.max || 99"
                :hidden="!feature.count"
              )
              slot(v-if="feature.menuSlot && $slots[feature.menuSlot]")
  template(v-else-if="features.length > 0")
    //- 輪播切換功能集合(頁面寬度1200px以下)
    .feature-bar__carousel
      carousel-icons(item-class="feature" :list="features")
        template(#item="{ item: feature }")
          slot(v-if="!!feature.slot" :name="feature.slot" :feature="feature")
          rd-badge(
            v-else
            :value="feature.count || 0"
            :max="feature.max || 99"
            :hidden="!feature.count"
          )
            i.mdi(
              :title="t(feature.dict)"
              :class="[feature.icon, feature.class]"
              @click="openNewLink(feature.link)"
            )
    //- 展開 + 全部列出(頁面寬度1200px以上)
    .feature-bar__default
      .feature(v-for="(feature, index) in features" :key="index")
        slot(v-if="!!feature.slot" :name="feature.slot" :feature="feature")
        rd-badge(
          v-else
          :value="feature.count || 0"
          :max="feature.max || 99"
          :hidden="!feature.count"
        )
          i.mdi(
            :title="t(feature.dict)"
            :class="[feature.icon, feature.class]"
            @click="openNewLink(feature.link || '')"
          )
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import CarouselIcons from './carousel-icon.vue';
import type { CustomStatus } from '../profile/nav-info';

export default defineComponent({
  name: 'FeatureBar',
  components: {
    CarouselIcons,
  },
  setup() {
    const { t } = useI18n({ useScope: 'parent' });
    // Origin
    const customStatus = inject('Nav:customStatus') as CustomStatus;

    // 展開功能
    const expand = computed(() => {
      return customStatus.collapse.enable; // ? 資料的collapse = 展開(反邏輯)
    });

    // 所有icon功能
    const features = computed(() => {
      return customStatus.feature.filter(fea => fea.enable);
    });

    // 任一功能有數量
    const hasFeatureAmount = computed(() => {
      return customStatus.feature.some(fea => !!fea.count);
    });

    // 另開新分頁
    const openNewLink = (link: string) => {
      window.open(link);
    };

    return {
      expand,
      features,
      hasFeatureAmount,
      openNewLink,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
// bar上的
.feature-bar {
  @include flex-basic(center) {
    display: inline-flex;
  }
  margin-right: 15px;
  .feature {
    @include flex-basic(center);
    cursor: pointer;
    :deep(i) {
      font-size: 24px;
      color: white;
    }
    & + .feature {
      margin-left: 20px;
    }
  }
  &__default {
    @include flex-basic(center) {
      display: inline-flex;
    }
  }
  &__carousel {
    display: none;
  }
  @media (max-width: 1200px) {
    &__carousel {
      @include flex-basic(center);
    }
    &__default {
      display: none;
    }
  }
}
// 點開的 dropdown menu 樣式
.feature-menu {
  :deep() {
    .feature-menu-option {
      padding: 0 20px;
      line-height: 32px;
      &:hover {
        background-color: $primary-4;
      }
    }
    .rd-dropdown-item__content {
      width: 100%;
    }
  }
  &-item {
    @include flex-basic;
    @include space;
    width: 100%;
    i {
      font-size: 20px;
    }
    .counter {
      margin-left: auto;
    }
  }
}
</style>
