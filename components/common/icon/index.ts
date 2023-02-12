import { App } from 'vue';
import RdArrowUp from './arrow-up.vue';
import RdCurrencyIcon from './currency-icon.vue';
import RdSort from './sort.vue';

export default {
  install: (app: App): void => {
    app.component(RdArrowUp.name, RdArrowUp);
    app.component(RdCurrencyIcon.name, RdCurrencyIcon);
    app.component(RdSort.name, RdSort);
  },
};

declare module 'vue' {
  export interface GlobalComponents {
    // 單元件
    RdArrowUp: typeof RdArrowUp;
    RdCurrencyIcon: typeof RdCurrencyIcon;
    RdSort: typeof RdSort;
  }
}
