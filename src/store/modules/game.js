import { STATIC_GAME_LIST } from '@/configs/static_game'
import { gameList } from '@/api/game'
import { gameOpenProcess } from '@/utils/game-open-process'
import { useNotice } from '@/utils/use-notice'

const state = {
  gameList: [],
  originGameListLength: 0,
  gameDetail: {
    gameDetailType: '',
    minGold: 0,
    minSilver: 0
  },
  gameMeunId: 1,
  pageSubMenuID: 0,
  gameSearch: '',
  mine: {
    url: '',
    debug: false
  }
}

const getters = {
  // 遊戲分類
  gameTypeList(state) {
    if (!state.gameList.length) return []

    // 排除的遊戲類型 (e.g. 4礦寵)
    const excludeGameTypeList = []

    const target = state.gameList.reduce((acc, cur) => {
      const target = acc.map(item => item.type)

      if (excludeGameTypeList.includes(cur.GameTypeID) || !cur.GameType || target.includes(cur.GameType.toLowerCase()))
        return acc

      acc.push({
        id: cur.GameTypeID,
        type: cur.GameType.toLowerCase(),
        label: cur.GameTypeName,
        route: {
          name: 'game',
          query: {
            type: cur.GameType.toLowerCase()
          }
        }
      })

      return acc
    }, [])

    // 排序依照 provide id 遞迴。
    return target.sort((a, b) => (a.id > b.id ? 1 : -1))
  }
}

const mutations = {
  SET_DEFAULT(state) {
    state.gameList = []
    state.originGameListLength = 0
    state.gameDetail = {
      gameDetailType: '',
      minGold: 0,
      minSilver: 0
    }
    state.mine = {
      url: '',
      debug: false
    }
  },

  SET_GAME_LIST(state, payload) {
    state.gameList = payload.concat(STATIC_GAME_LIST)
  },

  SET_ORIGIN_GAME_LIST_lENGTH(state, payload) {
    state.originGameListLength = payload
  },

  SET_GAME_DETAIL_TYPE(state, payload) {
    state.gameDetail = payload
  },

  SET_GAME_MENU_ID(state, payload) {
    state.gameMeunId = payload
  },

  SET_PAGE_SUB_MENU_ID(state, payload = null) {
    state.pageSubMenuID = payload
  },

  SET_GAME_SEARCH(state, payload) {
    state.gameSearch = payload
  },

  SET_MINE_URL(state, payload) {
    state.mine.url = payload + (state.mine.debug && payload ? '&debug=true' : '')
  },

  SET_MINE_DEBUG(state, payload) {
    state.mine.debug = payload
  }
}

const actions = {
  setGameList({ commit, rootState }) {
    return new Promise(resolve => {
      ;(async () => {
        const res = await gameList({
          locale: rootState.member.languageCode
        })
        commit('SET_GAME_LIST', res.Data)
        if (res.Data !== null) {
          commit('SET_ORIGIN_GAME_LIST_lENGTH', res.Data.length)
        }
        resolve()
      })()
    })
  },

  // 遊戲詳細頁上方返回鍵使用，目的是紀錄遊戲類型顯示不同類型。
  setGameDetailType({ commit }, param) {
    commit('SET_GAME_DETAIL_TYPE', param)
  },

  setMineUrl({ commit, dispatch }, param) {
    commit('SET_MINE_URL', param)
    dispatch('platform/setCover', !!param, { root: true })
  },

  setMineDebug({ commit, dispatch }, param) {
    commit('SET_MINE_DEBUG', param)
  },

  playMine({ rootState, dispatch }, param) {
    return new Promise(resolve => {
      ;(async () => {
        try {
          if (!rootState.game.gameList.length) await dispatch('setGameList')

          const target = rootState.game.gameList.find(item => item.Vendor.GameProvider === 'MK Pet')

          if (!target) {
            useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
            resolve()
            return false
          }

          if (!!target.MaintenanceStatus || !!target.Vendor?.MaintenanceStatus) {
            useNotice({ type: 'info', message: '遊戲維護中' })
            // 當是本頁時則關閉loading遮罩。
            if (param.location) dispatch('platform/setDisplayLoadingHtml', false, { root: true })
            resolve()
            return false
          }

          const body = {
            gameID: target.GameID,
            gameProvider: target.Vendor.GameProvider,
            gameProviderGameID: target.Vendor.GameProviderGameID,
            checkProviderMember: false,
            forceTransfer: false,
            accessToken: JSON.parse(localStorage.getItem('userToken'))?.[2] || ''
          }
          // 取消iframe開啟
          // if (!param.location) body.returnUrl = location.href

          if (!body.accessToken) return useNotice({ type: 'error', message: '更新資訊失敗，請登出後重新登入' })
          const response = await gameOpenProcess(body)
          // 本頁開啟
          // if (response) location.href = response

          // 本頁iframe開啟
          if (response && !state.mine.url) dispatch('setMineUrl', response)
        } catch {
          useNotice({ type: 'error', message: '發生錯誤，請稍後再試，或洽客服人員' })
        } finally {
          resolve()
        }
      })()
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
