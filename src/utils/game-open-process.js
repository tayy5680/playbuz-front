import { isOpenAnotherWebPage } from '@/utils/ua'
import { gameLink } from '@/api/game'
import { postUpdateMemberStatus } from '@/api/member'
import { useNotice } from '@/utils/use-notice'
import uaParser from 'ua-parser-js'
import store from '@/store'
import i18n from '@/configs/locales'
const {
  global: { t }
} = i18n

// loading build
export const buildLoadingHTML = () => {
  return new Promise(resolve => {
    const img = new Image()
    img.src = require(`@/assets/img/logo/logo_PlayBUZ_only.png`)
    img.onload = () => {
      const dataURL = img.src
      resolve(createLoadingElement(dataURL))
    }
    img.onerror = () => {
      resolve(createLoadingElement(null))
    }
  })
}

const createLoadingElement = dataURL => {
  return `
    <style>
      body { background: #000; display: flex; align-items: center; justify-content: center; margin: 0; color: #fff; }
      .img { position: relative; animation: bounce 1s infinite; }
      .ping { position: absolute; top: 0; left: 0; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
      .text { text-align: center; font-weight: bold; }
      @keyframes ping {
        75%, 100% {
          transform: scale(2);
          opacity: 0;
        }
      }
      @keyframes bounce {
        0%, 100% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
          transform: translateY(0);
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
    </style>
    <div>
      <div class="img">
        ${dataURL ? `<img class="ping" src="${dataURL}"><img src="${dataURL}">` : ''}
      </div>
      <div class="text">LOADING</div>
    </div>
  `
}

// 開啟遊戲流程
export const gameOpenProcess = async obj => {
  let page = null
  if (isOpenAnotherWebPage() && obj.returnUrl) {
    page = window.open()
    if (page) {
      const loadingHTML = await buildLoadingHTML()
      page.document.body.innerHTML = loadingHTML
      page.document.title = process.env.VUE_APP_SITE_NAME
    }
  }

  return new Promise((resolve, reject) => {
    const ua = uaParser()

    obj.platform = ['mobile', 'wearable', 'embedded'].includes(ua.device.type) ? 'mobile' : 'web'

    obj.Locale = store.state.member.languageCode
    Promise.all([gameLink({ body: obj }), postUpdateMemberStatus({ body: { gameID: obj.GameID } })])
      .then(res => {
        // if (!page) return
        if (obj.returnUrl) {
          if (isOpenAnotherWebPage()) page.location = res[0].Url
          else location.href = res[0].Url
          resolve()
        } else resolve(res[0].Url)
      })
      .catch(err => {
        const target = store.state.game.gameList.find(item => item.GameID === obj.gameID)

        const errorCodeList = {
          // 開啟遊戲失敗
          5003: '遊戲維護中',
          5004: t('本款遊戲{name}，不支援多重登入，請關閉多餘視窗', { name: target?.GameName ?? '' })
        }
        const errorMessage = errorCodeList[err.Code] ?? '發生錯誤，請稍後再試，或洽客服人員'
        useNotice({ type: 'error', message: errorMessage })
        if (isOpenAnotherWebPage() && obj.returnUrl && page) page.close()
        reject()
      })
  })
}
