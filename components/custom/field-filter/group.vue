<i18n src="../../utils/rd/lang.json"></i18n>
<template lang="pug">
//- 選項空間
rd-checkbox-group(v-model="value")
  .field-filter__group-container(:style="optionsStyle")
    .field-filter__group(v-for="(group, idx) in groupFields" :key="idx")
      .title {{ idx }}
      rd-checkbox.field-filter__option(
        v-for="(obj, index) in group"
        :key="index"
        :label="obj.key"
        :disabled="obj.disabled"
      )
        span.label {{ obj.name }}
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  inject,
  type Ref,
  warn,
  onMounted,
} from 'vue';
import type { GroupFieldSet } from './typing';
import { groupBy, min } from 'lodash';

export default defineComponent({
  // 自訂欄位
  name: 'FieldFilterGroup',
  inheritAttrs: false,
  setup() {
    const value = inject<Ref<string[]>>('FieldFilter:value');
    const currentFields = inject<Ref<GroupFieldSet[]>>(
      'FieldFilter:currentFields',
      ref([]),
    );
    onMounted(() => {
      if (currentFields.value.some(field => !field.group)) {
        warn('部分選項沒有 group!!');
      }
    });
    const groupFields = computed(() =>
      groupBy(currentFields.value, field => field.group),
    );
    // grid row 最大數量 10
    const optionsStyle = computed(() => {
      const columnLimit = 2;
      return {
        gridTemplateColumns: `repeat(${min([
          columnLimit,
          Object.keys(groupFields.value).length,
        ])}, 1fr)`,
      };
    });

    return {
      value,
      currentFields,
      groupFields,
      optionsStyle,
    };
  },
});
</script>

<style lang="scss" scoped>
.field-filter {
  &__group-container {
    display: grid;
    gap: 10px;
    margin-bottom: 10px;
  }
  &__group {
    @include flex-basic(flex-start, flex-start);
    @include space-vertical;
    flex-direction: column;
    padding: 10px;
    background-color: $primary-5;
    border-radius: 6px;
    :deep(.el-checkbox) {
      height: 14px;
      margin-right: 0;
    }
    :deep(.el-checkbox__label) {
      line-height: 1;
    }
    .title {
      font-size: 14px;
      font-weight: 600;
      line-height: 1;
      color: $text-1;
    }
  }
  &__option {
    @include space(5px);
    min-width: 220px;
    .label {
      line-height: 1;
    }
  }
}
</style>
