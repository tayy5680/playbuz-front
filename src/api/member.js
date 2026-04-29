import request from '@/api/request'

// 確認會員登入驗證碼
export const postCheckLoginVerification = inputData => {
  const url = 'Token/CheckLoginVerification'
  const method = 'post'
  const data = {
    Phone: inputData.phoneNumber,
    VerifyCode: inputData.verifyCode,
    Device: inputData.device,
    Email: inputData.email
  }

  return request({
    method,
    url,
    data
  })
}

// 會員註冊
export const postTokenRegister = inputData => {
  const url = 'Token/Register'
  const method = 'post'
  const data = {
    IntroduceCode: inputData.introduceCode,
    PromoteCode: inputData.promoteCode,
    CustomField: inputData.customField,
    RegisterSource: inputData.registerSource,
    Locale: inputData.locale
  }

  return request({
    method,
    url,
    data,
    noCache: true
  })
}

// Line登入
export const postCheckLineLogin = inputData => {
  const url = 'Token/CheckLineLogin'
  const method = 'post'
  const data = {
    VerifyCode: inputData.code,
    IntroduceCode: inputData.introduceCode,
    PromoteCode: inputData.promoteCode,
    Device: inputData.device
  }

  return request({
    method,
    url,
    data
  })
}

// Yahoo登入
export const postCheckYahooLogin = inputData => {
  const url = 'Token/CheckYahooLogin'
  const method = 'post'
  const data = {
    VerifyCode: inputData.code,
    IntroduceCode: inputData.introduceCode,
    PromoteCode: inputData.promoteCode,
    Device: inputData.device
  }

  return request({
    method,
    url,
    data
  })
}

// Apple登入
export const postCheckAppleLogin = inputData => {
  const url = 'Token/CheckAppleLogin'
  const method = 'post'
  const data = {
    VerifyCode: inputData.code,
    IntroduceCode: inputData.introduceCode,
    PromoteCode: inputData.promoteCode,
    Device: inputData.device
  }

  return request({
    method,
    url,
    data
  })
}

// 登入驗證手機
export const postTokenSendLoginVerification = inputData => {
  const url = 'Token/SendLoginVerification'
  const method = 'post'
  const data = {
    Phone: inputData.phoneNumber,
    reCAPTCHA: inputData.reCAPTCHA,
    Locale: inputData.locale,
    Email: inputData.email
  }

  return request({
    method,
    url,
    data
  })
}

// 廣告推廣商登入
export const postTokenAdLogin = inputData => {
  const url = 'Token/AdLogin'
  const method = 'post'
  const data = {
    reCAPTCHA: inputData.reCAPTCHA,
    Account: inputData.account,
    Password: inputData.password
  }

  return request({
    method,
    url,
    data
  })
}

// 重發登入驗證手機
export const getTokenSignOut = inputData => {
  const url = 'Token/SignOut'
  const method = 'get'
  const data = {
    refresh_token: inputData.refresh_token
  }

  return request({
    method,
    url,
    data
  })
}

// 刷新令牌(token)
export const postTokenRefreshToken = inputData => {
  const url = 'Token/RefreshToken'
  const method = 'post'
  const data = {
    refresh_token: inputData.refresh_token
  }
  return request({
    method,
    url,
    data
  })
}

// 頭像庫
export const getAvatars = () => {
  const url = 'Member/AvatarRepository'
  const method = 'get'
  return request({
    method,
    url
  })
}

export const editAvatar = path => {
  const url = 'Member/UpdateAvatar'
  const method = 'post'
  return request({
    method,
    url,
    data: { AvatarID: path }
  })
}

// 修改會員暱稱
export const postNickname = name => {
  const method = 'post'
  const url = 'Member/Nickname'
  const data = {
    Nickname: name
  }

  return request({
    method,
    url,
    data
  })
}

// 驗證門號或信箱是否重複
export const postValidateContactInfo = inputData => {
  const url = '/Token/ValidateContactInfo'
  const method = 'post'
  const data = {
    Phone: inputData.phoneNumber,
    Email: inputData.email
  }

  return request({
    method,
    url,
    data
  })
}

// 上傳會員頭像
export const uploadAvatar = fileData => {
  const url = 'Member/UploadAvatar'
  const method = 'post'
  const userPhotoForm = new FormData()
  userPhotoForm.append('File', fileData)
  return request({
    method,
    url,
    data: userPhotoForm,
    timeout: 30000
  })
}

export const getMemberInfo = () => {
  const url = 'Member/MemberInfo'
  const method = 'get'
  return request({
    method,
    url,
    noCache: true
  })
}

// 取得像框
export const getAvatarFrameRepository = () => {
  const url = 'Member/AvatarFrameRepository'
  const method = 'get'
  return request({
    method,
    url,
    noCache: true
  })
}

// 更新像框
export const getUpdateAvatarFrame = ({ body }) => {
  const url = 'Member/UpdateAvatarFrame'
  const method = 'post'
  const data = {
    HeadPhotoFrameID: body.headPhotoFrameID ?? 0
  }
  return request({ method, url, data })
}

// 新增遊玩紀錄
export const postUpdateMemberStatus = ({ body }) => {
  const url = 'Member/UpdateMemberStatus'
  const method = 'post'
  const data = {
    GameID: body.gameID ?? 0
  }
  return request({ method, url, data })
}

// 推廣資訊
export const getMemberPromoteInfo = inputData => {
  const url = 'Member/PromoteInfo'
  const method = 'get'
  const data = inputData
  return request({
    method,
    url,
    data
  })
}

// 取得訂單資訊
export const getCouponGetOrder = inputData => {
  const url = 'Coupon/GetOrder'
  const method = 'get'
  const data = {
    Locale: inputData.locale
  }

  if (inputData?.orderID) data.OrderID = inputData.orderID
  if (inputData?.StartDate) data.StartDate = inputData.StartDate
  if (inputData?.EndDate) data.EndDate = inputData.EndDate

  return request({
    method,
    url,
    data
  })
}

// 更新訂單資訊
export const postCouponUpdateOrder = inputData => {
  const url = 'Coupon/UpdateOrder'
  const method = 'post'
  const data = {
    OrderID: inputData.orderID
  }

  if (inputData.recipientsName) data.RecipientsName = inputData.recipientsName
  if (inputData.recipientsPhoneNumber) data.RecipientsPhoneNumber = inputData.recipientsPhoneNumber
  if (inputData.zipCode) data.ZipCode = inputData.zipCode
  if (inputData.city) data.City = inputData.city
  if (inputData.cityArea) data.CityArea = inputData.cityArea
  if (inputData.address) data.Address = inputData.address
  if (inputData.playerNote) data.PlayerNote = inputData.playerNote

  return request({
    method,
    url,
    data
  })
}

// 取消訂單資訊
export const postCouponCancelOrder = inputData => {
  const url = 'Coupon/CancelOrder'
  const method = 'post'
  const data = {
    OrderID: inputData.orderID
  }

  return request({
    method,
    url,
    data
  })
}

// 取得訂單狀態
export const postCouponOrderCheck = inputData => {
  const url = 'Coupon/OrderCheck'
  const method = 'get'
  const data = {
    OrderId: inputData.orderID
  }

  return request({
    method,
    url,
    data,
    noCache: true
  })
}

// 取得縣市資訊
export const getCouponCityGet = inputData => {
  const url = 'Coupon/CityGet'
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

// 取得站台預設語系
export const getTokenLocale = () => {
  const url = 'Token/Locale'
  const method = 'get'

  return request({
    method,
    url
  })
}

// 修改個人預設語系
export const postMemberLocaleMod = inputData => {
  const url = 'Member/LocaleMod'
  const method = 'post'
  const data = {
    Locale: inputData.locale
  }

  return request({
    method,
    url,
    data
  })
}

// 礦寵資訊
export const getMiningPetInfo = inputData => {
  const url = 'Mining/GetPetInfo'
  const method = 'get'

  const data = {
    access_token: inputData.accessToken
  }

  return request({
    method,
    url,
    data
  })
}

// 取得訂單資訊
export const getOnSiteOrder = inputData => {
  const url = 'Coupon/OnSiteOrder'
  const method = 'get'
  const data = {
    OrderId: inputData.orderID
  }

  return request({
    method,
    url,
    data,
    noCache: true
  })
}

// 取得總碼量排行榜 // 排行-活躍度排行
export const getRankingBetCache = inputData => {
  const url = 'Member/ContributionRanking/BetCache'
  const method = 'get'
  const data = {
    StartDate: inputData.startDate,
    EndDate: inputData.endDate,
    Top: inputData.top,
    MemberID: inputData.memberID
  }

  return request({
    method,
    url,
    data,
    noCache: true
  })
}

// 取得總資產排行榜 //排行-玩家排行
export const getRankingTotalWalletPoint = inputData => {
  const url = 'Member/ContributionRanking/TotalWalletPoint'
  const method = 'get'
  const data = {
    Top: inputData.top
  }

  return request({
    method,
    url,
    data,
    noCache: true
  })
}

// 會員註冊認證
export const postCertification = inputData => {
  const url = 'Member/Certification'
  const method = 'post'
  const data = {
    Phone: inputData.phoneNumber,
    Email: inputData.email,
    VerifyCode: inputData.verifyCode
  }

  return request({
    method,
    url,
    data
  })
}
