<i18n>
  {
    "zh-tw": {
      "cancel": "取消",
      "confirm": "確定",
      "result": "筆",
    }
  }
</i18n>
<template lang="pug">
.batch-input-button
  //- 上方按鈕
  rd-button.batch-pop__button(
    ref="buttonRef"
    v-bind="$attrs"
    v-click-outside="onClickOutside"
    @click="popVisible = !popVisible"
  )
    slot
  //- 彈出框
  rd-popover.batch-pop(
    ref="popoverRef"
    virtual-triggering
    placement="bottom"
    trigger="click"
    :visible="popVisible"
    :popper-class="getPopperClass"
    :virtual-ref="buttonRef"
    :width="popoverWidth"
  )
    //- 提示文字
    slot(name="content")
      .batch-pop__info
        span {{ batchInfoText }}
    //- 批次輸入框
    rd-form(ref="batchFormRef" :model="batchForm" :rules="rules")
      rd-form-item(prop="content")
        rd-input.batch-pop__inner-text(
          v-model="batchValue"
          type="textarea"
          :placeholder="batchTextareaPlaceholder"
          resize="none"
          :rows="9"
        )
    slot(name="footer")
      .batch-pop__footer
        //- 顯示列數
        .batch-pop__amount(v-if="showInputAmount")
          span(:class="{ 'batch-pop__amount--error': popError }") {{ splitBatchValue.length }}
          span(v-if="maxRows") {{ ` / ${maxRows}` }}
          span {{ t('result') }}
        //- 取消
        rd-button(type="secondary" size="small" @click="cancel") {{ cancelText || t('cancel') }}
        //- 確定
        rd-button(type="primary" size="small" @click="confirmValidate") {{ confirmText || t('confirm') }}
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { ClickOutside as clickOutside } from 'element-plus';

export default defineComponent({
  name: 'BatchInputButton',
  directives: {
    clickOutside,
  },
  props: {
    // popover 的批次輸入框 placeholder
    batchTextareaPlaceholder: {
      type: String,
      default: '',
    },
    // popover 的說明文字
    batchInfoText: {
      type: String,
      default: '',
    },
    // 彈出框寬度
    popoverWidth: {
      type: [Number, String],
      default: 400,
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
      default: 'batch-input-button-popper',
    },
    // 確認按紐文字
    confirmText: String,
    // 取消按鈕文字
    cancelText: String,
  },
  emits: ['update:value', 'update:visible', 'cancel', 'confirm'],
  setup(props, { emit }) {
    // popperClass用，避免重複class
    const uid = getCurrentInstance()?.uid || 0;
    // popover ref
    const popoverRef = ref();
    // 按鈕 ref
    const buttonRef = ref();
    // 批次輸入框 ref
    const batchFormRef = ref();
    // popover 的批次輸入框內容
    const batchValue = ref('');
    const { t } = useI18n({ useScope: 'local' });

    // 將輸入值分割
    const splitBatchValue = computed(() =>
      batchValue.value ? batchValue.value.split('\n') : [],
    );

    // 判定輸入是否超過定義的最大數量
    const popError = computed(() => {
      return typeof props.maxRows !== 'undefined'
        ? splitBatchValue.value.length > props.maxRows
        : false;
    });

    // 批次輸入框表單驗證 (default form-item 為 content)
    const batchForm = reactive({
      content: splitBatchValue.value,
    });

    // 驗證規則
    const rules = reactive({
      content: props.rule as object[],
    });

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
     * 變更內容
     * @param {string} inputValue 輸入內容
     */
    const changeValue = (inputValue: string) => {
      // 更新popper裡的輸入匡值
      batchValue.value = inputValue;
    };

    // 檢查滑鼠事件點擊是否在外部空白處，用以關閉 popover(不清空資料)
    const onClickOutside = (e: Event) => {
      const batchPopClasses: string[] = e
        .composedPath()
        .map((el: EventTarget) => (el as HTMLElement).className || '');
      const innerComponent = !!batchPopClasses.find(name =>
        name.includes(getPopperClass.value),
      );
      popVisible.value = innerComponent;
    };

    // 取消
    const cancel = () => {
      // 關閉popover
      popVisible.value = false;
      // popover input清空
      changeValue('');
      // 觸發父層動作
      emit('cancel');
    };

    // 確定前檢查驗證
    const confirmValidate = () => {
      // 當有帶入驗證時才驗證
      if (props.rule) {
        batchFormRef.value.validate((valid: boolean) => {
          if (valid) {
            confirm();
          }
        });
      } else {
        confirm();
      }
    };

    // 確定
    const confirm = () => {
      // 關閉popover
      popVisible.value = false;
      // 更新值回上層value
      emit('update:value', splitBatchValue.value);
      // 觸發父層動作
      emit('confirm');
      // popover input清空
      changeValue('');
    };

    return {
      popError,
      t,
      batchValue,
      batchForm,
      rules,
      batchFormRef,
      popVisible,
      buttonRef,
      popoverRef,
      onClickOutside,
      getPopperClass,
      uid,
      cancel,
      confirmValidate,
      splitBatchValue,
    };
  },
});
</script>
<style lang="scss" scoped>
.batch-pop {
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
