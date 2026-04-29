import { reactive } from 'vue'
import { useNotice } from '@/utils/use-notice'

// api
import { getGMOExecTran } from '@/api/deposit'

// utils
import { checkOrderStatus } from '../utils.js'

/** GMO mpToken的錯誤碼 */
export const getMpTokenErrorCodeMsg = code => {
  switch (code) {
    case '100':
      return '卡號要求檢查錯誤'
    case '101':
      return '卡號格式錯誤(包括非數字字元)'
    case '102':
      return '卡號格式錯誤（超出10-16位數範圍）'
    case '110':
      return '有效期限要求檢查錯誤'
    case '111':
      return '到期日期格式錯誤（包含非數字字元）'
    case '112':
      return '到期日格式錯誤（6 位或 4 位數字除外）'
    case '113':
      return '到期日格式錯誤（月份 13 或以上）'
    case '121':
      return '安全碼格式錯誤（包含非數字字元）'
    case '122':
      return '安全碼位數錯誤'
    case '131':
      return '持卡人格式錯誤（包括半角字母數字字元和部分符號）'
    case '132':
      return '持卡人格式錯誤（超過 51 位數字）'
    case '141':
      return 'MP信用卡代幣發行號碼格式錯誤（包括非數字）'
    case '142':
      return 'MP信用卡令牌發行號碼格式錯誤（超出1-10範圍）'
    case '150':
      return '加密卡片資訊所需資訊檢查錯誤'
    case '160':
      return '店舖ID要求檢查錯誤'
    case '161':
      return '店舖ID格式錯誤（超過14位）'
    case '180':
      return 'master 上不存在商店 ID 或公鑰哈希值'
    case '190':
      return '卡資訊（加密）無法解密'
    case '191':
      return '解密卡片資訊後格式錯誤（加密）'
    case '200':
      return '需要回調檢查錯誤'
    case '201':
      return '回呼格式錯誤（包括半角字母數字、底線、句點以外的字元）'
    case '701':
      return 'MP信用卡令牌參數（cardObject）不存在'
    case '901':
      return '我們服務中的系統錯誤'
    case '902':
      return '處理擁擠'
    default:
      return ''
  }
}

/** GMO mpToken的錯誤欄位參數 */
export const getMpTokenErrorField = field => {
  switch (field) {
    // 卡號
    case 'card.cardNumber':
      return 'isCardNumberError'

    // 有效期限(月份)
    case 'card.expiryMonth':
      return 'isCardExpiryError'

    // 有效期限(年度)
    case 'card.expiryYear':
      return 'isCardExpiryError'

    // // 安全碼
    // case 'card.cardholderName':
    //   return 'isCardCvcError'

    // 預設
    default:
      return ''
  }
}

/** 信用卡: values-欄位驗證(is error) */
export const validator = reactive({
  isCardNumberError: false,
  isCardExpiryError: false,
  isCardCvcError: false
})

/** 信用卡: 取得加密後的信用卡資訊token */
export const getCreditCardToken = async (mulpay, mulPayFormElements, name) => {
  try {
    const options = { tokenNumber: 2 }
    const resCreditCard = await mulpay.getTokenThroughIframe(mulPayFormElements[0], name, options)

    if (resCreditCard.result === 'validation_error') {
      handleValidator(resCreditCard.errorList)
      return '發生錯誤'
    }
    if (!resCreditCard.tokenList || resCreditCard.tokenList.length === 0) {
      console.error('找不到信用卡資訊Token', resCreditCard)
      useNotice({ type: 'error', message: '找不到信用卡資訊Token,如需進一步查詢,請聯繫客服。' })
      return '發生錯誤'
    }

    // 清除卡片信息輸入表單
    for (let index = 0; index < mulPayFormElements.length; index++) {
      const element = mulPayFormElements[index]
      if (element) element.clear()
    }

    // 回傳值
    return resCreditCard
  } catch (err) {
    throw Error(err)
  }
}

/** 信用卡: 建立交易/收費執行(與發卡公司溝通進行付款) */
export const createTransaction = (isOpenTest, route, gmoInfo, resCreditCard) => {
  return new Promise((resolve, reject) => {
    try {
      const packageGroupID = parseInt(route.params.depositPackageGroupID)
      // RetUrl
      const orderIDUrl = `orderId=${gmoInfo.OrderID}`
      const tdTenantName = `TdTenantName=${process.env.VUE_APP_SITE_NAME}`
      // site url
      const siteUrl = isOpenTest ? 'https://192.168.1.146:8080' : process.env.VUE_APP_SITE_URL
      const paramsRetUrl = `${siteUrl}/deposit/giftpack/time/${packageGroupID}?${orderIDUrl}&${tdTenantName}`

      // values
      const params = {
        accessID: gmoInfo.AccessID,
        accessPass: gmoInfo.AccessPass,
        orderID: gmoInfo.OrderID,
        token: resCreditCard ? resCreditCard.tokenList[0] : null,

        // 1=一次付清, 2=分期付款, 3=年終獎金一次付清, 5=循環信用付款
        method: 1,

        // 1=正常（POST方法）（預設）, 2=直接接收, 3=正常（GET方式）
        callbackType: 3,

        // 重新導向的Url(需自行設定)
        retUrl: paramsRetUrl,

        tdTenantName: process.env.VUE_APP_SITE_NAME
      }

      // resExecTran = ACS=xxx&RedirectUrl=https://xxx
      getGMOExecTran(params)
        .then(resExecTran => {
          if (!resExecTran?.data) {
            console.error('信用卡建立交易,找不到資料', resExecTran)
            useNotice({ type: 'error', message: '信用卡建立交易,找不到資料,如需進一步查詢,請聯繫客服。' })
            resolve('發生錯誤')
            return false
          }
          const data = {
            acs: Number(resExecTran?.data?.split('&')?.[0]?.split('ACS=')?.[1]),
            redirectUrl: resExecTran?.data?.split('RedirectUrl=')?.[1]
          }
          resolve(data)
        })
        .catch(err => reject(err))
    } catch (err) {
      reject(err)
    }
  })
}

/** 信用卡: 開始交易(會回傳此筆交易是否需要3DS驗證) */
export const startTransaction = (resExecTran, gmoInfo) => {
  return new Promise((resolve, reject) => {
    try {
      if (Number(resExecTran.acs) === 2) {
        // 執行3DS，判斷回傳結果是否為使用3DS (acs=2，3DS2.0)

        if (!resExecTran?.redirectUrl) {
          console.error('信用卡開始交易,找不到資料', resExecTran)
          useNotice({ type: 'error', message: '信用卡開始交易,找不到資料,如需進一步查詢,請聯繫客服。' })
          resolve('發生錯誤')
          return false
        }

        // 暫存於localStorage，因url返回資料有少
        const params = {
          assessId: gmoInfo.AccessID,
          accessPass: gmoInfo.AccessPass,
          type: resExecTran.acs,
          paymentTypeId: 3,
          gmoOrderStatus: '1'
        }
        localStorage.gmoData = JSON.stringify(params)

        // 跳轉至3DS頁面，另開分頁 => window.open(redirectUrl)
        const redirectUrl = resExecTran.redirectUrl
        if (redirectUrl) location.href = redirectUrl
        resolve('OK')
      } else {
        // 不用3DS

        // 暫存於localStorage，因url返回資料有少
        const params = {
          assessId: gmoInfo.AccessID,
          accessPass: gmoInfo.AccessPass,
          type: resExecTran.acs,
          paymentTypeId: 3,
          gmoOrderStatus: '1'
        }
        localStorage.gmoData = JSON.stringify(params)

        // 確認訂單狀態Api
        setTimeout(() => {
          checkOrderStatus()
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    } catch (err) {
      reject(err)
    }
  })
}

/** 信用卡: 驗證信用卡 */
export const handleValidator = errorList => {
  let errorMsg = ''

  // 初始化
  validator.isCardNumberError = false
  validator.isCardExpiryError = false
  validator.isCardCvcError = false

  // 處理: 錯誤訊息
  for (let index = 0; index < Object.keys(errorList).length; index++) {
    const item = errorList[index]

    // 錯誤訊息
    if (item && item.legacyCode) {
      const msg = getMpTokenErrorCodeMsg(item.legacyCode)
      if (msg) errorMsg += `${index + 1}. ${msg}\n`
    }

    // 錯誤提示
    const field = getMpTokenErrorField(item.field)
    if (field) validator[field] = true
  }
  console.error(`信用卡Token Api出現錯誤訊息:\n${errorMsg}`)
}
