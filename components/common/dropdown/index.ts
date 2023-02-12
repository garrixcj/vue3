import { type App } from 'vue';
import RdDropdown from './dropdown.vue';
import RdDropdownItem from './item.vue';
import { ElDropdownMenu, ElDropdownItem } from 'element-plus';

export default {
  install: (app: App): void => {
    app.component(RdDropdown.name, RdDropdown);
    app.component(RdDropdownItem.name, RdDropdownItem);
    app.component('RdDropdownMenuItem', ElDropdownItem);
    app.component('RdDropdownMenu', ElDropdownMenu);
  },
};

declare module 'vue' {
  export interface GlobalComponents {
    // 單元件
    RdDropdown: typeof RdDropdown;
    RdDropdownItem: typeof RdDropdownItem;
    RdDropdownMenuItem: typeof ElDropdownItem;
    RdDropdownMenu: typeof ElDropdownMenu;
  }
}
