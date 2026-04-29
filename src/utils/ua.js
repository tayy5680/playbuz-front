import uaParser from 'ua-parser-js'

const ua = uaParser()

// 是否可以另開視窗
export const isOpenAnotherWebPage = () => {
  // 非行動裝置則直接另開
  if (!ua.device.type) return true

  // 行動裝置則包含以下字串才可另開
  const browser = ['chrome', 'safari', 'firefox', 'edge', 'samsung']
  let isOpen = false
  for (const item of browser) {
    if (ua.browser?.name?.toLowerCase().includes(item)) {
      isOpen = true
      break
    }
  }
  return isOpen
}

// 取得裝置與瀏覽器
export const deviceInfo = () => {
  const browser = ua.browser?.name || false
  const os = ua.os?.name || false
  return `${os}, ${browser}`
}
// 取得device.type
export const deviceType = ua.device.type
