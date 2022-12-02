import { useI18n } from 'vue-i18n';

export const useInitial = () => {
  const { t } = useI18n({ useScope: 'local' });
  // 操作選項
  const operatorOption = [
    {
      value: 0,
      label: t('all'),
    },
    {
      value: 5,
      label: t('edit_remark'),
    },
    {
      value: 6,
      label: t('restriction'),
    },
  ];
  // 申請類別選項
  const applyOption = [
    {
      value: 1,
      label: t('apply_url'),
    },
    {
      value: 2,
      label: t('apply_url_success'),
    },
    {
      value: 3,
      label: t('apply_url_voiding'),
    },
    {
      value: 4,
      label: t('apply_url_void_completed'),
    },
  ];
  // 關鍵字選項
  const keywordOptions = [
    {
      value: 'operator',
      label: t('operator'),
    },
    {
      value: 'ip',
      label: t('operator_ip'),
    },
  ];

  return {
    operatorOption,
    applyOption,
    keywordOptions,
  };
};
