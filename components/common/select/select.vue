<i18n src="../../utils/rd/lang.json"></i18n>
<template lang="pug">
.rd-select
  //- select 點擊
  selected(
    ref="selectedRef"
    v-click-outside="onClickOutside"
    @click="updateVisible(!visible)"
  )
    template(#selected="{ current }")
      slot(name="selected" :current="current")
    template(#placeholder): slot(name="placeholder")
  rd-popover(
    ref="popoverRef"
    trigger="click"
    virtual-triggering
    popper-class="rd-select__layout"
    :visible="visible"
    :virtual-ref="selectedRef"
    :placement="placement"
    :fallback-placements="['bottom-start', 'top-start', 'right', 'left']"
    :width="popWidth"
    @hide="popoverHide"
  )
    .rd-select__content(ref="selectContentRef")
      //- 快搜
      .quick-search(v-show="hasQuickSearch")
        rd-input(
          v-model="searchKeyword"
          :placeholder="quickSearchPlaceHolder || t('input-keyword')"
          :validate-event="false"
        )
      //- 選項 (搭配 option 元件使用)
      rd-scrollbar(ref="scrollbarRef")
        .select-options(
          ref="menuRef"
          :style="{ maxHeight: `${popperSetting.maxHeight}px` }"
        )
          rd-option(v-if="allOption" :label="t('all')" all)
          //- 快捷選項 請選擇 (不會計入所有選項內)
          rd-option(
            v-else-if="resetOption"
            :label="t('place-holder-default')"
            value=""
          )
          //- options 生成
          template(v-if="options.length > 0")
            rd-option(
              v-for="(option, index) in options"
              :key="index"
              v-bind="option"
            )
          //- slot 生成
          slot(v-else)
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  provide,
  ref,
  warn,
  watchEffect,
  watch,
  nextTick,
  type PropType,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { isArray } from 'lodash';
import { useFormItem } from 'element-plus';
import ViewMode from '../../custom/view-mode/index.vue';
import Selected from './selected.vue';
import RdOption from './option.vue';
import { ElTooltip, ClickOutside as clickOutside } from 'element-plus';
import type {
  PopperSetting,
  QuickSearchSetting,
  SelectOption,
  SelectedSetting,
  SelectedSize,
} from './typing';

export default defineComponent({
  name: 'RdSelect',
  components: {
    Selected,
    RdOption,
    ViewMode,
  },
  directives: {
    clickOutside,
  },
  props: {
    // 共用屬性
    value: {
      type: [Array, String, Number] as PropType<
        string[] | number[] | string | number
      >,
      required: true,
    }, // 被選取的 option
    options: {
      type: Array as PropType<SelectOption[]>,
      default: () => [],
    }, // 下拉選項資料
    size: {
      // 尺寸
      type: String as PropType<SelectedSize>,
      default: 'default',
      validator: (val: string) => {
        const typeSet = ['small', 'default', 'large'];
        return typeSet.indexOf(val) !== -1;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    }, // 狀態 (是否禁用)
    multiple: {
      type: Boolean,
      default: false,
    }, // 是否為多選
    allOption: {
      type: Boolean,
      default: false,
    }, // 是否有全選選項
    resetOption: {
      type: Boolean,
      default: false,
    }, // 是否有 [請選擇] 重置選項 (與全選衝突)
    // 快搜選項 (boolean 值只決定開關，若為物件值則必定開啟快搜)
    quickSearch: {
      type: [Object, Boolean] as PropType<QuickSearchSetting | boolean>,
      default: false,
    },
    // 下拉選單彈出框設定
    popperSetting: {
      type: Object as PropType<PopperSetting>,
      default: () => ({}),
    },
    // 已選項目設定
    selectedSetting: {
      type: Object as PropType<SelectedSetting>,
      default: () => ({}),
    },
  },
  emits: ['update:value', 'change'],
  setup(props, { emit, slots }) {
    const popoverRef = ref<InstanceType<typeof ElTooltip>>();
    const selectedRef = ref<InstanceType<typeof Selected>>();
    const selectContentRef = ref();
    const scrollbarRef = ref();
    const menuRef = ref();
    // Init
    const { t } = useI18n({ useScope: 'local' });
    if (props.multiple && !isArray(props.value)) {
      // 避免多選錯誤使用 預先排錯清空錯誤型態 value
      warn('使用多選模式時，綁定的 value 不是陣列');
    }
    if (!props.multiple && props.allOption) {
      // 全選選項功能只適用於多選
      warn(
        '單選模式無法適用多選限定的虛擬全選選項，請自行加入「全選」的單一選項',
      );
    }

    // -----------------------------------------
    // 共用
    // -----------------------------------------
    const popWidth = computed(() => props.popperSetting['width']);
    const selectValue = computed(() => props.value); // 同 props value
    provide('RdSelect:selectedData', selectValue);
    const disabledValue = computed(() => props.disabled); // 同 props value
    provide('RdSelect:disabled', disabledValue);
    const quickSearchPlaceHolder = computed(() =>
      typeof props.quickSearch === 'boolean'
        ? undefined
        : props.quickSearch['placeholder'],
    );
    // 更新被選取的選項
    const updateValue = (val: unknown) => {
      emit('update:value', val);
      emit('change', val);
    };

    // 跳躍到已選選項高度
    const scrollTo = async () => {
      await nextTick();
      const top =
        menuRef.value.querySelector('.rd-option .is-selected')?.offsetTop || 0;
      scrollbarRef.value.setScrollTop(top);
      scrollbarRef.value.update();
    };

    // 控制 popover 收合
    const visible = ref(false);
    // 更新 popover 收合狀態
    const updateVisible = (val: boolean) => {
      if (!props.disabled) {
        visible.value = val;
        if (val) {
          // 開啟時跳躍到選項高度
          scrollTo();
        }
      }
    };
    // 點空白處關閉 popover
    const popoverHide = () => {
      visible.value = false;
      // 關閉時清除快搜
      searchKeyword.value = '';
    };
    provide('RdSelect:visible', visible);

    // 表單驗證時只會監聽 el 系列組件，因此導入 formItem 讓 form 在執行表單驗證時能監聽到該組件 value
    const { formItem } = useFormItem();

    const currentSize = computed(() => {
      if (formItem?.size) {
        return formItem.size;
      }

      return props.size;
    });
    provide('RdSelect:size', currentSize);

    // popoverSetting placement
    const placement = computed(() => {
      if (typeof props.popperSetting['placement'] !== 'undefined') {
        return props.popperSetting['placement'];
      }
      return 'bottom-start';
    });

    // 選項模式
    const mode = computed(() => (props.multiple ? 'multiple' : 'single'));
    provide('RdSelect:mode', mode);

    // 已選樣式選項
    provide('RdSelect:selectedSetting', props.selectedSetting);

    // 快搜選項
    const searchKeyword = ref(''); // 快搜輸入框內容
    const hasQuickSearch = computed(() => !!props.quickSearch);
    provide('RdSelect:quickSearch', props.quickSearch);
    provide('RdSelect:searchKeyword', searchKeyword);

    const getAllOptions = () => {
      if (props.options.length !== 0) {
        return props.options;
      }
      // * 因解析 vnode 太複雜所以使用 any
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const children = slots.default?.().reduce(
        (acc, child) =>
          isArray(child.children)
            ? [...acc, ...child.children]
            : child.props !== null
            ? [...acc, child]
            : acc,
        [] as any[],
        /* eslint-enable  @typescript-eslint/no-explicit-any */
      );
      if (children && isArray(children)) {
        // 分隔線、全選項、群組功能 不列入計算，value 不能為 undefined
        return children
          .filter(
            (childComponent: typeof RdOption) =>
              !(
                childComponent.props?.all ||
                childComponent.props.all === '' ||
                childComponent.props?.divided ||
                childComponent.props.divided === '' ||
                childComponent.props?.group ||
                childComponent.props.group === ''
              ),
          )
          .map((childComponent: typeof RdOption) => childComponent.props)
          .filter(
            props => typeof props.value !== 'undefined',
          ) as SelectOption[];
      }
      return [] as SelectOption[];
    };
    // 下層全部選項
    const allOptions = computed(() => {
      return getAllOptions();
    });

    // 點選 options 外部元素關閉 popover
    const onClickOutside = (e: Event) => {
      // 利用 .rd-select__content 尋找其上層 el-popper 根節點，
      // 判斷點擊區塊是否位於根節點內來控制 popover 顯示開關
      const elPopperRoot = selectContentRef.value.parentNode;
      const target = e.target;

      if (elPopperRoot.contains(target)) {
        return;
      }

      if (visible.value) {
        visible.value = !visible.value;
      }
    };

    // -----------------------------------------
    // 單選
    // -----------------------------------------

    // [單選] 已選擇標籤
    const selectLabel = ref<SelectOption>();
    provide('RdSelect:selectedLabel', selectLabel);
    // 點擊選項
    const select = (prop: SelectOption) => {
      if (!prop.disabled) {
        visible.value = false;
        selectLabel.value = prop;
        updateValue(prop.value);
      }
    };
    provide('RdSelect:select', select);

    // -----------------------------------------
    // 多選
    // -----------------------------------------

    // [多選] 已選擇標籤
    const selectTags = ref<SelectOption[]>([]);
    provide('RdSelect:selectedTags', selectTags);
    // [多選] 全選功能
    // 啟用選項
    const enableOptions = computed(() =>
      allOptions.value.filter(option => !option.disabled),
    );
    // 是否已全選 可選都在已選裡面 = 全選
    const checkAll = computed(
      () =>
        enableOptions.value.length > 0 &&
        enableOptions.value.every(
          option =>
            (selectValue.value as (number | string)[]).indexOf?.(
              option.value,
            ) !== -1,
        ),
    );
    provide('RdSelect:checkAll', checkAll);
    // 全選不穩定狀態 (有任何一個已經選取且還沒全選)
    const indeterminate = computed(
      () =>
        enableOptions.value.some(
          option =>
            (selectValue.value as (number | string)[]).indexOf?.(
              option.value,
            ) !== -1,
        ) && !checkAll.value,
    );
    provide('RdSelect:indeterminate', indeterminate);

    // 全選/全選取消
    const changeAll = (flag: boolean) => {
      const opts = enableOptions.value.map(opt => opt.value);
      let unsortKeys: (string | number)[] = [];
      if (flag) {
        // true 全選 => 排除重複 (已選 + 可選)
        unsortKeys = [...(selectValue.value as (number | string)[]), ...opts];
      } else {
        // false 全不選 => 已選過濾可選
        unsortKeys = (selectValue.value as (number | string)[]).filter(
          option => opts.indexOf(option) === -1,
        );
      }
      const tags = allOptions.value.filter(
        option => unsortKeys.indexOf(option.value) !== -1,
      );
      updateValue(tags.map(option => option.value));
      selectTags.value = tags;
    };
    provide('RdSelect:changeAll', changeAll);

    // 選取/取消選取
    const check = (flag: boolean, optProp: SelectOption) => {
      let unsortKeys: (string | number)[] = [];
      if (flag) {
        unsortKeys = [
          ...(selectValue.value as (number | string)[]),
          optProp.value,
        ];
      } else {
        unsortKeys = (selectValue.value as (number | string)[]).filter(
          option => optProp.value !== option,
        );
      }

      const tags = allOptions.value.filter(
        option => unsortKeys.indexOf(option.value) !== -1,
      );
      updateValue(tags.map(option => option.value));
      selectTags.value = tags;
    };
    provide('RdSelect:check', check);

    // -----------------------------------------
    // Mounted
    // -----------------------------------------
    const init = () => {
      if (props.multiple) {
        // 多選載入取得複數標籤
        selectTags.value = allOptions.value.filter(
          option =>
            (props.value as (number | string)[]).indexOf?.(option.value) !== -1,
        );
      } else {
        allOptions.value.forEach(option => {
          // 單選載入取得標籤
          if (props.value === option.value) {
            selectLabel.value = {
              ...option,
            };
          }
        });
      }
    };

    // 取得初始資料
    onMounted(() => {
      init();
    });
    watchEffect(init);
    // 多選勾選選項後就重新計算 popover 位置，避免蓋住 select 選擇器
    if (props.multiple) {
      watchEffect(() => {
        if (selectValue.value) {
          popoverRef.value?.popperRef?.popperInstanceRef?.update();
        }
      });
    }

    watch(
      () => props.value,
      () => {
        // 當 value change 更新驗證狀態
        formItem?.validate?.('change');
      },
    );

    return {
      t,
      visible,
      hasQuickSearch,
      searchKeyword,
      placement,
      updateVisible,
      onClickOutside,
      popoverRef,
      selectedRef,
      selectContentRef,
      scrollbarRef,
      menuRef,
      quickSearchPlaceHolder,
      popoverHide,
      popWidth,
    };
  },
});
</script>

<style lang="scss" scoped>
.rd-select {
  display: inline-block;
  vertical-align: top;
  &__content {
    .select-options {
      box-sizing: border-box;
      max-height: 300px;
    }
    // 快搜
    .quick-search {
      padding: 0 6px 6px;
    }
  }
  :global(.el-popover.el-popper.rd-select__layout) {
    padding: 6px 0;
  }
}
</style>
