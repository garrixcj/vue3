export as namespace EnvConfig;

export type Env = {
  appEnv: string; // 環境名稱
  hosts: {
    ws?: string; // websocket host
    pidAdmin?: string; // PID控端
    rd3?: string; // 舊控端轉址
    rd3Casino?: string; // 舊控端 Casino 類轉址
    rd3Live?: string; // 舊控端 Live 類轉址
    rde?: string; // 彩票類轉址
    bigBallOld?: string; // 大球舊站轉址
    bigBallV3?: string; // 大球站轉址
    [key: string]: string;
  };
  firebase: Record<string, string>;
  pusher: Record<string, string>;
};
