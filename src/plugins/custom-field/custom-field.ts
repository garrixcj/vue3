import { ref } from 'vue';
import { operate as operateApi } from '@/api/admin';

export type FieldsType = {
  key: string;
  name: string;
  visible: boolean;
  default: boolean;
  disabled: boolean;
};

export type FieldsInfoType = {
  config: {
    operation: string;
    groupId: number;
    groupName: string;
  };
  data: FieldsType[];
};

export const useOperateApi = () => {
  const customOptions = ref([] as string[]);
  const columnID = ref(0);

  const getOperateCustomFields = (fieldsInfo: FieldsInfoType) => {
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

  const putCustomColumns = (fields: string[], fieldsInfo: FieldsInfoType) => {
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
        });
    }
  };

  return { customOptions, getOperateCustomFields, putCustomColumns };
};
