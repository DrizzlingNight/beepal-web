// / digit預設為2，代表取小數第二位
export function toPercent(num, total, digit = 2) {
  const result = (Math.round(num / total * 10000) / Number.parseFloat(100).toFixed(digit)) || 0
  return `${result}%`
}
