/**
 * @param {boolean} nonAside - 不顯示左方選單
 * @param {boolean} nonHeader - 不顯示上方header
 * @param {boolean} nonFooter - 不顯示下方footer
 * @param {boolean} nonHeaderZone - header無高度(桌上裝置)
 * @param {boolean} mobileNonHeaderZone - header無高度(行動裝置)
 * @param {boolean} mobileNonMenu - 不顯示上方menu(行動裝置)
 * @param {boolean} isLogin - 登入狀態下才能進入
 * @param {boolean} nonGuest - 訪客不能進入
 * @param {boolean} widthFull - 寬度全版面
 */
const nonAside = true
const nonHeader = true
const nonFooter = true
const nonHeaderZone = true
const mobileNonMenu = true
const isLogin = true
const nonGuest = true
const widthFull = true

const routes = [
  {
    path: '/mainenance',
    name: 'mainenance',
    component: () => import('@/views/mainenance'),
    meta: { title: '網站維護中', mobileNonMenu, nonAside, nonHeader, nonFooter, nonHeaderZone, widthFull }
  },
  // { path: '/', name: 'home', component: () => import('@/views/home'), meta: { mobileNonMenu, } },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/playbuz-home'),
    meta: { nonAside, widthFull, nonFooter }
  },
  {
    path: '/guide/cofunlive/:pageId',
    name: 'guide',
    component: () => import('@/views/guide'),
    meta: { title: '相關教學', nonAside, widthFull, nonFooter }
  },
  // {
  //   path: '/twitter',
  //   name: 'twitter',
  //   component: () => import('@/views/twitter'),
  //   meta: { title: '推特', mobileNonMenu }
  // },
  // { path: '/rank', name: 'rank', component: () => import('@/views/rank'), meta: { title: '排行榜', mobileNonMenu } },
  {
    path: '/game/:gameType?/:gameClass?',
    name: 'game',
    component: () => import('@/views/game'),
    meta: { title: '熱門遊戲' }
  },
  // { path: '/store', name: 'store', component: () => import('@/views/store'), meta: { title: '門市據點' } },
  {
    path: '/game/detail/:gameType?/:gameID',
    name: 'game/detail',
    component: () => import('@/views/game-detail'),
    meta: { title: '遊戲詳細', nonHeaderZone }
  },
  {
    path: '/deposit/:depositPageType?/:depositPageClass?/:depositPackageGroupID?',
    name: 'deposit',
    component: () => import('@/views/deposit'),
    meta: { title: '儲值購點' }
  },
  {
    path: '/deposit-complete',
    name: 'deposit-complete',
    component: () => import('@/views/deposit/complete'),
    meta: { title: '交易處理中', nonAside, nonHeader, nonHeaderZone }
  },
  { path: '/news/:TagsName?', name: 'event', component: () => import('@/views/event'), meta: { title: '最新消息' } },
  {
    path: '/news/:TagsName/:eventID',
    name: 'event/detail',
    component: () => import('@/views/event-detail'),
    meta: { title: '最新消息' }
  },
  // {
  //   path: '/coupon/order',
  //   name: 'order',
  //   component: () => import('@/views/coupon/order'),
  //   meta: { title: '寄件資訊', nonAside, isLogin, nonGuest }
  // },
  // {
  //   path: '/coupon/onsiteqrcode',
  //   name: 'onsiteqrcode',
  //   component: () => import('@/views/coupon/onsiteqrcode'),
  //   meta: { title: '兌換', nonAside, isLogin, nonGuest }
  // },
  {
    path: '/center',
    name: 'center',
    component: () => import('@/views/center'),
    meta: { title: '會員中心', isLogin, nonGuest }
  },
  {
    path: '/center/edit',
    name: 'center/edit',
    component: () => import('@/views/center/edit'),
    meta: { title: '會員資料', isLogin }
  },
  {
    path: '/center/record',
    name: 'center/record',
    component: () => import('@/views/center/record'),
    meta: { title: '訂單', isLogin, nonGuest }
  },
  {
    path: '/center/redirectPage',
    name: 'center/redirectPage',
    component: () => import('@/views/center/redirectPage'),
    meta: { title: '跳轉頁' }
  },
  { path: '/FAQ/:faqTypeName?', name: 'FAQ', component: () => import('@/views/FAQ'), meta: { title: '常見問題' } },

  {
    path: '/userRules/:pageId?',
    name: 'userRules',
    component: () => import('@/views/user-rules'),
    meta: { title: '相關規範' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/aboutUs'),
    meta: { title: '客服中心' }
  },
  // 404
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
]

const versionDisableItem = {
  tw: ['twitter', 'store'],
  japan: ['twitter', 'store']
}

export const getRoutes = () => {
  return routes.filter(item => !versionDisableItem?.[process.env.VUE_APP_VERSION_TITLE]?.includes(item.name))
}
