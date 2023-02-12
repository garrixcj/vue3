/**
 * JSON 解析內容格式轉換
 */

/**
 * JSON 字串轉換處理，將 JSON.stringify 形式字串的 number 轉換成 string
 *
 * @param {string} text 未轉換成 JSON 前的 encode 文字
 * @param {string[]} [keys=[]] 指定只有特定 key 內容要轉換成 string
 *                             若不帶參數則預設轉換所有 number 為 string
 * @return {JSON} 轉換後的 JSON 結果
 */
export const parseNumberToString = (
  text: string,
  keys: string[] = [],
): JSON => {
  let tmpText = text;
  if (keys.length === 0) {
    // 不帶指定 key，轉換所有 number 為 string
    tmpText = tmpText.replace(/([[:])?(\d+\.?\d*)([,}\]])/g, '$1"$2"$3');
  } else {
    const defaultPattern = '("k":)(\\d+\\.?\\d*)([,}\\]])';
    keys.forEach(key => {
      const pattern = defaultPattern.replace('k', key);
      tmpText = tmpText.replace(new RegExp(pattern, 'g'), '$1"$2"$3');
    });
  }
  return JSON.parse(tmpText);
};

export default {
  parseNumberToString, // 將 JSON.stringify 形式字串的 number 轉換成 string
};
