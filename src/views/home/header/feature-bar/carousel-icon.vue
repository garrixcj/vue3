<template lang="pug">
//- carousel Feature 輪播功能列
.carousel-feature
  .prev-feature(
    v-show="list.length > 1"
    :class="[itemClass]"
    @click="slide('prev')"
  )
    i.mdi.mdi-chevron-left
  transition-group.trans-feature(tag="div" :name="carouselTransName")
    .current-item(:key="currentShow" :class="[itemClass]")
      slot(name="item" :item="currentItem")
        i.mdi(:class="[currentItem?.icon]")
  .next-feature(
    v-show="list.length > 1"
    :class="[itemClass]"
    @click="slide('next')"
  )
    i.mdi.mdi-chevron-right
</template>

<script lang="ts">
import { computed, defineComponent, type PropType, ref } from 'vue';
import type { CustomSwitch } from '../profile/nav-info';

export default defineComponent({
  name: 'CarouselIcon',
  props: {
    list: { type: Array as PropType<CustomSwitch[]>, required: true },
    itemClass: { type: String, default: '' },
  },
  setup(props) {
    // carousel 跑馬燈
    const currentShow = ref(0);
    const carouselTransName = ref('carousel-next');
    const currentItem = computed(() => {
      return props.list[currentShow.value];
    });
    const slide = (dir: 'next' | 'prev') => {
      carouselTransName.value = `carousel-${dir}`;
      if (props.list.length < 2) {
        return;
      }
      const step = dir === 'next' ? 1 : -1;
      currentShow.value =
        (currentShow.value + step + props.list.length) % props.list.length;
    };

    return {
      currentShow,
      carouselTransName,
      currentItem,
      slide,
    };
  },
});
</script>

<style lang="scss" scoped>
.carousel-feature {
  @include flex-basic(center);
  .trans-feature {
    position: relative;
    width: 65px;
    height: 56px;
    overflow: hidden;
    @include flex-basic(center);
  }
  .current-item {
    @include flex-basic(center);
    position: absolute;
    width: 100%;
    font-size: 32px;
    cursor: pointer;
  }
  .prev-feature,
  .next-feature {
    font-size: 32px;
    cursor: pointer;
    &:hover i {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 999px;
    }
    i {
      @include flex-basic(center);
      width: 32px;
      height: 32px;
    }
  }
}

/* GO TO NEXT SLIDE */
.carousel-next-enter-active,
.carousel-next-leave-active {
  transition: transform 0.5s ease-in-out;
}
.carousel-next-enter-from {
  transform: translateX(100%);
}
.carousel-next-leave-to {
  transform: translateX(-100%);
}

/* GO TO PREVIOUS carousel */
.carousel-prev-enter-active,
.carousel-prev-leave-active {
  transition: transform 0.5s ease-in-out;
}
.carousel-prev-enter-from {
  transform: translateX(-100%);
}
.carousel-prev-leave-to {
  transform: translateX(100%);
}
</style>
