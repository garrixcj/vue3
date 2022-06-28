/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * WebSocket Websocket連線相關
 */
import { acceptHMRUpdate, defineStore } from 'pinia';
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
    onOpen() {
      this.isConnected = true;
    },
    onClose() {
      this.isConnected = false;
    },
    onError() {},
    onMessage(message: string) {
      this.message = message;
    },
    onReconnect() {},
    onReconnectError() {
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
