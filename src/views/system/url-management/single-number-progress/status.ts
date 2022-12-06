import { keyBy } from 'lodash';
import type { DomainName } from './single-number-progress';

export type StatusInfo = {
  type: string;
  status: string;
  dict: string;
  keys: number[];
};
// 單據狀態資訊列表 －> *需特別注意: 因為需求，某些後端狀態在前端會被視為同一個狀態*
export const statusList: StatusInfo[] = [
  // 「前端狀態」處理中 －> *需特別注意(擁有複數狀態)*
  {
    type: 'warning',
    status: 'processing',
    dict: 'processing',
    // 「後端狀態」待處理:0、處理中: 1
    keys: [0, 1],
  },
  // 「前端狀態」已完成
  {
    type: 'success',
    status: 'finished',
    dict: 'finished',
    // 「後端狀態」已完成:2
    keys: [2],
  },
  // 「前端狀態」作廢中 －> *需特別注意(擁有複數狀態)*
  {
    type: 'warning',
    status: 'abolishing',
    dict: 'abolishing',
    // 「後端狀態」待作廢:3、作廢中:4
    keys: [3, 4],
  },
  // 「前端狀態」已作廢
  {
    type: 'danger',
    status: 'abolished',
    dict: 'abolished',
    // 「後端狀態」已作廢:5
    keys: [5],
  },
];

// 以前端狀態當做key的列資訊對照表
export const statusListMap = keyBy(statusList, info => info.status);

// 單據狀態 - 後端值key與前端狀態的對照表
export const statusKeyMap = statusList.reduce(
  (acc: Record<number, string>, info) => {
    info.keys.forEach((key: number) => {
      acc[key] = info.status;
    });
    return acc;
  },
  {},
);

// 判定是否可以做廢
export const abolishable = (
  status: number,
  buy: string,
  domainList: DomainName[],
) => {
  let result = false;

  // 當今天單據的「後端狀態」為「待處理」時或者是
  // 單據的「後端狀態」為「處理中」，且是購買方式為「公司買」，且所有的域名狀態都還處於處理中時
  // 以上2種狀況任一才可進行作廢
  const notProcessingDomainCount = domainList.filter(
    obj => obj.progress !== 1,
  ).length;
  if (
    status === 0 ||
    (status === 1 && buy === 'domain' && notProcessingDomainCount === 0)
  ) {
    result = true;
  }

  return result;
};
