/**
 * IP 相關格式轉換
 */

// 格式
export const formater: Record<string, RegExp> = {
  // IPv4 格式
  ipv4: /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/,
  // 只打前四組的 ipv6 格式
  half: /^([0-9a-fA-F]{1,4}:){3}[0-9a-fA-F]{1,4}$/,
  // IPv6 中與 IPv4 相容的節點
  ipv4Node: /(.*:)([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$)/,
  // 完整 IPv6 格式
  ipv6: /^([0-9a-fA-F]{4}:){7}[0-9a-fA-F]{4}$/,
};

// 格式判斷
export const matcher: Record<string, (address: string) => boolean> = {
  // IPv4 格式
  ipv4: (address: string) => address.match(formater.ipv4) !== null,
  // IPv6 格式，判斷只打前四組
  ipv6Half: (address: string) =>
    address.length < 20 && address.match(formater.half) !== null,
  // 判斷完整 IPv6 格式
  ipv6: (address: string) => address.match(formater.ipv6) !== null,
};

/**
 * IP 格式轉換，將 IPv6 縮寫轉為完整位址，若傳入 IPv4 則直接回傳原位址
 * @param   {string} address    IP 位址
 * @param   {number} formatType IPv6 顯示的方式：0 預設值，若 IPv6 後四組可省略則省略、1 只顯示 IPv6 前四組、2 顯示 IPv6 完整位址
 * @returns {string} 回傳正規化後的 IP，若非 IP 則回傳空字串
 */
export const normalize = (address: string, formatType = 0): string => {
  // 若傳入格式不符合則回傳空字串
  if (typeof address !== 'string' || address === '') {
    return '';
  }
  // 若為 IPv4 格式則直接回傳
  if (matcher.ipv4(address)) {
    return address;
  }

  let tmpAddress = address.toLowerCase();
  // 若只打前四組自動補後綴省略
  if (matcher.ipv6Half(tmpAddress)) {
    tmpAddress = `${tmpAddress}::`;
  }

  // 轉換 IPv6 相容 IPv4 的位址
  const hextets = tmpAddress.match(formater.ipv4Node);
  if (hextets) {
    tmpAddress = hextets[1];
    const ipv4 = hextets[2].match(/[0-9]+/g) as string[];
    for (let i = 0; i < 4; i += 1) {
      const byte = parseInt(ipv4[i], 10);
      ipv4[i] = `0${byte.toString(16)}`.substr(-2);
    }
    tmpAddress += `${ipv4[0] + ipv4[1]}:${ipv4[2] + ipv4[3]}`;
  }

  // 縮寫補零
  tmpAddress = tmpAddress.replace(/^:|:$/g, '');
  const tmpIPv6 = tmpAddress.split(':');

  for (let i = 0; i < tmpIPv6.length; i += 1) {
    const hex = tmpIPv6[i];
    if (hex !== '') {
      // 若有省略字串則補零
      tmpIPv6[i] = `0000${hex}`.substr(-4);
    } else {
      // ::補零
      const hexArray = [];
      for (let j = tmpIPv6.length; j <= 8; j += 1) {
        hexArray.push('0000');
      }
      tmpIPv6[i] = hexArray.join(':');
    }
  }

  let result = tmpIPv6.join(':');

  // 若不符合 IPv6 格式則回傳空字串
  if (!matcher.ipv6(result)) {
    return '';
  }

  if (formatType === 1) {
    return `${result.substring(0, 19)}::`;
  }

  if (formatType === 2) {
    return result;
  }

  // 若 formatType 為 0 則省略 :: 後為 0 的 IP 顯示
  result =
    result.substring(20) === '0000:0000:0000:0000'
      ? `${result.substring(0, 20)}:`
      : result;
  return result;
};

export default {
  formater,
  matcher,
  normalize,
};
