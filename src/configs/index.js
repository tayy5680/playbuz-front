import dayjs from 'dayjs'
import i18n from './locales'
const {
  global: { t }
} = i18n

export const SITE_NAME = process.env.VUE_APP_SITE_NAME
export const SITE_FULL_NAME = t(process.env.VUE_APP_SITE_FULL_NAME)
export const SERVICE_HOURS = process.env.VUE_APP_SERVICE_HOURS
export const SERVICE_PHONE = process.env.VUE_APP_SERVICE_PHONE

export const WEEKS = ['日', '一', '二', '三', '四', '五', '六']

// 聯絡資訊
export const SITE = {
  mail: 'service.tw@playbuz.app',
  contact: {
    name: 'LiveChat',
    QAName: 'LiveChat',
    account: 'LiveChat',
    url: 'https://direct.lc.chat/14172252/',
    icon: 'livechat',
    color: 'liveChatBg',
    mail: 'service.tw@playbuz.app'
  }
}

export const HOME_HEADER_MENU = [
  { id: 'home', label: '推薦', route: { name: 'home' } },
  { id: 'rank', label: '排行榜', img: './img/rank/icon_rank.svg', route: { name: 'rank' } },
  { id: 'twitter', label: '{siteName}動態', img: './img/twitter/icon_twitter.svg', route: { name: 'twitter' } }
]

// 預設站台幣值
export const CURRENCY = '$'

// copyright
export const COPYRIGHT = `©2025 ${SITE_NAME} All Rights Reserved.`

// 監聽視窗縮放時的debounce延遲時間
export const OBSERVE_TIME = 300

// 裝置尺寸
export const DEVICE_WIDTH = {
  mobile: 768,
  tablet: 1024
}

export const CONTRACR_LIST = [
  // { id: 'about', type: 'about', showID: 'about', label: '關於{siteName}' }
]

// 遊戲幣參數
export const COIN_TYPE = [
  {
    id: 1,
    type: 'gold',
    point: 'GoldPoint',
    label: '金幣',
    display: true,
    img: '/img/coin/i_money_gold.svg',
    imgLine: '/img/coin/i_money_gold_line.svg',
    icon: '/img/coin/i_money_gold.svg',
    color: '#ffd500',
    packing: {
      minLimit: 3000,
      setp: 100,
      quick: [3000, 5000, 10000]
    }
  }
  // {
  //   id: 2,
  //   type: 'silver',
  //   point: 'SilverPoint',
  //   label: '銀幣',
  //   display: true,
  //   img: '/img/coin/i_money_silver_line.svg',
  //   imgLine: '/img/coin/i_money_silver_line.svg',
  //   icon: '/img/coin/i_money_silver.svg',
  //   color: '#3E3A39',
  //   packing: {
  //     minLimit: 100000,
  //     setp: 100,
  //     quick: [100000, 300000, 500000]
  //   }
  // }
]

export const RECAPTCHA = {
  // recaptcha金鑰
  siteKey: process.env.VUE_APP_RECAPTCHA_KEY,

  // google recaptcha 類型
  actionList: {
    // 登入
    login: '/Login',
    // 代理登入
    agentLogin: '/Token/AdLogin',
    // 兌換禮包
    exchangeSerialno: '/Transaction/ExchangeSerialno',
    // 新增好友
    addFriend: '/Friend/FriendAdd'
  }
}

export const NICKNAME_RULE = { min: 2, max: 16 }

export const CERTIFIED_CD_SEC = 180
export const RESEND_CERTIFIED_CD_SEC = 70

export const TODAY = dayjs()

export const POPULAR_CODE_LIST = [
  // 三方模式
  'third',

  // 推廣(AGM)
  'promote',
  'introduce',

  // 邀請(MGM)
  'introduction'
]

export const lineUrl = () => {
  let link = 'https://access.line.me/oauth2/v2.1/authorize?'
  link += 'response_type=code'
  link += '&client_id=' + process.env.VUE_APP_LINE_CLIENT_ID
  link += '&redirect_uri=' + process.env.VUE_APP_LINE_REDIRECT_URI
  link += '&state=lineLogin'
  link += '&scope=openid%20profile'
  if (process.env.VUE_APP_VERSION_TITLE === 'tw') link += '&bot_prompt=aggressive'
  return link
}

export const yahooUrl = () => {
  let link = 'https://api.login.yahoo.com/oauth2/request_auth?'
  link += 'response_type=code'
  link += '&client_id=' + process.env.VUE_APP_YAHOO_CLIENT_ID
  link += '&redirect_uri=' + process.env.VUE_APP_YAHOO_REDIRECT_URI
  link += '&language=ja-JP'
  return link
}

export const appleUrl = () => {
  let link = 'https://appleid.apple.com/auth/authorize?'
  link += 'response_type=code'
  link += '&client_id=' + process.env.VUE_APP_APPLE_CLIENT_ID
  link += '&redirect_uri=' + process.env.VUE_APP_APPLE_REDIRECT_URI
  link += '&state=appleLogin'
  // window.AppleID.auth.init({
  //   clientId: process.env.VUE_APP_APPLE_CLIENT_ID,
  //   scope: 'name email',
  //   redirectURI: process.env.VUE_APP_APPLE_REDIRECT_URI,
  //   state: JSON.stringify({ foo: 'bar' }),
  //   response_type: 'code',
  // })

  // window.AppleID.auth.signIn()
  return link
}

export const UNKNOWN_USER_NAME = '不具名使用者'

export const SOCIAL_LIST = [
  { id: 'facebook', icon: 'bi-facebook', url: 'https://www.facebook.com/profile.php?id=61575997414405' },
  { id: 'instagram', icon: 'bi-instagram', url: 'https://www.instagram.com/playbuz_tw?igsh=MWw3aTlwbHdtdjZwMw' },
  { id: 'youtube', icon: 'bi-youtube', url: 'https://www.youtube.com/channel/UCVCz7OKu1ZYueiPO5GJ_kqg' },
  { id: 'twitter-x', icon: 'bi-twitter-x', url: 'https://x.com/Play_BUZ' }
]
