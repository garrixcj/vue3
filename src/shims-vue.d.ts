/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/**
 * File
 */
declare module '*.json' {
  const value: any;
  export default value;
}
declare module '*.png';
declare module '*.svg';

import { ComponentInternalInstance } from 'vue';
/**
 * Websocket
 */
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $socket: { sendObj: Function };
  }
}
