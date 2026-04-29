import { useNotice } from '@/utils/use-notice'
import { postTokenRegister, postCheckLineLogin, postCheckYahooLogin, postCheckAppleLogin } from '@/api/member'
import { setToken } from '@/utils'

const getDefault = () => {
  return {
    agmCode: '',
    mgmCode: '',
    signupReward: null
  }
}

export default {
  namespaced: true,

  state: getDefault(),

  mutations: {
    SET_AGM_CODE(state, code) {
      state.agmCode = code
    },

    SET_MGM_CODE(state, code) {
      state.mgmCode = code
    },

    SET_SIGNUP_REWARD(state, reward) {
      state.signupReward = reward
    },

    RESET_STORE(state) {
      state = Object.assign(state, getDefault())
    }
  },

  getters: {
    agmCode(state) {
      return state.agmCode
    },

    mgmCode(state) {
      return state.mgmCode
    },

    signupReward(state) {
      return state.signupReward
    }
  },

  actions: {
    // 訪客註冊&更新會員資訊
    async createGuest({ state, dispatch, rootState }) {
      const inputData = {
        locale: rootState.member.languageCode
      }

      try {
        const res = await postTokenRegister(inputData)
        if (res.Status.Code !== '0') return Promise.reject()
        await setToken(res)
        await dispatch('member/logIn', null, { root: true })
        return Promise.resolve()
      } catch (err) {
        // TODO: 應整理錯誤訊息丟給UI顯示
        const errorCodeList = {
          400: '查無此輸入碼',
          1026: '推廣碼失效，將轉為一般註冊流程',
          1027: '介紹碼失效，將轉為一般註冊流程'
        }

        const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
        const type = ['1026', '1027'].includes(err.Code) ? 'info' : 'error'
        useNotice({ type, message: errorMessage })
        return Promise.reject()
      }
    },

    // 綁定推廣碼(agm)與邀請碼(mgm)
    async acceptMemberLine({ state, dispatch, rootState }) {
      const popularizeCode = JSON.parse(localStorage.getItem('popularizeCode'))
      if (!popularizeCode && !state.agmCode) return Promise.resolve(true)

      const formatToken = obj => {
        // 如果無資料則跳出不更新token
        if (!obj.access_token || !obj.refresh_token || !obj.ids_token) return false
        setToken(obj)
        localStorage.removeItem('popularizeCode')
      }

      try {
        const inputData = {
          locale: rootState.member.languageCode
        }
        if (state.agmCode) inputData.promoteCode = state.agmCode
        else if (popularizeCode?.promote || popularizeCode?.third)
          inputData.promoteCode = popularizeCode?.promote || popularizeCode?.third
        else if (popularizeCode?.introduce) inputData.promoteCode = popularizeCode.introduce
        else if (popularizeCode?.introduction) inputData.introduceCode = popularizeCode.introduction

        if (popularizeCode?.third) inputData.registerSource = popularizeCode.third
        if (popularizeCode?.token) inputData.customField = popularizeCode.token

        const res = await postTokenRegister(inputData)
        formatToken(res)
        return Promise.resolve(res)
      } catch (err) {
        // TODO: 應整理錯誤訊息丟給UI顯示
        const errorCodeList = {
          400: '查無此輸入碼',
          423: '您已使用過這組輸入碼',
          1022: '好可惜! 您沒抽中禮包，下次再接再厲吧!!',
          1023: '輸入碼無效',
          1024: '您已擁有推廣者身份',
          1025: '無法重複加入推廣',
          1026: '推廣碼無效'
        }

        if (state.agmCode) {
          Object.assign({
            1026: '推廣碼無效'
          })
        } else {
          Object.assign({
            1026: '推廣碼失效，將轉為一般註冊流程',
            1027: '介紹碼失效，將轉為一般註冊流程'
          })
        }

        const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
        const type = !state.agmCode && ['1026', '1027'].includes(err.Code) ? 'info' : 'error'
        useNotice({ type, message: errorMessage })
        return Promise.reject(false)
      } finally {
        localStorage.removeItem('popularizeCode')
      }
    },
    async actionLineSignIn({ commit, state }, payload) {
      const formatToken = obj => {
        // 如果無資料則跳出不更新token
        if (!obj.access_token || !obj.refresh_token || !obj.ids_token) return false
        setToken(obj)
        localStorage.removeItem('popularizeCode')
      }

      const inputData = { ...payload }
      const popularizeCode = JSON.parse(localStorage.getItem('popularizeCode'))

      try {
        if (state.agmCode) inputData.promoteCode = state.agmCode
        else if (popularizeCode?.promote || popularizeCode?.third)
          inputData.promoteCode = popularizeCode?.promote || popularizeCode?.third
        else if (popularizeCode?.introduce) inputData.promoteCode = popularizeCode.introduce
        else if (popularizeCode?.introduction) inputData.introduceCode = popularizeCode.introduction
        if (popularizeCode?.third) inputData.registerSource = popularizeCode.third

        const res = await postCheckLineLogin(inputData)
        formatToken(res)
        return res
      } catch (e) {
        console.warn(e)
        sessionStorage.removeItem('lineLogin')
        commit('sign/UPDATE_LOGIN', false, { root: true })
        if (e?.Code === '1036') return useNotice({ type: 'error', message: '此LINE帳號已被綁定' })
        if (e?.Code === '201') return useNotice({ type: 'error', message: 'LINE登入或驗證失敗' })
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        throw e
      }
    },

    async actionYahooSignIn({ commit, state }, payload) {
      const formatToken = obj => {
        // 如果無資料則跳出不更新token
        if (!obj.access_token || !obj.refresh_token || !obj.ids_token) return false
        setToken(obj)
        localStorage.removeItem('popularizeCode')
      }

      const inputData = { ...payload }
      const popularizeCode = JSON.parse(localStorage.getItem('popularizeCode'))
      try {
        if (state.agmCode) inputData.promoteCode = state.agmCode
        else if (popularizeCode?.promote || popularizeCode?.third)
          inputData.promoteCode = popularizeCode?.promote || popularizeCode?.third
        else if (popularizeCode?.introduce) inputData.promoteCode = popularizeCode.introduce
        else if (popularizeCode?.introduction) inputData.introduceCode = popularizeCode.introduction
        if (popularizeCode?.third) inputData.registerSource = popularizeCode.third

        const res = await postCheckYahooLogin(inputData)
        formatToken(res)
        return res
      } catch (e) {
        console.warn(e)
        sessionStorage.removeItem('yahooLogin')
        commit('sign/UPDATE_LOGIN', false, { root: true })
        if (e?.Code === '1036') return useNotice({ type: 'error', message: '此帳號已被綁定' })
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        throw e
      }
    },

    async actionAppleSignIn({ commit, state }, payload) {
      const formatToken = obj => {
        // 如果無資料則跳出不更新token
        if (!obj.access_token || !obj.refresh_token || !obj.ids_token) return false
        setToken(obj)
        localStorage.removeItem('popularizeCode')
      }
      const inputData = { ...payload }
      const popularizeCode = JSON.parse(localStorage.getItem('popularizeCode'))
      try {
        if (state.agmCode) inputData.promoteCode = state.agmCode
        else if (popularizeCode?.promote || popularizeCode?.third)
          inputData.promoteCode = popularizeCode?.promote || popularizeCode?.third
        else if (popularizeCode?.introduce) inputData.promoteCode = popularizeCode.introduce
        else if (popularizeCode?.introduction) inputData.introduceCode = popularizeCode.introduction
        if (popularizeCode?.third) inputData.registerSource = popularizeCode.third

        const res = await postCheckAppleLogin(inputData)
        formatToken(res)
        return res
      } catch (e) {
        console.warn(e)
        sessionStorage.removeItem('appleLogin')
        commit('sign/UPDATE_LOGIN', false, { root: true })
        if (e?.Code === '1036') return useNotice({ type: 'error', message: '此Apple ID已被綁定' })
        if (e?.Code === '400') return useNotice({ type: 'error', message: 'Apple登入或驗證失敗' })
        useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        throw e
      }
    }
  }
}
