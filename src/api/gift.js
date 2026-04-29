import request from '@/api/request'

// 設定交易密碼
export const getTransactionSetTransactionPassword = (inputData) => {
  const url = 'Transaction/SetTransactionPassword'
  const method = 'get'
  const data = {
    TransactionPassword: inputData.transactionPassword,
  }

  return request({
    method,
    url,
    data,
  })
}

// 輸入交易密碼
export const postTransactionVerifyPassword = (inputData) => {
  const url = 'Transaction/VerifyPassword'
  const method = 'post'
  const data = {
    TransactionPassword: inputData.transactionPassword,
  }

  return request({
    method,
    url,
    data,
  })
}

// 贈點試算
export const postTransactionEstimateFee = (inputData) => {
  const url = 'Transaction/EstimateFee'
  const method = 'post'
  const data = {
    Point: inputData.point,
  }

  return request({
    method,
    url,
    data,
  })
}

// 提交贈點
export const postTransactionSubmitRewardPoint = (inputData) => {
  const url = 'Transaction/SubmitRewardPoint'
  const method = 'post'
  const data = {
    PointTypeID: inputData.pointTypeID,
    Point: inputData.point,
    TransactionPassword: inputData.transactionPassword,
  }
  return request({
    method,
    url,
    data,
  })
}

// 發送重設交易密碼的簡訊
export const postTransactionSendTransactionPasswordVerify = (inputData) => {
  const url = 'Transaction/SendTransactionPasswordVerify'
  const method = 'post'
  const data = {
    Locale: inputData.locale,
  }

  return request({
    method,
    url,
    data,
  })
}

// 確認重設交易密碼的簡訊
export const postTransactionCheckTransactionPasswordVerify = (inputData) => {
  const url = 'Transaction/CheckTransactionPasswordVerify'
  const method = 'post'
  const data = {
    VerifyCode: inputData.verifyCode,
  }

  return request({
    method,
    url,
    data,
  })
}
