import { type App } from 'vue';
import RdLayout from './normal.vue';
import RdLayoutContent from './content.vue';
import RdNavbarLayout from './navbar.vue';
import RdLayoutSubTab from './sub-tab.vue';

export default {
  install(app: App): void {
    app.component(RdLayout.name, RdLayout);
    app.component(RdLayoutContent.name, RdLayoutContent);
    app.component(RdNavbarLayout.name, RdNavbarLayout);
    app.component(RdLayoutSubTab.name, RdLayoutSubTab);
  },
};

declare module 'vue' {
  export interface GlobalComponents {
    // 單元件
    RdLayout: typeof RdLayout;
    RdLayoutContent: typeof RdLayoutContent;
    RdNavbarLayout: typeof RdNavbarLayout;
    RdLayoutSubTab: typeof RdLayoutSubTab;
  }
}
