/**
 * 取得英數亂數組合(預設16碼)
 * @param  {number} length 長度
 * @return {string} result
 */
export const randomAlphanumeric = (length = 16) => {
  const variables =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  let count = 0;

  for (count; count < length; count += 1) {
    result += variables.charAt(Math.floor(Math.random() * variables.length));
  }
  return result;
};

export default {
  randomAlphanumeric,
};
