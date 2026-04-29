import { tw, setup } from 'twind'
import config from './config'

setup(config)

export default {
  install: (app) => {
    app.config.globalProperties.tw = tw
  },
}
