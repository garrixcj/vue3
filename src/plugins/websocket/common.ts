// 常用事件監聽(暫時充當範例)
import { useWs } from './index';
import { Channel } from 'laravel-echo';

// 個人頻道常用事件包裝
class SelfChannel {
  channel?: Channel = undefined;
  constructor() {
    const ws = useWs();
    this.channel = ws.subscribeSelf();
  }
  // 監聽權限刷新事件
  listenPermission(callback: Function) {
    this.channel?.listen('.refresh.permission', callback);
    return this;
  }
  // 監聽下載事件
  listenExport(callback: Function) {
    this.channel?.listen('.refresh.export', callback);
    return this;
  }
}

// 訂閱使用個人頻道
export const useSelfChannel = () => {
  const selfChannel = new SelfChannel();
  return { selfChannel };
};

// 公用頻道常用事件包裝
class PublicChannel {
  channel?: Channel = undefined;
  constructor() {
    const ws = useWs();
    this.channel = ws.subscribePublic();
  }
  // 監聽功能維護事件
  listenFeatureMaintain(callback: Function) {
    this.channel?.listen('.refresh.feature.maintain', callback);
    return this;
  }
  // 監聽維護遊戲事件
  listenMaintainLobby(callback: Function) {
    this.channel?.listen('.maintain.lobby', callback);
    return this;
  }
}

// 訂閱使用公用頻道
export const usePublicChannel = () => {
  const publicChannel = new PublicChannel();
  return { publicChannel };
};
