import { ref, inject, Ref } from 'vue';
import type { ApplyDomain } from './apply';

export const useRow = () => {
  // 拿來當作不重複key使用，避免新增刪除時造成混亂
  const key = ref(0);
  // 網址列表
  const urlList = inject('UrlManagement:urlList') as Ref<ApplyDomain[]>;

  // 新增一行
  const addNew = (domain?: string) => {
    urlList.value.push({
      key: key.value,
      domain: domain || '',
      format: '',
      legal: false,
    });
    key.value += 1;
  };

  // 自動新增一行
  const autoAdd = (canApplyNum: number) => {
    const emptyRow = urlList.value.filter(obj => !obj.domain).length;
    // 當沒有空行且未到達今日申請上限時新增一行
    if (!emptyRow && urlList.value.length < canApplyNum) {
      addNew();
    }
  };

  //- TODO: 有bug，為附屬功能故先行註解，待其餘主要功能完成再回來修
  // @keydown.tab="tabNextRow(scope.$index, $event)
  // focus到下一行input
  // const tabNextRow = (index: number, event: KeyboardEvent) => {
  //   const nextIndex = index + 1;
  //   const inputDomGroup =
  //     urlTableRef.value.$el.getElementsByClassName('can-focus');
  //   if (nextIndex < inputDomGroup.length) {
  //     event.preventDefault();
  //     inputDomGroup.value[nextIndex].focus();
  //   }
  // };

  // 移除一行
  const remove = (index: number) => {
    // 當有時才移除
    if (urlList.value[index]) {
      urlList.value.splice(index, 1);
    }
  };

  // 將格式錯誤的域名都刪除
  const removeError = () => {
    // 因splice的index會重置，故不使用forEach搭配removeRow
    const correctUrl = urlList.value.filter(obj => obj.legal);

    // 僅留下格式正確的域名
    urlList.value = correctUrl;
    // 當沒有任何域名時，新增一行回列表
    if (!correctUrl.length) {
      addNew();
    }
  };

  return {
    addNew,
    autoAdd,
    remove,
    removeError,
    // tabNext,
  };
};
