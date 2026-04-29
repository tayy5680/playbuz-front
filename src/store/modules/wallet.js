import { COIN_TYPE } from '@/configs'
import { getAllWallet } from '@/api/wallet'
import { useNotice } from '@/utils/use-notice'

const state = {
  walletPointLocalList: COIN_TYPE,
  walletList: {
    // key: pointTypeID
  },
  enableBalance: false,
  enableRecord: false,
  enableWallet: false,
  wallectStatus: {
    mainProviderID: 0,
    minorProviderID: 1,
    mainProviderDisable: false,
    minorProviderDisable: false,
    supportedPointTypeID: [1, 2]
  },
  walletActionObject: null,
  isDisplayViewData: true,
  displayBalanceType: 1,
  isWalletListUpdating: false
}

const getters = {
  walletTotal(state) {
    return Object.values(state.walletList).reduce(
      (acc, cur) => {
        if (!Object.keys(cur).length) return acc

        const walletMain = cur.find(item => item.WalletID === 0)
        const coin = COIN_TYPE.find(item => item.id === walletMain.WalletPointTypeID)
        const walletTotalCount = cur.reduce((acc, cur) => acc + cur.Balance, 0)
        if (!coin) return acc
        acc[coin.type] = walletTotalCount
        return acc
      },
      {
        gold: 0,
        silver: 0
      }
    )
  },

  walletPointList(state) {
    return state.walletPointLocalList.reduce((acc, cur) => {
      return state.debug ? acc.concat({ ...cur, display: true }) : acc.concat(cur)
    }, [])
  },

  walletMainPointList(state) {
    const pointTypeMap = {
      GoldPoint: 'gold',
      SilverPoint: 'silver',
      TourPoint: 'tour'
    }
    return Object.values(state.walletList).reduce(
      (acc, cur) => {
        if (!Object.keys(cur).length) return acc

        const walletMain = cur.find(item => item.WalletID === 0)
        if (walletMain) {
          acc[pointTypeMap[walletMain.PointType]] += walletMain.Balance
        }
        return acc
      },
      {
        gold: 0,
        silver: 0,
        tour: 0
      }
    )
  }
}

const mutations = {
  SET_WALLET_LIST(state, payload) {
    state.walletList = payload
  },

  SET_ENABLE_BALANCE(state, payload) {
    state.enableBalance = payload
  },

  SET_DISPLAY_BALANCE_TYPE(state, payload) {
    state.displayBalanceType = payload
  },

  SET_ENABLE_RECORD(state, payload) {
    state.enableRecord = payload
  },

  SET_ENABLE_WALLET(state, payload) {
    state.enableWallet = payload
  },

  SET_WALLET_ACTION_OBJECT(state, payload) {
    state.walletActionObject = payload
  },

  SET_IS_DISPLAY_VIEW_DATA(state, payload) {
    state.isDisplayViewData = payload
  },

  SET_WALLET_DEFAULT_STATUS(state) {
    state.wallectStatus = {
      mainProviderID: 0,
      minorProviderID: 1,
      mainProviderDisable: false,
      minorProviderDisable: false,
      supportedPointTypeID: [1, 2]
    }
  },

  SET_WALLET_STATUS(state, payload) {
    state.wallectStatus = payload
  },

  SET_IS_WALLET_UPDATING(state, payload) {
    state.isWalletListUpdating = payload
  },
  SET_POINT_TYPE_ID(state, payload) {
    if (!state.walletActionObject) return
    state.walletActionObject.pointTypeID = payload
  }
}

const actions = {
  setEnableBalance({ commit }, param) {
    commit('SET_ENABLE_BALANCE', param)
  },

  setDisplayBalanceType({ commit }, param) {
    commit('SET_DISPLAY_BALANCE_TYPE', param)
  },

  setEnableRecord({ commit }, param) {
    commit('SET_ENABLE_RECORD', param)
  },

  setEnableWallet({ commit }, param) {
    commit('SET_ENABLE_WALLET', param)
  },

  setWalletActionObject({ commit }, param) {
    commit('SET_WALLET_ACTION_OBJECT', param)
  },

  setPointTypeID({ commit }, param) {
    commit('SET_POINT_TYPE_ID', param)
  },

  setIsDisplayViewData({ commit }, param) {
    commit('SET_IS_DISPLAY_VIEW_DATA', param)
  },

  setWalletDefaultStatus({ commit }) {
    commit('SET_WALLET_DEFAULT_STATUS')
  },

  setWalletStatus({ commit }, param) {
    commit('SET_WALLET_STATUS', param)
  },

  setWalletList({ commit }, param) {
    commit('SET_WALLET_LIST', param)
  },

  // 更新所有錢包餘額 錯誤彈窗已在此處理 頁面處理行為即可
  /**
   * @param {boolean} param 是否呼叫遊戲商
   */
  async updateAllWallet({ state, commit, rootState }, param = true) {
    if (!localStorage.getItem('userToken')) return
    // 如果有暫存先從暫存印出上次紀錄的資訊
    if (localStorage.getItem('wallet')) {
      const target = JSON.parse(window.decodeURIComponent(window.atob(localStorage.getItem('wallet'))))
      commit('SET_WALLET_LIST', target)
    }

    // 尚有處理中則不再呼叫查詢API
    if (state.isWalletListUpdating) return
    commit('SET_IS_WALLET_UPDATING', true)
    try {
      let input = {
        // 總是檢查遊戲商帳號註冊
        checkProviderMember: param,
        // 總是更新遊戲商餘額
        updateFromProvider: true,
        locale: rootState.member.languageCode
      }
      if (input.checkProviderMember) {
        const cofunLiveCode = new URLSearchParams(window.location.search).get('CofunLiveCode')
        input.CofunLiveCode = cofunLiveCode
      }
      const res = await getAllWallet(input)
      const outputObject = {}
      COIN_TYPE.forEach(coinItem => {
        const coinResult = res.Data.filter(filterItem => {
          return filterItem.PointType === coinItem.point
        })
        outputObject[coinItem.id] = coinResult
      })

      localStorage.setItem('wallet', window.btoa(window.encodeURIComponent(JSON.stringify(outputObject))))
      commit('SET_WALLET_LIST', outputObject)
    } catch (e) {
      console.warn(e)
      const errorCodeList = {
        timeout: '網路不穩，請檢查網路連線'
      }

      if (errorCodeList[e.Code]) {
        const errorMessage = errorCodeList[e.Code] ?? '遊戲錢包更新失敗，請稍後再試'
        useNotice({ type: 'error', message: errorMessage })
      }
    } finally {
      commit('SET_IS_WALLET_UPDATING', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
