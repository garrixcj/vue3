/* eslint-disable @typescript-eslint/no-explicit-any */
import env from '@/env';
import { inject, onUnmounted, type App, type InjectionKey } from 'vue';
import type { State } from './typings';
import { useWebSocketStore } from '@/stores/websocket';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

// WS Provider Key
export const WebSocketKey: InjectionKey<State> = Symbol();

// Create WS
export const WSCreator = {
  install: (app: App) => {
    const echo = new Echo({
      broadcaster: 'pusher',
      key: env.pusher.appKey,
      wsHost: env.pusher.host,
      wsPort: 80,
      wssPort: 443,
      forceTLS: false,
      encrypted: true,
      disableStats: true, // 很重要，一定要打開<回饋官方pusher開關>
      enabledTransports: ['ws', 'wss'],
    });

    app.provide(WebSocketKey, {
      pusher: Pusher,
      echo,
    });
  },
};

// 使用 WebSocket
export const useWs = () => {
  const ws = inject(WebSocketKey, {});
  const wsStore = useWebSocketStore();

  /**
   * 訂閱頻道收取通知
   * @param  {string} channel 訂閱頻道
   * @param  {boolean} destroy unmounted 時自我摧毀
   * @param  {Function} callback 接收事件後反饋
   */
  const subscribe = (channelKey: string, destroy = true) => {
    const channel = ws.echo?.channel(channelKey);
    if (destroy) {
      onUnmounted(() => {
        ws.echo?.leave(channelKey);
      });
    }
    return channel;
  };

  /**
   * 訂閱公用頻道收取通知
   */
  const subscribePublic = () => {
    return subscribe(wsStore.publicChannel);
  };

  /**
   * 訂閱個人頻道收取通知
   * @param  {string} event 事件 key
   * @param  {Function} callback 接收事件後反饋
   */
  const subscribeSelf = () => {
    if (wsStore.initialized && wsStore.userChannel) {
      return subscribe(wsStore.userChannel);
    }
    return undefined;
  };

  // 關閉連線(App底層使用)
  const disconnect = () => {
    ws.echo?.disconnect();
  };

  return { ...ws, subscribe, subscribePublic, subscribeSelf, disconnect };
};
