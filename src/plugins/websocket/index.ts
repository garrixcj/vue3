/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getCurrentInstance,
  inject,
  onMounted,
  type App,
  type ComponentInternalInstance,
  type InjectionKey,
} from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $socket: { sendObj: Function };
  }
}

declare class Websocket {
  connect?: any;
  disconnect?: any;
  sender?: Function;
}

export const WebSocketKey: InjectionKey<Websocket> = Symbol();

// Get Sending Function ( onMounted )
export const getSender = () => {
  const { proxy } = getCurrentInstance() as ComponentInternalInstance;
  return proxy?.$socket.sendObj;
};
// 使用 WebSocket
export const useWs = () => {
  const ws = inject(WebSocketKey, {});
  onMounted(() => {
    // 必須在onMounted取得currentInstance後取得sender function才能使用
    ws.sender = getSender();
  });
  return ws;
};

// create websocket
export default {
  install: (app: App) => {
    app.provide(WebSocketKey, {
      connect: app.config.globalProperties.$connect,
      disconnect: app.config.globalProperties.$disconnect,
    });
  },
};
