import dayjs from 'dayjs'

export const RECORD_TYPE_LIST = [
  { id: 'wallet', label: '卷匣', component: 'viewWallet' },
  { id: 'record', label: '紀錄', component: 'viewRecord' }
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

// 票匣紀錄狀態
export const TICKET_STATUS_LIST = [
  {
    id: 1,
    label: '簽到取得',
    img: require('./images/i_tick3.svg'),
    color: 'rgba(255,255,255,1)',
  },
  {
    id: 2,
    label: '推薦取得',
    img: require('./images/i_tick3.svg'),
    color: 'rgba(255,255,255,1)',
  },
  {
    id: 3,
    label: '收禮取得',
    img: require('./images/i_tick3.svg'),
    color: 'rgba(255,255,255,1)',
  },
  {
    id: 4,
    label: '金幣購買',
    img: require('./images/i_tick3.svg'),
    color: 'rgba(255,255,255,1)',
  },
  {
    id: 5,
    label: '銀幣購買',
    img: require('./images/i_tick3.svg'),
    color: 'rgba(255,255,255,1)',
  },
  {
    id: 6,
    label: '現金購買',
    img: require('./images/i_tick3.svg'),
    color: 'rgba(255,255,255,1)',
  },
  {
    id: 7,
    label: '活動券兌換成功',
    img: require('./images/i_tick3.svg'),
    color: 'rgba(0,223,185,1)',
  },
  {
    id: 8,
    label: '贈禮',
    img: require('./images/i_tick3.svg'),
    color: 'rgba(0,223,185,1)',
  },
]
