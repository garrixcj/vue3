/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * WebSocket Websocket連線相關
 */
import { acceptHMRUpdate, defineStore } from 'pinia';

type WebSocketState = {
  socket: Socket;
};

type Socket = {
  isConnected: boolean;
  message: string;
  reconnectError: boolean;
};

export const useWebSocketStore = defineStore('websocket', {
  state: (): WebSocketState => ({
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    },
  }),
});

// Pinia HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWebSocketStore, import.meta.hot));
}
