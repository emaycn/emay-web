/**
 * 获取默认时间
 * @param {*} format yyyy yyyyMM yyyyMMdd
 * @param {*} diff +- 年/月/日
 */
export function getDefaultDate(format, diff) {
  if (diff === undefined) {
    diff = 0
  }
  var nowDate = new Date()
  var date = {
    year: nowDate.getFullYear(),
    month: nowDate.getMonth() + 1,
    date: nowDate.getDate()
  }
  if (format === 'yyyy') {
    date.year = date.year + diff
  } else if (format === 'yyyyMM' || format === 'yyyy-MM') {
    date.month = date.month + diff
  } else if (format === 'yyyyMMdd' || format === 'yyyy-MM-dd') {
    date.date = date.date + diff
  }
  if (date.month >= 1 && date.month <= 9) {
    date.month = '0' + date.month
  }
  if (date.date >= 0 && date.date <= 9) {
    date.date = '0' + date.date
  }
  if (format === 'yyyy') {
    return date.year + ''
  } else if (format === 'yyyyMM') {
    return date.year + '' + date.month
  } else if (format === 'yyyy-MM') {
    return date.year + '-' + date.month
  } else if (format === 'yyyyMMdd') {
    return date.year + '' + date.month + '' + date.date
  } else if (format === 'yyyy-MM-dd') {
    return date.year + '-' + date.month + '-' + date.date
  } else {
    return ''
  }
}
