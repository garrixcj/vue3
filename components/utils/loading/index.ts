import { type App } from 'vue';
import vLoading from './directive';

export default {
  install(app: App) {
    app.directive('loading', vLoading);
  },
  directive: vLoading,
};
