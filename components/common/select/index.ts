import { type App } from 'vue';
import RdSelect from './select.vue';
import RdOption from './option.vue';

export default {
  install: (app: App) => {
    app.component(RdSelect.name, RdSelect);
    app.component(RdOption.name, RdOption);
  },
};

declare module 'vue' {
  export interface GlobalComponents {
    // 單元件
    RdSelect: typeof RdSelect;
    RdOption: typeof RdOption;
  }
}
