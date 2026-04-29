import dayjs from 'dayjs'
export const EVENT_GA_VALUE = dayjs().format('YYYY') + '年' + dayjs().format('M') + '月_月簽到'

/**
 * @param { string } eventTime 當前年月份(YYYY-MM)
 * @param { object } monthData 月簽到參數
 * @param { object } monthData.other 特例活動名稱(YYYY-MM: name)
 * @param { array } monthData.exclude 禁用月份(YYYY-MM)(string)
 * @param { string } MONTH_SIGN_VALUE 活動名稱(空值為禁用)
 */
const eventTime = dayjs().format('YYYY-MM')
const monthData = {
  other: {
    '2023-03': '2023-03-Tour'
  },
  exclude: []
}
export const MONTH_SIGN_VALUE = monthData.exclude.includes(eventTime) ? '' : monthData.other[eventTime] || eventTime
