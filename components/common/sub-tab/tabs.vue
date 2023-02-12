<template lang="pug">
.rd-sub-tabs
  //- label 會利用 teleport 的方式傳送到 nav 底下
  .rd-sub-tabs-nav(:id="navId")

  .rd-sub-tabs-content
    slot
</template>

<script lang="ts">
import {
  defineComponent,
  provide,
  computed,
  getCurrentInstance,
  ref,
  onMounted,
} from 'vue';

export default defineComponent({
  name: 'RdSubTabs',
  props: {
    // v-model, 必填
    modelValue: {
      type: String,
      required: true,
    },
    // 控制 label 的大小
    size: {
      type: String,
      default: 'default',
      validator: (val: string) => {
        const typeSet = ['default', 'large'];
        return typeSet.indexOf(val) !== -1;
      },
    },
  },
  emits: ['update:model-value'],
  setup(props, { emit }) {
    // teleport id
    const uid = getCurrentInstance()?.uid || 0;
    const navId = `rd-sub-tabs-nav-${uid}`;
    provide('RdSubTabs:navId', navId);

    // active tab
    provide(
      'RdSubTabs:activeKey',
      computed(() => props.modelValue),
    );
    const updateValue = (value: string): void => {
      emit('update:model-value', value);
    };
    provide('RdSubTabs:updateValue', updateValue);

    // Mounted 狀態 (teleport 目標是否已載入)
    const isMounted = ref(false);
    provide('RdSubTabs:isMounted', isMounted);
    onMounted(() => {
      // teleport 必須要在目標 id mounted 後才能使用 to
      isMounted.value = true;
    });

    // tab size
    provide('RdSubTabs:size', props.size);

    return {
      navId,
    };
  },
});
</script>

<style lang="scss" scoped>
.rd-sub-tabs-nav {
  margin-bottom: 10px;
  @include flex-basic;
  @include space(10px);
}
</style>
