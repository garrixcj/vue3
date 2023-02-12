import { type App } from 'vue';
import RdSubTabs from './tabs.vue';
import RdSubTabPane from './tab-pane.vue';

export default {
  install: (app: App) => {
    app.component(RdSubTabs.name, RdSubTabs);
    app.component(RdSubTabPane.name, RdSubTabPane);
  },
};

declare module 'vue' {
  export interface GlobalComponents {
    // 單元件
    RdSubTabs: typeof RdSubTabs;
    RdSubTabPane: typeof RdSubTabPane;
  }
}
