/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createVNode,
  render,
  type DirectiveBinding,
  type ObjectDirective,
} from 'vue';
import RdLoading from './loading.vue';

// 產生loading元件
const createInstance = (el: any, binding: DirectiveBinding) => {
  // i18n locale
  const locale = binding.instance ? binding.instance.$i18n.locale : 'zh-cn';
  // 額外選項
  const textExr = el.getAttribute('loading-text');
  const backgroundExr = el.getAttribute('loading-background');
  const customClassExr = el.getAttribute('loading-custom-class');
  const fullscreenExr = el.getAttribute('loading-fullscreen') === 'true';
  // 建立 node
  const loadingVNode = createVNode(RdLoading, {
    visible: binding.value,
    text: textExr || '',
    background: backgroundExr || '',
    customClass: customClassExr || '',
    fullscreen: fullscreenExr || false,
    locale,
  });
  // 渲染產生el
  render(loadingVNode, document.createElement('div'));
  // 存取instance
  el.instance = loadingVNode;
  // 父層設定為position relative且禁止滾動
  el.classList.add('rd-loading-relative');
  el.appendChild(loadingVNode.el);

  // 移除
  const destroySelf = () => {
    // 移除 Loading
    if (el.instance && el.instance.el.parentNode) {
      el.instance.el.parentNode.removeChild(el.instance.el);
    }
    // 關閉 Loading
    el.instance.props.visible = false;
    // 移除上層的 Loading class
    el.classList.remove('rd-loading-relative');
  };
  el.instance.destroySelf = destroySelf;

  return el;
};

// Directive 設定
const vLoading: ObjectDirective = {
  beforeMount(el: any, binding: DirectiveBinding) {
    if (binding.value) {
      createInstance(el, binding);
    }
  },
  updated(el: any, binding: DirectiveBinding) {
    if (binding.value !== binding.oldValue) {
      if (binding.value) {
        createInstance(el, binding);
      } else {
        el?.instance?.destroySelf();
      }
    }
  },
  unmounted(el: any) {
    el?.instance?.destroySelf();
  },
};

export default vLoading;
