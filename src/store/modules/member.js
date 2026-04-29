import { postNickname, getMemberInfo, getTokenSignOut, getTokenLocale } from '@/api/member'
import { CURRENCY } from '@/configs'
import { useNotice } from '@/utils/use-notice'

export default {
  namespaced: true,

  state: {
    info: null,
    enableLanguage: false,
    languageList: [],
    languageCode: ''
  },

  mutations: {
    SET_INFO(state, payload) {
      state.info = payload
    },

    SET_ENABLE_LANGUAGE(state, payload) {
      state.enableLanguage = payload
    }
  },

  getters: {
    isLogin(state) {
      return state.info !== null
    },

    languageObject(state) {
      return state.languageList.find(item => item.Locale === state.languageCode) ?? {}
    },

    currency() {
      return CURRENCY
    }
  },

  actions: {
    async logIn({ state, getters, commit, dispatch }, token) {
      const userToken = JSON.parse(localStorage.getItem('userToken')) || []
      if (!token && userToken?.length < 2) return
      await getMemberInfo()
        .then(response => {
          const info = response.Data

          const infoData = {
            ...info,
            PhotoSrc: info.Photo.Url
              ? `${info.Photo.Url}?${Math.random()
                  .toString(36)
                  .slice(3, 8)}`
              : '',
            FrameSrc: info.Photo.Frame
              ? `${info.Photo.Frame}?${Math.random()
                  .toString(36)
                  .slice(3, 8)}`
              : '',
            IsGuest: info.Roles.includes('Guest')
          }
          commit('SET_INFO', infoData)
          dispatch('setInfoToLocalstorage', infoData)
        })
        .catch(async _ => {
          // API回覆錯誤或token無效
          await dispatch('signOut')
          location.reload()
        })
    },

    // 登出帳號
    signOut({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        ;(async () => {
          try {
            const target = JSON.parse(localStorage.getItem('userToken'))?.[1] || ''
            await getTokenSignOut({ refresh_token: target })
            resolve()
          } catch (err) {
            reject(err)
          } finally {
            // 登出後仍保留的localStorage
            const key = [
              'audio_isBgm',
              'audio_isSound',
              'language',
              'hideBillboardUntil',
              'hideBillboardEventList',
              'beforeinstallprompt'
            ]
            const deviceKeyToKeep = key.reduce((acc, item) => {
              acc[item] = localStorage.getItem(item)
              return acc
            }, {})
            dispatch('setInfo', null)
            localStorage.clear()
            Object.entries(deviceKeyToKeep).forEach(([item, value]) => {
              if (value !== null) localStorage.setItem(item, value)
            })
            commit('login/RESET_STORE', {}, { root: true })
          }
        })()
      })
    },

    async pathNickname({ state, dispatch }) {
      if (state.info && !state.info.NickName && !state.info.Roles.includes('Guest')) {
        try {
          await postNickname(`player${state.info.MemberID}`)

          // 跳過cache更新info內容
          await getMemberInfo()
          await dispatch('logIn')
        } catch (err) {
          // 流程使用不顯示任何錯誤訊息
        }
      }
    },

    setInfo({ commit }, param) {
      commit('SET_INFO', param)
    },

    setInfoToLocalstorage(_, param) {
      if (!param) localStorage.removeItem('info')
      else localStorage.setItem('info', JSON.stringify(param))
    },

    async setSiteLocale({ state }, param = '') {
      if (localStorage.getItem('language')) state.languageCode = localStorage.getItem('language')
      // params: 帶入語系參數
      if (param) localStorage.setItem('language', param)

      try {
        const response = await getTokenLocale()
        state.languageList = response.Data ?? {}
      } catch {
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
      }

      // 本地設定語系包含在取回的語系列表內則不做變更。
      const target = state.languageList.some(item => item.Locale === localStorage.getItem('language'))

      if (!target) {
        const defaultLanguage = state.languageList.find(item => item.IsDefault)
        if (!defaultLanguage) return false
        localStorage.setItem('language', defaultLanguage.Locale)
      }

      state.languageCode = localStorage.getItem('language')
    },

    setEnableLanguage({ commit }, param) {
      commit('SET_ENABLE_LANGUAGE', param)
    }
  }
}
