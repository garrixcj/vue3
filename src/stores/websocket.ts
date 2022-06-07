/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * WebSocket Websocket連線相關
 */
import { acceptHMRUpdate, defineStore } from 'pinia';
import { warn } from 'vue';
import store from './index';

export type WebSocketState = {
  isConnected: boolean;
  message: string;
  reconnectError: boolean;
};

export const useWebSocketStore = defineStore('websocket', {
  state: (): WebSocketState => ({
    isConnected: false,
    message: '',
    reconnectError: false,
  }),
  actions: {
    SOCKET_ONOPEN() {
      this.isConnected = true;
    },
    SOCKET_ONCLOSE() {
      this.isConnected = false;
    },
    SOCKET_ONERROR() {
      // warn('ws error');
    },
    SOCKET_ONMESSAGE(message: string) {
      this.message = message;
    },
    SOCKET_RECONNECT() {
      warn('ws rc error');
    },
    SOCKET_RECONNECT_ERROR() {
      this.reconnectError = true;
    },
  },
});

// Need to be used outside the setup
export function useWebSocketStoreWithOut() {
  return useWebSocketStore(store);
}

// Pinia HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWebSocketStore, import.meta.hot));
}
