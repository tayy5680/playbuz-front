<template>
  <viewAudio />
  <div class="app-bg" :class="tw(['fixed', 'top-0', 'left-0', 'h-screen', 'w-full', 'z--1', 'bg-bg'])">
    <div
      class="bg"
      :class="tw(['h-screen', 'w-full', 'bg-no-repeat', 'bg-cover', 'bg-center'])"
      style="background-image: url(/img/activity/2026white_bg.png);"
    ></div>
  </div>
  <div class="wrap" :class="tw(['w-screen', 'md:min-h-full', 'flex', 'flex-col', 'h-auto'])">
    <viewHeader v-if="!route.meta.nonHeader" />
    <div
      class="container"
      ref="viewContainer"
      :class="
        tw([
          { 'pt-[75px]': !route.meta.nonHeader },
          'w-full',
          'flex',
          'mx-auto',
          { 'max-w-[1200px]': !route.meta.widthFull },
          'flex-1',
          'flex-col',
          'md:flex-row',
          { 'mb-30px': !route.meta.nonFooter },
          'justify-center',
          { 'min-h-[100svh]': isMobile }
        ])
      "
    >
      <div id="mobileMenu"></div>
      <viewAside v-if="!route.meta.nonAside" />
      <el-config-provider :locale="locale">
        <div
          :class="
            tw([
              'flex-1',
              'flex-grow',
              'w-full',
              'max-w-full',
              'mt-[18px]',
              { 'md:max-w-[calc(100svw-234px)] md:pr-5': !route.meta.widthFull }
            ])
          "
        >
          <router-view />
        </div>
      </el-config-provider>
    </div>
    <viewFooter v-if="!route.meta.nonFooter" />
  </div>

  <!-- 礦寵 -->
  <mineView v-if="mineUrl" />

  <!-- 遮罩 -->
  <teleport to="body">
    <transition name="fade">
      <div
        class="cover"
        v-if="isCover"
        :class="tw(['fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-bg', 'bg-opacity-80', 'z-mask'])"
      ></div>
    </transition>
  </teleport>

  <!-- 轉帳(錢包、紀錄) -->
  <viewWallet v-if="enableWallet" />
  <viewRecord v-if="enableRecord" />
  <!-- root component -->
  <viewChatRoom v-if="enableTalk" />
  <viewDrawer v-if="drawerState" />
  <viewEvent />
  <!-- 客服 暫時關閉  -->
  <!-- <viewService /> -->
  <viewShortcut v-if="!isSiteMaintenance" />
  <teleport to="body" class="balance-bg">
    <viewBalance v-if="enableBalance" :class="tw(['fixed', 'top-1/2', 'left-1/2', '-translate-1/2', 'z-30'])" />
  </teleport>
  <div
    class="loadingHtml"
    v-if="displayLoadingHtml"
    :class="
      tw(['fixed', 'top-0', 'left-0', 'z-50', 'w-full', 'h-full', 'bg-black', 'flex', 'items-center', 'justify-center'])
    "
    v-html="loadingElementHtml"
  ></div>
</template>

<script>
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import store from '@/store'

  import viewDrawer from '@/components/viewDrawer'
  import viewHeader from '@/components/header'
  import viewAside from '@/components/aside'
  import viewFooter from '@/components/footer'
  import viewChatRoom from '@/components/chatRoom'
  import viewEvent from '@/components/viewEvent'
  import viewShortcut from '@/components/shortcut'
  import viewBalance from '@/components/view-balance'
  import mineView from '@/components/mine-view'

  import viewWallet from '@/components/view-balance/wallet'
  import viewRecord from '@/components/view-balance/record'
  import viewAudio from '@/components/audio'

  import { ElMessageBox } from 'element-plus'
  import { buildLoadingHTML } from '@/utils/game-open-process'
  import zhTW from 'element-plus/lib/locale/lang/zh-tw'
  import { postTokenRefreshToken } from '@/api/member'
  import { setToken } from '@/utils'
  import { useNotice } from '@/utils/use-notice'
  import { useI18n } from 'vue-i18n'
  import dayjs from 'dayjs'
  dayjs.extend(require('dayjs/plugin/isBetween'))

  export default {
    components: {
      viewChatRoom,
      viewDrawer,
      viewEvent,
      // 客服 暫時關閉
      // viewService,
      viewShortcut,
      viewBalance,
      mineView,
      viewAudio,
      viewHeader,
      viewAside,
      viewFooter,
      viewWallet,
      viewRecord
    },

    setup() {
      const transition = ref(true)

      const route = useRoute()
      const router = useRouter()
      const { t } = useI18n()
      const drawerState = computed(() => store.getters['sign/drawerState'])
      const isLogin = computed(() => store.getters['member/isLogin'])
      const info = computed(() => store.state.member.info)
      const name = computed(() => info.value?.NickName)
      const enableBalance = computed(() => store.state.wallet.enableBalance)
      const mineUrl = computed(() => store.state.game.mine.url)
      const lineLoginType = sessionStorage.getItem('lineLoginType')
      const yahooLoginType = sessionStorage.getItem('yahooLoginType')
      const appleLoginType = sessionStorage.getItem('appleLoginType')
      const lineLoginBackPage = JSON.parse(sessionStorage.getItem('lineLoginBackPage'))
      const yahooLoginBackPage = JSON.parse(sessionStorage.getItem('yahooLoginBackPage'))
      const appleLoginBackPage = JSON.parse(sessionStorage.getItem('appleLoginBackPage'))
      const enableRecord = computed(() => store.state.wallet.enableRecord)
      const enableWallet = computed(() => store.state.wallet.enableWallet)
      const isSiteMaintenance = computed(() => store.state.platform.isSiteMaintenance)
      const maintenanceInterval = ref(null)

      const locale = zhTW

      const displayLoadingHtml = computed(() => store.state.platform.displayLoadingHtml)
      const loadingElementHtml = ref('')

      //  loginProxy 登入流程後回調
      watch(
        info,
        (newInfo, old) => {
          if (!old && newInfo && !newInfo.IsGuest) {
            const hookProcess = sessionStorage.getItem('handleLoginProcedure')
            if (hookProcess) {
              store.dispatch('sign/loginProxy', JSON.parse(hookProcess))
            }
          }
        },
        { deep: true }
      )

      const infoUrlParamLogin = async () => {
        const tokenList = JSON.parse(localStorage.getItem('userToken'))
        const timeStamp = JSON.parse(localStorage.getItem('userTokenTimeStamp'))
        const isAfterWeek = dayjs().isAfter(dayjs.unix(timeStamp).add(7, 'day'))

        // RefreshToken 的條件
        // (tokenList 須同時包含access_token、ids_token、refresh_token)
        if (tokenList && (tokenList.length !== 3 || !timeStamp || isAfterWeek)) {
          try {
            const response = await postTokenRefreshToken({
              refresh_token: tokenList[1]
            })
            await setToken(response)
          } catch {
            useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
          }
        }

        // Line登入回傳 預防使用者登入後重新整理頁面，故多判斷 info.value
        if (info.value === null || info.value.Roles.includes('Guest')) {
          logIn()
        } else {
          let lineParamD = sessionStorage.getItem('lineLogin') ? JSON.parse(sessionStorage.getItem('lineLogin')) : {}
          let yahooParamD = sessionStorage.getItem('yahooLogin') ? JSON.parse(sessionStorage.getItem('yahooLogin')) : {}
          let appleParamD = sessionStorage.getItem('appleLogin') ? JSON.parse(sessionStorage.getItem('appleLogin')) : {}
          // 有帳號並綁定line
          if (lineLoginBackPage && lineLoginType === 'edit') {
            useNotice({ type: 'info', message: '綁定中，請稍候' })
            bindLine(lineParamD)
          }
          if (yahooLoginBackPage && yahooLoginType === 'edit') {
            useNotice({ type: 'info', message: '綁定中，請稍候' })
            bindYahoo(yahooParamD)
          }
          if (appleLoginBackPage && appleLoginType === 'edit') {
            useNotice({ type: 'info', message: '綁定中，請稍候' })
            bindApple(appleParamD)
          }
        }
        await store.dispatch('member/logIn')
        // 檢查暱稱
        store.dispatch('member/pathNickname')

        // 網址內是否包含須自動彈出之活動名稱
        eventAction()

        // 當使用者身份為未登入或身份為訪客時，若網址包含returnUrl
        // returnUrl 取得情境：礦寵空投、CofunLIVE的登入參數)
        if (store.state.platform.returnUrl) {
          // 訪客或未登入：登入介面
          if (info.value === null || info.value?.IsGuest) {
            store.commit('sign/UPDATE_DRAWER_STATE', true)
            store.commit('sign/UPDATE_IS_DREWER_SHOW_GUEST', false)
          }
          // 已登入：跳轉returnUrl
          else store.dispatch('platform/redirectToReturnUrl')

          const url = new URL(window.location.href)
          url.searchParams.delete('returnUrl')
          window.history.replaceState(null, '', url.toString())
        }

        // 當帳號代理相關時則直接清空推廣代碼不寫入。
        if (info.value?.Roles.includes('Agent')) {
          localStorage.removeItem('popularizeCode')
          return false
        }

        // #region 邀請碼/推廣碼/三方登入
        const field = JSON.parse(localStorage.getItem('popularizeCode'))
        if (!field) return false

        // 濾出網址是否有包含註冊相關，有的話就彈出註冊視窗
        const urlSearchParams = new URLSearchParams(location.search)
        const params = Object.fromEntries(urlSearchParams.entries())

        // 可用三方清單
        const THIRD_LIST = ['jkf']

        if (field.third && THIRD_LIST.includes(params.third)) {
          if (info.value) {
            if (info.value.Roles.includes('Normal')) store.commit('sign/UPDATE_DRAWER_STEP', 'ThreadAward')
            if (!info.value.Roles.includes('Guest')) {
              const query = JSON.parse(JSON.stringify(route.query))
              delete query.third
              router.replace(query)
              return false
            }
          } else store.commit('sign/UPDATE_DRAWER_STEP', 'third')
        } else if (field.introduce || field.introduction || field.promote) {
          if (info.value) {
            if (info.value.Roles.includes('Invitee')) return false
            if (info.value.Roles.includes('Normal')) {
              store.commit('sign/UPDATE_DRAWER_STEP', 'ThreadAward')
            }
          }
          if (info.value && info.value.Roles.includes('Invitee')) return false
          if (info.value && info.value.Roles.includes('Normal')) {
            store.commit('sign/UPDATE_DRAWER_STEP', 'ThreadAward')
          }
        } else return false
        store.commit('sign/UPDATE_DRAWER_STATE', true)
      }
      // 當main.js跑完才執行的內容
      const isWebSiteInitReady = computed(() => store.state.platform.isWebSiteInitReady)
      watch(isWebSiteInitReady, val => {
        if (val) infoUrlParamLogin()
      })

      // 網址內是否包含須自動彈出之活動名稱
      const eventAction = async () => {
        if (!route.query.event) return false

        const EVENT_LIST = ['mine']

        if (EVENT_LIST.includes(route.query.event)) {
          if (route.query.event === 'mine') {
            loadingElementHtml.value = await buildLoadingHTML()
            store.dispatch('sign/loginProxy', { binding: true, action: 'goMine' })
          } else store.dispatch('sign/loginProxy', { binding: true, action: 'goEvent', event: route.query.event })
        }

        const query = JSON.parse(JSON.stringify(route.query))
        delete query.event
        router.replace(query)
      }

      watch(info, bol => {
        if (!bol && route.name && !route.meta.isLogin) router.replace({ name: 'home' })
      })

      // Line登入流程
      const lineLoginApi = async params => {
        const data = {
          code: params.code,
          state: params.state,
          device: store.state.platform.deviceInfo
        }
        await store.dispatch('login/actionLineSignIn', data).then(res => {
          if (res.Status.Code === '0') {
            setToken(res)
            store.dispatch('member/logIn', JSON.parse(localStorage.getItem('userToken')))
            if (lineLoginBackPage && lineLoginType === 'edit') {
              useNotice({ type: 'info', message: '綁定成功' })
            }
          }
        })
      }

      // yahoo登入流程
      const yahooLoginApi = async params => {
        const data = {
          code: params.code,
          state: params.state,
          device: store.state.platform.deviceInfo
        }
        await store.dispatch('login/actionYahooSignIn', data).then(res => {
          if (res.Status.Code === '0') {
            setToken(res)
            store.dispatch('member/logIn', JSON.parse(localStorage.getItem('userToken')))
            if (yahooLoginBackPage && yahooLoginType === 'edit') {
              useNotice({ type: 'info', message: '綁定成功' })
            }
          }
        })
      }

      // apple登入流程
      const appleLoginApi = async params => {
        const data = {
          code: params.code,
          state: params.state,
          device: store.state.platform.deviceInfo
        }
        await store.dispatch('login/actionAppleSignIn', data).then(res => {
          if (res.Status.Code === '0') {
            setToken(res)
            store.dispatch('member/logIn', JSON.parse(localStorage.getItem('userToken')))
            if (appleLoginBackPage && appleLoginType === 'edit') {
              useNotice({ type: 'info', message: '綁定成功' })
            }
          }
        })
      }

      // Line, yahoo, apple登入流程
      const logIn = async () => {
        let lineParamD = sessionStorage.getItem('lineLogin') ? JSON.parse(sessionStorage.getItem('lineLogin')) : {}
        let yahooParamD = sessionStorage.getItem('yahooLogin') ? JSON.parse(sessionStorage.getItem('yahooLogin')) : {}
        let appleParamD = sessionStorage.getItem('appleLogin') ? JSON.parse(sessionStorage.getItem('appleLogin')) : {}

        try {
          store.commit('sign/UPDATE_DRAWER_STATE', true)
          store.commit('sign/UPDATE_LOGIN', true)
          if (window.location.href.includes('lineLogin') && !!Object.keys(lineParamD).length) {
            useNotice({ type: 'info', message: '登入中，請稍候' })
            await lineLoginApi(lineParamD)
          }
          if (window.location.href.includes('yahoo_callback') && !!Object.keys(yahooParamD).length) {
            useNotice({ type: 'info', message: '登入中，請稍候' })
            await yahooLoginApi(yahooParamD)
          }
          if (window.location.href.includes('appleLogin') && !!Object.keys(appleParamD).length) {
            useNotice({ type: 'info', message: '登入中，請稍候' })
            await appleLoginApi(appleParamD)
          }
          store.commit('sign/UPDATE_LOGIN', false)
          store.commit('sign/UPDATE_DRAWER_STATE', false)
        } catch {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        } finally {
          if (window.location.href.includes('lineLogin')) {
            sessionStorage.removeItem('lineLogin')
          }
          if (window.location.href.includes('yahoo_callback')) sessionStorage.removeItem('yahooLogin')
          if (window.location.href.includes('appleLogin')) sessionStorage.removeItem('appleLogin')
          store.commit('sign/UPDATE_LOGIN', false)
        }
      }
      // Line綁定流程
      const bindLine = async params => {
        try {
          lineLoginApi(params)
        } catch {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        } finally {
          sessionStorage.removeItem('lineLoginBackPage')
          sessionStorage.removeItem('lineLoginType')
        }
      }

      // yahoo綁定流程
      const bindYahoo = async params => {
        try {
          yahooLoginApi(params)
        } catch {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        } finally {
          sessionStorage.removeItem('yahooLoginBackPage')
          sessionStorage.removeItem('yahooLoginType')
        }
      }

      // apple綁定流程
      const bindApple = async params => {
        try {
          appleLoginApi(params)
        } catch {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        } finally {
          sessionStorage.removeItem('appleLoginBackPage')
          sessionStorage.removeItem('appleLoginType')
        }
      }

      const lang = computed(() => store.state.member.languageCode)

      // 維護頁面跳轉
      watch(isSiteMaintenance, val => {
        if (val) router.push('/Mainenance')
      })
      // 初始化
      const init = async () => {
        // 檢測網站是否維護中
        try {
          // 每三分鐘檢測是否進入維護狀態
          maintenanceInterval.value = setInterval(async () => {
            await store.dispatch('platform/fetchMaintenanceStatus')
          }, 3 * 60 * 1000)
          store.dispatch('platform/fetchMaintenanceStatus')
          if (isSiteMaintenance.value) return
        } catch (e) {}

        // 取得使用者的資訊
        const infoObj = localStorage.getItem('info')
        if (infoObj) store.dispatch('member/setInfo', JSON.parse(infoObj))
        // 紀錄活動以及登入資格 (打開礦寵使用)
        sessionStorage.removeItem('handleLoginProcedure')
        // 取得使用者裝置
        store.dispatch('platform/setDeviceInfo')
        // 取得彈跳佈告欄和活動
        store.dispatch('event/initEventList')
        // 取得活動是否有未完成動作 (前端需提示紅點)
        if (store.state.member.info && !store.state.member.info.Roles.includes('Guest'))
          store.dispatch('event/setReceiveObject')
      }

      const isCover = computed(() => store.state.platform.cover)

      const isMobile = computed(() => store.getters['platform/isMobile'])

      const enableTalk = computed(() => store.state.platform.enableTalk)
      watch(enableTalk, bol => {
        const time = bol ? hightIntervalChatListTime : lowIntervalChatListTime
        setIntervalChatList(time)
      })

      // 取得聊天清單(預設40秒叫一次但當開啟聊天室時則10秒一次)
      const lowIntervalChatListTime = 40000
      const hightIntervalChatListTime = 10000
      let chatListTimer = null
      let walletTimer = null

      const setIntervalChatList = (time = lowIntervalChatListTime) => {
        clearInterval(chatListTimer)
        if (!isLogin.value) return false
        store.dispatch('platform/setChatRoomLis')
        store.dispatch('platform/setFriendList')
        store.dispatch('platform/setFriendCheckList')
        chatListTimer = setInterval(() => {
          if (!isLogin.value) return clearInterval(chatListTimer)
          store.dispatch('platform/setChatRoomLis')
          store.dispatch('platform/setFriendList')
          store.dispatch('platform/setFriendCheckList')
        }, time)
      }

      // 取得錢包與遊戲錢包
      const setIntervalWallet = (updateSec = 10) => {
        clearInterval(walletTimer)
        if (!isLogin.value) return false
        store.dispatch('wallet/updateAllWallet')
        walletTimer = setInterval(() => {
          if (!isLogin.value) return clearInterval(walletTimer)
          // 排程不呼叫遊戲商 只更新主錢包
          store.dispatch('wallet/updateAllWallet', false)
        }, updateSec * 1000)
      }
      watch(lang, () => {
        store.dispatch('wallet/updateAllWallet')
        document.title = route.meta.title
          ? `${t(process.env.VUE_APP_SITE_NAME)} - ${t(route.meta.title)}`
          : t(process.env.VUE_APP_SITE_NAME)
      })

      watch(
        () => route.name,
        async n => {
          if (route.name === 'home') {
            transition.value = true
          } else {
            transition.value = false
          }
          store.dispatch('platform/setPage', n)
        }
      )

      const deferredPrompt = ref(null)
      onMounted(() => {
        init()
        setIntervalChatList()
        setIntervalWallet(25)

        window.addEventListener('beforeinstallprompt', e => {
          // console.log('符合安裝條件！')
          if (localStorage.getItem('beforeinstallprompt')) return
          localStorage.setItem('beforeinstallprompt', 'true')
          e.preventDefault()
          deferredPrompt.value = e
        })

        // 長寬偵測
        window.addEventListener('resize', () => {
          store.dispatch('platform/updateScreen')
        })
      })

      onUnmounted(() => {
        window.removeEventListener('resize', () => {
          store.dispatch('platform/updateScreen')
        })
        clearInterval(maintenanceInterval.value)
      })

      const showInstallPromptButton = () => {
        if (!deferredPrompt.value) return
        ElMessageBox.confirm(
          t('是否將{name}安裝到桌面?', { name: t(process.env.VUE_APP_SITE_NAME) }),
          t('安裝應用程式'),
          {
            confirmButtonText: t('安裝'),
            cancelButtonText: t('取消'),
            type: 'info'
          }
        )
          .then(() => {
            if (deferredPrompt.value) {
              deferredPrompt.value.prompt()
              deferredPrompt.value.userChoice.then(() => {
                deferredPrompt.value = null
              })
            } else ElMessageBox.close()
          })
          .catch(() => {
            ElMessageBox.close()
          })
      }
      const isShowInstallPrompt = computed(() => deferredPrompt.value && isWebSiteInitReady.value)
      watch(isShowInstallPrompt, val => {
        if (val) showInstallPromptButton()
      })

      watch(isLogin, bol => {
        if (bol) {
          setIntervalChatList()
          setIntervalWallet(25)
        }
      })

      watch(enableBalance, bol => {
        store.dispatch('platform/setCover', bol)
      })
      watch(isMobile, () => {
        store.dispatch('wallet/setEnableBalance', false)
        store.dispatch('wallet/setEnableRecord', false)
        store.dispatch('wallet/setEnableWallet', false)
      })

      return {
        displayLoadingHtml,
        loadingElementHtml,
        locale,
        route,
        isCover,
        isMobile,
        drawerState,
        name,
        enableTalk,
        enableBalance,
        mineUrl,
        enableWallet,
        enableRecord,
        transition,
        isSiteMaintenance
      }
    }
  }
</script>

<style lang="scss">
  #app {
    overscroll-behavior: contain;
    position: fixed;
    top: 0;
    left: 0;
    overflow-x: hidden;
    width: 100svw;
    height: 100svh;
    font-family: 'Noto Sans TC', Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    //滾動條設置
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */

    input,
    button {
      &:focus,
      &:active,
      &:hover {
        outline: none !important;
        box-shadow: none !important;
      }
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    input[type='number'] {
      -moz-appearance: textfield;
    }

    .el-skeleton__image {
      svg {
        fill: #8d8d8d;
      }
    }
  }

  /* Chrome、Safari 和 Opera 的滚动条 */
  ::-webkit-scrollbar {
    display: none;
  }

  .slide-enter-active,
  .slide-leave-active {
    z-index: 999;
    transition: all 0.3s ease-in-out;
  }

  .slide-enter-from,
  .slide-leave-to {
    opacity: 0.2;
    transform: translateY(100%);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.46s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: all 0.26s ease-in-out;
  }

  .fade-scale-enter-to,
  .fade-scale-leave-from {
    opacity: 1;
    transform: scale(1);
  }

  .fade-scale-enter-from,
  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.6);
  }

  .pop-view-enter-active,
  .pop-view-leave-active {
    transition: all 0.36s cubic-bezier(0.4, 0.34, 0.16, 1.78);
  }

  .pop-view-enter-from,
  .pop-view-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.4) !important;
    filter: blur(10px) grayscale(0%);
  }

  .page-enter-active,
  .page-leave-active,
  .page-x-enter-active,
  .page-x-leave-active {
    position: absolute;
    z-index: 999;
    width: 100%;
    transition: all 0.83s ease-in-out;
  }

  .page-enter-to,
  .page-leave-from {
    opacity: 1;
    transform: translateX(0);
  }

  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }

  .page-x-enter-to,
  .page-x-leave-from {
    opacity: 1;
    transform: translateY(0);
  }

  .page-x-enter-from,
  .page-x-leave-to {
    opacity: 0;
    transform: translateY(100%);
  }

  .expand-enter-active,
  .expand-leave-active {
    overflow: hidden;
    transition: height 1s ease-in-out;
  }

  .expand-enter,
  .expand-leave-to {
    height: 0;
  }

  // el-skeleton 客制樣式
  .el-skeleton {
    --el-skeleton-color: #e5e5e5 !important;
    --el-skeleton-to-color: #f6f6f6 !important;
    --el-svg-monochrome-grey: #7c7ed7 !important;
  }

  // use-notice ElMessage 客制樣式
  .el-message {
    $message-padding: 13px;
    $message-icon-size: 26px;
    $message-icon-gpg-size: 30px;

    top: 100% !important;
    left: 0 !important;
    transform: translate(calc(50svw - 50%), calc(-100% - 20px)) !important;
    min-width: 200px !important;
    max-width: 90svw;

    &.el-message-fade-enter-from,
    &.el-message-fade-leave-to {
      transform: translate(calc(50svw - 50%), -20px) !important;
    }

    .el-message__icon {
      display: none;
    }

    .new-content {
      display: flex;
      align-items: center;
      width: 100%;
    }

    .new-content__text {
      display: block;
      margin-left: 27px;
      font-size: 18px;
      color: #fff;
      word-break: break-all;
    }

    &.el-message--success,
    &.el-message--info,
    &.el-message--error {
      padding: $message-padding;
      border-radius: 10px;
    }

    &.el-message--success,
    &.el-message--info {
      background-color: #6a13bf;
      border: 0;
      box-shadow: 0 0 12px #0006;
    }

    &.el-message--error {
      background-color: #d61a5a;
      border: 0;
      box-shadow: 0 0 12px #0006;
    }
  }

  // v-loading custom css
  body {
    overscroll-behavior: contain;

    .el-loading-mask {
      background: transparent;
    }

    .el-loading-text {
      color: #b5b2a4 !important;
    }

    .el-loading-spinner {
      .path {
        stroke-width: 5;
        stroke-linecap: round;
        stroke: #b5b2a4;
      }
    }

    // // el-loading-整個頁面
    // .is-fullscreen {
    //   margin-top: 10svh;
    //   margin-left: 300px;

    //   .el-loading-spinner {
    //     top: calc((100svh - 10svh) / 2);

    //     @include md-up {
    //       right: calc((100svw - 300px) / 2);
    //       width: auto !important;
    //     }
    //   }
    // }
  }

  .EL-LOADING-CONTENT {
    .el-loading-spinner {
      margin: auto;
    }
  }

  // table type
  .data-table-overflow {
    overflow-x: auto;
  }

  .data-table {
    overflow: hidden;
    min-width: 500px;
    background: #242424;
    border-radius: 6px 6px 0 0;

    & th,
    & td {
      padding: 12px;
      text-align: center;
      border: 1px solid #484848;
    }

    & th {
      background: #3d215b;
    }

    & td {
      color: #ffde72;
    }

    & tr:nth-child(odd) td:nth-child(1),
    & tr:nth-child(odd) td:nth-child(2) {
      background: #343434;
    }

    @media screen and (max-width: 480px) {
      min-width: 400px;

      & th:nth-child(1),
      & td:nth-child(1) {
        width: 69px;
      }

      & th:nth-child(2),
      & td:nth-child(2) {
        width: 120px;
      }

      & th:nth-child(3),
      & td:nth-child(3) {
        width: 100px;
      }

      & th:nth-child(4),
      & td:nth-child(4) {
        width: 110px;
      }
    }
  }
</style>
