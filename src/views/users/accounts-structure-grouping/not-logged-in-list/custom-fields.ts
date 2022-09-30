import { useI18n } from 'vue-i18n';

// 未登入列表自訂欄位初始設定
export const detailTableColumnsInit = () => {
  const { t } = useI18n({ useScope: 'local' });
  return {
    config: {
      operation: 'notLoggedInList',
      groupId: 0,
      groupName: '自訂欄位',
    },
    data: [
      {
        key: 'increment_number',
        name: t('increment_number'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'parent_username',
        name: t('parent_username'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'member_account',
        name: t('member_account'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'currency',
        name: t('currency'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'deposit_amount_total',
        name: t('deposit_amount_total'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'withdrawal_amount_total',
        name: t('withdrawal_amount_total'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'balance_difference',
        name: t('balance_difference'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'status',
        name: t('status'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'member_establish_time',
        name: t('member_establish_time'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'last_login_time',
        name: t('last_login_time'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'since_then_offline_days',
        name: t('since_then_offline_days'),
        visible: true,
        default: true,
        disabled: true,
      },
    ],
  };
};

// 未登入總計列表自訂欄位初始設定
export const countsTableColumnsInit = () => {
  const { t } = useI18n({ useScope: 'parent' });
  return {
    config: {
      operation: 'notLoggedInCounts',
      groupId: 0,
      groupName: '自訂欄位',
    },
    data: [
      {
        key: 'since_then_offline_days',
        name: t('since_then_offline_days'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'number_of_members',
        name: t('number_of_members'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'enable',
        name: t('enable'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'disable',
        name: t('disable'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'block',
        name: t('block'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'bankrupt',
        name: t('bankrupt'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'locked',
        name: t('lock'),
        visible: true,
        default: true,
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
