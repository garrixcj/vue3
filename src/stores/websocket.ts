/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * WebSocket Websocket連線相關
 */
import { acceptHMRUpdate, defineStore } from 'pinia';
import store from './index';
import { uniq } from 'lodash';
import { useOperatorStore } from './operator';

export type WebSocketState = {
  // 可用頻道
  channels: string[];
  // 公用頻道
  publicChannel: 'admin';
  // 個人頻道
  userChannel: string;
  // 初始化完成(個人頻道設置完成)
  initialized: boolean;
};

export const useWebSocketStore = defineStore('websocket', {
  state: (): WebSocketState => ({
    channels: ['admin'],
    publicChannel: 'admin',
    userChannel: '',
    initialized: false,
  }),
  actions: {
    // 新增頻道
    addChannel(channel: string) {
      // 排除重複訂閱
      this.channels = uniq([...this.channels, channel]);
    },
    // 設置user
    init() {
      const operatorStore = useOperatorStore();
      if (operatorStore.operator.id) {
        const user = `admin.${operatorStore.operator.id}`;
        this.userChannel = user;
        this.initialized = true;
        this.addChannel(user);
      }
    },
    // 重置頻道設定
    resetChannels() {
      this.channels = ['admin'];
      this.userChannel = '';
      this.initialized = false;
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
