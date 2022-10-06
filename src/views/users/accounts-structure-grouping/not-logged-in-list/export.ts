import { ref, reactive } from 'vue';
import { loginInfo } from '@/api/user';
import { useCookieStore } from '@/stores/cookie';
import type { DetailListFormType, ExportParamsType } from './type';
import { useAccesses } from '@/plugins/access/view';

export const useExport = () => {
  const cookieStore = useCookieStore();
  const visible = ref(false);
  const params = reactive({
    functionName: '',
    tabName: '',
  });

  // 初始匯出設定
  const initExport = () => {
    toggleDialog(true);
    params.functionName = 'accounts_structure_group';
    params.tabName = 'not_logged_in_list';
  };

  // 切換匯出視窗
  const toggleDialog = (status: boolean) => {
    visible.value = status;
  };

  // 判斷是否有匯出權限
  const hasExportPerm = useAccesses(['Downloads', 'NotLoggedInListExport']);

  // 執行匯出
  const exportMembersLastLoginGroup = (
    form: DetailListFormType,
    note: string,
  ) => {
    const params = {} as ExportParamsType;
    if (note !== '') {
      params.export_remark = note;
    }
    if (form.startDateTime !== '') {
      params.start_date_time = form.startDateTime;
    }
    params.lang = cookieStore.lang;
    params.day_group = form.dayGroup;
    return loginInfo.exportMembersLastLoginGroup(form.domain, params);
  };

  return {
    visible,
    params,
    toggleDialog,
    initExport,
    hasExportPerm,
    exportMembersLastLoginGroup,
  };
};
