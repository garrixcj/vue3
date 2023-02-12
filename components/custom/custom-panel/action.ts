// Value Key 是否勾選鍵值
export enum CheckKeys {
  view = 'viewChecked',
  modify = 'modifyChecked',
}
// Enable Key 啟用選項鍵值
export enum EnableKeys {
  view = 'isViewEnabled',
  modify = 'isModifyEnabled',
}

/** 更新父層節點開關
 * @param {Object} parent 父層
 * @param {String} type 修改類型 view / modify
 */
export const updateParent = (
  parent: RdCustomPanel.ListItem,
  type: RdCustomPanel.Action,
) => {
  // Enable Key
  const enableModify = EnableKeys[type];
  const current = parent;
  // Enable 需打開才能計算更新
  const parentFilter = parent.children.filter(
    (child: RdCustomPanel.ListItem) => child[enableModify],
  );
  if (parentFilter.length !== 0) {
    const targetKey = CheckKeys[type];
    const caculate = parentFilter.some(child => child[targetKey]);
    // 當下層為部分更新時，只有在子層有勾選任意一個時才會更新父層
    if (!parentFilter[0].partialSync || caculate) {
      current[targetKey] = caculate;
    }
  }
};

/**
 * 更新子層所有節點開關
 * @param {Object} self 自身
 * @param {String} target 更新目標鍵值 view / modify
 * @param {String} operate 原始操作類型 view / modify (橫向影響時Enable判斷原始鍵值)
 */
export const syncChildren = (
  self: RdCustomPanel.ListItem,
  target: RdCustomPanel.Action,
  operate: RdCustomPanel.Action,
) => {
  const targetKey = CheckKeys[target]; // 更新目標鍵值
  const operateEnable = EnableKeys[operate]; // 原始操作 Enable Key
  const targetEnable = EnableKeys[target]; // 自身操作 Enable Key
  self.children.forEach((item: RdCustomPanel.ListItem) => {
    const current = item;
    // 當操作方的 Enable 為關閉時不可動作
    // 舉例: 點擊檢視同步下層時，修改的橫向影響是看檢視的 Enable
    // 自身目標 Enable 關閉時不可動作
    // 全取消時不判斷 partialSync，全勾選時不異動部分更新的層級
    if (
      item[operateEnable] &&
      item[targetEnable] &&
      (!self[targetKey] || !item.partialSync)
    ) {
      current[targetKey] = self[targetKey];
    }
    // 遞迴向下更新
    if (current.children && current.children.length !== 0) {
      // 全取消時不判斷 partialSync，全勾選時不異動部分更新的層級
      if (!self[targetKey] || !current.children[0].partialSync) {
        syncChildren(item, target, operate);
      }
    }
  });
};

/** 橫向影響 檢視<->修改
 * 修改打開時影響檢視 / 檢視關閉時影響修改
 * @param {String} operate 操作類型 view / modify
 * @param {Object} self 自身
 * @return {Promise} 接續執行
 */
export const horizonEffect = (
  operate: RdCustomPanel.Action,
  self: RdCustomPanel.ListItem,
) => {
  const isModify = operate === 'modify'; // 是否為修改
  const target = isModify ? 'view' : 'modify'; // 橫向操作目標
  const operateKey = CheckKeys[operate]; // 操作鍵值
  const targetKey = CheckKeys[target]; // 操作鍵值
  const enableKey = EnableKeys[target]; // 橫向目標啟用狀態鍵值

  return new Promise((resolve, reject) => {
    // 關閉檢視 或 開啟修改 且橫向是可影響的
    if (isModify === self[operateKey] && self[enableKey]) {
      const current = self;
      current[targetKey] = self[operateKey];
      resolve(true);
    } else {
      reject();
    }
  });
};

/** Special Ckeckbox Hook
 * 更新上面三層，子項、單項與大類
 * 橫向更新
 * @param {String} type 修改類型 view / modify
 * @param {Object} category 更新大類目標
 * @param {Object} item 更新單項目標
 * @param {Object} child 更新子項目標
 * @param {Object} special 特殊備註
 */
const checkSpecial = (
  type: RdCustomPanel.Action,
  category: RdCustomPanel.ListItem,
  item: RdCustomPanel.ListItem,
  child: RdCustomPanel.ListItem,
  special: RdCustomPanel.ListItem,
) => {
  // 只在勾選時執行
  const isModify = type === 'modify';
  const typeInverse = isModify ? 'view' : 'modify'; // 橫向操作目標
  if (special[CheckKeys[type]]) {
    // 更新子項、單項與大類
    updateParent(child, type);
    updateParent(item, type);
    updateParent(category, type);
  }

  // 橫向影響
  horizonEffect(type, special)
    .then(() => {
      if (special[CheckKeys[typeInverse]]) {
        // [橫向]更新單項與大類
        updateParent(child, typeInverse);
        updateParent(item, typeInverse);
        updateParent(category, typeInverse);
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch(() => {});
};

/** Child Ckeckbox Hook
 * 更新上面兩層，單項與大類
 * 橫向更新
 * 部分更新特殊備註
 * @param {String} type 修改類型 view / modify
 * @param {Object} category 更新大類目標
 * @param {Object} item 更新單項目標
 * @param {Object} child 子項自身
 */
const checkChild = (
  type: RdCustomPanel.Action,
  category: RdCustomPanel.ListItem,
  item: RdCustomPanel.ListItem,
  child: RdCustomPanel.ListItem,
) => {
  const isModify = type === 'modify';
  const typeInverse = isModify ? 'view' : 'modify'; // 橫向操作目標
  // 先更新單項與大類
  updateParent(item, type);
  updateParent(category, type);
  if (child.children.length !== 0 && !child[CheckKeys[type]]) {
    syncChildren(child, type, type);
  }

  // 橫向影響
  horizonEffect(type, child)
    .then(() => {
      if (child.children.length !== 0 && !child[CheckKeys[typeInverse]]) {
        syncChildren(child, typeInverse, type);
      }
      // [橫向]更新單項與大類
      updateParent(item, typeInverse);
      updateParent(category, typeInverse);
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch(() => {});
};
/** Item Ckeckbox Hook
 * 更新上層大類，同步所有子項
 * 橫向更新
 * @param {String} type 修改類型 view / modify
 * @param {Object} category 更新大類目標
 * @param {Object} item 單項自身
 */
const checkItem = (
  type: RdCustomPanel.Action,
  category: RdCustomPanel.ListItem,
  item: RdCustomPanel.ListItem,
) => {
  const isModify = type === 'modify';
  const typeInverse = isModify ? 'view' : 'modify'; // 橫向操作目標
  // 更新大類，同步子項
  syncChildren(item, type, type);
  updateParent(category, type);

  // 橫向影響
  horizonEffect(type, item)
    .then(() => {
      // [橫向]更新大類，同步子項
      syncChildren(item, typeInverse, type);
      // 重新計算單項
      updateParent(item, typeInverse);
      // 重新計算大類
      updateParent(category, typeInverse);
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch(() => {});
};
/** Category Ckeckbox Hook
 * 同步所有子項
 * 橫向更新
 * @param {String} type 修改類型 view / modify
 * @param {Object} category 大類自身
 */
const checkCategory = (
  type: RdCustomPanel.Action,
  category: RdCustomPanel.ListItem,
) => {
  const isModify = type === 'modify';
  const typeInverse = isModify ? 'view' : 'modify';
  // 同步子項
  syncChildren(category, type, type);

  // 橫向影響
  horizonEffect(type, category)
    .then(() => {
      // [橫向]同步單項與子項
      syncChildren(category, typeInverse, type);
      // 重新計算大類下所有單項
      category.children.forEach((item: RdCustomPanel.ListItem) => {
        updateParent(item, typeInverse);
      });
      // 重新計算大類
      updateParent(category, typeInverse);
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch(() => {});
};

// 勾選功能
export const CheckEvent = {
  checkSpecial,
  checkChild,
  checkItem,
  checkCategory,
};

export default {
  updateParent,
  syncChildren,
  horizonEffect,
  checkSpecial,
  checkChild,
  checkItem,
  checkCategory,
};
