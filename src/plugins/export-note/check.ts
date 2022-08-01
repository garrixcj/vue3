import exportApi from '@/api/export';
import systemApi from '@/api/system';

// 檢查 API 是否能匯出檔案
export const useCheckExport = (functionName: string, tabName: string) => {
  const checkExport = () =>
    new Promise((resolve, reject) => {
      // 檢查是否能生成匯出檔案
      exportApi.checkAvailable(functionName, tabName).then(resp => {
        if (resp.data.result) {
          if (resp.data.data) {
            // 檢查下載專區是否在維護狀態
            systemApi
              .getFeatureEntranceMaintenanceStatus('Downloads')
              .then(maintenResp => {
                if (maintenResp.data.result) {
                  if (maintenResp.data.data.status) {
                    // 維護中
                    reject({
                      type: 'mainten',
                      time: maintenResp.data.data.end_at,
                    });
                  }
                  resolve(true);
                }
              });
          } else {
            // 忙碌中
            reject('busy');
          }
        } else {
          reject(false);
        }
      });
    });
  return { checkExport };
};
