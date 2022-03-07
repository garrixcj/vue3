/**
 * 特殊權限特殊邏輯特別說明
 */

/**
 * Tooltip 顯示字典
 */
export const tooltip = [{ id: 402, msg: 'level_manage' }];

export const showTooltip = (id: number): boolean =>
  !!tooltip.find(perm => perm.id === id);

export const getTooltipMsg = (id: number): string =>
  tooltip.find(perm => perm.id === id)?.msg || '';
