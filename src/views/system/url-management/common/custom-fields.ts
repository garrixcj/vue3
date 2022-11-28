import { useI18n } from 'vue-i18n';

// 客端域名自訂欄位初始設定
export const customerDomainFieldsInitial = () => {
  const { t } = useI18n({ useScope: 'local' });
  return {
    config: {
      operation: 'urlManagementCustomerDomain',
      groupId: 0,
      groupName: '自訂欄位',
    },
    data: [
      {
        key: 'id',
        name: t('increment_number'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'site',
        name: t('site'),
        visible: true,
        default: false,
        disabled: false,
      },
      {
        key: 'suffix',
        name: t('suffix'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'domainName',
        name: t('domain_name'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'urlStatus',
        name: t('url_status'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'abnormalState',
        name: t('abnormal_state'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'abnormalDate',
        name: t('recent_abnormal_date'),
        visible: true,
        default: false,
        disabled: false,
      },
      {
        key: 'service',
        name: t('service_items'),
        visible: true,
        default: false,
        disabled: false,
      },
      {
        key: 'domainNameStatus',
        name: t('domain_name_status'),
        visible: true,
        default: false,
        disabled: false,
      },
      {
        key: 'sslStatus',
        name: t('ssl_status'),
        visible: true,
        default: false,
        disabled: false,
      },
      {
        key: 'ip',
        name: 'IP',
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'automaticRenewalDate',
        name: t('domain_name_expiration_date'),
        visible: true,
        default: false,
        disabled: false,
      },
      {
        key: 'systemDetection',
        name: t('system_detection'),
        visible: true,
        default: false,
        disabled: false,
      },
      {
        key: 'manage',
        name: t('manage'),
        visible: true,
        default: false,
        disabled: false,
      },
      {
        key: 'previousNode',
        name: t('previous_node'),
        visible: true,
        default: false,
        disabled: false,
      },
      {
        key: 'remark',
        name: t('remark'),
        visible: true,
        default: false,
        disabled: false,
      },
      {
        key: 'operating',
        name: t('operating'),
        visible: true,
        default: true,
        disabled: true,
      },
    ],
  };
};
