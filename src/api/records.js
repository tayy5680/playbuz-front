import request from '@/api/request'

// 會員訂單列表
export const getOrderRecord = (inputData) => {
  const url = 'Member/OrderList'
  const method = 'get'
  const data = {
    StartDate: inputData.StartDate,
    EndDate: inputData.EndDate,
    Locale: inputData.locale,
  }

  return request({
    method,
    url,
    data,
    noCache: true,
  })
}

// 會員贈點紀錄列表
export const getTransactionRecord = (inputData) => {
  const url = 'Transaction/TransactionRecord'
  const method = 'get'
  const data = {
    StartDate: inputData.StartDate,
    EndDate: inputData.EndDate,
    RecordType: inputData.RecordType,
    Skip: inputData.Skip,
    Show: inputData.Show,
  }

  return request({
    method,
    url,
    data,
    noCache: true,
  })
}

// 解鎖序號
export const getDiscloseSerialNo = (inputData) => {
  const url = 'Transaction/discloseSerialNo'
  const method = 'post'
  const data = {
    TID: inputData.TID,
  }

  return request({
    method,
    url,
    data,
  })
}

export const getOrder = (inputData) => {
  const url = 'Member/Order'
  const method = 'get'
  const data = {
    TransId: inputData.transId,
    Locale: inputData.lang,
  }
  return request({
    method,
    url,
    data,
    noCache: true,
  })
}
