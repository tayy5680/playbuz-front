import Router from '@/router'

export default {
  namespaced: true,

  state: {
    drawerState: false,
    isDrawerShowGuest: true,
    drawerStep: '',
    drawerBindType: '',
    logIn: false
  },

  getters: {
    drawerState(state) {
      return state.drawerState
    },

    drawerStep(state) {
      return state.drawerStep
    },

    drawerBindType(state) {
      return state.drawerBindType
    }
  },

  mutations: {
    UPDATE_DRAWER_STATE(state, isOpen) {
      state.drawerState = isOpen
      state.isDrawerShowGuest = true
    },
    UPDATE_IS_DREWER_SHOW_GUEST(state, isDrawerShowGuest) {
      state.isDrawerShowGuest = isDrawerShowGuest
    },

    UPDATE_DRAWER_STEP(state, step) {
      state.drawerStep = step
    },

    UPDATE_DRAWER_BIND_TYPE(state, step) {
      state.drawerBindType = step
    },
    UPDATE_LOGIN(state, step) {
      state.logIn = step
    }
  },

  actions: {
    /**
     * loginProxy 登入檢查代理
     * @redirectObj 定義登入後動作，參數如下
     * - @action  {string}   執行動作類（若未帶是轉導）
     * - @trail   {boolean}  對試用身份放行，會先於綁定判斷
     * - @binding {boolean}  需驗證綁定狀態
     * - @stop    {boolean}  當次執行若未登入就取消後續動作
     * - @event   {string}   指定活動
     * - 其餘參數用於 vue-router 或按需自行加上所需(ex: packageID)
     */

    async loginProxy({ rootState, commit, dispatch, rootGetters }, redirectObj) {
      const info = rootState.member.info

      if (rootGetters['member/isLogin']) {
        const shouldValidate = redirectObj?.binding

        // 觸發活動行為資格確認
        if (redirectObj && shouldValidate) {
          if (info.IsGuest) {
            if (redirectObj.resume) return
            commit('UPDATE_DRAWER_STEP', 'bindAccount')
            commit('UPDATE_DRAWER_STATE', true)
            // 異步讓 destroy 先執行
            setTimeout(() => {
              redirectObj.resume = true
              sessionStorage.setItem('handleLoginProcedure', JSON.stringify(redirectObj))
            }, 0)
            return
          }
          commit('UPDATE_DRAWER_STATE', false)
        }

        // 處理參數指定動作、路由
        if (redirectObj) {
          const isReturn = sessionStorage.getItem('handleLoginProcedure')

          sessionStorage.removeItem('handleLoginProcedure')
          if (Router.currentRoute.value.name === redirectObj.name) Router.push('/').catch(() => {})

          switch (redirectObj.action) {
            case 'goEvent':
              dispatch('event/goto', redirectObj.event)
              // 跳轉進來的指定活動，呼叫跑活動
              if (isReturn) dispatch('event/goto', JSON.parse(isReturn).event)
              return

            case 'goMine':
              if (redirectObj.location) dispatch('platform/setDisplayLoadingHtml', true)
              await dispatch('game/playMine', redirectObj, { root: true })
              return false
          }

          Router.push({ ...redirectObj }).catch(() => {})
        }
      } else {
        // 登入後回調勾子
        if (!redirectObj.stop) sessionStorage.setItem('handleLoginProcedure', JSON.stringify(redirectObj))

        // 一般登入
        commit('UPDATE_DRAWER_STATE', true)
      }
    }
  }
}
