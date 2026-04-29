import store from '@/store'
import uaParser from 'ua-parser-js'
import i18n from '@/configs/locales'
const { global: { t } } = i18n

const ua = uaParser()

export default () => {
  const isAgent = store.state.member.info?.Roles.includes('Agent')
  const type = isAgent ? 'promote' : 'introduction'
  const code = isAgent ? store.state.member.info.PromotionCode : store.state.member.info.IntroduceCode
  const link = `${location.origin}?${type}=${code}`
  const text = '【免費玩，領很大🥰🥰】\n  我正在{siteName}平台暢遊元宇宙！\n  點擊連結，免費註冊\n  馬上領取豪華新手大禮包🎁🎁\n  超多虛擬幣和豐富虛寶等你拿💰💰💰\n  \n  ▪️稀有礦寵🐥🐕\n  ▪️Oculus VR頭戴式主機🥽\n  ▪️任天堂Switch主機🎮\n  ▪️Gogoro電動車🛵\n  💯免抽獎等你帶回家！'
  const message = t(text, { siteName: process.env.VUE_APP_SITE_NAME })
  const shareLINE = () => {
    if (!ua.device.type) {
      const url = `https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(message) + '\r'}&url=${encodeURIComponent(link)}`
      window.open(url, 'LINE', 'width=626,height=500')
    } else {
      const url = `https://line.me/R/msg/text/?${encodeURIComponent(message)}${encodeURIComponent(link)}`
      window.open(url)
    }
  }

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(message)}`)
  }
  const shareWhatsapp = () => {
    window.open(`https://api.whatsapp.com/send/?text=${encodeURIComponent(message)}\n${encodeURIComponent(link)}`)
  }

  return {
    code,
    link,
    message,
    shareTelegram,
    shareLINE,
    shareWhatsapp,
  }
}
