import { TODAY } from '@/configs'
import { EVENT } from '@/configs/event'
import { getActivityRedDot, getActivityNews } from '@/api/event'
import dayjs from 'dayjs'
dayjs.extend(require('dayjs/plugin/duration'))

export default {
  namespaced: true,

  state: {
    openState: false,
    specify: '',
    eventList: [],
    receiveObject: {},
    roiginNews: {},
    news: {},
  },

  getters: {
    // 集氣型活動是否已領取所有
    isGatherReceive (state) {
      if (!state.receiveObject) return true

      return !state.receiveObject.HasGatherConditions
    },

    // 是否已月簽到
    isSignReceive (state) {
      if (!state.receiveObject) return true

      return state.receiveObject.HasSignInRecord
    },

    // 扭蛋機抽獎次數(Object)
    isSpinReceive (state) {
      if (!state.receiveObject) return {}

      return Object.entries(state.receiveObject).reduce((acc, cur) => {
        if (!cur[0].toLowerCase().includes('spin')) return acc

        acc[cur[0]] = cur[1]
        return acc
      }, {})
    },
  },

  mutations: {
    UNSET_EVENT (state) {
      state.specify = ''
    },

    SET_SPECIFY (state, payload) {
      state.specify = payload
    },

    SET_OPEN_STATE (state, payload) {
      state.openState = payload
    },

    SET_EVENT_LIST (state, payload) {
      state.eventList = payload
    },

    SET_RECEIVE_OBJECT (state, payload) {
      state.receiveObject = payload
    },

    SET_NEWS (state, payload) {
      state.news = payload.news
      state.roiginNews = payload.roiginNews
    },
  },

  actions: {
    goto ({ state }, event) {
      state.specify = event
      state.openState = true
    },

    setSpecify ({ commit }, param) {
      commit('SET_SPECIFY', param)
    },

    setOpenState ({ commit }, param) {
      commit('SET_OPEN_STATE', param)
    },

    setNews ({ commit }, param) {
      const payload = {
        newsType: 1,
        Locale: param.lang,
      }
      const target = getActivityNews(payload)
      return Promise.resolve(target)
        .then(res => {
          if (!res.Data?.length) return
          const dataFormate = {}
          for (const value of res.Data) {
            if (!value[param.isMobile ? 'ImgUrlMo' : 'ImgUrlPc']) continue
            if (!value.TriggerType) value.TriggerType = 'Daily'
            if (value.MediaType === 'video') {
              if (value.ImgUrlMo.includes('youtube')) {
                value.videoType = 'youtube'
                const originVideo = value[param.isMobile ? 'ImgUrlMo' : 'ImgUrlPc']
                const regex = /(?:\?v=|\/shorts\/)([^&]+)/
                const match = originVideo.match(regex)
                if (match) {
                  value.videoFormate = match[1]
                }
              } else {
                value.videoType = 'imgBed'
              }
            }
            for (const valuePage of value.NewsPageInfo) {
              if (!dataFormate[valuePage.Page]) {
                dataFormate[valuePage.Page] = []
              }
              dataFormate[valuePage.Page].push(value)
            }
          }
          const payload = {
            roiginNews: res.Data,
            news: Object.keys(dataFormate).length ? dataFormate : {},
          }

          commit('SET_NEWS', payload)
        })
        .catch((e) => {
          console.warn('SET_NEWS', e)
        })
    },

    initEventList ({ state, commit }) {
      const event = EVENT.reduce((acc, cur) => {
        const list = []
        if (cur.activity) {
          for (const item of cur.activity.progress) {
            list.push({
              id: item.id,
              start: cur.deadline.start,
              end: cur.deadline.end,
              action: item.action,
              autoOpen: cur.isEventAutoOpen,
              switch: item.switch,
            })
          }
        }
        return acc.concat(list)
      }, [])

      const param = event
        .filter(item => item.action?.type === 'event')
        .filter(item => {
          return state.specify
            ? item.id === state.specify
            : TODAY.isBetween(item.start, item.end)
        })

      commit('SET_EVENT_LIST', param)
    },

    async setReceiveObject ({ commit }) {
      try {
        const res = await getActivityRedDot()
        commit('SET_RECEIVE_OBJECT', res)
      } catch {}
    },
  },
}
