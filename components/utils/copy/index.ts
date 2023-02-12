import { ref } from 'vue';

// 使用前請在 template 加上 『隱藏 input』
// 單行
// <input ref="inputRef" value="複製資料" style="opacity:0;position:fixed; left: -999999px; top: -999999px" />
// 換行
// <textarea ref="inputRef" value="複製資料" style="opacity:0;position:fixed; left: -999999px; top: -999999px" />
// Pug
// input(ref="inputRef" value="複製資料" style="opacity:0;position:fixed; left: -999999px; top: -999999px")
// textarea(ref="inputRef" value="複製資料" style="opacity:0;position:fixed; left: -999999px; top: -999999px")

// 『隱藏 input』 的 Ref
const inputRef = ref<HTMLInputElement>();
// 複製功能
const copy = (name: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(name);
  } else {
    if (inputRef.value) {
      inputRef.value.value = name;
    }
    inputRef.value?.select(); // 選擇物件
    document.execCommand('copy'); // 執行瀏覽器複製命令
  }
};

export const useCopy = () => ({ inputRef, copy });
