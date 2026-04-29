import 'vue-tel-input/dist/vue-tel-input.css'

import { createApp, h, watch, computed } from 'vue'
import VueGtag from 'vue-gtag-next'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import twind from './twind'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { apply } from 'twind'
import VueTelInput from 'vue-tel-input'
import allCountries from '@/utils/all-countries.js'
import { VueReCaptcha } from 'vue-recaptcha-v3'

import i18n from '@/configs/locales'
import { EVENT } from '@/configs/event'
import { RECAPTCHA, TODAY, POPULAR_CODE_LIST } from '@/configs'
import { useI18n } from 'vue-i18n'
import VueYtframe from 'vue3-ytframe'
import '@/assets/css/main-style.scss'
import '@/assets/css/fade-anim.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import dayjs from 'dayjs'
dayjs.extend(require('dayjs/plugin/isBetween'))

createApp({
  render: () => h(App),
  setup() {
    // 在div#app上添加網站style名稱
    document.body.classList.add('main-style-white')
    localStorage.setItem('styleColor', 'White')

    // 取得當前時間內活動(不包含常駐礦機)。
    const activeEventBg = () => {
      const eventList = EVENT.filter(item => {
        return item.id !== 'gpgMine' && TODAY.isBetween(item.deadline.before, item.deadline.end)
      })
      store.dispatch('platform/setActiveEventList', eventList)
    }

    // 網址參數存入本機(localStorage)
    const setPopularizeCode = () => {
      const searchStr = window.location.search
      const urlSearchParams = new URLSearchParams(searchStr)
      const params = Object.fromEntries(urlSearchParams.entries())

      if (!Object.keys(params)) return

      // 礦寵空投活動會帶入的參數 returnUrl, phone, email
      if (params.returnUrl) store.dispatch('platform/setReturnUrl', params.returnUrl)
      if (params.phone) store.dispatch('platform/setPhoneNumber', params.phone)
      if (params.email) store.dispatch('platform/setEmail', params.email)

      // Line登入回傳
      if (params.code && params.state === 'lineLogin') {
        sessionStorage.setItem(
          'lineLogin',
          JSON.stringify({
            code: params.code,
            state: params.state
          })
        )
      }

      const lineLoginBackPage = JSON.parse(sessionStorage.getItem('lineLoginBackPage'))
      if (lineLoginBackPage) {
        const { returnRoute, query, routeParams } = lineLoginBackPage
        router.push({
          name: returnRoute,
          params: { ...routeParams },
          query: { ...query }
        })
      }

      // yahoo登入回傳
      if (params.code && params.state === 'login') {
        sessionStorage.setItem(
          'yahooLogin',
          JSON.stringify({
            code: params.code,
            state: params.state
          })
        )
      }

      const yahooLoginBackPage = JSON.parse(sessionStorage.getItem('yahooLoginBackPage'))
      if (yahooLoginBackPage) {
        const { returnRoute, query, routeParams } = yahooLoginBackPage
        router.push({
          name: returnRoute,
          params: { ...routeParams },
          query: { ...query }
        })
      }

      // apple登入回傳
      if (params.code && params.state === 'appleLogin') {
        sessionStorage.setItem(
          'appleLogin',
          JSON.stringify({
            code: params.code,
            state: params.state
          })
        )
      }

      const appleLoginBackPage = JSON.parse(sessionStorage.getItem('appleLoginBackPage'))
      if (appleLoginBackPage) {
        const { returnRoute, query, routeParams } = appleLoginBackPage
        router.push({
          name: returnRoute,
          params: { ...routeParams },
          query: { ...query }
        })
      }

      // popularizeCode 邀請碼與推廣碼
      const newVal = {}
      for (const key of Object.keys(params)) {
        if (!POPULAR_CODE_LIST.includes(key)) continue
        newVal[key] = params[key]
      }

      // 當未有任何新增數值時則直接離開。
      if (!Object.keys(newVal).length) return false

      const oldVal = localStorage.getItem('popularizeCode') ? JSON.parse(localStorage.getItem('popularizeCode')) : {}
      const popularize = JSON.stringify({ ...oldVal, ...newVal })
      localStorage.setItem('popularizeCode', popularize)
    }

    const setVuexPopilarizeCode = () => {
      const trage = localStorage.getItem('popularizeCode') ? JSON.parse(localStorage.getItem('popularizeCode')) : {}

      // 寫入介紹碼至store提供畫面使用(MGM:introduction)與推廣碼(AGM:promote, introduce)
      for (const key of Object.keys(trage)) {
        if (key.introduction) store.commit('login/SET_MGM_CODE', key.introduction)
        if (key.promote) store.commit('login/SET_AGM_CODE', key.promote)
        if (key.introduce) store.commit('login/SET_AGM_CODE', key.introduce)
      }
    }

    // 語系設定
    const { locale } = useI18n()
    const lang = computed(() => store.state.member.languageCode)
    watch(lang, val => {
      locale.value = val
      store.dispatch('game/setGameList')
    })
    const info = computed(() => store.state.member.info)
    watch(info, (newVal, oldVal) => {
      if (oldVal) store.dispatch('member/setSiteLocale')
    })

    const init = async () => {
      await store.dispatch('member/setSiteLocale')
      await store.dispatch('game/setGameList')
      locale.value = lang.value
      activeEventBg()
      setPopularizeCode()
      setVuexPopilarizeCode()

      // 網站基礎全部載入完畢：isWebSiteInitReady=true
      await store.dispatch('platform/setWebSiteInitReady', true)
    }

    init()
  }
})
  .mixin({
    data() {
      return {
        transitionBase: apply`transition-all duration-500 ease-in-out`
      }
    }
  })
  .use(i18n)
  .use(VueReCaptcha, {
    siteKey: RECAPTCHA.siteKey,
    loaderOptions: { autoHideBadge: true }
  })
  .use(VueGtag, {
    property: {
      id: process.env.VUE_APP_GA_ID
    }
  })
  .use(store)
  .use(router)
  .use(twind)
  .use(ElementPlus)
  .use(VueYtframe)
  .use(VueTelInput, {
    allCountries: allCountries.reduce((acc, cur) => {
      if (!acc.includes(cur.dialCode)) return acc
      acc[acc.findIndex(item => item === cur.dialCode)] = cur
      return acc
    }, process.env.VUE_APP_PHONE_COUNTRIES.split(',')),
    defaultCountry: JSON.parse(process.env.VUE_APP_PHONE),
    showFlags: false,
    inputOptions: {
      autocomplete: 'off'
    },
    dropdownOptions: {
      showDialCodeInSelection: true
    }
  })
  .directive('audio', {
    mounted(el, binding) {
      el.addEventListener('click', async () => {
        if (binding.value === 'none') return
        const audio = await store.dispatch('audio/getAudioPlayer', binding.value)
        if (store.state.audio.isPlaySound && audio) {
          audio.currentTime = 0
          audio.play()
        }
      })
    },
    unmounted(el) {
      const onClick = el.customOnClick
      el.removeEventListener('click', onClick)
    }
  })
  .directive('fade', {
    mounted(el, binding) {
      const direction = binding.value || 'up'
      el.classList.add('fade-start')
      // 根據方向加不同 class
      switch (direction) {
        case 'up':
          el.classList.add('fade-up-start')
          break
        case 'down':
          el.classList.add('fade-down-start')
          break
        case 'left':
          el.classList.add('fade-left-start')
          break
        case 'right':
          el.classList.add('fade-right-start')
          break
        case 'opacity':
          el.classList.add('fade-opacity-start')
          el.classList.add('fade-opacity-start')
          break
        default:
          el.classList.add('fade-up-start')
      }

      const observer = new IntersectionObserver(entries => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          el.classList.add('fade-in')
          observer.unobserve(el)
        }
      })

      observer.observe(el)
    }
  })
  .mount('#app')
