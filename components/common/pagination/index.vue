<i18n src="../../utils/rd/lang.json"></i18n>
<template lang="pug">
.rd-pagination
  .rd-pagination__section
    //- 筆數下拉選單
    .rd-pagination__sizes(v-if="!noSizes")
      rd-select(
        v-model:value="size"
        :options="pageOptions"
        :popperSetting="popperSetting"
        @change="changePageSize"
      )
    //- 總計文字
    .rd-pagination__total(v-if="!noTotal")
      | {{ t('total_result', { num: groupSeparator(`${$attrs.total}`) }) }}
  .rd-pagination__section
    //- 頁碼主區塊
    .rd-pagination__pager
      el-pagination(
        v-bind="$attrs"
        layout="prev, pager, next"
        :page-size="size"
      )
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElPagination } from 'element-plus';
import RdSelect from '../select/select.vue';
import type { PopperSetting } from '../select/typing';
import { groupSeparator } from '../../utils/format/amount';

export default defineComponent({
  name: 'RdPagination',
  components: {
    ElPagination,
    RdSelect,
  },
  inheritAttrs: false,
  props: {
    // 不顯示分頁選單
    noSizes: {
      type: Boolean,
      default: false,
    },
    // 不顯示筆數總計
    noTotal: {
      type: Boolean,
      default: false,
    },
    // 每頁筆數下拉選單項目
    pageSizes: {
      type: Array as PropType<number[]>,
      validator: (pageSizes: unknown[]) => {
        return (
          pageSizes.length > 0 &&
          pageSizes.every((item: unknown) => typeof item === 'number')
        );
      },
      default: () => [30, 50, 100],
    },
    // 每頁筆數下拉選單預設選取項目
    pageSize: {
      type: Number,
      validator: (pageSize: unknown) => {
        return typeof pageSize === 'number';
      },
      default: 30,
    },
    // 下拉選單彈出框設定
    popperSetting: {
      type: Object as PropType<PopperSetting>,
      default: () => ({}),
    },
  },
  emits: ['update:pageSize'],
  setup(props, { emit }) {
    const { t } = useI18n({ useScope: 'local' });
    const size = ref(props.pageSize);
    const pageOptions = computed(() => {
      return props.pageSizes.map((value: number) => ({
        value,
        label: `${value}${t('page')}`,
      }));
    });

    // 監聽 props 的 pageSize 同步回 data
    watch(
      () => props.pageSize,
      (value: number) => {
        size.value = value;
      },
    );

    // 更新值時 emit 更新
    const changePageSize = (value: number) => {
      size.value = value;
      emit('update:pageSize', value);
    };

    return {
      t,
      size,
      pageOptions,
      changePageSize,
      groupSeparator,
    };
  },
});
</script>

<style lang="scss" scoped>
.rd-pagination {
  @include flex-basic(space-between);
  &__section {
    @include flex-basic;
    @include space;
  }
}
</style>
