import request from '@/api/request'
// 禮包獎項
export const getPackageList = inputData => {
  const url = 'ElectronicMall/PackageList'
  const method = 'get'
  const data = {
    Locale: inputData.locale
  }

  return request({
    method,
    url,
    data
  })
}

// 禮包獎項機率
export const getPackagePercent = inputData => {
  const url = 'ElectronicMall/Package/Percent'
  const method = 'get'
  const data = {
    DrawlotsActivityId: inputData.drawlotsActivityId,
    Locale: inputData.locale
  }
  return request({
    method,
    url,
    data
  })
}

// 購買禮包
export const postElectronicMallBuyPackage = inputData => {
  const url = 'ElectronicMall/BuyPackage'
  const method = 'post'
  const data = {
    PackageID: inputData.packageID,
    UniformInvoiceInfo: {},
    Quantity: inputData.quantity,
    TelecomCarrier: inputData.telecomCarrier,
    BuyType: inputData.buyType,
    PaymentTypeName: inputData.paymentTypeName
  }

  data.UniformInvoiceInfo = {
    DonateMark: inputData.uniformInvoiceInfo.donateMark,
    CarrierType: inputData.uniformInvoiceInfo.carrierType,
    CarrierId: inputData.uniformInvoiceInfo.carrierId,
    NPOBAN: inputData.uniformInvoiceInfo.npoban,
    BuyerEmailAddress: inputData.uniformInvoiceInfo.buyerEmailAddress,
    BuyerIdentifier: inputData.uniformInvoiceInfo.buyerIdentifier,
    BuyerName: inputData.uniformInvoiceInfo.buyerName
  }

  for (const [key, value] of Object.entries(data.UniformInvoiceInfo)) {
    if ([null, undefined, ''].includes(value)) delete data.UniformInvoiceInfo[key]
  }

  for (const [key, value] of Object.entries(data)) {
    if ([null, undefined, ''].includes(value)) delete data[key]
  }

  return request({
    method,
    url,
    data,
    // test
    type: 'BuyPackage'
  })
}

// 兌換序號
export const postExchange = ({ body }) => {
  const url = 'Transaction/Exchange'
  const method = 'post'
  const data = {
    ExchangeCode: body.ExchangeCode,
    reCAPTCHA: body.recaptcha,
    Locale: body.locale
  }

  return request({
    method,
    url,
    data
  })
}

// 取消訂單
export const postMemberOrderDel = inputData => {
  const url = 'Member/OrderDel'
  const method = 'post'
  const data = {
    TransId: inputData.transId
  }

  return request({
    method,
    url,
    data
  })
}

/** GMO mul-pay金流: 信用卡執行交易 */
export const getGMOExecTran = data => {
  const url = '/gmo-api/payment/ExecTran.idPass'
  const method = 'post'
  const model = {
    AccessID: data.accessID,
    AccessPass: data.accessPass,
    CallbackType: data.callbackType,
    Method: data.method,
    OrderID: data.orderID,
    RetUrl: data.retUrl,
    Token: data.token,
    TdTenantName: data.tdTenantName
  }
  return request({
    method,
    url,
    data: model,
    type: 'GMOProxyUrlencodedPay'
  })
}

/** GMO mul-pay金流: 結算開始(產生PayPay HTML格式) */
export const getGMOPayPayStart = data => {
  const url = '/gmo-api/payment/PaypayStart.idPass'
  const method = 'post'
  const model = { AccessID: data.AccessID, Token: data.Token }
  return request({
    method,
    url,
    data: model,
    type: 'GMOProxyUrlencodedPay'
  })
}

/** GMO mul-pay金流: apple pay 驗證 */
export const applePayValidateMerchant = data => {
  const url = '/Apple/ValidateMerchant'
  const method = 'post'
  return request({
    method,
    url,
    data,
    type: 'XPGCashFlowPay'
  })
}

/** GMO mul-pay金流: apple pay 執行付款 */
export const gmoApplePayExec = (data = { AccessID: '', AccessPass: '', Token: '' }) => {
  const url = '/GMO/ApplePayExec'
  const method = 'post'
  return request({
    method,
    url,
    data: data,
    type: 'XPGCashFlowPay'
  })
}

/** 取得GMO訂單狀態 */
export const getOrderStatus = (params = { assessId: '', accessPass: '', type: 2 }) => {
  const url = `/GMO/done?accessID=${params.assessId}&accessPass=${params.accessPass}&type=${params.type}`
  const method = 'post'
  return request({
    method,
    url,
    type: 'XPGCashFlowPay'
  })
}

// 取得交易贈點設定，金銀幣的上下限
export const getTransactionRewardPoint = () => {
  const url = 'Transaction/RewardPoint/Get'
  const method = 'post'

  return request({
    method,
    url
  })
}
