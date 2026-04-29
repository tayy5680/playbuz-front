import { createRouter, createWebHistory } from 'vue-router'
import { getRoutes } from './routes'
import store from '@/store'
import { trackRouter } from 'vue-gtag-next'

import i18n from '@/configs/locales'
const {
  global: { t }
} = i18n
const routes = getRoutes()

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    const target = {
      top: 0,
      left: 0,
      behavior: 'smooth'
    }
    // 客服中心Q&A開關選項時不觸發置頂
    if ((to.name === 'service' || from.name === 'service') && to.query.index) return
    // 打開禮包不觸發置頂
    if (
      to.name === 'deposit' &&
      from.name === 'deposit' &&
      ['depositPageType', 'depositPageClass'].every(key => from.params?.[key] === to.params?.[key])
    )
      return

    // todo: 觸發原不詳，主要是為了解決ios 15.4下部份渲染完成後，未能正確時機觸發置頂。
    setTimeout(() => {
      document.querySelector('#app').scrollTo(target)
    }, 100)
  }
})

router.beforeEach((to, from, next) => {
  // 偵測是否維護中
  store.dispatch('platform/fetchMaintenanceStatus')

  // 需要登入畫面但未登入時則轉跳至首頁 與 當頁面為訪客無法進入實則轉跳至首頁。
  if ((to.meta.isLogin && !store.state.member.info) || (to.meta.nonGuest && store.state.member.info.IsGuest))
    next({ name: 'home' })
  else next()

  document.title = to.meta.title
    ? `${t(process.env.VUE_APP_SITE_NAME)} - ${t(to.meta.title)}`
    : t(process.env.VUE_APP_SITE_NAME)
})

trackRouter(router, {
  template(to) {
    return {
      page_title: to.meta.title
        ? `${t(process.env.VUE_APP_SITE_NAME)} - ${t(to.meta.title)}`
        : t(process.env.VUE_APP_SITE_NAME),
      page_path: to.path
    }
  }
})

export default router
