import request from '@/api/request'

// 取得會員錢包總額
export const getWalletTotal = () => {
  const url = 'Member/MemberWallet'
  const method = 'get'

  return request({
    method,
    url
  })
}

// 取得所有錢包餘額
// 【cofun】：CheckProviderMember=true + CofunCode=12345
export const getAllWallet = inputData => {
  const url = 'Wallet/Search'
  const method = 'get'
  const data = {
    CheckProviderMember: inputData.checkProviderMember,
    UpdateFromProvider: inputData.updateFromProvider,
    Locale: inputData.locale
  }
  if (inputData.PointTypeID !== undefined && inputData.PointTypeID !== '') data.PointTypeID = inputData.PointTypeID
  if (inputData.CofunLiveCode !== undefined) data.CofunLiveCode = inputData.CofunLiveCode
  return request({
    method,
    url,
    data
  })
}

// 轉換錢包
export const postWalletTransfer = inputData => {
  const url = 'Wallet/Transfer'
  const method = 'post'
  const data = {
    FromWalletPointTypeID: inputData.FromWalletPointTypeID,
    ToWalletPointTypeID: inputData.ToWalletPointTypeID,
    Point: inputData.Point,
    CheckProviderMember: !!inputData.CheckProviderMember
  }
  return request({
    method,
    url,
    data
  })
}

// 一鍵轉回錢包
export const postWalletTransferBack = inputData => {
  const url = 'wallet/TransferBack'
  const method = 'post'
  const data = {
    PointTypeID: inputData.PointTypeID
  }
  return request({
    method,
    url,
    data
  })
}

// 錢包轉換紀錄
export const postWalletTransferRecord = inputData => {
  const url = 'wallet/TransferRecord'
  const method = 'post'
  const data = {
    PointTypeID: inputData.pointTypeID,
    FromWalletID: inputData.fromWalletID,
    ToWalletID: inputData.toWalletID,
    sDate: inputData.sDate,
    eDate: inputData.eDate,
    Skip: 0,
    Show: 1000,
    Field: 'CreateTime',
    OrderType: 'desc',
    Locale: inputData.locale
  }
  return request({
    method,
    url,
    data
  })
}
