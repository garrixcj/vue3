import { forIn } from 'lodash';
import { reactive } from 'vue';
import type { Orders, ColumnSet } from './typing';

export const useSort = (columns: ColumnSet[]) => {
  // 支援的排序方式
  const orders = [null, 'ascending', 'descending'] as Orders[];

  // 可排序的列
  const sortableColumns = () => {
    return columns.reduce((acc, item) => {
      if (item.sortable) {
        acc[item.dataIndex] = null;
      }
      return acc;
    }, {} as { [key: string]: Orders });
  };

  // 各列的排序
  const columnsSort = reactive(sortableColumns());

  // 設定各列的排序(預設 null)
  const setSort = (columnName: string, order: Orders) => {
    forIn(columnsSort, (value, key) => {
      columnsSort[key] = null;
      if (columnName === key) {
        columnsSort[key] = order;
      }
    });
  };

  return {
    orders,
    columnsSort,
    setSort,
  };
};
