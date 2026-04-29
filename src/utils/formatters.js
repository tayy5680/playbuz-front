import dayjs from 'dayjs'
import { DEPOSIT_TYPE_LIST } from '@/configs/deposit'

export function createFormatter (list, key, value) {
  const map = list.reduce((acc, item) => {
    return Object.assign(acc, { [item[key]]: item[value] })
  }, {})
  return (row, col, value) => map[value] ?? value
}

export function timeFormatter (val, { format = 'YYYY-MM-DD HH:mm:ss', to = '' } = {}) {
  const timeString = dayjs(val).format(format)
  if (['', 'Invalid Date', 'Invalid date'].includes(timeString)) return to
  return timeString
}

export function currencyFormatter (currency, val) {
  if (isNaN(val)) return `${currency} ${val}`
  const result = pointFormatter(val)
  return `${currency} ${result}`
}

export function pointFormatter (val) {
  if (isNaN(val)) return val
  const str = val.toString().split('.')
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return str.join('.')
}

export function depositTypeFormatter (val) {
  let result = ''
  const target = DEPOSIT_TYPE_LIST.find(item => item.id === val && item.id !== 0)
  if (target) result = target.label
  return result
}
