import { ClickOutside as clickOutside } from 'element-plus';
import { ref, unref } from 'vue';

export { clickOutside };

export const useClickOutside = () => {
  const visible = ref(false);
  // popover 的 template ref
  const popoverRef = ref();
  // 綁定到 v-click-outside 的 function
  const onClickOutside = (e: Event) => {
    // 取得 popper 真實的內容 template ref
    const elPopperRoot = unref(unref(popoverRef).popperRef).contentRef;
    const target = e.target;

    // 若點擊位置屬於 popper 內容，取消動作
    if (elPopperRoot.contains(target)) {
      return;
    }

    // 關閉 popper
    visible.value = false;
  };
  return { visible, popoverRef, onClickOutside };
};
