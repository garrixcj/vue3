<i18n src="../../utils/rd/lang.json"></i18n>
<template lang="pug">
.rd-batch-input
  //- 上方輸入框
  rd-input.batch-pop__text(
    ref="inputRef"
    v-model="inputSearchValue"
    v-bind="$attrs"
    :placeholder="batchInputPlaceholder"
    v-click-outside="onClickOutside"
    clearable
    @click="popVisible = !popVisible"
    @input="changeSearchValue('single', $event)"
  )
    //- 模糊搜尋
    template(v-if="$slots.append" #append)
      slot(name="append")
  //- 彈出框
  rd-popover.batch-pop(
    ref="popoverRef"
    virtual-triggering
    placement="bottom"
    trigger="click"
    :visible="popVisible"
    :popper-class="getPopperClass"
    :virtual-ref="inputRef"
    :width="popWidth"
  )
    //- 提示文字
    slot(name="content")
      .batch-pop__info
        span {{ batchInfoText }}
    //- 批次輸入框
    rd-form(ref="batchFormRef" :model="batchForm" :rules="rules")
      rd-form-item(prop="content")
        rd-input.batch-pop__inner-text(
          v-model="batchSearchValue"
          type="textarea"
          :placeholder="batchTextareaPlaceholder"
          resize="none"
          :rows="9"
          @input="changeSearchValue('batch', $event)"
        )
    slot(name="footer")
      .batch-pop__footer
        //- 複製內容
        rd-button(size="small" text @click="copy(batchSearchValue)") {{ t('copy_content') }}
        //- 全部清除
        rd-button(size="small" text @click="reset") {{ t('reset_all') }}
        //- 顯示列數
        .batch-pop__amount(v-if="showInputAmount")
          span(:class="{ 'batch-pop__amount--error': popError }") {{ value.length }}
          span(v-if="maxRows") {{ ` / ${maxRows}` }}
          span {{ t('result') }}
  //- 複製 input
  textarea(
    ref="copyInputRef"
    value="複製資料"
    style="opacity: 0; position: fixed; left: -999999px; top: -999999px"
  )
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  watch,
  type PropType,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { ClickOutside as clickOutside } from 'element-plus';
import { useCopy } from '../../utils/copy';

export default defineComponent({
  name: 'RdBatchInput',
  directives: {
    clickOutside,
  },
  props: {
    // 批次搜尋文字內容
    value: {
      type: Array as PropType<string[]>,
      default: () => [] as string[],
    },
    // popover 的說明文字
    batchInfoText: {
      type: String,
      default: '',
    },
    // popover 的批次輸入框 placeholder
    batchTextareaPlaceholder: {
      type: String,
      default: '',
    },
    // 搜尋 input 的 placeholder
    batchInputPlaceholder: {
      type: String,
      default: '',
    },
    // 元件寬度 (上方輸入框寬度)
    width: {
      type: [Number, String],
      default: 320,
    },
    // 彈出框寬度 (預設不固定寬度)
    popoverWidth: {
      type: [Number, String],
    },
    // 批次輸入框的驗證規則
    rule: {
      type: Array,
    },
    // 是否要顯示輸入數量
    showInputAmount: {
      type: Boolean,
      default: true,
    },
    // 最大輸入數量（最多能輸入幾個內容）
    maxRows: {
      type: [Number, String],
    },
    //
    popperClass: {
      type: String,
      default: 'batch-input',
    },
    // 資料分隔符號
    separator: {
      type: String,
      default: ',',
    },
  },
  emits: ['update:value', 'update:visible'],
  setup(props, { emit }) {
    const uid = getCurrentInstance()?.uid || 0;
    // Init
    const popoverRef = ref();
    const inputRef = ref();
    const { t } = useI18n({ useScope: 'local' });
    const popWidth = computed(() => {
      return typeof props.popoverWidth !== 'undefined'
        ? `${props.popoverWidth}px`
        : `${props.width}px`;
    });
    const popError = computed(() => {
      return typeof props.maxRows !== 'undefined'
        ? props.value.length > props.maxRows
        : false;
    });

    // CSS Var Setting
    const batchInputWidth = computed(() => `${props.width}px`);

    // 上方輸入框內容
    const inputSearchValue = ref(props.value.join(props.separator));
    // popover 的批次輸入框內容
    const batchSearchValue = ref(props.value.join('\n'));

    // 批次輸入框表單驗證 (default form-item 為 content)
    const batchForm = reactive({
      content: props.value,
    });

    // 驗證規則
    const rules = reactive({
      content: props.rule as object[],
    });

    // 批次輸入框 ref
    const batchFormRef = ref();

    // 監聽 value 以隨時轉換格式
    watch(
      () => props.value,
      value => {
        inputSearchValue.value = value.join(props.separator);
        batchSearchValue.value = value.join('\n');
        batchForm.content = value;
      },
    );

    const popVisible = ref(false);
    // 更新 visible 值回上層
    watch(
      () => popVisible.value,
      value => {
        emit('update:visible', value);
      },
    );
    // 取得 popper-class
    const getPopperClass = computed(() => {
      return `${props.popperClass}-${uid}`;
    });

    /**
     * 變更搜尋內容
     * @param {string} field      輸入來源 (single:上方輸入框，batch:popover 的批次輸入框)
     * @param {string} inputValue 輸入內容
     */
    const changeSearchValue = (field: string, inputValue: string) => {
      // 如果使用者輸入的是 popover 的批次輸入框，就要把輸入的「,」全部過濾掉
      const restrictValue =
        field === 'batch'
          ? inputValue.replaceAll(props.separator, '')
          : inputValue;

      let text = [] as string[];
      // 如果輸入內容不為空，則將輸入內容轉換為 array，儲存輸入的每一個元素
      if (restrictValue !== '') {
        // 將使用者輸入的元素分割出來，並存進 searchValue 裡
        text =
          field === 'batch'
            ? restrictValue.split('\n')
            : restrictValue.split(props.separator);
      }
      emit('update:value', text);
    };

    // 檢查滑鼠事件點擊是否在外部空白處，用以關閉 popover
    const onClickOutside = (e: Event) => {
      const batchPopClasses: string[] = e
        .composedPath()
        .map((el: EventTarget) => (el as HTMLElement).className || '');
      const innerComponent = !!batchPopClasses.find(name =>
        name.includes(getPopperClass.value),
      );
      popVisible.value = innerComponent;
    };

    onMounted(() => {
      // 針對 input
      inputRef.value.input.setAttribute('readonly', 'true');
    });

    // 複製內容
    const { inputRef: copyInputRef, copy } = useCopy();

    // 全部清除
    const reset = () => {
      emit('update:value', []);
    };

    return {
      // template use
      popWidth,
      popError,
      t,
      inputSearchValue,
      batchSearchValue,
      changeSearchValue,
      batchForm,
      rules,
      batchFormRef,
      popVisible,
      inputRef,
      popoverRef,
      onClickOutside,
      getPopperClass,
      uid,
      // style use
      batchInputWidth,
      // 功能
      copyInputRef,
      copy,
      reset,
    };
  },
});
</script>
<style lang="scss" scoped>
.batch-pop {
  &__text {
    width: v-bind(batchInputWidth);
  }
  &__info {
    padding-bottom: 10px;
    font-size: 14px;
    color: $text-3;
    text-align: left;
    // 批次搜尋內輸入框移除 margin-bottom
    + .el-form {
      .el-form-item {
        margin-bottom: unset;
      }
    }
  }
  &__inner-text {
    height: auto;
  }
  &__footer {
    @include flex-basic(flex-end);
    @include space;
    margin-top: 4px;
  }
  &__amount {
    font-size: 12px;
    line-height: 20px;
    color: $text-3;

    &--error {
      color: $danger;
    }
  }
}
</style>
