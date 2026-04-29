import { AUDIO_SOUND_LIST } from '@/components/audio/config.js'
import { Howl } from 'howler'
export default {
  namespaced: true,

  state: {
    isShowWindow: false,
    isPlaySound: true,
    audioPlayer: {},
    bgm: {
      id: '',
      player: null,
      isPausing: false,
      isPlayBgm: true,
    },
  },

  mutations: {
    SET_ISSHOWWINDOW (state, bool) {
      state.isShowWindow = bool
    },

    SET_PLAY_SOUND (state, payload) {
      state.isPlaySound = payload
      localStorage.setItem('audio_isSound', payload)
    },

    SET_BGM (state, payload) {
      state.bgm = {
        ...state.bgm,
        ...payload,
      }
      if (payload.isPlayBgm !== undefined) localStorage.setItem('audio_isBgm', payload.isPlayBgm)
    },
  },

  actions: {
    setBgm ({ commit }, param) {
      commit('SET_BGM', param)
    },

    setIsShowWindow ({ commit }, param) {
      commit('SET_ISSHOWWINDOW', param)
    },

    setPlaySound ({ commit }, param) {
      commit('SET_PLAY_SOUND', param)
    },

    getAudioPlayer ({ state }, param = '') {
      if (state.audioPlayer[param]) return state.audioPlayer[param]

      return new Promise((resolve) => {
        const newAudio = new Howl({
          src: [AUDIO_SOUND_LIST.find(sound => sound.id === param)?.url ?? AUDIO_SOUND_LIST[0].url],
          onload: () => {
            state.audioPlayer[param] = newAudio
            resolve(newAudio)
          },
          onloaderror: () => {
            resolve(null)
          },
        })
      })
    },

    handleBgmStatus ({ state, commit }, param) {
      if (state.bgm.player) {
        const data = {
          isPausing: false,
        }
        switch (param) {
          case 'play':
            if (state.bgm.id) state.bgm.player.play(state.bgm.id)
            else data.id = state.bgm.player.play()
            data.isPlayBgm = true
            break
          case 'stop':
            state.bgm.player.stop(state.bgm.id)
            data.isPlayBgm = false
            break
          case 'pause':
            state.bgm.player.pause(state.bgm.id)
            data.isPausing = true
            break
        }
        commit('SET_BGM', data)
      }
    },
  },
}
