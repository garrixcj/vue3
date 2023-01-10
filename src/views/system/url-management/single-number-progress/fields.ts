export const getFields = (t: Function) => ({
  config: {
    operation: 'urlManagementProgress',
    groupId: 0,
    groupName: '自訂欄位',
  },
  data: [
    // 序號
    {
      key: 'index',
      name: t('increment_number'),
      visible: true,
      default: true,
      disabled: false,
    },
    // 站別
    {
      key: 'site',
      name: t('site'),
      visible: true,
      default: true,
      disabled: false,
    },
    // 後置碼
    {
      key: 'suffix',
      name: t('suffix'),
      visible: true,
      default: true,
      disabled: true,
    },
    // 單號
    {
      key: 'ticketId',
      name: t('trans_number'),
      visible: true,
      default: true,
      disabled: true,
    },
    // 已完成/申請筆數
    {
      key: 'count',
      name: t(`${t('finished')} / ${t('application_number')}`),
      visible: true,
      default: true,
      disabled: false,
    },
    // 購買方式
    {
      key: 'buy',
      name: t('ways_to_purchase'),
      visible: true,
      default: true,
      disabled: false,
    },
    // 管理權限
    {
      key: 'management',
      name: t('management_permission'),
      visible: true,
      default: true,
      disabled: false,
    },
    // 申請日期
    {
      key: 'applyDate',
      name: t('application_date'),
      visible: true,
      default: true,
      disabled: false,
    },
    // 完成日期
    {
      key: 'finishDate',
      name: t('finished_date'),
      visible: true,
      default: true,
      disabled: false,
    },
    // 進度
    {
      key: 'processe',
      name: t('processe'),
      visible: true,
      default: true,
      disabled: true,
    },
    // 狀態
    {
      key: 'status',
      name: t('status'),
      visible: true,
      default: true,
      disabled: true,
    },
    // 操作
    {
      key: 'operating',
      name: t('operating'),
      visible: true,
      default: true,
      disabled: true,
    },
  ],
});
