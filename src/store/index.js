import { createStore } from 'vuex'

import login from './modules/login'
import member from './modules/member'
import platform from './modules/platform'
import game from './modules/game'
import event from './modules/event'
import wallet from './modules/wallet'
import audio from './modules/audio'
import sign from './modules/sign'

export default createStore({
  modules: {
    platform,
    game,
    login,
    member,
    event,
    wallet,
    audio,
    sign,
  },
})
