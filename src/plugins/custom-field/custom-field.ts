import { onMounted, ref } from 'vue';
import { operate as operateApi } from '@/api/admin';
import { useLoadingStore } from '@/stores/loading';
import { useCookieStore } from '@/stores/cookie';
import { notify } from '@/components/utils/notification';
import dict from '@/languages/plugin/custom_field.json';
import { useTrans } from '@/plugins/i18n/replace';

// 自訂欄位資料
export type FieldsType = {
  key: string;
  name: string;
  visible: boolean;
  default: boolean;
  disabled: boolean;
};

// 自訂欄位初始資訊
export type FieldsInfoType = {
  config: {
    operation: string;
    groupId: number;
    groupName: string;
  };
  data: FieldsType[];
};

// 初始化自訂欄位
export const initCustomField = (fieldsInfo: FieldsInfoType) => {
  const { t } = useTrans(dict, useCookieStore().lang);
  const customOptions = ref([] as string[]);
  const columnID = ref(0);
  const fieldsData = fieldsInfo.data;

  // 取目前自訂欄位設定
  const getOperateCustomFields = () => {
    operateApi.getCustomColumns(fieldsInfo.config.operation).then(resp => {
      const respData = resp.data.data;
      if (respData.groups.length > 0) {
        const groups = respData.groups[0];
        columnID.value = groups.column_id;
        customOptions.value = fieldsInfo.data
          .filter(item => Object.values(groups.columns).includes(item.key))
          .map(item => item.key);
      } else {
        customOptions.value = fieldsInfo.data
          .filter(item => item.default)
          .map(item => item.key);
      }
    });
  };

  // 設定自訂欄位
  const putCustomColumns = (fields: string[]) => {
    const config = fieldsInfo.config;
    if (columnID.value > 0) {
      return operateApi
        .putCustomColumns(columnID.value, config.groupName, fields)
        .then(() => {
          customOptions.value = fields;
        });
    } else {
      return operateApi
        .postCustomColumns(
          config.operation,
          config.groupId,
          config.groupName,
          fields,
        )
        .then(() => {
          customOptions.value = fields;
          getOperateCustomFields();
        });
    }
  };

  // 判斷是否顯示欄位
  const isDisplayedColumns = (column: string) => {
    return customOptions.value.includes(column);
  };

  // 確認異動
  const confirm = (fields: string[]) => {
    useLoadingStore().page = true;
    putCustomColumns(fields).then(() => {
      notify.success({
        title: t('success'),
      });
      useLoadingStore().page = false;
    });
  };

  onMounted(() => {
    getOperateCustomFields();
  });

  return { customOptions, fieldsData, isDisplayedColumns, confirm };
};
