import dayjs from 'dayjs'

export const RECORD_TYPE_LIST = [
  { id: 'order', label: '訂單紀錄', component: 'viewOrder' },
  { id: 'give', label: '贈禮紀錄', component: 'viewPresent' },
  { id: 'receive', label: '收禮紀錄', component: 'viewPresent' },
  { id: 'coupon', label: '兌換紀錄', component: 'viewCoupon' }
]

export const RECODRD_RANGE_LIST = [
  {
    id: 0,
    label: '本月',
    start: dayjs().startOf('month').toISOString(),
    end: dayjs().endOf('day').toISOString(),
  }, {
    id: 1,
    label: '上月',
    start: dayjs().subtract(1, 'month').startOf('month').toISOString(),
    end: dayjs().subtract(1, 'month').endOf('month').toISOString(),
  },
  // 更多範圍為一年
  {
    id: 2,
    label: '更多',
    start: dayjs().subtract(1, 'year').startOf('day').toISOString(),
    end: dayjs().endOf('day').toISOString(),
  },
]

// 訂單記錄狀態
export const STORE_STATUS_LIST = [
  {
    id: 0,
    label: '處理中',
  },
  {
    id: 1,
    label: '已完成',
  },
  {
    id: 2,
    label: '取消',
  },
  {
    id: 3,
    label: '異常',
  },
  {
    id: 4,
    label: '取消',
  },
]

// 兌換紀錄狀態
export const COUPON_STATUS_LIST = [
  {
    id: -2,
    label: '待處理',
  },
  {
    id: -1,
    label: '處理中',
  },
  {
    id: 0,
    label: '已寄出',
  },
  {
    id: 1,
    label: '完成',
  },
  {
    id: 2,
    label: '取消訂單',
  },
]
