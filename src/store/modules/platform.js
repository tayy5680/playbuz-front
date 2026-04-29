import { getChatRoomList, getFriendList, getFriendRecommendList, getFriendCheckList } from '@/api/chat'
import { getSystemMainenance } from '@/api/site'
import { gameLink } from '@/api/game'
import { deviceInfo, deviceType } from '@/utils/ua'
import { DEVICE_WIDTH } from '@/configs'
import { useNotice } from '@/utils/use-notice'

const state = {
  deviceInfo: '',
  cover: false,
  coverCount: 0,
  element: {
    headerHeight: 0,
    // Todo: delete
    // asideHeight: 0,
    containerWidth: 0
  },
  enableTalk: false,
  talkData: {
    chatList: {},
    checkList: {},
    friendList: [],
    recommendList: []
  },
  pageMenuList: [],
  activeEventList: [],
  returnUrl: '',
  phoneNumber: '',
  email: '',
  displayLoadingHtml: false,
  teleportList: [],
  site: 'playBUZ',
  loading: false,
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  isWebSiteInitReady: false,
  isSiteMaintenance: false,
  siteMaintenanceData: null
}

const getters = {
  // 是否達到行動裝置尺寸
  isMobile: state => state.screenWidth < 768,
  // isMobile: state => state.element.containerWidth < DEVICE_WIDTH.mobile,
  isTablet: state =>
    state.element.containerWidth >= DEVICE_WIDTH.mobile && state.element.containerWidth <= DEVICE_WIDTH.tablet,
  // 將好友與待確認名單合併
  isformatFriend: state => {
    return state.talkData.friendList.length > 0 || state.talkData.checkList.length > 0
      ? state.talkData.friendList.concat(state.talkData.checkList)
      : {}
  }
}

const mutations = {
  SET_DEFAULT(state) {
    state.cover = false
    state.coverCount = 0
    state.enableTalk = false
    state.talkData = {
      chatList: {},
      friendList: []
    }
    state.returnUrl = ''
    state.email = ''
    state.phoneNumber = ''
    state.displayLoadingHtml = false
    state.teleportList = []
  },

  SET_COVER(state, payload) {
    const count = state.coverCount > 0
    state.cover = count
    // 當遮罩計數器小於0時，則初始為0
    if (!count) state.coverCount = 0

    const app = document.body.querySelector('#app')

    app.style.position = count ? 'static' : ''
    document.body.style.overflow = count ? 'hidden' : ''
  },

  SET_ADD_COVER(state) {
    state.coverCount++
  },

  SET_REMOVE_COVER(state) {
    state.coverCount--
  },

  SET_ELEMENT_HEADER_HEIGHT(state, payload) {
    state.element.headerHeight = payload
  },

  // Todo: delete
  SET_ELEMENT_ASIDE_HEIGHT(state, payload) {
    state.element.asideHeight = payload
  },

  SET_ELEMENT_CONTAINER_WIDTH(state, payload) {
    state.element.containerWidth = payload
  },

  SET_ENABLE_TALK(state, payload) {
    state.enableTalk = payload
  },

  SET_RECOMMEND_LIST(state, payload) {
    const recommendList = payload.recommendList.Data
    if (recommendList) {
      recommendList.forEach(e => {
        const IsFriendList = state.talkData.friendList.find(item => item?.FriendID === e?.FriendID)
        if (IsFriendList) {
          e.IsFriendSate = true
        }
      })
    }
    state.talkData.recommendList = payload.recommendList
  },

  SET_FRIEND_LIST(state, payload = []) {
    payload.forEach(e => {
      e.IsFriendSate = true
    })
    state.talkData.friendList = payload
  },

  SET_CHAT_LIST(state, payload = []) {
    payload.Member.forEach(e => {
      const IsFriendSate = state.talkData.friendList.find(item => item.FriendID === e.MemberID)
      if (IsFriendSate) {
        e.IsFriendSate = true
      }
    })

    payload.Service.forEach(e => {
      e.IsFriendSate = true
    })
    state.talkData.chatList = payload
  },

  SET_CHECK_LIST(state, payload = []) {
    payload.forEach(item => {
      item.IsFriendSate = false
    })
    state.talkData.checkList = payload
  },

  SET_PAGE_MENU_LIST(state, payload = []) {
    state.pageMenuList = payload
  },

  SET_PAGE_MENU_ID(state, payload = null) {
    state.pageMenuID = payload
  },

  SET_PAGE(state, payload) {
    state.page = payload
  },

  SET_ACTIVE_EVENT_LIST(state, payload = null) {
    state.activeEventList = payload
  },

  SET_DEVICE_INFO(state, payload = '') {
    state.deviceInfo = payload
  },

  SET_RETURN_URL(state, payload) {
    state.returnUrl = payload
  },

  SET_PHONE_NUMBER(state, payload) {
    state.phoneNumber = payload
  },

  SET_EMAIL(state, payload) {
    state.email = payload
  },

  SET_DISPLAY_LOADING_HTML(state, payload) {
    state.displayLoadingHtml = payload
  },

  SET_TELEPORT_LIST(state, payload) {
    // 把最新的彈窗置頂至最前
    const index = state.teleportList.findIndex(item => item === payload)
    if (index === -1) {
      const target = new Set([payload, ...state.teleportList])
      state.teleportList = Array.from(target)
    } else state.teleportList.splice(index, 1)
  },

  SET_IS_LOADING(state, payload) {
    state.loading = payload
  },
  SET_SCREEN_WIDTH(state, payload) {
    state.screenWidth = payload
  },
  SET_SCREEN_HEIGHT(state, payload) {
    state.screenHeight = payload
  },
  SET_WEBSITE_INIT_READY(state, payload) {
    state.isWebSiteInitReady = payload
  },
  SET_IS_SITE_MAINTENCE(state, payload) {
    state.isSiteMaintenance = payload
  },
  SET_SITE_MAINTENCE_DATA(state, payload) {
    state.siteMaintenanceData = payload
  }
}

const actions = {
  async fetchMaintenanceStatus({ commit }) {
    try {
      const maintenance = await getSystemMainenance().then(res => res.Data?.Maintenances ?? [])
      // 預設狀態
      commit('SET_IS_SITE_MAINTENCE', false)
      commit('SET_SITE_MAINTENCE_DATA', null)

      if (!maintenance.length) return

      const now = new Date()
      const currentMaintenance = maintenance.find(item => {
        const start = new Date(item.StartDateTime)
        const end = new Date(item.EndDateTime)
        return now >= start && now <= end
      })
      if (currentMaintenance) {
        commit('SET_IS_SITE_MAINTENCE', true)
        commit('SET_SITE_MAINTENCE_DATA', currentMaintenance)
      }
    } catch (e) {
      commit('SET_IS_SITE_MAINTENCE', false)
      commit('SET_SITE_MAINTENCE_DATA', null)
    }
  },
  setDefault({ commit }) {
    commit('SET_DEFAULT')
  },

  setCover({ commit }, param) {
    if (param) commit('SET_ADD_COVER')
    else commit('SET_REMOVE_COVER')
    commit('SET_COVER', param)
  },

  setElementHeaderHeight({ commit }, param) {
    commit('SET_ELEMENT_HEADER_HEIGHT', param)
  },

  // Todo: delete
  setElementAsideHeight({ commit }, param) {
    commit('SET_ELEMENT_ASIDE_HEIGHT', param)
  },

  setElementContainerWidth({ commit }, param) {
    commit('SET_ELEMENT_CONTAINER_WIDTH', param)
  },

  setEnableTalk({ commit }, param) {
    commit('SET_ENABLE_TALK', param)
  },

  setRecommendList({ commit }) {
    const target = getFriendRecommendList()
    return Promise.resolve(target)
      .then(res => {
        const recommendList = {
          Data: res.Data,
          AddingQuotaPerDay: res.AddingQuotaPerDay,
          AddingQuotaLeft: res.AddingQuotaLeft,
          AddingAvailable: res.AddingAvailable
        }
        commit('SET_RECOMMEND_LIST', { recommendList })
      })
      .catch(() => {})
  },

  setChatRoomLis({ commit }) {
    const target = getChatRoomList()
    return Promise.resolve(target)
      .then(res => {
        commit('SET_CHAT_LIST', res.Data)
      })
      .catch(err => {
        console.warn(err)
      })
  },

  setFriendList({ commit }) {
    const target = getFriendList()
    return Promise.resolve(target)
      .then(res => {
        commit('SET_FRIEND_LIST', res.Data)
      })
      .catch(() => {})
  },

  setFriendCheckList({ commit }) {
    const target = getFriendCheckList()
    return Promise.resolve(target)
      .then(res => {
        commit('SET_CHECK_LIST', res.Data)
      })
      .catch(() => {})
  },

  setPageMenuList({ commit }, param) {
    if (param?.length) {
      commit('SET_PAGE_MENU_LIST', param)
      commit('SET_PAGE_MENU_ID', param[0].id)
    } else commit('SET_PAGE_MENU_LIST')
  },

  setPageMenuID({ commit }, param) {
    commit('SET_PAGE_MENU_ID', param)
  },

  setPage({ commit }, param) {
    if (!param) return
    commit('SET_PAGE', param)
  },

  resetPageMenu({ commit }) {
    commit('SET_PAGE_MENU_LIST')
    commit('SET_PAGE_MENU_ID')
  },

  setActiveEventList({ commit }, param) {
    commit('SET_ACTIVE_EVENT_LIST', param)
  },

  setDeviceInfo({ commit }) {
    commit('SET_DEVICE_INFO', deviceInfo())
  },

  setReturnUrl({ commit }, param) {
    const url = new URL(window.location.href)
    const newUrl = new URL(param)
    url.searchParams.forEach((value, key) => {
      if (key !== 'returnUrl') newUrl.searchParams.set(key, value)
    })
    commit('SET_RETURN_URL', newUrl.toString())
  },
  async redirectToReturnUrl({ rootState, state, commit }, param) {
    if (!state.returnUrl) return
    // cofun 特殊轉址處理: 寫死金幣和GameID
    if (state.returnUrl.includes('CofunLiveCode')) {
      try {
        const cofunData = rootState.game.gameList.find(x => x.GameID === 100001)
        if (!cofunData) return new Error()

        const streamerRoomUrl = new URL(state.returnUrl)
        const streamerRoomParams = streamerRoomUrl.searchParams
        const input = {
          platform: 'web',
          pointTypeID: 1,
          gameID: 100001,
          gameProvider: cofunData.Vendor.GameProvider,
          gameProviderGameID: cofunData.Vendor.GameProviderGameID,
          returnUrl: process.env.VUE_APP_SITE_URL,
          Locale: localStorage.getItem('language')
        }
        const linkRes = await gameLink({ body: input }).then(res => res?.Url ?? '')
        if (!linkRes) return
        const cofunGameUrl = new URL(linkRes)
        const newUrl =
          streamerRoomUrl.origin +
          streamerRoomUrl.pathname +
          cofunGameUrl.search +
          '&streamchannelid=' +
          streamerRoomParams.get('streamchannelid') +
          '&streamerid=' +
          streamerRoomParams.get('streamerid')
        location.replace(newUrl)
      } catch (e) {
        console.error(e)
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
      }
    } else location.replace(state.returnUrl)
  },

  setPhoneNumber({ commit }, param) {
    commit('SET_PHONE_NUMBER', param)
  },

  setEmail({ commit }, param) {
    commit('SET_EMAIL', param)
  },

  setDisplayLoadingHtml({ commit }, param) {
    commit('SET_DISPLAY_LOADING_HTML', param)
  },

  setTeleportList({ commit }, param) {
    if (!param) return false
    commit('SET_TELEPORT_LIST', param)
  },

  updateScreen({ commit }) {
    commit('SET_SCREEN_WIDTH', window.innerWidth)
    commit('SET_SCREEN_HEIGHT', window.innerHeight)
  },
  setWebSiteInitReady({ commit }, param) {
    commit('SET_WEBSITE_INIT_READY', param)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
