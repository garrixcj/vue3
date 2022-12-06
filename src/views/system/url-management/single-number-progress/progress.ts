import { keyBy, mapValues, invert } from 'lodash';

type ProgressInfo = {
  type: string;
  progress: string;
  dict: string;
  key: number;
};
// 域名狀態資訊列表
export const progressList: ProgressInfo[] = [
  {
    type: 'warning',
    progress: 'processing',
    dict: 'processing',
    key: 1,
  },
  {
    type: 'success',
    progress: 'finished',
    dict: 'finished',
    key: 2,
  },
  {
    type: 'danger',
    progress: 'canNotBind',
    dict: 'can_not_bind',
    key: 3,
  },
  {
    type: 'danger',
    progress: 'abolished',
    dict: 'abolished',
    key: 4,
  },
];

// 以前端狀態當做key的列資訊對照表
export const progressListMap = keyBy(progressList, info => info.progress);

// 後端值key與前端狀態的對照表
export const progressKeyMap = invert(
  mapValues(progressListMap, obj => obj.key),
);
