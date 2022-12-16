// 客端域名自訂欄位初始設定
export const customerDomainFieldsInitial = (t: (key: string) => string) => {
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
        key: 'abnormalArea',
        name: t('abnormal_area'),
        visible: true,
        default: true,
        disabled: true,
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

// 管端域名自訂欄位初始設定
export const agentDomainNameFieldsInitial = (
  t: (key: string) => string,
  hasModify: boolean,
) => {
  const result = {
    config: {
      operation: 'urlManagementAgentDomainName',
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
        disabled: true,
      },
      {
        key: 'domainName',
        name: t('domain_name'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'url',
        name: 'URL',
        visible: true,
        default: false,
        disabled: false,
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
  if (!hasModify) {
    result.data = result.data.filter(item => item.key !== 'operating');
  }
  return result;
};

// IP服務自訂欄位初始設定
export const ipServiceFieldsInitial = (t: (key: string) => string) => {
  return {
    config: {
      operation: 'urlManagementIPService',
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
        default: true,
        disabled: true,
      },
      {
        key: 'suffix',
        name: t('suffix'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'ipType',
        name: t('ip_type'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'purchaseMethod',
        name: t('ways_to_purchase'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'ipv4',
        name: 'IPv4',
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'ipv6',
        name: 'IPv6',
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'attackStatus',
        name: t('attack_status'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'domainName',
        name: t('domain_name'),
        visible: true,
        default: true,
        disabled: false,
      },
    ],
  };
};

// 活躍域名自訂欄位初始設定
export const activeDomainNameFieldsInitial = (t: (key: string) => string) => {
  return {
    config: {
      operation: 'urlManagementActiveDomainName',
      groupId: 0,
      groupName: '自訂欄位',
    },
    data: [
      {
        key: 'domain',
        name: t('domain'),
        visible: true,
        default: true,
        disabled: true,
        group: t('basic_information'),
      },
      {
        key: 'suffix',
        name: t('suffix'),
        visible: true,
        default: true,
        disabled: true,
        group: t('basic_information'),
      },
      {
        key: 'domainName',
        name: t('domain_name'),
        visible: true,
        default: true,
        disabled: true,
        group: t('basic_information'),
      },
      {
        key: 'abnormalState',
        name: t('abnormal_state'),
        visible: true,
        default: true,
        disabled: true,
        group: t('basic_information'),
      },
      {
        key: 'risk',
        name: t('risk'),
        visible: true,
        default: true,
        disabled: true,
        group: t('basic_information'),
      },
      // 域名訪問群組
      {
        key: 'rank',
        name: t('rank'),
        visible: true,
        default: true,
        disabled: true,
        group: t('domain_visited'),
      },
      {
        key: 'requestTotal',
        name: t('visited_num'),
        visible: true,
        default: true,
        disabled: false,
        group: t('domain_visited'),
      },
      {
        key: 'requestRatio',
        name: t('percent'),
        visible: true,
        default: true,
        disabled: true,
        group: t('domain_visited'),
      },
      {
        key: 'requestGrow',
        name: t('growing_percent'),
        visible: true,
        default: true,
        disabled: true,
        group: t('domain_visited'),
      },
      // 登入成功群組
      {
        key: 'loginPassTotal',
        name: t('login_num'),
        visible: true,
        default: true,
        disabled: false,
        group: t('login_result_1'),
      },
      {
        key: 'loginPassRatio',
        name: t('percent'),
        visible: true,
        default: true,
        disabled: false,
        group: t('login_result_1'),
      },
      {
        key: 'loginPassGrow',
        name: t('growing_percent'),
        visible: true,
        default: true,
        disabled: false,
        group: t('login_result_1'),
      },
      // 登入失敗群組
      {
        key: 'loginFailTotal',
        name: t('login_num'),
        visible: true,
        default: true,
        disabled: true,
        group: t('login_fail'),
      },
      {
        key: 'loginFailRatio',
        name: t('percent'),
        visible: true,
        default: true,
        disabled: false,
        group: t('login_fail'),
      },
      {
        key: 'loginFailGrow',
        name: t('growing_percent'),
        visible: true,
        default: true,
        disabled: false,
        group: t('login_fail'),
      },
    ],
  };
};
