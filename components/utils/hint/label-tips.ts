import { ref, onMounted } from 'vue';

/**
 * 檢查 label 是否需顯示 tooltip
 */
export const useLabelTips = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const labelRefs = ref<any[]>([]);

  // * 因解析 el 太複雜所以使用 any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setRefItem = (el: any) => {
    labelRefs.value.push(el);
  };
  const tooltipDisabled = ref<boolean[]>([]);

  onMounted(() => {
    labelRefs.value.forEach((item, key) => {
      tooltipDisabled.value[key] =
        item && !(item.clientWidth < item.scrollWidth);
    });
  });

  return { tooltipDisabled, labelRefs, setRefItem };
};
