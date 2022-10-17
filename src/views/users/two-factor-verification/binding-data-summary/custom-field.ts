import { useI18n } from 'vue-i18n';

export const bindingFieldsInitial = () => {
  const { t } = useI18n({ useScope: 'parent' });
  return {
    config: {
      operation: 'bindingList',
      groupId: 0,
      groupName: t('custom_field'),
    },
    data: [
      {
        key: 'created_at',
        name: t('registration_time'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'username',
        name: t('member_account'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'alias',
        name: t('alias'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'binding_at',
        name: t('binding_time'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'type',
        name: t('verification_method'),
        visible: true,
        default: true,
        disabled: true,
      },
      {
        key: 'telephone',
        name: t('telephone'),
        visible: true,
        default: true,
        disabled: false,
      },
      {
        key: 'last_login',
        name: t('last_login_time'),
        visible: true,
        default: true,
        disabled: false,
      },
    ],
  };
};
