import type Echo from 'laravel-echo';

/* eslint-disable @typescript-eslint/no-explicit-any */
export as namespace Websocket;

export class State {
  pusher?: any;
  echo?: Echo;
}
