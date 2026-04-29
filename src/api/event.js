import request from '@/api/request'
import dayjs from 'dayjs'
dayjs.extend(require('dayjs/plugin/localeData'))
dayjs.extend(require('dayjs/plugin/utc'))
dayjs.extend(require('dayjs/plugin/timezone'))
const tw = require('dayjs/locale/zh-tw')

// 新手七日簽到紀錄
export const getSeven = () => {
  const url = 'Activity/NoviceSignIn7thList'
  const method = 'get'
  const today = dayjs().locale(tw).subtract(6, 'hour').format('YYYY-MM-DD')

  return request({
    method,
    url,
    noCache: true,
  })
    .then(response => {
      switch (response.Status.Code) {
        case '0':
          response.Data.forEach(item => {
            if (item.IsSignIn && item.SignInTime) item.SignDate = dayjs(item.SignInTime).locale(tw).subtract(6, 'hour').format('YYYY-MM-DD')
            item.IsToday = (item.SignDate === today)
          })
          return response.Data
        default:
      }
    })
}

// 新手七日簽到
export const getActivityNoviceSignIn7th = () => {
  const url = 'Activity/NoviceSignIn7th'
  const method = 'get'

  return request({
    method,
    url,
  })
}

// 簽到活動紀錄
export const getActivityNormalSignInMonthList = (inputData) => {
  const url = 'Activity/Normal/SignInMonthList'
  const method = 'get'
  const data = {
    Month: inputData.Month,
  }

  return request({
    method,
    url,
    data,
    noCache: true,
  })
}

// 活動簽到
export const postActivityNormalSignInMonth = (inputData) => {
  const url = 'Activity/Normal/SignInMonth'
  const method = 'post'
  const data = {
    Month: inputData.Month,
  }
  return request({
    method,
    url,
    data,
  })
}

// 取得可抽獎次數
export const getActivityDrawlotsGetSpins = (inputData) => {
  const url = `Activity/Drawlots/${inputData.ActivityName}/GetSpins`
  const method = 'get'
  return request({
    method,
    url,
    noCache: true,
  })
}

// 抽獎
export const postActivityDrawlotsSpin = (inputData) => {
  const url = `Activity/Drawlots/${inputData.ActivityName}/Spin/${inputData.SpinType}`
  const method = 'post'
  return request({
    method,
    url,
  })
}

// 取得活動是否有未完成動作
export const getActivityRedDot = () => {
  const url = 'Activity/RedDot'
  const method = 'get'
  return request({
    method,
    url,
    noCache: true,
  })
}

// 新聞版面
export const getActivityNews = (inputData) => {
  const url = 'Activity/News'
  const method = 'get'
  const data = {
    TagsId: inputData.tagsID,
    NewsType: inputData.newsType,
    Locale: inputData.locale,
  }
  return request({
    method,
    url,
    data,
  })
}

// 取得最新標題標籤
export const getActivityNewsTags = (inputData) => {
  const url = 'Activity/News/Tags'
  const method = 'get'
  return request({
    method,
    url,
  })
}

// 新聞內容
export const getActivityNewsContent = (inputData) => {
  const url = 'Activity/News/Content'
  const method = 'get'
  const data = {
    NewsId: inputData.newsID,
    Locale: inputData.locale,
  }
  return request({
    method,
    url,
    data,
  })
}
