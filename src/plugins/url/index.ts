import env from '@/env';

export const enum HostMap {
  'WEBSOCKET_HOST' = 'ws',
  'BIGBALL_OLD_HOST' = 'bigBallOld',
  'BIGBALL_V3_HOST' = 'bigBallV3',
  'PID_ADMIN_HOST' = 'pidAdmin',
  'RD3_CASINO_HOST' = 'rd3Casino',
  'RD3_HOST' = 'rd3',
  'RD3_LIVE_HOST' = 'rd3Live',
  'RDE_URL' = 'rde',
}

export const useHosts = () => {
  const domain = window.location.hostname;
  let hosts = env.hosts;
  if (domain.includes('cloud')) {
    hosts = env.cloudHosts;
  }
  return { hosts };
};

export default env.hosts;
