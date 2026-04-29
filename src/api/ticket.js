import request from '@/api/request'

// 取得兌換紀錄
export const getTicketUsageRecord = inputData => {
  const url = 'Ticket/UsageRecord'
  const method = 'get'
  const data = {
    sDate: inputData.sDate,
    eDate: inputData.eDate
  }
  return request({
    method,
    url,
    data,
    noCache: true
  })
}

// 取得券匣
export const getTicketTicketBox = () => {
  const url = 'Ticket/TicketBox'
  const method = 'get'
  return request({
    method,
    url
  })
}

// 贈送票券
export const postTicketTicketGift = inputData => {
  const url = 'Ticket/TicketGift'
  const method = 'post'
  const data = {
    TicketId: inputData.ticketId,
    Quantity: inputData.quantity,
    ReceiverId: inputData.receiverId,
    Remark: inputData.remark
  }
  return request({
    method,
    url,
    data
  })
}

// 兌換票券
export const postTicketTicketUse = inputData => {
  const url = 'Ticket/TicketUse'
  const method = 'post'
  const data = {
    TicketId: inputData.ticketId,
    Quantity: inputData.quantity
  }
  return request({
    method,
    url,
    data
  })
}

// 取得所有賽事
export const getTicketTour = () => {
  const url = 'Ticket/Tour'
  const method = 'get'
  return request({
    method,
    url
  })
}

// 歷史賽事排行榜
export const getTicketTourHistoryRanking = () => {
  const url = 'Ticket/TourHistoryRanking'
  const method = 'get'
  return request({
    method,
    url
  })
}
