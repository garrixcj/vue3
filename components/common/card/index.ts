import { type App } from 'vue';
import RdCard from './card.vue';
import RdMiniCard from './mini-card.vue';
import RdPanelCard from './panel-card.vue';

export default {
  install: (app: App): void => {
    app.component(RdCard.name, RdCard);
    app.component(RdMiniCard.name, RdMiniCard);
    app.component(RdPanelCard.name, RdPanelCard);
  },
};

declare module 'vue' {
  export interface GlobalComponents {
    // 單元件
    RdCard: typeof RdCard;
    RdMiniCard: typeof RdMiniCard;
    RdPanelCard: typeof RdPanelCard;
  }
}
