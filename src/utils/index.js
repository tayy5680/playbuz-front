import { useNotice } from '@/utils/use-notice'
import dayjs from 'dayjs'

export function deepCopy (value) {
  return _deepCopy(value, new WeakMap())
}
function _deepCopy (value, cache) {
  const representingType = Object.prototype.toString.call(value)
  if (representingType !== '[object Object]' && representingType !== '[object Array]') return value

  if (cache.has(value)) return cache.get(value)

  const clone = representingType === '[object Object]' ? {} : []
  Object.setPrototypeOf(clone, Object.getPrototypeOf(value))
  cache.set(value, clone)

  Object.keys(value).forEach(key => {
    clone[key] = _deepCopy(value[key], cache)
  })

  return clone
}

// 寫入 local storage 內的 userToken，當缺少其中一種 token 提示並不不寫入
export function setToken (tokenData = null) {
  return new Promise((resolve, reject) => {
    if (!tokenData) {
      useNotice({ type: 'error', message: '更新資訊失敗，請登出後重新登入' })
      return reject()
    }

    const target = [
      tokenData.access_token,
      tokenData.refresh_token,
      tokenData.ids_token,
    ]

    if (Object.values(target).includes(null)) {
      useNotice({ type: 'error', message: '更新資訊失敗，請登出後重新登入' })
      reject()
    } else {
      localStorage.setItem('userToken', JSON.stringify(target))
      localStorage.setItem('userTokenTimeStamp', JSON.stringify(dayjs().unix()))
      resolve()
    }
  })
}
