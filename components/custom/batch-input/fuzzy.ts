import { ref, watch, type Ref } from 'vue';

// 模糊搜尋開關
export const disabled = ref(false);

const batchInput = ref<string[]>([]);

// 檢查模糊搜尋開關是否需取消
export const useCheckDisabled = (formContent: Ref<string[]> = batchInput) => {
  watch(formContent, value => {
    const list = value.filter(item => item !== '');
    if (list.length > 1) {
      disabled.value = true;
    } else {
      disabled.value = false;
    }
    batchInput.value = formContent.value;
  });
  return { disabled, batchInput };
};
