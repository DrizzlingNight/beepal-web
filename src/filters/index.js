export { dateFormat } from '@/utils/time'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function money_filter(num) {
  const arr = [];
  let type = 0;
  num = Number(num)
  if (num < 0) {
    num = -num;
    type = 1;
  }
  num = num.toFixed(2);
  const l = num.split('.')[0];
  const r = num.split('.')[1] || '';
  let fLen = l.length % 3; // 整数长度%3的余数
  fLen = fLen || 3; // 首次需要截取的长度
  const len = Math.ceil(l.length / 3);// 截取的次数
  for (let i = 0; i < len; i++) {
    if (i == 0 && fLen != 0) {
      arr.push(l.substr(0, fLen));
    } else {
      arr.push(l.substr(fLen + (i - 1) * 3, 3));
    }
  }
  let result = arr.join(',');
  if (r) result = arr.join(',') + '.' + r;
  if (type == 1) result = '-' + result;
  return result;
}
