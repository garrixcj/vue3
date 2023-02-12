import {
  ElNotification,
  notificationTypes,
  type NotificationHandle,
  type NotificationParamsTyped,
  type NotificationOptions,
} from 'element-plus';

// 客製 icon
export const custom = (options: NotificationOptions) => {
  let notificationOptions = {
    ...options,
    icon: 'default',
    customClass: 'custom-icon',
  };
  if (options.customClass) {
    notificationOptions = {
      ...notificationOptions,
      customClass: `${options.customClass} custom-icon`,
    };
  }

  return ElNotification(notificationOptions);
};

export const notify = {
  ...ElNotification,
  custom,
};

export const RdNotification = ElNotification;

/**
 * 定時關閉的警告通知
 * @param  {number=10} duration 定時關閉，預設 10 秒
 */
export const useTimingNotify = (duration = 10000) =>
  notificationTypes.reduce((acc, type) => {
    acc[type] = (options?: NotificationParamsTyped) =>
      ElNotification[type]({ ...(options as NotificationOptions), duration });
    return acc;
  }, {} as Record<string, (options: NotificationParamsTyped) => NotificationHandle>);
