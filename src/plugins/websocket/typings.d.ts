/* eslint-disable @typescript-eslint/no-explicit-any */
export as namespace Websocket;

export class State {
  connect?: any;
  disconnect?: any;
  sender?: Function;
}

export type Proxy = {
  $socket?: { sendObj: Function };
};
