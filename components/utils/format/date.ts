/**
 * 日期時間轉換格式
 */

import dayjs from 'dayjs';
import { type Dayjs } from 'dayjs';

export enum CommonFormats {
  date = 'YYYY-MM-DD',
  time = 'HH:mm:ss',
}

/**
 * 轉換成日期
 * @param {string | Date | Dayjs | null | undefined} time
 * @param {string} defaultText
 * @return {string}
 */
export const dateFormat = (
  time: string | Date | Dayjs | null | undefined,
  defaultText = '',
) => {
  if (dayjs(time).isValid()) {
    return dayjs(time).format(CommonFormats.date);
  }
  return defaultText;
};

/**
 * 轉換成時間
 * @param {string | Date | Dayjs | null | undefined} time
 * @param {string} defaultText
 * @return {string}
 */
export const timeFormat = (
  time: string | Date | Dayjs | null | undefined,
  defaultText = '',
) => {
  if (dayjs(time).isValid()) {
    return dayjs(time).format(CommonFormats.time);
  }
  return defaultText;
};

export default {
  CommonFormats,
  dateFormat,
  timeFormat,
};
