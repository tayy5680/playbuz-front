import { useNotice } from '@/utils/use-notice'
import { computed } from 'vue'
import store from '@/store'

// api
import { getGMOPayPayStart, applePayValidateMerchant, getOrderStatus, postElectronicMallBuyPackage, gmoApplePayExec } from '@/api/deposit'
import { getOrder } from '@/api/records'

/** 取得PayPay支付HTML */
export const onGMOPayPay = async (response, router, route, handleSetInterval, newWindow) => {
  try {
    const gmoInfo = response?.Data?.GMOInfo
    if (!gmoInfo) {
      console.error('禮包支付發生錯誤,取不到資料,如需進一步查詢,請聯繫客服。', response)
      useNotice({ type: 'error', message: '禮包支付發生錯誤,取不到資料,如需進一步查詢,請聯繫客服。' })
      return false
    }

    const paypayRes = await getGMOPayPayStart({ AccessID: gmoInfo.AccessID, Token: gmoInfo.Token })
    if (!paypayRes.data) {
      console.error('PayPay支付發生錯誤,取不到資料,如需進一步查詢,請聯繫客服。', paypayRes)
      useNotice({ type: 'error', message: 'PayPay支付發生錯誤,取不到資料,如需進一步查詢,請聯繫客服' })
      return false
    }
    const accessID = response?.Data?.GMOAccessID
    const accessPass = response?.Data?.GMOAccessPass

    // localStorage
    const params = { assessId: accessID, accessPass: accessPass, type: null, paymentTypeId: 4, gmoOrderStatus: '1' }
    localStorage.gmoData = JSON.stringify(params)
    await new Promise(resolve => setTimeout(resolve, 10))

    // route
    const target = route.query
    router.push({ query: { ...target, orderId: response?.Data?.PayselInfo?.ORDER_ID } })
    handleSetInterval()

    // 開啟新視窗
    newWindow.document.write(paypayRes.data)
    newWindow.document.close()
  } catch (error) {
    console.error('PayPay支付發生錯誤,如需進一步查詢,請聯繫客服。', error)
    useNotice({ type: 'info', message: 'PayPay支付發生錯誤,如需進一步查詢,請聯繫客服' })
  }
}

/**
 * Apple Pay JS Api
 * @param gmoOrderStatus 無=0, 交易處理中=1, 交易成功=2, 交易失敗=3
 */
export const onApplePayJSClicked = (router, route, gmoOrderStatus, input, handleSetInterval) => {
  return new Promise((resolve) => {
    try {
      const ApplePaySession = window.ApplePaySession

      // 1. 檢查是否支援 Apple Pay
      if (!ApplePaySession) return false
      if (!isCheckApplePay.value) return false

      // 2. 設定支付請求
      const total = input.price * input.quantity
      const request = {
        countryCode: 'JP',
        currencyCode: 'JPY',
        merchantCapabilities: ['supports3DS'],
        supportedNetworks: ['masterCard', 'visa', 'jcb', 'amex'],
        merchantIdentifier: 'merchant.cubegame.app',
        total: { label: 'CubeGame', amount: total },
      }

      // 3. 建立 session
      const session = new ApplePaySession(3, request)

      // 4. 呼叫您自己的伺服器來請求新的商家會話。
      session.onvalidatemerchant = async (event) => {
        try {
          gmoOrderStatus.value = 1
          const res = await applePayValidateMerchant({ ValidationUrl: event.validationURL })
          if (res?.data) {
            console.log('取得商家Api Data', res.data)
            session.completeMerchantValidation(res.data)
          } else {
            useNotice({ type: 'error', message: 'Apple Pay支付發生錯誤,商家驗證找不到資料' })
          }
        } catch (error) {
          console.error('商家驗證失敗:', error)
          useNotice({ type: 'error', message: 'Apple Pay支付發生錯誤,商家驗證失敗' })
          session.abort()
        }
      }

      // 5. 處理支付授權(定義Apple Pay支付授權結果)
      session.onpaymentauthorized = async (event) => {
        try {
          console.log('處理支付授權-event', event)
          const paymentToken = event.payment
          console.log('處理支付授權-event.payment.token', paymentToken)

          // apple pay payment token to base64
          const jsonString = JSON.stringify(paymentToken)
          const token = btoa(jsonString)
          // const token = Buffer.from(jsonString).toString('base64')
          console.log('處理支付授權-payment token base64', token)

          // 建立gmo訂單
          console.log('建立gmo訂單-input', input)
          const response = await postElectronicMallBuyPackage(input)
          const orderId = response?.Data?.PayselInfo?.ORDER_ID
          console.log('建立gmo訂單-response', response)
          console.log('orderId', orderId)
          if (!response?.Data) {
            console.error('ApplePay支付發生錯誤,取不到資料,如需進一步查詢,請聯繫客服。', response)
            useNotice({ type: 'error', message: 'ApplePay支付發生錯誤,取不到資料,如需進一步查詢,請聯繫客服' })
            return false
          }

          // 執行gmo付款
          const accessID = response?.Data?.GMOAccessID
          const accessPass = response?.Data?.GMOAccessPass
          const data = {
            AccessID: accessID,
            AccessPass: accessPass,
            Token: token,
            PaymentToken: paymentToken,
          }
          console.log('執行gmo付款-data', data)

          const res = await gmoApplePayExec(data)
          console.log('執行gmo付款-response', res)

          // 完成支付
          const result = { status: ApplePaySession.STATUS_SUCCESS }
          session.completePayment(result)
          console.log('完成支付，關閉apple pay')

          // localStorage
          const params = { assessId: accessID, accessPass: accessPass, type: null, paymentTypeId: 5, gmoOrderStatus: '1' }
          localStorage.gmoData = JSON.stringify(params)
          await new Promise(resolve => setTimeout(resolve, 10))

          // route
          const target = route.query
          router.push({ query: { ...target, orderId: orderId } })
          handleSetInterval()
          console.log('開始偵測訂單狀態')
        } catch (err) {
          console.error('處理支付授權失敗:', err)
          useNotice({ type: 'error', message: 'Apple Pay支付發生錯誤,處理支付授權失敗,如需進一步查詢,請聯繫客服' })
          session.completePayment(ApplePaySession.STATUS_FAILURE)
        }
      }

      // 取消
      session.oncancel = (event) => {
        console.error('取消:', event)
        gmoOrderStatus.value = 0
        resolve({ status: 'success', gmoOrderStatus: gmoOrderStatus.value, message: '取消交易' })
        useNotice({ type: 'info', message: '取消交易' })
      }

      // 開始交易(開啟 Apple Pay Modal)
      session.begin()
    } catch (error) {
      console.error('catch:', error)
    }
  })
}

/**
 * 確認訂單狀態
 * @param assessId GMO金流代號
 * @param type 非3DS=0, 3DS=2
 * @param type 非3DS=0, 3DS=2
 * @param paymentTypeId 信用卡=card, PayPay=paypay
 * @param nowPayTypeID 信用卡=3, PayPay=4
 * @param gmoOrderStatus 無=0, 交易處理中=1, 交易成功=2, 交易失敗=3
 */
export const checkOrderStatus = async (route) => {
  const errorMsg = '確認訂單狀態,發生錯誤,如需進一步查詢,請聯繫客服。'
  return new Promise(resolve => {
    try {
      const gmoData = localStorage.gmoData ? JSON.parse(localStorage.gmoData) : { assessId: '', accessPass: '', type: 0, paymentTypeId: 3, gmoOrderStatus: '0' }
      const target = route.query
      let nowPayTypeID = gmoData.paymentTypeId

      // 取得: 付款方式
      nowPayTypeID = Number(gmoData.paymentTypeId) > 0 ? Number(gmoData.paymentTypeId) : 3

      // 驗證: orderId
      if (!target?.orderId) {
        localStorage.gmoData = ''
        resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 0 })
      }

      // 取得: localStorage gmoData
      const params = localStorage.gmoData ? JSON.parse(localStorage.gmoData) : { assessId: '', accessPass: '', type: 0, paymentTypeId: 3, gmoOrderStatus: '0' }
      if (!params.assessId) {
        resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 0 })
        return false
      }

      // call api
      if (params.paymentTypeId === 3) {
        // 訂單狀態: 信用卡
        getOrderStatus({ assessId: params.assessId, accessPass: params.accessPass, type: Number(params.type) })
          .then(res => {
            if (!res?.data?.Status?.Message) {
              console.error('信用卡，確認訂單狀態發生錯誤,取不到資料', res)
              useNotice({ type: 'error', message: '確認訂單狀態發生錯誤,取不到資料' })
              resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 3, isError: true })
              return false
            }

            const status = res.data.Status.Message
            switch (status) {
              // 訂單成功
              case 'Success':
                setTimeout(() => {
                  resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 2 })
                }, 1000)
                break

              // 訂單失敗
              default:
                setTimeout(() => {
                  console.error('信用卡，' + errorMsg, res)
                  useNotice({ type: 'error', message: errorMsg })
                  resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 3, isError: true })
                }, 1000)
                break
            }
            localStorage.gmoData = ''
          })
          .catch(error => {
            console.error(errorMsg + '(getOrderStatus)', error)
            useNotice({ type: 'error', message: errorMsg })
            resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 3, isError: true })
          })
      } else {
        // PayPay
        const status = target?.status
        if (status) {
          // PayPay付款完成後，導頁回來判斷status => 交易成功=success, 交易失敗=fail
          if (status === 'success') resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 2, isError: true })
          else resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 3, isError: true })
        } else {
          // PayPay付款完成，沒有導頁回來 => 偵測訂單狀態
          const inputData = {
            transId: target.orderId,
            lang: store.state.member.languageCode,
          }
          getOrder(inputData)
            .then(res => {
              const storedStatusID = res?.Data && res.Data[0]?.StoredStatusID
              switch (storedStatusID) {
                // 確定交付
                case 1:
                  resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 2 })
                  break

                // 取消交付
                case 2:
                  resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 3 })
                  break

                // 異常
                case 3:
                  resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 3 })
                  break

                // 系統自動取消的訂單
                case 4:
                  resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 3 })
                  break

                // 處理中
                default:
                  resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 1 })
                  break
              }
            })
            .catch(error => {
              console.error(errorMsg + '(getOrder)', error)
              useNotice({ type: 'error', message: errorMsg })
              resolve({ nowPayTypeID: nowPayTypeID, gmoOrderStatus: 3, isError: true })
            })
        }
      }
    } catch (error) {
      console.error('catch-catch', error)
      useNotice({ type: 'error', message: errorMsg })
      resolve({ nowPayTypeID: 1, gmoOrderStatus: 3, isError: true })
    }
  })
}

/** apple pay library */
const mainSession = window.ApplePaySession

/** 確認瀏覽器是否可使用Apple Pay */
export const isCheckApplePay = computed(() => {
  if (mainSession && mainSession.canMakePayments()) return true
    else return false
})
