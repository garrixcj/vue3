/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getCurrentInstance,
  inject,
  onMounted,
  type App,
  type InjectionKey,
} from 'vue';
import type { State, Proxy } from './typings';
import { useWebSocketStoreWithOut } from '@/stores/websocket';
import VueNativeSock from 'vue-native-websocket-vue3';
import hosts from '@/plugins/url';

// WS Provider Key
export const WebSocketKey: InjectionKey<State> = Symbol();

// Get Sending Function ( onMounted )
export const getSender = () => {
  const proxy = getCurrentInstance()?.proxy as Proxy;
  return proxy?.$socket?.sendObj;
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

// Create WS
export const WSCreator = {
  install: (app: App) => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    app.use(VueNativeSock, `${protocol}://${hosts.ws}`, {
      format: 'json',
      reconnection: true,
      reconnectionDelay: 3000,
      connectManually: true,
      useWebSocketStoreWithOut,
      mutations: {
        SOCKET_ONOPEN: 'onOpen',
        SOCKET_ONCLOSE: 'onClose',
        SOCKET_ONERROR: 'onError',
        SOCKET_ONMESSAGE: 'onMessage',
        SOCKET_RECONNECT: 'onReconnect',
        SOCKET_RECONNECT_ERROR: 'onReconnectError',
      },
    });
  },
};

// create websocket
export const WSProvider = {
  install: (app: App) => {
    app.provide(WebSocketKey, {
      connect: app.config.globalProperties.$connect,
      disconnect: app.config.globalProperties.$disconnect,
    });
  },
};
