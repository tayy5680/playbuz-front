const fs = require('fs')
const axios = require('axios')
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const URL = process.env.VUE_APP_SITE_URL
const API_URL = process.env.VUE_APP_API_URL

const instance = axios.create({
  baseURL: API_URL,
  timeout: 3000
})

instance.interceptors.response.use(
  response => {
    const statusCode = response.data.Status?.Code ?? '999'
    if (statusCode !== '0') return Promise.reject()
    return Promise.resolve(response.data.Data)
  },
  error => {
    return Promise.reject(error)
  }
)

const list = [
  {
    priority: 1,
    route: '',
    queryList: ['']
  },
  {
    priority: 0.7,
    route: 'guide/cofunlive',
    queryList: [
      '/how-to-watch-cofun-live-streams',
      '/how-to-become-cofun-live-streamer',
      '/how-to-topup-package',
      '/how-to-withdraw-earnings'
    ]
  },
  {
    priority: 0.9,
    route: 'game',
    queryList: ['', '/leisure', '/educationsimulation']
  },
  {
    priority: 0.9,
    route: 'game/detail',
    queryList: ['/EducationSimulation/5001', '/Leisure/100001']
  },
  {
    priority: 0.9,
    route: 'deposit',
    queryList: ['', '/giftpack/first', '/orderno']
  },
  {
    priority: 0.9,
    route: 'news',
    queryList: ['/All', '/News', '/Activity', '/Good', '/Strategy']
  },
  {
    priority: 0.9,
    route: 'FAQ',
    queryList: ['/general', '/account', '/topup', '/game']
  },
  {
    priority: 0.9,
    route: 'center',
    queryList: ['', '/edit', '/record']
  },
  {
    priority: 0.8,
    route: 'userRules',
    queryList: [
      '/user-guidelines',
      '/game-management-policy',
      '/intellectual-property',
      '/privacy-policy',
      '/limitation-of-liability',
      '/anti-fraud-and-security'
    ]
  },
  {
    priority: 0.8,
    route: 'about',
    queryList: []
  }
].map(item => {
  const target = {
    ...item,
    route: `${URL}/${item.route}`
  }
  return target
})

const init = async () => {
  try {
    // 取得遊戲
    const gameResponse = await instance.get('Game/GameList')
    const gameList = gameResponse.map(item => `/detail/${item.GameID}`)
    const gameIndex = list.findIndex(item => item.route === `${URL}/game`)
    list.splice(gameIndex + 1, 0, {
      priority: 0.8,
      route: `${URL}/game`,
      queryList: gameList
    })

    // 取得文章
    const language = 'zh-TW'
    const eventResponse = await instance.get('Activity/News', { params: { TagsId: 6, locale: language } })
    const eventList = eventResponse?.map(item => `/All/${item.NewsId}`) ?? []
    const eventIndex = list.findIndex(item => item.route === `${URL}/`)
    list.splice(eventIndex + 1, 0, {
      priority: 0.8,
      route: `${URL}/news`,
      queryList: eventList
    })

    const data = new Date()
    const year = data.getFullYear()
    const month = (data.getMonth() + 1).toString().padStart(2, '0')
    const day = data
      .getDate()
      .toString()
      .padStart(2, '0')
    const hour = data.getHours()
    const minutes = data.getMinutes()

    const formatList = list.reduce((acc, cur, index, arr) => {
      const first =
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://www.sitemaps.org/schemas/sitemap/0.9 https://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">'
      const last = '\n</urlset>'

      if (index === 0) acc += first

      if (cur.queryList) {
        for (const value of cur.queryList) {
          acc += `
  <url>
    <loc>${cur.route}${value}</loc>
    <lastmod>${year}-${month}-${day}T${hour}:${minutes}:00+08:00</lastmod>
    <priority>${cur.priority}</priority>
    <changefreq>weekly</changefreq>
  </url>`
        }
      }

      if (arr.length - 1 === index) acc += last

      return acc
    }, '')

    fs.writeFile('public/sitemap.xml', formatList, 'utf-8', err => {
      if (err) throw err
    })
  } catch (err) {
    console.log('err', err)
  }
}

init()
